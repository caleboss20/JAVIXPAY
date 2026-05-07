import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters'
import { useNavigation } from '@react-navigation/native'
const rules = [
  { id: 1, label: 'Minimum 8 characters',          test: (p) => p.length >= 8 },
  { id: 2, label: 'At least one uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { id: 3, label: 'At least one number',            test: (p) => /[0-9]/.test(p) },
  { id: 4, label: 'At least one special character', test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
]
export default function Setpasswordscreen() {
  const navigation = useNavigation()
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew]                 = useState(false)
  const [showConfirm, setShowConfirm]         = useState(false)
  const [loading, setLoading]                 = useState(false)
  const [confirmError, setConfirmError]       = useState('')
  const [touched, setTouched]                 = useState(false)
  const shakeAnim = useRef(new Animated.Value(0)).current
  // ── Check each rule ──
  const ruleResults = rules.map((rule) => ({
    ...rule,
    passed: rule.test(newPassword),
  }))
  const allRulesPassed = ruleResults.every((r) => r.passed)
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== ''
  const isReady        = allRulesPassed && passwordsMatch
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
  const handleConfirmChange = (text) => {
    setConfirmPassword(text)
    setTouched(true)
    if (text !== newPassword) {
      setConfirmError('Passwords do not match')
    } else {
      setConfirmError('')
    }
  }
  const handleReset = () => {
    if (!isReady) {
      triggerShake()
      return
    }
    setLoading(true)
    // ── TODO: BACKEND ────────────────────────────────────────────
    // Send new password to backend for update
    // e.g. await api.post('/auth/reset-password', { password: newPassword })
    // Hash password server side never send plain text in production
    // ─────────────────────────────────────────────────────────────
    setTimeout(() => {
      setLoading(false)
      navigation.navigate('loginscreen')
    }, 3000)
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* ── LOGO ── */}
      <View style={styles.logoWrapper}>
        
        <Image
          source={require('../../../assets/javix.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      {/* ── TITLE ── */}
      <Text style={styles.title}>Set a new password</Text>
      <Text style={styles.subtitle}>
        Your new password must be different from{'\n'}previously used passwords
      </Text>
      {/* ── NEW PASSWORD ── */}
      <Text style={styles.label}>New Password*</Text>
      <Animated.View
        style={[
          styles.inputWrapper,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNew}
          placeholder="Enter new password"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowNew(!showNew)}
          style={styles.eyeBtn}
        >
          <Ionicons
            name={showNew ? 'eye-outline' : 'eye-off-outline'}
            size={s(20)}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </Animated.View>
      {/* ── LIVE VALIDATION CHECKLIST ── */}
      {newPassword.length > 0 && (
        <View style={styles.checklist}>
          {ruleResults.map((rule) => (
            <View key={rule.id} style={styles.checkRow}>
              <View
                style={[
                  styles.checkIcon,
                  { backgroundColor: rule.passed ? '#22c55e' : '#e5e7eb' },
                ]}
              >
                <Ionicons
                  name={rule.passed ? 'checkmark' : 'close'}
                  size={s(10)}
                  color="#fff"
                />
              </View>
              <Text
                style={[
                  styles.checkLabel,
                  { color: rule.passed ? '#22c55e' : '#6b7280' },
                ]}
              >
                {rule.label}
              </Text>
            </View>
          ))}
        </View>
      )}
      {/* ── CONFIRM PASSWORD ── */}
      <Text style={[styles.label, { marginTop: vs(16) }]}>Confirm Password*</Text>
      <View
        style={[
          styles.inputWrapper,
          touched && confirmError ? styles.inputError : null,
          touched && passwordsMatch ? styles.inputSuccess : null,
        ]}
      >
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={handleConfirmChange}
          secureTextEntry={!showConfirm}
          placeholder="Confirm new password"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => setShowConfirm(!showConfirm)}
          style={styles.eyeBtn}
        >
          <Ionicons
            name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
            size={s(16)}
            color="#9ca3af"
          />
        </TouchableOpacity>
      </View>
      {/* ── CONFIRM ERROR ── */}
      {touched && confirmError ? (
        <Text style={styles.errorText}>{confirmError}</Text>
      ) : null}
      {/* ── RESET BUTTON ── */}
      <TouchableOpacity
        style={[
          styles.resetBtn,
          !isReady ? styles.resetBtnDisabled : null,
        ]}
        onPress={handleReset}
        activeOpacity={isReady ? 0.8 : 1}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.resetBtnText}>Reset password</Text>
        )}
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
    paddingHorizontal: s(24),
  },
  backBtn: {
    marginTop: vs(10),
    width: s(40),
    height: s(40),
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: vs(16),
    marginBottom: vs(2),
  },
  logo: {
    width: s(130),
    height: vs(95),
    alignSelf:'center',
  },
  title: {
   fontSize: s(24),
    fontWeight: '600',
    marginBottom: s(10),
    textAlign:'center',
  },
  subtitle: {
     fontSize: s(12),
    color: '#666',
    lineHeight:s(17),
    fontWeight: '400',
    textAlign:'center',
     marginBottom: s(25),
  },
  label: {
    fontSize: s(13),
    fontWeight: '600',
    color: '#111827',
    marginBottom: vs(10),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: s(0.5),
    borderColor: '#cecece',
    borderRadius: s(10),
    paddingHorizontal: s(12),
    // backgroundColor: '#F9FAFB',
    marginBottom: vs(4),
     marginTop:s(10),
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputSuccess: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  input: {
    flex: 1,
    paddingVertical: vs(11),
    fontSize: s(13),
    color: '#111827',
   
   
  },
  eyeBtn: {
    padding: s(4),
  },
  checklist: {
    marginTop: vs(8),
    marginBottom: vs(4),
    gap: vs(6),
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  checkIcon: {
    width: s(13),
    height: s(13),
    borderRadius: s(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: {
    fontSize: s(13),
    color: '#666',
    fontWeight: '400',
    textAlign:'center',
    
    
  },
  errorText: {
    fontSize: s(11),
    color: '#ef4444',
    marginBottom: vs(8),
    marginTop: vs(2),
  },
  resetBtn: {
    width:'100%',
   backgroundColor:'green',
   height:s(45),
   justifyContent:'center',
   alignItems:'center',
   alignSelf:'center',
   borderRadius:s(10),
   marginTop:s(20),
   marginBottom:s(20),



  },
  resetBtnDisabled: {
    backgroundColor: '#e0e0e0',
    opacity:s(0.5),
  },
  resetBtnText: {
   fontSize:s(14),
  color:'#fff',
  fontWeight:'600',
  },
  backToLogin: {
    fontSize: s(13),
    color: '#6b7280',
    textAlign: 'left',
    
  },
})