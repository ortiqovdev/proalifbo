const {withAndroidManifest,withDangerousMod,withXcodeProject}=require('expo/config-plugins');
const fs=require('fs');
const path=require('path');
module.exports=function keyboard(config){
  config=withAndroidManifest(config,c=>{
    const app=c.modResults.manifest.application[0];
    app.service ||= [];
    if(!app.service.some(s=>s.$['android:name']==='.AlifboKeyboard')) app.service.push({
      $:{'android:name':'.AlifboKeyboard','android:exported':'true','android:label':'Pro Alifbo','android:permission':'android.permission.BIND_INPUT_METHOD'},
      'intent-filter':[{action:[{$:{'android:name':'android.view.InputMethod'}}]}],
      'meta-data':[{$:{'android:name':'android.view.im','android:resource':'@xml/alifbo_keyboard'}}]
    });
    return c;
  });
  config=withDangerousMod(config,['android',c=>{
    const root=path.join(c.modRequest.platformProjectRoot,'app/src/main');
    for(const [file,dir] of [['AlifboKeyboard.kt','java/uz/proalifbo/mobile'],['alifbo_keyboard.xml','res/xml']]){
      fs.mkdirSync(path.join(root,dir),{recursive:true});
      fs.copyFileSync(path.join(__dirname,'android',file),path.join(root,dir,file));
    }
    return c;
  }]);
  return withXcodeProject(config,c=>{
    const name='AlifboKeyboard';
    fs.cpSync(path.join(__dirname,'ios'),path.join(c.modRequest.platformProjectRoot,name),{recursive:true});
    const p=c.modResults;
    if(p.pbxTargetByName(name)) return c;
    const t=p.addTarget(name,'app_extension',name,c.ios.bundleIdentifier+'.keyboard');
    p.addBuildPhase([name+'/KeyboardController.swift'],'PBXSourcesBuildPhase','Sources',t.uuid);
    for(const ref of p.pbxXCConfigurationList()[t.pbxNativeTarget.buildConfigurationList].buildConfigurations){
      Object.assign(p.pbxXCBuildConfigurationSection()[ref.value].buildSettings,{
        CODE_SIGN_ENTITLEMENTS:'AlifboKeyboard/Keyboard.entitlements',SWIFT_VERSION:'5.0',IPHONEOS_DEPLOYMENT_TARGET:'15.1',APPLICATION_EXTENSION_API_ONLY:'YES',
        CURRENT_PROJECT_VERSION:c.ios.buildNumber||'1',MARKETING_VERSION:c.version||'1.0'
      });
    }
    return c;
  });
};

