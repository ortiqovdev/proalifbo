import React, { useEffect, useState, useRef } from 'react';
import Workspace from './Workspace';
import { ActivityIndicator, Alert, Image, Linking, Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Storage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import * as Splash from 'expo-splash-screen';
import { convert } from '../shared/new-alphabet';
Splash.preventAutoHideAsync().catch(() => {});
const modes = [['latin','Lotin'],['kirill','Кирилл'],['new','Yangi alifbo']];
const slides = [
  ['Pro Alifbo','O‘zbekcha matnni uch yozuv orasida o‘giring. Natija yozganingiz zahoti ko‘rinadi.'],
  ['Avtoyozuv','Avtoyozuvni yoqing. Probel bosilganda oxirgi so‘z yangi alifboga o‘tadi.'],
  ['Natijani olib keting','Kerakli alifboni tanlang va natijani nusxalab, xabar yoki hujjatga joylang.']
];
function Button({title, onPress, disabled, light}) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({pressed})=>[s.button,light && s.light,{opacity:disabled?.45:pressed?.75:1}]}><Text style={{color:light?'#175436':'white',fontWeight:'700'}}>{title}</Text></Pressable>;
}
function Screen(){
  const [ready,setReady]=useState(false), [step,setStep]=useState(0), [text,setText]=useState(''), [mode,setMode]=useState('new'), [notice,setNotice]=useState('');
  useEffect(()=>{Storage.multiGet(['intro','mode']).then(([[,intro],[,saved]])=>{if(intro==='done')setStep(3);if(modes.some(([id])=>id===saved))setMode(saved)}).catch(()=>{}).finally(()=>setReady(true))},[]);
  useEffect(()=>{if(ready)Splash.hideAsync().catch(()=>{})},[ready]);
  const result=convert(text,mode);
  function finish(){setStep(3);Storage.setItem('intro','done').catch(()=>{});}
  if (ready && step === 3) return <Workspace text={text} result={result} mode={mode} modes={modes} notice={notice}
    onText={value=>{setText(value);setNotice('')}}
    onMode={id=>{setMode(id);setNotice('');Storage.setItem('mode',id).catch(()=>{})}}
    copy={async()=>{try{await Clipboard.setStringAsync(result);setNotice('Nusxalandi.')}catch{setNotice('Natijani bosib tutib nusxalang.')}}}/>;
  return <SafeAreaView style={s.safe}><StatusBar barStyle="dark-content"/><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.page}>
    <View style={s.brand}><Image source={require('./logo.png')} style={{width:46,height:46}}/><Text style={s.brandText}>Pro Alifbo</Text></View>
    {!ready?<ActivityIndicator/>:step<3?<View style={s.card}><Text style={s.tag}>TANISHUV  ·  {step+1} / 3</Text><Text style={s.title}>{slides[step][0]}</Text><Text style={s.body}>{slides[step][1]}</Text><Button title={step===2?'Boshlash':'Keyingi'} onPress={()=>step===2?finish():setStep(step+1)}/>{step<2&&<Button light title="O‘tkazib yuborish" onPress={finish}/>}</View>:null}</ScrollView></SafeAreaView>;
}
export default function App(){return <SafeAreaProvider><Screen/></SafeAreaProvider>}
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f4f8f4'},page:{padding:22,gap:18,maxWidth:700,width:'100%',alignSelf:'center'},
  brand:{flexDirection:'row',alignItems:'center',gap:10},brandText:{fontSize:22,fontWeight:'700',color:'#194932'},
  title:{fontSize:34,fontWeight:'600',color:'#123a28'},heading:{fontSize:18,fontWeight:'700',color:'#173e2b'},
  card:{padding:20,borderRadius:22,backgroundColor:'white',borderWidth:1,borderColor:'#d9e8dc',gap:14},
  body:{fontSize:17,lineHeight:25,color:'#466250'},tag:{color:'#25764d',fontWeight:'700',letterSpacing:1.5},
  input:{minHeight:125,textAlignVertical:'top',fontSize:18,color:'#183b2a'},row:{flexDirection:'row',flexWrap:'wrap',gap:8},
  button:{borderRadius:15,backgroundColor:'#17653e',minHeight:44,paddingHorizontal:14,alignItems:'center',justifyContent:'center'},light:{backgroundColor:'#eaf4ec'},
  result:{minHeight:80,fontFamily:Platform.OS==='ios'?'Times New Roman':'serif',fontSize:21,color:'#173e2b'}
});




