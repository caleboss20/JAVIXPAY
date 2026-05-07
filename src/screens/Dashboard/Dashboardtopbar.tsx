import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';

const Dashboardtopbar = () => {
  return (
    <View style={styles.navbar}>
      <View style={styles.profilebox}>
        <View style={styles.profilecircle}>
            <Image
            style={styles.image} 
            source={require("../../../assets/profile.png")}
            />
        </View>
        <Text style={styles.welcomemsg}>Welcome back, Caleb!</Text>
      </View>

      <View style={styles.notificationcontainer}>
        <Ionicons name="notifications-outline"size={20} />
        <View style={styles.reddot}><Text style={styles.number}>2</Text></View>
      </View>
    </View>
  )
}

export default Dashboardtopbar

const styles = StyleSheet.create({
 navbar:{
  flexDirection:'row',
  paddingHorizontal:s(13),
  marginTop:s(20),
  justifyContent:'space-between',

 },
 welcomemsg:{
  fontSize:s(14),
  fontWeight:'500',
  color:'#000000',
 },
 profilebox:{
 flexDirection:'row',
 gap:s(10),
 alignItems:'center',

 },
 profilecircle:{
  width:s(50),
  height:s(50),
  borderRadius:s(30),
  backgroundColor:'green',
 },
 image:{
  width:"100%",
  height:'100%',
  borderRadius:s(30),
  
 },
 notificationcontainer:{
  width:s(40),
  height:s(40),
  borderRadius:s(22),
  backgroundColor:'#fff',
  alignItems:'center',
  justifyContent:'center',
  position:'relative',
  marginTop:s(3),

 },
 reddot:{
  // width:s(8),
  // height:s(8),
  borderRadius:'100%',
  backgroundColor:'red',
  position:'absolute',
  top:s(6),
  right:s(4),
  paddingHorizontal:s(4),
  // paddingVertical:s(0.1),
 },
 
number:{
 fontSize:s(10),
 color:'white',
 fontWeight:'500',
},








})