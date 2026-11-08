import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import Constants from 'expo-constants';
import {WebView} from 'react-native-webview';

export default function PreviewOCR({photo, finish}) {
  const browser=useRef(null);
  const host=Constants.expoConfig?.hostUri;
  useEffect(()=>{
    const timer=setTimeout(()=>finish(null),90000);
    return ()=>clearTimeout(timer);
  },[finish]);
  return <View pointerEvents="none" style={{position:'absolute',width:1,height:1,opacity:0}}>
    <WebView ref={browser} source={{uri:'http://'+host+'/pro-alifbo-ocr/index.html'}}
      onLoad={()=>browser.current?.injectJavaScript('readPhoto('+JSON.stringify('data:image/jpeg;base64,'+photo)+');true;')}
      onError={()=>finish(null)} onHttpError={()=>finish(null)}
      onMessage={({nativeEvent})=>{
        try {finish(JSON.parse(nativeEvent.data).text ?? null);} catch {finish(null);}
      }}/>
  </View>;
}
