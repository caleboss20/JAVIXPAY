import { StyleSheet, Text,Button,Pressable, 
  View,TextInput, TouchableOpacity,ActivityIndicator } from 'react-native'
import React, { useState } from 'react';
import { s,vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context';
import Backarrow from './Components/Backarrow';


const Signupscreen = () => {
  const navigation=useNavigation();
  const [showspinner,setShowspinner]=useState(false);
  const handleNext=()=>{
   setShowspinner(true);
   const timer=setTimeout(()=>{
   navigation.navigate("verification")
   },2000)
  }
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
     
     <View style={styles.topbar}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Backarrow />
  </TouchableOpacity>
  {/* Step 2/3 + progress bars */}
  <View style={styles.stepWrapper}>
    <Text style={styles.stepText}>Step 2/3</Text>
    <View style={styles.progressRow}>
      <View style={[styles.bar, styles.barActive]} />  {/* green */}
      <View style={[styles.bar, styles.barActive]} />  {/* green */}
      <View style={styles.bar} />                       {/* grey */}
    </View>
  </View>
</View>

    {/* for the middle content */}
    <View style={styles.contentContainer}>
      <Text style={styles.bigText}>Let's get you started</Text>
    <Text style={styles.introText}>Provide your personal details below</Text>
    </View>


    {/* for the form */}
     <View style={{paddingHorizontal:s(20),marginTop:s(35)}}>

      {/**for name */}
       <Text style={styles.inputLabel}>Full Name (As shown on ID)</Text>
       <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#aaa"           
          keyboardType="default"
          autoCapitalize="none"
          secureTextEntry 
        />

         {/**for contact */}

         <Text style={styles.inputLabel}>Phone Number</Text>
       <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#aaa"           
          keyboardType="phone-pad"
          autoCapitalize="none"
          secureTextEntry 
        />

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
          secureTextEntry={true} 
        />
       



        {/* <Text style={styles.forgotpasswordText}>Forgot password?</Text> */}
    

        <View style={styles.bottomtext}>
           
        </View>


         <TouchableOpacity style={styles.button} 
         onPress={handleNext}>
          <Text style={{color:'#fff',
     fontSize: s(15), fontWeight: '400'}}>Next</Text>
          {showspinner?
          <ActivityIndicator size={"small"} color={"white"} />

          :null}
          
         </TouchableOpacity>
      
        <View style={styles.bottomtext}>
          <Text style={{color:'#555',fontSize:s(14)}}>Already a user?</Text>
          <TouchableOpacity onPress={()=>navigation.navigate("loginscreen")}>
            <Text style={{color:'green',fontSize:s(14)}}>Login</Text>
          </TouchableOpacity>
        </View>
     </View>

    </SafeAreaView>
    </SafeAreaProvider>
   
  )
}

export default Signupscreen

const styles = StyleSheet.create({
  container:{
     flex: 1,      
    backgroundColor: '#fff',
    paddingHorizontal:s(2),
  },
  stepWrapper: {
  alignItems: 'flex-end',
  gap: vs(6),
},
stepText: {
  fontSize: s(13),
  color: '#333',
  fontWeight: '500',
},
progressRow: {
  flexDirection: 'row',
  gap: s(6),
},
bar: {
  width: s(55),
  height: vs(4),
  backgroundColor: '#ddd',
  borderRadius: s(4),
},
barActive: {
  backgroundColor: 'green',
},
  topbar:{
  flexDirection:'row',
  justifyContent:'space-between',
   alignItems: 'center',       //center vertically
    paddingHorizontal: s(15),
    paddingTop: s(25),
    
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
  paddingTop:s(32),
  paddingHorizontal:s(20),
  },
  bigText:{
    fontSize:s(24),
    fontWeight:'bold',
    color:'black',
    
  },
  introText:{
  fontSize:s(14),
  paddingTop:s(10),
  color:'gray',
  paddingHorizontal:s(2),
  },
    inputLabel: {
    fontSize: s(14),
    paddingHorizontal:s(2),
    color: '#555',
    marginBottom: s(10),
    
  },
 
  input:{
    backgroundColor: '#f2f2f2',
    borderRadius: s(12),
    height: s(45),
    paddingHorizontal: s(16),
    fontSize: s(15),
    color: '#333',
    marginBottom: s(15),
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

   flexDirection:'row',
   gap:7,
  
  },
  bottomtext:{
   
    flexDirection:'row',
    color:'black',
    gap:3,
    alignItems:'center',
    marginTop:s(20),
    justifyContent:'center'
  },
  spinner:{
    marginLeft:s(6),
  },
})