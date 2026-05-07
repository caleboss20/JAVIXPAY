import { StyleSheet, Text,Button,Pressable, 
  View,TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react';
import { s,vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import Backarrow from './Components/Backarrow';

const Homescreen = () => {
  const navigation=useNavigation();
    const handleRegister = () => {
    
     navigation.navigate('welcomepage');
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
       <TouchableOpacity 
       style={styles.backButton}
          onPress={() => navigation.goBack()}>
       <Backarrow />
       </TouchableOpacity>
       <Text style={styles.colorText}>LOGIN</Text>
      </View>

    {/* for the middle content */}
    <View style={styles.contentContainer}>
      <Text style={styles.bigText}>Welcome Back</Text>
    <Text style={styles.introText}>You've been missed. Login to continue</Text>
    </View>


    {/* for the form */}
     <View style={{paddingHorizontal:s(20),marginTop:s(40)}}>

      {/* for email */}
       <Text style={styles.inputLabel}>Email</Text>
       <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#aaa"           
          keyboardType="email-address"
          autoCapitalize="none"    
        />
         {/* for password */}
        <Text style={styles.inputLabel}>Password</Text>
       <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#aaa"           
          keyboardType="email-address"
          autoCapitalize="none"
          secureTextEntry
        />
       <TouchableOpacity onPress={()=>navigation.navigate("forgotpassword")}>
         <Text style={styles.forgotpasswordText}>Forgot password?</Text>
       </TouchableOpacity>
    
         <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("pinauth")}>
          <Text style={{color:'#fff',fontSize:s(14)}}>Login</Text>
          
         </TouchableOpacity>
        {/* <View style={styles.bottomtext}>
          <Text style={{color:'#555',fontSize:s(12)}}>Are you a new user?</Text>
          <TouchableOpacity>
            <Text>Register</Text>
          </TouchableOpacity>
          
        </View> */}
        <View style={styles.bottomtext}>
        <Text style={{color:'#555',fontSize:s(15)}}>Are you a new user?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={{color:'green',fontSize:s(15)}}>Register</Text>
        </TouchableOpacity>
        </View>
     </View>

    </SafeAreaView>
   
  )
}

export default Homescreen

const styles = StyleSheet.create({
  container:{
     flex: 1,      
    backgroundColor: '#fff',
    paddingHorizontal:s(2),
  },
  topbar:{
  flexDirection:'row',
  justifyContent:'space-between',
   alignItems: 'center',       //center vertically
    paddingHorizontal: s(15),
    paddingTop: s(66),
    
  },
    backButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText:{
    fontWeight:'bold',
    color:'green',
    fontSize:s(16),
  },  
  contentContainer:{
  paddingTop:s(30),
  paddingHorizontal:s(20),
  },
  bigText:{
    fontSize:s(24),
    fontWeight:'bold',
    color:'black',
  },
  introText:{
  fontSize:s(12),
  marginTop:s(6),
  color:'gray',
  paddingHorizontal:s(2),
  },
    inputLabel: {
    fontSize: s(14),
    paddingHorizontal:s(2),
    color: '#555',
    marginBottom: s(12),
    
  },
  forgotpasswordText:{
  fontSize: s(14),
    paddingHorizontal:s(2),
    color: 'green',
    marginTop: s(24),
    paddingBottom:s(10),
  },
  input:{
    backgroundColor: '#f2f2f2',
    borderRadius: s(12),
    height: s(45),
    paddingHorizontal: s(16),
    fontSize: s(15),
    color: '#333',
    marginBottom: s(30),
  },
  button:{
  width:'100%',
   backgroundColor:'green',
   height:s(45),
   justifyContent:'center',
   alignItems:'center',
   alignSelf:'center',
   borderRadius:s(10),
   marginTop:s(20),
  
  },
  bottomtext:{
    
    flexDirection:'row',
    color:'black',
    gap:5,
    alignItems:'center',
    marginTop:s(25),
    justifyContent:'center'
  }
})