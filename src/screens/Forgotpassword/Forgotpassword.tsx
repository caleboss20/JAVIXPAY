import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image
} from 'react-native'
import { s, vs } from 'react-native-size-matters';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
// 🔌 This is your future backend hook
const requestPasswordReset = async (email: string) => {
  // For now, simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  // Simulate backend response
  if (email !== 'mrrcaleboss@gmail.com') {
    throw new Error('Email not found')
  }
  return { success: true }
}
const ForgotPassword = ({ navigation }: any) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }
  const handleSend = async () => {
    setError('')
    // ✅ Frontend validation
    if (!email) {
      setError('Email is required')
      return
    }
    if (!validateEmail(email)) {
      setError('Invalid email format')
      return
    }
    setLoading(true)
    try {
      // ✅ This is where backend plugs in later
      await requestPasswordReset(email)
      navigation.navigate('emailotp', { email })
    } catch (err: any) {
      // ✅ Backend error handling ready
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
   <SafeAreaView style={styles.container}>
      <Image
          style={styles.logo}
          source={require('../../../assets/javix.png')}
          resizeMode="contain"
        />
     <View style={styles.content}>
      <Text style={styles.title}>Forgot Password</Text>
     <Text style={styles.notifytext}>
        Please enter the Email associated with your account and we'll send an OTP
     </Text>
     <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => {
          setEmail(text)
          setError('')
        }}
        style={[
          styles.input,
          error ? { borderColor: 'red' } : null
        ]}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={[
          styles.button,
          (!email || loading) && { opacity: 0.6 }
        ]}
        onPress={handleSend}
        disabled={!email || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send</Text>
        )}
      </TouchableOpacity>
      
      <Text
        style={styles.back}
        onPress={() => navigation.goBack()}
      >
        Back to login
      </Text>
    </View>
   </SafeAreaView>
  )
}
export default ForgotPassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  content:{
    marginTop:s(10),
   
  },
  title: {
    fontSize: s(24),
    fontWeight: '600',
    marginBottom: s(10),
    textAlign:'center',
  },
  notifytext:{
  fontSize: s(12),
    color: '#666',
    lineHeight:s(17),
    fontWeight: '400',
    textAlign:'center',
    paddingHorizontal:s(40),
     marginBottom: s(15),
  },
  label:{
  fontSize: s(12),
    color: '#121212',
    lineHeight:s(17),
    fontWeight: '400',
    marginBottom:s(10),
    
    
     
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: s(15),
    fontSize: s(14),
    width:'100%',
  },
  error: {
    color: 'red',
    marginTop: 8,
    fontSize: 14
  },
  button: {
    backgroundColor: 'green',
    padding: s(12),
    borderRadius: s(10),
    alignItems: 'center',
    marginTop: s(20)
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  back: {
    marginTop: s(20),
    textAlign: 'left',
    color: '#666',
    marginLeft:s(2),
    fontSize:s(12),
  },
   logo: {
    width: s(160),
    height: vs(95),
    alignSelf:'center',
  },
})