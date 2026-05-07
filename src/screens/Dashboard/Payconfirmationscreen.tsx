import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GHS', symbol: '₵', flag: '🇬🇭', name: 'Ghanaian Cedi' },
  { code: 'NGN', symbol: '₦', flag: '🇳🇬', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', flag: '🇰🇪', name: 'Kenyan Shilling' },
]
export default function Payconfirmationscreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const {
    recipient,
    amount,
    sendCurrency,
    receiveCurrency,
    receiverGets,
    fee,
    totalDeducted,
    rate,
  } = route.params
  const [note, setNote] = useState('')
  const [paying, setPaying] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(40)).current
  const buttonScale = useRef(new Animated.Value(1)).current
  const getCurrency = (code) => CURRENCIES.find(c => c.code === code) || CURRENCIES[0]
  const sendCurrencyObj = getCurrency(sendCurrency)
  const receiveCurrencyObj = getCurrency(receiveCurrency)
  const formatAmount = (val) =>
    Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])
  const handlePayNow = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
    setPaying(true)
    // ─────────────────────────────────────────────────────────────
    // TODO: REAL PAYMENT API CALL GOES HERE
    // This is where CalliPay processes and moves the user's money.
    // When backend is ready, replace this timeout with:
    //
    // const response = await fetch('https://api.callipay.com/v1/payments/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${userToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     quoteId,              // short-lived server quote (never trust client amounts)
    //     recipientId: recipient.id,
    //     amount,
    //     sendCurrency,
    //     receiveCurrency,
    //     note,
    //   }),
    // })
    // const data = await response.json()
    // if (!data.success) { setPaying(false); showError(data.message); return }
    // navigation.navigate('PaymentSuccess', { recipient, amount, sendCurrency })
    // ─────────────────────────────────────────────────────────────
    setTimeout(() => {
      setPaying(false)
      navigation.navigate('paymentsuccess', { recipient, amount, sendCurrency })
    }, 3000)
  }
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Close button */}
      <TouchableOpacity
        style={[styles.closeBtn, { top: insets.top + 16 }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Flag */}
        <Text style={styles.flagEmoji}>{sendCurrencyObj.flag}</Text>
        {/* Amount */}
        <Text style={styles.amountText}>
          {formatAmount(amount)} {sendCurrency}
        </Text>
        {/* Recipient name */}
        <Text style={styles.recipientName}>{recipient.fullName}</Text>
        {/* Divider */}
        <View style={styles.divider} />
        {/* Note field */}
        <View style={styles.noteField}>
          <View style={styles.noteIconBox}>
            <Ionicons name="create-outline" size={16} color="#fff" />
          </View>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note (optional)"
            placeholderTextColor="#6B7280"
            value={note}
            onChangeText={setNote}
            maxLength={60}
          />
        </View>
       
        {/* Summary rows */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>They receive</Text>
            <Text style={styles.summaryValue}>
              {receiveCurrencyObj.symbol}{formatAmount(receiverGets)} {receiveCurrency}
            </Text>
          </View>
          <View style={styles.summaryRowDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rate</Text>
            <Text style={styles.summaryValue}>
              1 {sendCurrency} = {Number(rate).toFixed(4)} {receiveCurrency}
            </Text>
          </View>
          <View style={styles.summaryRowDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fee (1%)</Text>
            <Text style={styles.summaryValue}>
              {sendCurrencyObj.symbol}{formatAmount(fee)}
            </Text>
          </View>
          <View style={styles.summaryRowDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total deducted</Text>
            <Text style={[styles.summaryValue, { color: '#2cb65f',fontWeight:'600' }]}>
              {sendCurrencyObj.symbol}{formatAmount(totalDeducted)}
            </Text>
          </View>
        </View>
        {/* Brand tag */}
       
        {/* Send label */}
        <Text style={styles.sendLabel}>SEND YOUR{'\n'}PAYMENT</Text>
      </Animated.View>
      {/* Pay Now button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 20 }]}>
        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
          <TouchableOpacity
            style={[styles.payButton, paying && styles.payButtonPaying]}
            onPress={handlePayNow}
            activeOpacity={0.9}
            disabled={paying}
          >
            {paying ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.payButtonText}>Pay Now</Text>
            )}
          </TouchableOpacity>
          
        </Animated.View>
        <Text style={styles.logo}>Powered by CalliPay</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1a12',
  },
//   {#0a120e,#0c1a12,#0f1f15}
  closeBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 72,
  },
  flagEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  amountText: {
     fontSize: s(32),
        fontWeight: '800',
        letterSpacing: -0.2,
        color:'#fff',
  },
  recipientName: {
    fontSize: s(14),
    color: '#666',
    fontWeight: '400',
    marginTop:s(10),
  },
 
  noteField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    // backgroundColor: '#141414',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    // borderWidth: 1,
    // borderColor: '#2A2A2A',
    marginTop:s(0),
    marginBottom:s(30),
  },
  noteIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    // backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteInput: {
    flex: 1,
     fontSize: s(14),
    color: '#fff',
    fontWeight: '400',
    
  },
  summaryCard: {
    width: '100%',
    // backgroundColor: '#141414',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 1,
    // borderWidth: 1,
    // borderColor: '#1F1F1F',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  summaryRowDivider: {
    // height: 1,
    backgroundColor: '#1F1F1F',
  },
  summaryLabel: {
     fontSize: s(14),
    color: '#666',
    fontWeight: '400',
  },
  summaryValue: {
     fontSize: s(13),
    color: '#666',
    fontWeight: '400',
  },
  brandTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 28,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },

  sendLabel: {
    fontSize: s(30),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: .7,
    marginTop: s(20),
    lineHeight: 54,
  },
  bottomContainer: {
    paddingHorizontal: 24,
  },
  payButton: {
    backgroundColor: '#4ADE80',
    borderRadius: 16,
    paddingVertical: 15,
    width:'90%',
    alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonPaying: {
    backgroundColor: '#16A34A',
  },
  payButtonText: {
    fontSize: s(14),
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.3,
  },
  logo:{
     fontSize: s(11),
    color: '#666',
    alignSelf:"center",
    marginTop:s(13),
    fontWeight: '400',
  },
    overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  processingText: {
    color: '#fff',
    fontSize: s(16),
    fontWeight: '600',
    marginTop: vs(8),
  },
  processingSubText: {
    color: '#9CA3AF',
    fontSize: s(13),
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a0a0a',
    borderColor: '#ff4d4f',
    borderWidth: 1,
    borderRadius: s(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    gap: s(8),
    marginBottom: vs(12),
    width: '100%',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: s(13),
    fontWeight: '500',
  },
})