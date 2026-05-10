import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters'
import { useUserAuth } from '../../Context/UserAuthcontext'

const PhoneConfirmationScreen = ({ route, navigation }: any) => {
  const { country } = route.params  // country from modal
  const { user }:any = useUserAuth()    // autofill from registration
  const [phone, setPhone] = useState(user?.phone || '')
  const [error, setError] = useState('')
  const validate = () => {
    if (!phone.trim()) {
      setError('Phone number is required')
      return false
    }
    if (!/^\d{9,15}$/.test(phone)) {
      setError('Enter a valid phone number')
      return false
    }
    setError('')
    return true
  }
  const handleContinue = () => {
    if (!validate()) return
    navigation.navigate('emailotp', {
      type:'wallet',
      country,
      phone: `${country.dial}${phone}`,
    } as never)
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={s(22)} color="#111" />
      </TouchableOpacity>
      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.flag}>{country.flag}</Text>
        <Text style={styles.title}>Add {country.name} Wallet</Text>
        <Text style={styles.subtitle}>
          Verify the phone number for this wallet
        </Text>
      </View>
      {/* Input */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={[styles.inputRow, error ? styles.inputError : null]}>
          {/* Country code — locked */}
          <View style={styles.dialBox}>
            <Text style={styles.flagSmall}>{country.flag}</Text>
            <Text style={styles.dial}>{country.dial}</Text>
          </View>
          {/* Divider */}
          <View style={styles.divider} />
          {/* Phone input */}
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={(text) => {
              setPhone(text.replace(/\D/g, ''))
              if (error) setError('')
            }}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#aaa"
          />
        </View>
        {/* Error */}
        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle-outline" size={s(13)} color="#e53935" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        {/* Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={s(16)} color="#16A34A" />
          <Text style={styles.infoText}>
            This number will be used to send and receive {country.currency} payments
          </Text>
        </View>
      </View>
      {/* Continue button */}
      <TouchableOpacity style={styles.btn} onPress={handleContinue}>
        <Text style={styles.btnText}>Continue</Text>
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
    marginTop: vs(8),
    width: s(38),
    height: s(38),
    borderRadius: s(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginTop: vs(28),
    marginBottom: vs(32),
  },
  flag: {
    fontSize: s(36),
    marginBottom: vs(10),
  },
  title: {
    fontSize:s(20),
    fontWeight:'500',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
   fontSize:s(12),
    fontWeight:'400',
    color: '#666',
    lineHeight:s(16),
   
  },
  inputSection: {
    flex: 1,
  },
  label: {
   fontSize:s(13),
    fontWeight:'400',
    color: '#666',
    lineHeight:s(16),
    marginBottom: vs(8),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: s(12),
    paddingHorizontal: s(14),
    height: vs(49),
  },
  inputError: {
    borderWidth: s(0.6),
    borderColor: '#e53935',
  },
  dialBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  flagSmall: {
    fontSize: s(18),
  },
  dial: {
    fontSize: s(13),
    fontWeight: '600',
    color: '#222',
  },
  divider: {
    width: 1.5,
    height: vs(22),
    backgroundColor: '#ddd',
    marginHorizontal: s(12),
  },
  input: {
    flex: 1,
    fontSize: s(14),
    color: '#111',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    marginTop:s(16),
  },
  errorText: {
    color: '#e53935',
    fontSize: s(11),
    fontWeight: '500',
    
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent:'center',
    gap: s(8),
    backgroundColor: '#F0FDF4',
    borderRadius: s(10),
    padding: s(12),
    marginTop: vs(16),
  },
  infoText: {
    flex: 1,
    fontSize: s(12),
    color: '#16A34A',
    lineHeight: vs(18),
  },
  btn: {
    backgroundColor: '#145a32',
    height: s(48),
    borderRadius: s(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(16),
  },
  btnText: {
    color: '#fff',
    fontSize: s(15),
    fontWeight: '700',
  },
})
export default PhoneConfirmationScreen