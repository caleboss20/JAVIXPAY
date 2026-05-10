import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  Alert,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Crypto from 'expo-crypto'
const CODE_LENGTH = 6
const maskEmail = (email: string) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  const masked = name.slice(0, 2) + '****'
  return `${masked}@${domain}`
}
export default function EmailOtp() {
  const navigation = useNavigation()
  const route = useRoute()
  // ← now reads type, phone, country too
  const { email, type, phone, country } = (route.params as any) || {}
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [hashedCode, setHashedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<any[]>([])
  const shakeAnim = useRef(new Animated.Value(0)).current
  // ── Generate and hash code on mount ──
  const generateCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      code
    )
    console.log('OTP Code (dev only):', code)
    console.log('Hashed Code:', hashed)
    setHashedCode(hashed)
  }
  useEffect(() => {
    generateCode()
  }, [])
  // ── Shake animation ──
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
    ]).start()
  }
  // ── Handle box input ──
  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)
    setError('')
    if (text && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1].focus()
    }
  }
  // ── Handle backspace ──
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }
  // ── Verify code ──
  const handleVerify = async () => {
    const enteredCode = otp.join('')
    if (enteredCode.length < 6) {
      setError('Please enter the complete 6 digit code')
      triggerShake()
      return
    }
    const enteredHashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      enteredCode
    )
    if (enteredHashed === hashedCode) {
      setError('')
      setLoading(true)
      setTimeout(() => {
       
        // navigate based on type
        if (type === 'wallet') {
          navigation.navigate('walletpin' as never, { country, phone } as never)
           
        } else {
          navigation.navigate('setpasswordscreen' as never)
        }
        setLoading(false)
      }, 4000)
    } else {
      setError('Invalid code. Please try again.')
      triggerShake()
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0].focus()
    }
  }
  // ── Resend code ──
  const handleResend = async () => {
    await generateCode()
    setOtp(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0].focus()
    Alert.alert('Code Resent', 'A new code has been sent.')
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* ICON */}
      <Image
        style={styles.logo}
        source={require('../../../assets/javix.png')}
        resizeMode="contain"
      />
      {/* TITLE — changes based on type */}
      <View style={styles.contentcontainer}>
        <Text style={styles.title}>
          {type === 'wallet' ? 'Verify your number' : 'Check your email'}
        </Text>
        <Text style={styles.subtitle}>
          {type === 'wallet'
            ? `Enter the code sent to ${phone}`
            : `Input the code that was sent to\n`}
          {type !== 'wallet' && (
            <Text style={styles.email}>{maskEmail(email)}</Text>
          )}
        </Text>
      </View>
      {/* OTP BOXES — unchanged */}
      <Animated.View
        style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}
      >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.otpBox,
              digit ? styles.otpBoxFilled : null,
              error ? styles.otpBoxError : null,
            ]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectionColor="#2cb65f"
          />
        ))}
      </Animated.View>
      {/* ERROR */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {/* CONTINUE BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.buttontext}>Continue</Text>
      </TouchableOpacity>
      {/* LOADER */}
      {loading && (
        <ActivityIndicator size="small" color="#2cb65f" style={styles.loader} />
      )}
      {/* RESEND */}
      <TouchableOpacity onPress={handleResend} disabled={loading}>
        <Text style={styles.resendText}>
          Didn't get any code?{' '}
          <Text style={styles.resendLink}>Click to resend</Text>
        </Text>
      </TouchableOpacity>
      {/* BACK — only show for email flow */}
      {type !== 'wallet' && (
        <TouchableOpacity
          onPress={() => navigation.navigate('loginscreen' as never)}
          disabled={loading}
        >
          <Text style={styles.backToLogin}>Back to log in</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: s(20),
  },
 
  contentcontainer:{
  alignSelf:'center',
  },
  title: {
    fontSize: s(24),
    fontWeight: '600',
    marginBottom: s(10),
    textAlign:'center',
  },
  subtitle: {
   fontSize: s(13),
    color: '#666',
    lineHeight:s(22),
    fontWeight: '400',
    textAlign:'center',
    paddingHorizontal:s(40),
     marginBottom: s(15),
  },
  email: {
    color: '#111827',
    fontWeight: '600',
    textAlign:'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(12),
    marginTop:s(30),
  },
  otpBox: {
    width: s(46),
    height: s(52),
    borderRadius: s(10),
    borderWidth: s(1),
    borderColor: '#E5E7EB',
    fontSize: s(20),
    fontWeight: '700',
    color: '#565b67',
    // backgroundColo: '#F9FAFB',
  },
  otpBoxFilled: {
    borderColor: '#2cb65f',
    backgroundColor: '#EEF2FF',
  },
  otpBoxError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: s(12),
    color: '#ef4444',
    marginBottom: vs(12),
    textAlign: 'center',
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
   marginBottom:s(30),
  
  },
  buttontext:{
  fontSize:s(14),
  color:'#fff',
  fontWeight:'600',  
  
  },
  loader: {
    marginBottom: vs(16),
  },
  resendText: {
    fontSize: s(13),
    color: '#6b7280',
    textAlign: 'left',
    marginBottom: vs(12),
  },
  resendLink: {
    color: 'green',
    fontWeight: '600',
  },
  backToLogin: {
    fontSize: s(13),
    color: '#6b7280',
    textAlign: 'left',
    marginTop: vs(4),
  },
   logo: {
    width: s(130),
    height: vs(95),
    alignSelf:'center',
  },
})