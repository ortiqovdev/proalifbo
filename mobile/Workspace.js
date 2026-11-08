import {requireOptionalNativeModule} from 'expo';
import { toNewAlphabet } from '../shared/new-alphabet';
import React from 'react';
import { ActivityIndicator, Alert, Animated, Easing, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/Ionicons';

const keyboardSettings = requireOptionalNativeModule('AlifboSettings');

export default function Workspace({text,onText,result,mode,modes,onMode,copy,notice}) {
  const [autoWrite, setAutoWrite] = React.useState(() => keyboardSettings?.enabled() ?? false);
  function changeAutoWrite(value) {
    keyboardSettings?.setEnabled(value);
    setAutoWrite(value);
  }
  const cursor = React.useRef(0);
  function editText(next) {
    let at = cursor.current;
    if (autoWrite && next.length === text.length + 1) {
      if (next !== text.slice(0, at) + ' ' + text.slice(at)) {
        at = 0;
        while (at < text.length && text[at] === next[at]) at++;
      }
      if (next === text.slice(0, at) + ' ' + text.slice(at)) {
        const prefix = text.slice(0, at).replace(/\S+$/u, toNewAlphabet);
        onText(prefix + ' ' + text.slice(at));
        return;
      }
    }
    onText(next);
  }
  const [expanded,setExpanded]=React.useState(false);
  const progress = React.useRef(new Animated.Value(0)).current;
  function openPanel() {
    Keyboard.dismiss();
    progress.setValue(0);
    setExpanded(true);
  }
  function animatePanel(open) {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: open ? 220 : 160,
      easing: open ? Easing.out(Easing.cubic) : Easing.in(Easing.quad),
      useNativeDriver: true
    }).start(({finished}) => { if (finished && !open) setExpanded(false); });
  }
  const insets = useSafeAreaInsets();
  const examples = {latin:['Sh','Shahar chiroqlari'],kirill:['Ш','Шаҳар чироқлари'],new:['Ş','Şahar çiroqlari']};
  return <SafeAreaView style={s.safe}><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
    <View style={s.sheet}><View style={s.header}>
      <View style={s.headerSide}><Pressable accessibilityRole="button" accessibilityLabel="Yordam" style={s.tool} onPress={()=>Alert.alert('Pro Alifbo','Matnni yozing yoki joylang. Avtoyozuv yoqilganda probel oxirgi so‘zni yangi alifboga o‘giradi.')}><Icon name="information-circle-outline" size={24} color="#17653e"/></Pressable></View>
      <Text style={s.brand}>Pro Alifbo</Text>
      <View style={[s.headerSide,{alignItems:'flex-end'}]}><View style={{alignItems:'center'}}><Switch accessibilityLabel="Avtoyozuv" value={autoWrite} onValueChange={changeAutoWrite} trackColor={{true:'#398562'}}/><Text style={s.switchLabel}>Avtoyozuv</Text></View></View>
    </View>
    <View style={s.inputRow}>
      <TextInput multiline textAlignVertical="top" style={s.input} placeholder="Matn kiriting" placeholderTextColor="#627269" value={text} onSelectionChange={event=>{cursor.current=event.nativeEvent.selection.start}} onChangeText={editText}/>
      {!!text && <Pressable accessibilityRole="button" accessibilityLabel="Matnni tozalash" onPress={()=>onText('')} style={s.tool}><Icon name="close" size={23} color="#42644e"/></Pressable>}
    </View>
    {!!result && <View style={s.output}><View style={s.resultHeader}><Text style={s.label}>Natija</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Nusxa olish" onPress={copy} style={s.tool}><Icon name="copy-outline" size={21} color="#17653e"/></Pressable>
    </View><ScrollView><Text selectable style={s.result}>{result}</Text></ScrollView></View>}
    </View>
    <View style={s.dock}><View style={s.languages}><View style={s.pill}><Text>Avtomatik</Text></View><Icon name="arrow-forward" size={20}/>
      <View style={{flex:1}}>
        <Pressable accessibilityRole="button" accessibilityState={{expanded}} onPress={openPanel} style={[s.pill,{flex:0}]}><Text>{modes.find(([id])=>id===mode)[1]}</Text><Icon name={expanded?'chevron-up':'chevron-down'} size={14}/></Pressable>
      </View></View>
    {!!notice && <Text accessibilityLiveRegion="polite" style={s.label}>{notice}</Text>}
    </View>
    <Modal visible={expanded} transparent animationType="none" onShow={()=>animatePanel(true)} onRequestClose={()=>animatePanel(false)}>
      <View style={s.overlay}><Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill,{backgroundColor:"rgba(18,38,28,.32)",opacity:progress}]}/>
        <Pressable accessible={false} style={StyleSheet.absoluteFill} onPress={()=>animatePanel(false)}/>
        <Animated.View style={[s.list,{opacity:progress,paddingBottom:Math.max(insets.bottom,16),transform:[{translateY:progress.interpolate({inputRange:[0,1],outputRange:[72,0]})}]}]}>
          <View style={s.grip}/>
          <View style={s.modalHeader}><Text accessibilityRole="header" style={s.modalTitle}>Natija alifbosi</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Yopish" style={s.close} onPress={()=>animatePanel(false)}><Icon name="close" size={20} color="#3f5a4c"/></Pressable>
          </View>
          <ScrollView bounces={false}>{modes.map(([id,label])=>{
            const selected = mode===id;
            return <Pressable key={id} accessibilityRole="radio" accessibilityLabel={label} accessibilityState={{checked:selected}}
              onPress={()=>{onMode(id);animatePanel(false)}} style={({pressed})=>[s.option,selected&&s.selected,pressed&&{opacity:.75}]}>
              <View style={[s.tile,selected&&s.green]}><Text style={[s.glyph,selected&&{color:'white'}]}>{examples[id][0]}</Text></View>
              <View style={{flex:1}}><Text style={s.optionName}>{label}</Text><Text style={s.label}>{examples[id][1]}</Text></View>
              <Icon name={selected?'checkmark-circle':'ellipse-outline'} size={22} color={selected?'#17653e':'#bacac0'}/>
            </Pressable>;
          })}</ScrollView>
        </Animated.View>
      </View>
    </Modal>
  </KeyboardAvoidingView></SafeAreaView>;
}
const s=StyleSheet.create({
  headerSide:{flex:1},switchLabel:{fontSize:11,color:"#41614e"},
  inputRow:{flex:1,flexDirection:'row'},tool:{alignSelf:'flex-start',width:44,height:44,alignItems:'center',justifyContent:'center'},resultHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  overlay:{flex:1,justifyContent:'flex-end'},
  list:{alignSelf:'center',width:'100%',maxWidth:560,maxHeight:'90%',backgroundColor:'#fbfdfb',borderTopLeftRadius:30,borderTopRightRadius:30,paddingHorizontal:20},
  grip:{alignSelf:'center',marginTop:9,width:36,height:4,borderRadius:2,backgroundColor:'#c7d6cc'},
  modalHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginVertical:10},
  modalTitle:{fontSize:24,fontWeight:'600',color:'#173e2b'},close:{height:44,width:44,alignItems:'center',justifyContent:'center'},
  option:{minHeight:68,padding:10,borderRadius:17,borderWidth:1,borderColor:'#dfE8e2',backgroundColor:'white',marginBottom:8,flexDirection:'row',alignItems:'center',gap:14},
  selected:{backgroundColor:'#eaf5ed',borderColor:'#7fac90'},tile:{width:42,height:42,alignItems:'center',justifyContent:'center',borderRadius:13,backgroundColor:'#eff4f0'},
  green:{backgroundColor:'#17653e'},glyph:{color:'#365b45',fontSize:23,fontFamily:Platform.OS==='ios'?'Georgia':'serif'},optionName:{fontSize:16,fontWeight:'600',color:'#173e2b',marginBottom:2},
  safe:{flex:1,backgroundColor:'#e6efe9'},sheet:{flex:1,marginHorizontal:10,marginTop:6,backgroundColor:'#ffffff',borderRadius:26,borderBottomLeftRadius:30,borderBottomRightRadius:30,paddingHorizontal:20},
  header:{height:62,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},brand:{fontSize:20,fontWeight:'600',color:'#193f30'},
  input:{flex:1,fontSize:24,color:'#23392f',paddingVertical:18},output:{flex:1,borderTopWidth:1,borderColor:'#d6e3da',paddingVertical:12,gap:6},
  result:{fontSize:23,color:'#164c35',fontFamily:Platform.OS==='ios'?'Times New Roman':'serif'},handle:{width:40,height:4,borderRadius:2,alignSelf:'center',backgroundColor:'#cad9cf',marginVertical:10},
  dock:{padding:16,gap:16},languages:{flexDirection:'row',alignItems:'center',gap:12},pill:{flex:1,minHeight:50,borderRadius:18,backgroundColor:'#f8fbf9',flexDirection:'row',gap:8,alignItems:'center',justifyContent:'center'},
  actions:{flexDirection:'row',alignItems:'center',justifyContent:'space-around'},circle:{width:46,height:46,borderRadius:23,backgroundColor:'#d3e5da',alignItems:'center',justifyContent:'center'},large:{width:72,height:72,borderRadius:36,backgroundColor:'#17653e'},label:{fontSize:13,color:'#4a6355'}
});







