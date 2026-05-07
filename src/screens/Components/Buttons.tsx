import { StyleSheet, Text, View,TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { s,vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const Buttons = () => {
  const navigation=useNavigation();
    const [showspinner,setShowspinner]=useState(false);
    const handleNext=()=>{
     setShowspinner(true);
     const timer=setTimeout(()=>{
     navigation.navigate("loginscreen")
     },2000)
    }
  return (
    <View>
     <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={{color:'#fff', fontSize:s(15),}}>Let's Get Started</Text>
              {showspinner?
                        <ActivityIndicator size={"small"} color={"white"} />
              
                        :""}
             </TouchableOpacity>
    </View>
  )
}

export default Buttons

const styles = StyleSheet.create({
    button:{
       minWidth:s(265),
       flexDirection:'row',
       gap:s(7),
       backgroundColor:'#0a813b',
       height:s(45),
       justifyContent:'center',
       alignItems:'center',
       alignSelf:'center',
       borderRadius:s(10),
      
       marginTop:s(20),
       cursor:'pointer',
       boxShadow:' rgba(10 30 0 0.45)',
      
      },
})