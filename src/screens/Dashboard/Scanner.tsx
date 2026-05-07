
import React, { useState, useEffect, useRef } from 'react'
import { s, vs } from 'react-native-size-matters';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
 
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
const { width, height } = Dimensions.get('window')




export function ScannerScreen({ selectedUser, insets, onBack, onScanComplete }) {
  const scanLine = useRef(new Animated.Value(0)).current
  const framePulse = useRef(new Animated.Value(1)).current
  const fadeIn = useRef(new Animated.Value(0)).current
  const [phase, setPhase] = useState('scanning')
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start()
    const sweepAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(scanLine, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    )
    sweepAnimation.start()
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(framePulse, {
          toValue: 1.04,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(framePulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    )
    pulseAnimation.start()
    const scanTimer = setTimeout(() => {
      sweepAnimation.stop()
      pulseAnimation.stop()
      setPhase('verifying')
      setTimeout(() => {
        onScanComplete()
      }, 2000)
    }, 5000)
    return () => {
      clearTimeout(scanTimer)
      sweepAnimation.stop()
      pulseAnimation.stop()
    }
  }, [])
  const QR_SIZE = 180
  const CORNER = 22
  const scanLineTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, QR_SIZE - 2],
  })
  return (
    <Animated.View
      style={[
        scannerStyles.container,
        { paddingTop: insets.top, opacity: fadeIn },
      ]}
    >
      {/* Header */}
      <View style={scannerStyles.header}>
        <TouchableOpacity onPress={onBack} style={scannerStyles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={scannerStyles.headerTitle}>Scan QR Code</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={scannerStyles.body}>
        <Text style={scannerStyles.subtitle}>
          {phase === 'scanning'
            ? `Scanning ${selectedUser?.firstName}'s QR code…`
            : ''}
        </Text>
        {/* QR + Frame */}
        <View style={scannerStyles.qrWrapper}>
          <Animated.View
            style={[
              scannerStyles.frame,
              { width: QR_SIZE + 32, height: QR_SIZE + 32 },
              { transform: [{ scale: framePulse }] },
            ]}
          >
            {/* TL */}
            <View style={[scannerStyles.corner, { top: 0, left: 0 }]}>
              <View style={[scannerStyles.cH, { width: CORNER, borderTopLeftRadius: 4 }]} />
              <View style={[scannerStyles.cV, { height: CORNER, borderTopLeftRadius: 4 }]} />
            </View>
            {/* TR */}
            <View style={[scannerStyles.corner, { top: 0, right: 0 }]}>
              <View style={[scannerStyles.cH, { width: CORNER, right: 0, borderTopRightRadius: 4 }]} />
              <View style={[scannerStyles.cV, { height: CORNER, right: 0, borderTopRightRadius: 4 }]} />
            </View>
            {/* BL */}
            <View style={[scannerStyles.corner, { bottom: 0, left: 0 }]}>
              <View style={[scannerStyles.cH, { width: CORNER, bottom: 0, borderBottomLeftRadius: 4 }]} />
              <View style={[scannerStyles.cV, { height: CORNER, bottom: 0, borderBottomLeftRadius: 4 }]} />
            </View>
            {/* BR */}
            <View style={[scannerStyles.corner, { bottom: 0, right: 0 }]}>
              <View style={[scannerStyles.cH, { width: CORNER, bottom: 0, right: 0, borderBottomRightRadius: 4 }]} />
              <View style={[scannerStyles.cV, { height: CORNER, bottom: 0, right: 0, borderBottomRightRadius: 4 }]} />
            </View>
          </Animated.View>
          {/* QR Code */}
          <View style={[scannerStyles.qrBox, { width: QR_SIZE, height: QR_SIZE }]}>
            <QRCode
              value={JSON.stringify({
                app: 'callipay',
                userId: selectedUser?.id,
                version: '1',
              })}
              size={QR_SIZE}
              color="#111827"
              backgroundColor="#fff"
            />
            {phase === 'scanning' && (
              <Animated.View
                style={[
                  scannerStyles.scanLine,
                  { width: QR_SIZE, transform: [{ translateY: scanLineTranslate }] },
                ]}
              />
            )}
            {phase === 'verifying' && (
              <View style={scannerStyles.verifyingOverlay}>
                <ActivityIndicator size="large" color="#16A34A" />
              </View>
            )}
          </View>
        </View>
        {/* User badge */}

        {/* <View style={scannerStyles.userBadge}>
          <View style={scannerStyles.badgeAvatar}>
            <Text style={scannerStyles.badgeAvatarText}>
              {selectedUser?.firstName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={scannerStyles.badgeName}>{selectedUser?.fullName}</Text>
            <Text style={scannerStyles.badgeSub}>
              {selectedUser?.username} · {selectedUser?.flag} {selectedUser?.country}
            </Text>
          </View>
        </View> */}

        {/* Status pill */}
        <View
          style={[
            scannerStyles.statusPill,
            phase === 'verifying' && scannerStyles.statusPillVerifying,
          ]}
        >
          <View
            style={[
              scannerStyles.statusDot,
              phase === 'verifying' && scannerStyles.statusDotVerifying,
            ]}
          />
          <Text
            style={[
              scannerStyles.statusText,
              phase === 'verifying' && scannerStyles.statusTextVerifying,
            ]}
          >
            {phase === 'scanning' ? 'Scanning…' : 'Verifying identity…'}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}


//scanner page styles//
const scannerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
     marginBottom:s(20),
   
  },
  qrWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    position: 'absolute',
    zIndex: 2,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
  },
  cH: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#16A34A',
  },
  cV: {
    position: 'absolute',
    width: 3,
    backgroundColor: '#16A34A',
  },
  qrBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    
  },
  scanLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#16A34A',
    opacity: 0.85,
    shadowColor: '#16A34A',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  verifyingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginTop:s(20),
   
    
  },
  badgeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16A34A',
  },
  badgeName: {
    fontSize:s(14),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  badgeSub: {
     fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop:s(40),
    // backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    // borderWidth: 1,
    // borderColor: '#BBF7D0',
  },
  statusPillVerifying: {
    backgroundColor: '#FFF7ED',
    // borderColor: '#FED7AA',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    // backgroundColor: '#16A34A',
  },
  statusDotVerifying: {
    // backgroundColor: '#F97316',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
  },
  statusTextVerifying: {
    color: '#F97316',
  },
})
