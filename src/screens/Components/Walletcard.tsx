import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters'
import { useWallet } from '../Context/Walletcontext'
export default function WalletCard() {
  const { wallets } = useWallet()
  const activeWallet = wallets[0]
  const currency = activeWallet?.currency || 'GHS'
  const balance = activeWallet?.balance?.toFixed(2) || '0.00'
  const walletName = activeWallet ? `${activeWallet.country} Wallet` : 'No wallet linked'
  const walletNumber = activeWallet ? `**** **** ${activeWallet.phone.slice(-4)}` : '**** **** ****'
  const shimmerAnim = useRef(new Animated.Value(-1)).current
  useEffect(() => {
    const runShimmer = () => {
      shimmerAnim.setValue(-1)
      Animated.timing(shimmerAnim, {
        toValue: 2,
        duration: 2500,
        useNativeDriver: true,
      }).start(() => setTimeout(runShimmer, 5000))
    }
    runShimmer()
  }, [])
  const cardWidth = s(340)
  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 2],
    outputRange: [-cardWidth, cardWidth * 2],
  })
  return (
    <LinearGradient
      colors={['#145a32', '#1e8449', '#22c55e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Shimmer */}
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }, { rotate: '23deg' }] },
        ]}
      />
      {/* Balance */}
      <Text style={styles.balance}>{currency} {balance}</Text>
      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.walletName}>{walletName}</Text>
          <Text style={styles.walletNumber}>{walletNumber}</Text>
        </View>
        <View style={styles.iconCircle}>
          <Ionicons name="wallet-outline" size={s(20)} color="#fff" />
        </View>
      </View>
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2E7D32',
    marginHorizontal: s(15),
    marginTop: s(20),
    borderRadius: s(12),
    padding: s(20),
    height: s(170),
    justifyContent: 'space-between',
    marginBottom:s(20),
  },
  // ── Shimmer ──
  shimmer: {
    position: 'absolute',
    top: -vs(40),
    width: s(45),
    height: '300%',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
  },
  // ── Balance ──
  balance: {
   color:"#fff",
  fontWeight:'600',
  fontSize:s(32)
  },
  // ── Bottom ──
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  walletName: {
    fontSize: s(15),
    color: '#fff',
    fontWeight: '500',
    marginBottom:s(4),
  },
  walletNumber: {
      color: 'rgba(255,255,255,0.8)',
     fontSize: s(15),
     letterSpacing:s(3),
    fontWeight: '400',
  },
  iconCircle: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})