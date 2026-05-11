import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters'
import { useWallet } from '../Context/Walletcontext'
const THEMES: Record<string, { label: string; colors: [string, string, string] }> = {
  emerald:  { label: 'Emerald',  colors: ['#145a32', '#1e8449', '#22c55e'] },
  gold:     { label: 'Gold',     colors: ['#78350f', '#b45309', '#f59e0b'] },
  midnight: { label: 'Midnight', colors: ['#1e1b4b', '#3730a3', '#6366f1'] },
  purple:   { label: 'Purple',   colors: ['#581c87', '#7e22ce', '#a855f7'] },
  crimson:  { label: 'Crimson',  colors: ['#7f1d1d', '#b91c1c', '#ef4444'] },
  ocean:    { label: 'Ocean',    colors: ['#164e63', '#0e7490', '#06b6d4'] },
}
export default function WalletCard({ wallet }: { wallet: any }) {
  const { updateWalletTheme } = useWallet()
  const [pickerVisible, setPickerVisible] = useState(false)
  const [activeThemeKey, setActiveThemeKey] = useState(wallet?.theme || 'emerald')
  const sheetAnim = useRef(new Animated.Value(300)).current
  const overlayAnim = useRef(new Animated.Value(0)).current
  const shimmerAnim = useRef(new Animated.Value(-1)).current
  const currency    = wallet?.currency || 'GHS'
  const balance     = wallet?.balance?.toFixed(2) || '0.00'
  const walletName  = wallet ? `${wallet.country} Wallet` : 'No wallet linked'
  const walletNumber = wallet ? `**** **** ${wallet.phone.slice(-4)}` : '**** **** ****'
  const currentTheme = THEMES[activeThemeKey] || THEMES.emerald
  // ── Shimmer loop ──
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
  // ── Sync theme if wallet prop changes externally ──
  useEffect(() => {
    if (wallet?.theme && wallet.theme !== activeThemeKey) {
      setActiveThemeKey(wallet.theme)
    }
  }, [wallet?.theme])
  const cardWidth = s(320)
  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 2],
    outputRange: [-cardWidth, cardWidth * 2],
  })
  const openPicker = () => {
    setPickerVisible(true)
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(sheetAnim, {
        toValue: 0,
        damping: 18,
        useNativeDriver: true,
      }),
    ]).start()
  }
  const closePicker = () => {
    Animated.parallel([
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 300,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => setPickerVisible(false))
  }
  const handleThemeSelect = (key: string) => {
    setActiveThemeKey(key)
    updateWalletTheme(wallet.id, key)
    closePicker()
  }
  return (
    <>
      {/* ── Card ── */}
      <TouchableWithoutFeedback onLongPress={openPicker} delayLongPress={400}>
        <LinearGradient
          colors={currentTheme.colors}
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
      </TouchableWithoutFeedback>
     {/* ── Theme picker bottom sheet ── */}
<Modal
  transparent
  visible={pickerVisible}
  animationType="none"
  onRequestClose={closePicker}
>
  {/* Overlay */}
  <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
    <TouchableOpacity
      style={StyleSheet.absoluteFill}
      activeOpacity={1}
      onPress={closePicker}
    />
  </Animated.View>
  {/* Sheet */}
  <View style={styles.sheetWrapper} pointerEvents="box-none">
    <Animated.View
      style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}
    >
      <View style={styles.dragHandle} />
      {/* Color swatches row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.swatchRow}
      >
        {Object.entries(THEMES).map(([key, theme]) => (
          <TouchableOpacity
            key={key}
            onPress={() => handleThemeSelect(key)}
           
          >
            <LinearGradient
              colors={theme.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.colorDot,
                activeThemeKey === key && styles.colorDotSelected,
              ]}
            >
              {activeThemeKey === key && (
                <Ionicons name="checkmark" size={s(16)} color="#fff" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.divider} />
      {/* Options list */}
      {[
        { icon: 'arrow-down-circle-outline', label: 'Fund wallet',    color: '#333', onPress: () => { closePicker() } },
        { icon: 'create-outline',label: 'Edit wallet',  color: '#333', onPress: () => { closePicker() } },
        { icon: 'swap-horizontal-outline', label: 'Convert currency',  color: '#333', onPress: () => { closePicker() } },
        { icon: 'trash-outline', label: 'Remove wallet',  color: '#E53935', onPress: () => { closePicker() } },
      ].map(({ icon, label, color, onPress }) => (
        <TouchableOpacity
          key={label}
          style={styles.optionRow}
          activeOpacity={0.7}
          onPress={onPress}
        >
          <Ionicons name={icon as any} size={s(22)} color={color} />
          <Text style={[styles.optionLabel, { color }]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  </View>
</Modal>
    </>
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
  // ── Sheet ──
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: s(24),
    paddingBottom: vs(20),
  },
  dragHandle: {
    width: s(40),
    height: vs(4),
    borderRadius: 99,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: vs(16),
  },
  sheetTitle: {
   fontSize:s(14),
    fontWeight:'500',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign:'center',
  },
  sheetSubtitle: { 
    textAlign: 'center',
    marginTop: vs(4),
    marginBottom: vs(20),
       fontSize: s(12),
    color: '#666',
    fontWeight: '400',
  },
  // ── Options sheet ──
swatchRow: {
  flexDirection: 'row',
  gap: s(12),
  paddingVertical: vs(16),
  paddingHorizontal: s(4),
},
colorDot: {
  width: s(38),
  height: s(38),
  borderRadius: s(19),
  alignItems: 'center',
  justifyContent: 'center',
},
colorDotSelected: {
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 6,
},
divider: {
  height: 1,
  backgroundColor: '#F3F4F6',
  marginBottom: vs(8),
},
optionRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: vs(14),
  gap: s(16),
},
optionLabel: {
 fontSize:s(14),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
},

    // ── Swatches ──
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: vs(12),
  },
  swatchWrapper: {
    alignItems: 'center',
    width: '30%',
    gap: vs(6),
  },
  swatch: {
    width: '100%',
    height: vs(52),
    borderRadius: s(6),
    alignItems: 'center',
    justifyContent: 'center',
  },

  swatchLabel: {
       fontSize: s(12),
    color: '#666',
    fontWeight: '400',
  },
})