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
const maskEmail = (email) => {
  if (!email) return ''
  const [name, domain] = email.split('@')
  const masked = name.slice(0, 2) + '****'
  return `${masked}@${domain}`
}
export default function EmailOtp() {
  const navigation = useNavigation()
  const route = useRoute()
  const { email } = route.params || { email: 'user@gmail.com' }
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [hashedCode, setHashedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef([])
  const shakeAnim = useRef(new Animated.Value(0)).current
  // ── Generate and hash code on mount ──
  const generateCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      code
    )
    // ── TODO: BACKEND ────────────────────────────────────────────
    // Backend will generate the code, hash it and send OTP to email
    // e.g. await api.post('/auth/send-otp', { email })
    // Remove all frontend code generation when backend is ready
    // ─────────────────────────────────────────────────────────────
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
  const handleChange = (text, index) => {
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
  const handleKeyPress = (e, index) => {
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
    // ── TODO: BACKEND ────────────────────────────────────────────
    // Send enteredCode to backend for verification
    // e.g. const result = await api.post('/auth/verify-otp', { email, code: enteredCode })
    // Backend will compare hashes securely server side
    // ─────────────────────────────────────────────────────────────
    if (enteredHashed === hashedCode) {
      setError('')
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        navigation.navigate('setpasswordscreen')
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
    // ── TODO: BACKEND ────────────────────────────────────────────
    // Call backend to resend OTP to email
    // e.g. await api.post('/auth/resend-otp', { email })
    // ─────────────────────────────────────────────────────────────
    Alert.alert('Code Resent', 'A new code has been sent to your email.')
  }
  return (
    <SafeAreaView style={styles.container}>
      
      {/* ── ICON ── */}
        <Image
                style={styles.logo}
                source={require('../../../assets/javix.png')}
                resizeMode="contain"
              />
      {/* ── TITLE ── */}
      <View style={styles.contentcontainer}>
    <Text style={styles.title}>Check your email</Text>
      <Text style={styles.subtitle}>
        Input the code that was sent to{'\n'}
        <Text style={styles.email}>{maskEmail(email)}</Text>
      </Text>
      </View>
    
      {/* ── OTP BOXES ── */}
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
      {/* ── ERROR MESSAGE ── */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      {/* ── CONTINUE BUTTON ── */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleVerify}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.buttontext}>Continue</Text>
      </TouchableOpacity>
      {/* ── ACTIVITY INDICATOR ── */}
      {loading && (
        <ActivityIndicator
          size="small"
          color="#2cb65f"
          style={styles.loader}
        />
      )}
      {/* ── RESEND ── */}
      <TouchableOpacity onPress={handleResend} disabled={loading}>
        <Text style={styles.resendText}>
          Didn't get any code?{' '}
          <Text style={styles.resendLink}>Click to resend</Text>
        </Text>
      </TouchableOpacity>
      {/* ── BACK TO LOGIN ── */}
      <TouchableOpacity
        onPress={() => navigation.navigate('loginscreen')}
        disabled={loading}
      >
        <Text style={styles.backToLogin}> Back to log in</Text>
      </TouchableOpacity>
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