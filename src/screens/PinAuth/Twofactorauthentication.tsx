import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useEffect } from 'react'
import { s, vs } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
const TWO_FA_OPTIONS = [
  {
    id: 1,
    label: 'Biometric Verification',
    description: 'Use fingerprint or face ID to verify',
    icon: 'finger-print-outline',
    toggleKey: 'biometricEnabled',
  },
  {
    id: 2,
    label: 'PIN Code',
    description: 'Use a 4 digit PIN to verify',
    icon: 'keypad-outline',
    toggleKey: 'pinCodeEnabled',
  },
]
const Twofactorauthentication = () => {
  const navigation = useNavigation();
  const [toggleStates, setToggleStates] = useState({
    biometricEnabled: false,
    pinCodeEnabled: false,
  })
  useEffect(() => {
    const loadToggles = async () => {
      try {
        const keys = TWO_FA_OPTIONS.map(o => o.toggleKey)
        const pairs = await AsyncStorage.multiGet(keys)
        const loaded = {}
        pairs.forEach(([key, value]) => {
          if (value !== null) loaded[key] = JSON.parse(value)
        })
        setToggleStates(prev => ({ ...prev, ...loaded }))
      } catch (e) {
        console.warn('Failed to load 2FA toggle states', e)
      }
    }
    loadToggles()
  }, [])
  const handleToggle = async (toggleKey, newValue) => {
    if (toggleKey === 'biometricEnabled' && newValue) {
      // 1. Check hardware support
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (!hasHardware) {
        Alert.alert('Not Supported', 'This device does not support biometric authentication.')
        return
      }
      // 2. Check if biometrics are enrolled on device
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      if (!isEnrolled) {
        Alert.alert('Not Set Up', 'Please set up Face ID or fingerprint in your device settings first.')
        return
      }
      // 3. Prompt native biometric scan
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity to enable biometrics',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      })
      if (!result.success) {
        // User cancelled or failed — keep toggle off
        return
      }
      // ── TODO: BACKEND CALL ──────────────────────────────────────────
      // Call your API here to notify the server biometric was enabled
      // e.g. await api.post('/user/2fa/biometric', { enabled: true })
      // ───────────────────────────────────────────────────────────────
    }
    // Save to local state + AsyncStorage
    setToggleStates(prev => ({ ...prev, [toggleKey]: newValue }))
    try {
      await AsyncStorage.setItem(toggleKey, JSON.stringify(newValue))
    } catch (e) {
      console.warn('Failed to save 2FA toggle state', e)
    }
  }
  const handleBack = () => {
    if (navigation?.canGoBack?.()) navigation.goBack()
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Enable 2FA Authentication</Text>
        <View style={styles.headerLeft} />
      </View>
      <View>
        <View style={styles.editNotice}>
          <Ionicons name="information-circle" size={s(14)} color="#f59e0b" />
          <Text style={styles.editNoticeText}>
            We recommend enabling at least one security method to protect your funds
          </Text>
        </View>
      </View>
      {/* ── 2FA OPTIONS ── */}
      <View style={styles.optionsCard}>
        {TWO_FA_OPTIONS.map((item, index) => (
          <View key={item.id}>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={item.icon} size={s(20)} color="#39d572" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{item.label}</Text>
                  <Text style={styles.optionDescription}>{item.description}</Text>
                </View>
              </View>
              <Switch
                value={toggleStates[item.toggleKey]}
                onValueChange={(val) => handleToggle(item.toggleKey, val)}
                trackColor={{ false: '#ddd', true: '#22c55e' }}
                thumbColor={'#fff'}
                style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
              />
            </View>
            {index < TWO_FA_OPTIONS.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
       <View style={[styles.securityBadge,]}>
                <Ionicons
                  name="lock-closed"
                  size={11}
                  color="#9CA3AF"
                />
                <Text style={styles.securityText}>
                  Your data is encrypted and secure
                </Text>
              </View>
    </SafeAreaView>
    
  )
}
export default Twofactorauthentication

const styles = StyleSheet.create({
  container:{
position:'relative',
flex:1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    marginTop: s(20),
  },
  headerLeft: {
    width: s(40),
  },
  headerTitle: {
    fontSize: s(16),
    fontWeight: '700',
    color: '#111827',
  },
  editNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: '#fffbeb',
    borderRadius: s(10),
    padding: vs(8),
    marginBottom: vs(26),
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: s(30),
    width: '90%',
    alignSelf: 'center',
  },
  editNoticeText: {
    fontSize: s(13),
    color: '#92400e',
    flex: 1,
    fontWeight: '400',
    lineHeight: s(20),
  },
  optionsCard: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: s(20),
    paddingHorizontal: s(16),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(18),
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: s(12),
  },
  iconWrapper: {
    width: s(38),
    height: s(38),
    borderRadius: s(10),
    backgroundColor: '#f3f5fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: s(14),
    fontWeight: '400',
    color: '#333',
    letterSpacing: 0.5,
  },
  optionDescription: {
    fontSize: s(12),
    color: '#9ca3af',
    marginTop: vs(3),
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
   // Security badge
  securityBadge: {
    position: 'absolute',
    bottom:s(42),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    justifyContent: 'center',
    
  },
  securityText: {
    
    fontSize: s(11),
    color: '#9CA3AF',
  },
})