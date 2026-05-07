import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { s, vs } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
export default function Paymentsuccess({ navigation, route }) {
    const [loading,setloading]=useState(false);
  const insets = useSafeAreaInsets()
  const { recipient, amount, sendCurrency } = route?.params || {
    recipient: { fullName: 'John Doe' },
    amount: '150',
    sendCurrency: 'USD',
  }
  const scaleAnim = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  //handledashboard//
  const handleDashboard=()=>{
     setloading(true)
    setTimeout(() => {
      navigation.navigate('dashboard')
    }, 3000);
   
  }



  const formatAmount = (val) =>
    Number(val).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  // Generate a mock transaction ID
  const transactionId = '4352 2748 3920'
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const rows = [
    { label: 'Transaction ID', value: transactionId },
   
    { label: 'Date', value: dateStr },
    { label: 'Type of Transaction', value: 'calliPay wallet' },
    { label: 'Amount transfered', value: `$${formatAmount(amount)}` },
    { label: 'Fee', value: '$0.5' },
    { label: 'Status', value: 'Success', isStatus: true },
  ]
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.iconWrapper,
            { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
          ]}
        >
          <View style={styles.iconGlow} />
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-sharp" size={36} color="#fff" />
          </View>
        </Animated.View>
        {/* Title */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Payment successful</Text>
          <Text style={styles.subtitle}>
            Successfully paid ${formatAmount(amount)}
          </Text>
        </Animated.View>
        {/* Payment Methods Card */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          {rows.map((row, index) => (
            <View key={index}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                {row.isStatus ? (
                  <View style={styles.statusBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={13}
                      color="#2cb65f"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.statusText}>Success</Text>
                  </View>
                ) : (
                  <Text style={styles.rowValue}>{row.value}</Text>
                )}
              </View>
              {index < rows.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </Animated.View>
      </ScrollView>
      {/* Total Bar + Go to Dashboard */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.totalBar}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${formatAmount(Number(amount) + 0.5)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleDashboard}
          activeOpacity={0.7}
        >
          <Text style={styles.dashboardLink}>
            {loading?<ActivityIndicator size={'small'} color={'green'}/>:"Go to dashboard"}
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 42,
  },
  // Icon
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e6f9ee',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2cb65f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Text
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: s(6),
    marginTop:s(5),
  },
  subtitle: {
    fontSize: s(12),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
  },
  // Card
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop:s(40),
   
  },
  cardTitle: {
   fontSize:s(14),
       fontWeight:'600',
       color: '#333',
       letterSpacing: 0.5,
       marginBottom: s(17),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  rowLabel: {
   fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
  rowValue: {
   fontSize:s(13),
       fontWeight:'500',
       color: '#333',
       letterSpacing: 0.5,
       marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: s(11),
    color: '#2cb65f',
    fontWeight: '400',
  },
  // Bottom
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  totalBar: {
     flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(10),
    backgroundColor: '#16A34A',
    paddingVertical: s(14),
    borderRadius: s(20),
    width:'90%',
    alignSelf:'center',
    marginBottom:s(20),
    
  },
  totalLabel: {
    color: '#fff',
    fontSize: s(14),
    fontWeight: '700',
  },
  totalValue: {
   color: '#fff',
    fontSize: s(14),
    fontWeight: '700',
  },
  dashboardLink: {
    textAlign: 'center',
    fontSize: 14,
    color: '#2cb65f',
    fontWeight: '600',
    paddingBottom: 4,
  },
})