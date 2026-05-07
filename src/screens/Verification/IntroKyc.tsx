import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'

import { Ionicons } from '@expo/vector-icons';
import { s, vs } from 'react-native-size-matters';
import Backarrow from '../Components/Backarrow';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


const IntroKyc = () => {
  const navigation=useNavigation();
  const next=()=>{
    navigation.navigate("idcapturescreen");
  }
  return (
    <SafeAreaProvider style={styles.container}>
        <SafeAreaView>
            <View style={styles.box}>
          <Image
          style={styles.image}
          source={require("../../../assets/verifyimage.png")}
           />
            </View>

            <View style={styles.content}>
              <Text style={styles.contentTitle}>First, you will need to complete a passport verification</Text>
              <Text style={styles.smallText}>To verify your
                 identity, please upload a clear photo
                  of your passport. Ensure that:</Text>
            </View>
       <View style={styles.infohead}>
        
        <View style={styles.info}>
        <Ionicons name="checkmark" style={{marginTop:s(2),color:'#16a34a'}} size={s(14)}/>
        <Text style={{fontSize:s(13),fontWeight:'500'}}>
          The passport is valid and not expired
        </Text>
        </View>

        <View style={styles.info}>
        <Ionicons name="checkmark"style={{marginTop:s(2),color:'#16a34a'}} size={s(14)}/>
        <Text style={{fontSize:s(13),fontWeight:'500'}}>
          All details are visible and easy to read
        </Text>
        </View>

        <View style={styles.info}>
        <Ionicons name="checkmark"style={{marginTop:s(2),color:'#16a34a'}} size={s(14)}/>
        <Text style={{fontSize:s(13),fontWeight:'500'}}>
          The complete passport page is visible
        </Text>
        </View>


       </View>
       <TouchableOpacity style={styles.button} onPress={next}>
        <Text style={styles.buttonText}>Next</Text>
       </TouchableOpacity>
       <View style={styles.securityBadge}>
  <Ionicons name="lock-closed" size={12} color="#6B7280" />
  <Text style={styles.securityText}>
    Your data is encrypted and secure
  </Text>
</View>




        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default IntroKyc;

const styles = StyleSheet.create({
  container:{
 flex:1,
 paddingHorizontal:s(35),
  },
  box:{
   flex:1,
   justifyContent:"center",
   alignItems:"center",
   paddingTop:vs(140),
   overflow:'visible',

  },
  image:{
  width:s(220),
  height:s(290),
  color:'green',
  borderRadius:s(60),
  },
  content:{
   marginTop:s(140),
  },
  contentTitle:{
 fontSize:s(18),
 color:'#111827',
 marginBottom:s(10),
 fontWeight:'600',
 lineHeight:s(26),
  },
  smallText:{
    lineHeight:s(21),
 fontSize:s(12),
 color:'#6b7280',
 marginBottom:s(10),
  },
  infohead:{
   flexDirection:'column',
   gap:s(14),
   marginTop:s(20),
  },
  info:{
    flexDirection:'row',
    gap:s(3),
    
  },
  button:{
  alignSelf:'center',
  marginTop:s(60),
  backgroundColor:'green',
  width:'100%',
  alignItems:'center',
  justifyContent:'center',
  padding:s(10),
  height:s(45),
  borderRadius:s(12),
  paddingBottom:s(10),

  },
  buttonText:{
    color:'white',
  },
  securityBadge:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:s(6),
    marginBottom:s(16),
    marginTop:s(17),
  },
  securityText:{
 fontSize:s(12),
//  paddingTop:s(10),
 color:"#6b7280",
 fontWeight:'400',
  },
 


})