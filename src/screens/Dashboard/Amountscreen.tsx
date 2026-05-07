import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window')
const CURRENCIES = [
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GHS', symbol: '₵', flag: '🇬🇭', name: 'Ghanaian Cedi' },
  { code: 'NGN', symbol: '₦', flag: '🇳🇬', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', flag: '🇰🇪', name: 'Kenyan Shilling' },
]

const FALLBACK_RATES = {
  USD: { GHS: 11.20, NGN: 1580, GBP: 0.79, EUR: 0.92, KES: 129 },
  GBP: { GHS: 19.10, NGN: 1990, USD: 1.27, EUR: 1.17, KES: 164 },
  EUR: { GHS: 16.80, NGN: 1720, USD: 1.09, GBP: 0.86, KES: 140 },
  GHS: { USD: 0.066, GBP: 0.052, EUR: 0.060, NGN: 104, KES: 8.5 },
  NGN: { GHS: 0.0096, USD: 0.00063, GBP: 0.00050, EUR: 0.00058, KES: 0.082 },
  KES: { GHS: 0.118, USD: 0.0078, GBP: 0.0061, EUR: 0.0071, NGN: 12.2 },
}
const FEE_RATE = 0.01
const MOCK_BALANCE = 75965.70
const DEFAULT_RECIPIENT = {
  id: 'CP_001',
  fullName: 'Benjamin Mensah',
  firstName: 'Benjamin',
  phone: '+233 24 123 4567',
  country: 'Ghana',
  flag: '????',
  currency: 'GHS',
  username: '@benjamin',
}
export default function Amountscreen({ navigation, route, selectedUser }) {
  const insets = useSafeAreaInsets()
  const recipient = selectedUser ?? route?.params?.recipient ?? DEFAULT_RECIPIENT
  const [amount, setAmount] = useState('0')
  const [sendCurrency, setSendCurrency] = useState('USD')
  const [receiveCurrency, setReceiveCurrency] = useState(recipient.currency || 'GHS')
  const [rates, setRates] = useState(FALLBACK_RATES['USD']) // seed with fallback immediately
  const [loadingRates, setLoadingRates] = useState(false)
  const [ratesError, setRatesError] = useState(false)
  const [showSendPicker, setShowSendPicker] = useState(false)
  const [showReceivePicker, setShowReceivePicker] = useState(false)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const amountAnim = useRef(new Animated.Value(1)).current
  const buttonAnim = useRef(new Animated.Value(0)).current
  const rateAnim = useRef(new Animated.Value(1)).current // start visible since we seed fallback
  const formatDisplay = (val) => {
    if (!val || val === '0') return '0.00'
    const parts = val.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    if (parts.length === 1) return parts[0] + '.00'
    parts[1] = parts[1].padEnd(2, '0')
    return parts.join('.')
  }
  const fetchRates = async (base) => {
    setLoadingRates(true)
    setRatesError(false)
    // seed fallback immediately so rate is never 0
    setRates(FALLBACK_RATES[base] || {})
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${base}`)
      if (!response.ok) throw new Error('API error')
      const data = await response.json()
      if (data.result !== 'success') throw new Error('Rate fetch failed')
      const merged = {
        ...FALLBACK_RATES[base],
        ...data.rates,
      }
      setRates(merged)
      rateAnim.setValue(0)
      Animated.spring(rateAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start()
    } catch (error) {
      console.log('Rate fetch error:', error)
      setRatesError(true)
      setRates(FALLBACK_RATES[base] || {})
      rateAnim.setValue(0)
      Animated.spring(rateAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start()
    } finally {
      setLoadingRates(false)
    }
  }
  useEffect(() => { fetchRates(sendCurrency) }, [sendCurrency])
  const numAmount = parseFloat(amount) || 0
  const rate = rates[receiveCurrency] || 0
  const fee = numAmount * FEE_RATE
  const totalDeducted = numAmount + fee
  const receiverGets = numAmount * rate
  // rate > 0 is always true now since we seed fallback; loadingRates no longer blocks
  const isValid = numAmount > 0 && totalDeducted <= MOCK_BALANCE && rate > 0
  useEffect(() => {
    Animated.spring(buttonAnim, {
      toValue: isValid ? 1 : 0.95,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start()
  }, [isValid])
  const pulseAmount = () => {
    Animated.sequence([
      Animated.timing(amountAnim, { toValue: 1.04, duration: 80, useNativeDriver: true }),
      Animated.timing(amountAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start()
  }
  const handleNumberPress = (num) => {
    pulseAmount()
    if (num === 'del') {
      setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
      return
    }
    if (num === '.' && amount.includes('.')) return
    if (amount === '0' && num !== '.') { setAmount(num); return }
    if (amount.includes('.')) {
      const decimals = amount.split('.')[1]
      if (decimals.length >= 2) return
    }
    setAmount(prev => prev + num)
  }
  const getCurrency = (code) => CURRENCIES.find(c => c.code === code) || CURRENCIES[0]
  const formatAmount = (val) => {
    if (!val || val === 0) return '0.00'
    return Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  const handleBack = () => {
    if (navigation?.canGoBack?.()) navigation.goBack()
  }
  const handleContinue = () => {
    navigation.navigate('payconfirmationscreen', {
      recipient,
      amount: numAmount,
      sendCurrency,
      receiveCurrency,
      receiverGets,
      fee,
      totalDeducted,
      rate,
    })
  }
  const CurrencyPicker = ({ visible, onClose, onSelect, selected }) => (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
      <View style={styles.pickerOverlay}>
        <View style={styles.pickerCard}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Currency</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color="#111827" />
            </TouchableOpacity>
          </View>
          {CURRENCIES.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[styles.pickerItem, selected === currency.code && styles.pickerItemSelected]}
              onPress={() => { onSelect(currency.code); onClose() }}
              activeOpacity={0.7}
            >
              <Text style={styles.pickerFlag}>{currency.flag}</Text>
              <View style={styles.pickerInfo}>
                <Text style={styles.pickerCode}>{currency.code}</Text>
                <Text style={styles.pickerName}>{currency.name}</Text>
              </View>
              {selected === currency.code && (
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  )
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={{ width: 40 }} />
      </View>
      {/* SCROLLABLE */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* RECIPIENT CARD */}
        <View style={styles.recipientCard}>
          <View style={styles.recipientAvatar}>
            <Text style={styles.recipientAvatarText}>
              {recipient.firstName?.charAt(0) ?? '?'}
            </Text>
          </View>
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientName}>{recipient.fullName}</Text>
            <Text style={styles.recipientSub}>
              {recipient.username} · {recipient.country}
            </Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>
        {/* AMOUNT DISPLAY */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>You send</Text>
          <Animated.View style={[styles.amountRow, { transform: [{ scale: amountAnim }] }]}>
            <Text style={styles.amountSymbol}>{getCurrency(sendCurrency).symbol}</Text>
            <Text style={[styles.amountValue, { color: numAmount > 0 ? '#111827' : '#D1D5DB' }]}>
              {formatDisplay(amount)}
            </Text>
          </Animated.View>
          <View style={styles.currencyRow}>
            <TouchableOpacity style={styles.currencySelector} onPress={() => setShowSendPicker(true)}>
              <Text style={styles.currencyFlag}>{getCurrency(sendCurrency).flag}</Text>
              <Text style={styles.currencyCode}>{sendCurrency}</Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
            <View style={styles.arrowContainer}>
              <Text>To</Text>
            </View>
            <TouchableOpacity style={styles.currencySelector} onPress={() => setShowReceivePicker(true)}>
              <Text style={styles.currencyFlag}>{getCurrency(receiveCurrency).flag}</Text>
              <Text style={styles.currencyCode}>{receiveCurrency}</Text>
              <Ionicons name="chevron-down" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
        {/* CONVERSION CARD */}
        <Animated.View
          style={[
            styles.conversionCard,
            {
              opacity: rateAnim,
              transform: [{ translateY: rateAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
            },
          ]}
        >
          {loadingRates ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#16A34A" />
              <Text style={styles.loadingText}>Fetching live rates...</Text>
            </View>
          ) : (
            <>
              <View style={styles.conversionRow}>
                <Text style={styles.conversionLabel}>{recipient.firstName} receives</Text>
                <Text style={styles.conversionValue}>
                  {getCurrency(receiveCurrency).symbol}{formatAmount(receiverGets)} {receiveCurrency}
                </Text>
              </View>
              <View style={styles.conversionDivider} />
              <View style={styles.conversionRow}>
                <View style={styles.rateLabelRow}>
                  <Text style={styles.conversionLabel}>Exchange rate</Text>
                  {ratesError && (
                    <TouchableOpacity onPress={() => fetchRates(sendCurrency)} style={styles.retryButton}>
                      <Ionicons name="refresh-outline" size={12} color="#F59E0B" />
                      <Text style={styles.retryText}>retry</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.rateValueRow}>
                  <Text style={styles.conversionRate}>
                    1 {sendCurrency} = {rate.toFixed(4)} {receiveCurrency}
                  </Text>
                </View>
              </View>
              <View style={styles.conversionDivider} />
              <View style={styles.conversionRow}>
                <Text style={styles.conversionLabel}>Fee (1%)</Text>
                <Text style={styles.conversionFee}>
                  {getCurrency(sendCurrency).symbol}{formatAmount(fee)}
                </Text>
              </View>
              <View style={styles.conversionDivider} />
              <View style={styles.conversionRow}>
                <Text style={styles.conversionLabel}>Total deducted</Text>
                <Text style={styles.conversionTotal}>
                  {getCurrency(sendCurrency).symbol}{formatAmount(totalDeducted)}
                </Text>
              </View>
            </>
          )}
        </Animated.View>
        {/* INSUFFICIENT BALANCE WARNING */}
        {numAmount > 0 && totalDeducted > MOCK_BALANCE && (
          <View style={styles.warningRow}>
            <Ionicons name="warning-outline" size={14} color="#EF4444" />
            <Text style={styles.warningText}>Insufficient balance</Text>
          </View>
        )}
      </ScrollView>
      {/* NUMPAD */}
      <View style={styles.numPad}>
        {[
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9'],
          ['.', '0', 'del'],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numPadRow}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.numPadKey}
                onPress={() => handleNumberPress(num)}
                activeOpacity={0.6}
              >
                {num === 'del' ? (
                  <Ionicons name="backspace-outline" size={22} color="#374151" />
                ) : (
                  <Text style={styles.numPadText}>{num}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      {/* CONTINUE BUTTON */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}>
        <Animated.View style={{ transform: [{ scale: buttonAnim }], width: '100%' }}>
          <TouchableOpacity
            style={[styles.continueButton, { opacity: isValid ? 1 : 0.45 }]}
            onPress={handleContinue}
            disabled={!isValid}
            activeOpacity={0.85}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
      {/* CURRENCY PICKERS */}
      <CurrencyPicker
        visible={showSendPicker}
        onClose={() => setShowSendPicker(false)}
        onSelect={setSendCurrency}
        selected={sendCurrency}
      />
      <CurrencyPicker
        visible={showReceivePicker}
        onClose={() => setShowReceivePicker(false)}
        onSelect={setReceiveCurrency}
        selected={receiveCurrency}
      />
    </View>
  )
}
// ─── STYLES ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  // Recipient card
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    padding: s(10),
    borderRadius: 16,
    gap: 12,
   
  },
  recipientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    
    position: 'relative',
  },
  recipientAvatarText: {
    fontSize:s(14),
       fontWeight:'400',
       color: '#333',
       letterSpacing: 0.5,
       marginBottom: 8,
      
  },
  
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
   fontSize: s(14),
       color: '#121212',
       fontWeight: '500',
  },
  recipientSub: {
    fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: s(11),
    color: 'green',
    fontWeight: '400',
  },
  // Amount
  amountContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  amountLabel: {
 fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
    justifyContent:'center',
    marginTop:s(10),
  },
  amountSymbol: {
    fontSize: s(26),
    fontWeight: '700',
    color: '#111827',
    // marginTop: 5,
  },
  amountValue: {
    fontSize: s(32),
    fontWeight: '800',
    letterSpacing: -2,
    color:'#000',
  },
  // Currency selectors
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop:s(13),
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencyFlag: {
    fontSize: s(16),
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Conversion card
  conversionCard: {
    // backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    gap:s(3),
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop:s(10),
    // borderWidth: 1,
    // borderColor: '#F3F4F6',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  conversionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  conversionLabel: {
      fontSize: s(14),
    color: '#666',
    fontWeight: '400',
  },
  conversionValue: {
    fontSize: s(13),
    color: '#121112',
    fontWeight: '400',
  },
  rateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  conversionRate: {
      fontSize: s(13),
    color: '#121112',
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  retryText: {
    color: '#F59E0B',
    fontSize: s(12),
    // color: '#666',
    fontWeight: '400',
  },
  conversionFee: {
      fontSize: s(13),
    color: '#121112',
    fontWeight: '400',
  },
  conversionTotal: {
    fontSize: s(13),
    color: '#121112',
    fontWeight: '600',
  },
  // Balance
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 4,
  },
  balanceText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  balanceAmount: {
    fontWeight: '700',
    color: '#374151',
  },
  // Warning
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom:s(15),
  },
  warningText: {
    fontSize: s(11),
    color: '#EF4444',
    fontWeight: '600',
   
  },
  // Number pad
  numPad: {
    paddingHorizontal: 20,
    gap: 4,
  },
  numPadRow: {
    flexDirection: 'row',
    gap: 4,
  },
  numPadKey: {
    flex: 1,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  numPadText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
  },
  // Bottom
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#F8F9FA',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 15,
    borderRadius: 24,
    width:'90%',
    alignSelf:'center',
    marginTop:s(9),
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Picker modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize:s(14),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
   
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemSelected: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  pickerFlag: {
    fontSize: 24,
  },
  pickerInfo: {
    flex: 1,
  },
  pickerCode: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  pickerName: {
    fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
})