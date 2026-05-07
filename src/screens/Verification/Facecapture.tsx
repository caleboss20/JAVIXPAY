import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native'
import { s, vs } from 'react-native-size-matters';
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')
const OVAL_SIZE = width * 0.72
export default function FaceCapture({ navigation, route }) {
  const { passportImage } = route.params
  const [permission, requestPermission] = useCameraPermissions()
  const [screenState, setScreenState] = useState('idle')
  // 'idle' | 'scanning' | 'confirm'
  const [capturedFace, setCapturedFace] = useState(null)
  const [percentage, setPercentage] = useState(0)
  const cameraRef = useRef(null)
  // Animations
  const scanAnim = useRef(new Animated.Value(0)).current
  const checkAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  const scanLoop = useRef(null)
  const percentageInterval = useRef(null)
  // Pulse animation for idle state
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )
    pulse.start()
    return () => pulse.stop()
  }, [])
  // Start scanning animations
  const startScanning = () => {
    // Scan line loop
    scanLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    )
    scanLoop.current.start()
    // Percentage counter
    let count = 0
    percentageInterval.current = setInterval(() => {
      count += 2
      setPercentage(count)
      if (count >= 100) {
        clearInterval(percentageInterval.current)
      }
    }, 80)
  }
  const stopScanning = () => {
    if (scanLoop.current) scanLoop.current.stop()
    if (percentageInterval.current) {
      clearInterval(percentageInterval.current)
    }
    // Animate checkmark
    Animated.spring(checkAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start()
  }
  useEffect(() => {
    if (screenState === 'scanning') {
      startScanning()
      setTimeout(() => {
        stopScanning()
        setScreenState('confirm')
      }, 4000)
    }
    return () => {
      if (scanLoop.current) scanLoop.current.stop()
      if (percentageInterval.current) {
        clearInterval(percentageInterval.current)
      }
    }
  }, [screenState])
  const scanLinePosition = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, OVAL_SIZE - 2],
  })
  // Capture face
  const handleCapture = async () => {
    if (!cameraRef.current) return
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      })
      setCapturedFace(photo.uri)
      setScreenState('scanning')
    } catch (error) {
      console.log('Capture error:', error)
    }
  }
  // Continue to processing
  const handleContinue = () => {
    navigation.navigate('processingscreen', {
      passportImage,
      selfieImage: capturedFace,
    })
  }
  // Retake
  const handleRetake = () => {
    setCapturedFace(null)
    setPercentage(0)
    checkAnim.setValue(0)
    scanAnim.setValue(0)
    setScreenState('idle')
  }
  // Permission screen
  if (screenState !== 'idle' && !permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={60} color="#fff" />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          We need your camera to verify your face
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      {/* ── BACK BUTTON ── */}
      {screenState === 'idle' && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      {/* ── TOP TEXT ── */}
      <View style={styles.topContainer}>
        {screenState === 'idle' && (
          <>
            <Text style={styles.title}>Face ID Verification</Text>
            <Text style={styles.subtitle}>
              Position your face inside the circle
            </Text>
          </>
        )}
        {screenState === 'scanning' && (
          <>
            <Text style={styles.title}>Hold Still...</Text>
            <Text style={styles.subtitle}>
              Verifying your face
            </Text>
          </>
        )}
        {screenState === 'confirm' && (
          <>
            <Text style={styles.title}>Face Verified!</Text>
            <Text style={styles.subtitle}>
              Identity confirmed successfully
            </Text>
          </>
        )}
      </View>
      {/* ── FACE OVAL ── */}
      <View style={styles.ovalContainer}>
        {/* Idle state - dashed circle with face icon */}
        {screenState === 'idle' && (
          <Animated.View
            style={[
              styles.dashedCircle,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            {/* Dashed border segments */}
            {[...Array(12)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dashSegment,
                  {
                    transform: [
                      { rotate: `${i * 30}deg` },
                      { translateY: -(OVAL_SIZE / 2 - 4) }
                    ]
                  }
                ]}
              />
            ))}
            {/* Face icon */}
            <View style={styles.faceIconContainer}>
              <Ionicons
                name="person-outline"
                size={80}
                color="#16A34A"
              />
            </View>
          </Animated.View>
        )}
        {/* Scanning state - live camera */}
        {screenState === 'scanning' && (
          <View style={styles.cameraOval}>
            {capturedFace ? (
              <Image
                source={{ uri: capturedFace }}
                style={styles.cameraView}
              />
            ) : (
              permission?.granted && (
                <CameraView
                  ref={cameraRef}
                  style={styles.cameraView}
                  facing="front"
                />
              )
            )}
            {/* Scan line */}
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: scanLinePosition }] }
              ]}
            />
            {/* Corner brackets */}
            <View style={[styles.corner, styles.cornerTL]}>
              <View style={[styles.cornerLine, styles.cornerLineH]} />
              <View style={[styles.cornerLine, styles.cornerLineV]} />
            </View>
            <View style={[styles.corner, styles.cornerTR,
              { transform: [{ scaleX: -1 }] }]}>
              <View style={[styles.cornerLine, styles.cornerLineH]} />
              <View style={[styles.cornerLine, styles.cornerLineV]} />
            </View>
            <View style={[styles.corner, styles.cornerBL,
              { transform: [{ scaleY: -1 }] }]}>
              <View style={[styles.cornerLine, styles.cornerLineH]} />
              <View style={[styles.cornerLine, styles.cornerLineV]} />
            </View>
            <View style={[styles.corner, styles.cornerBR,
              { transform: [{ scaleX: -1 }, { scaleY: -1 }] }]}>
              <View style={[styles.cornerLine, styles.cornerLineH]} />
              <View style={[styles.cornerLine, styles.cornerLineV]} />
            </View>
          </View>
        )}
        {/* Confirm state - checkmark */}
        {screenState === 'confirm' && (
          <View style={styles.cameraOval}>
            <Image
              source={{ uri: capturedFace }}
              style={styles.cameraView}
            />
            <Animated.View
              style={[
                styles.checkOverlay,
                {
                  transform: [{ scale: checkAnim }],
                  opacity: checkAnim,
                }
              ]}
            >
              <View style={styles.checkCircle}>
                <Ionicons
                  name="checkmark"
                  size={48}
                  color="#fff"
                />
              </View>
            </Animated.View>
          </View>
        )}
      </View>
      {/* ── PERCENTAGE ── */}
      {screenState === 'scanning' && (
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{percentage}%</Text>
          <Text style={styles.percentageLabel}>Verifying your face...</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${percentage}%` }
              ]}
            />
          </View>
        </View>
      )}
      {/* ── TIPS ── */}
      {screenState === 'idle' && (
        <View style={styles.tipsContainer}>
          {[
            { icon: 'sunny-outline', text: 'Make sure you are in good light' },
            { icon: 'glasses-outline', text: 'Remove glasses if possible' },
            { icon: 'phone-portrait-outline', text: 'Hold phone at eye level' },
          ].map((tip, i) => (
            <View key={i} style={styles.tipItem}>
              <Ionicons name={tip.icon} size={16} color="#9CA3AF" />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      )}
      {/* ── BOTTOM BUTTONS ── */}
      <View style={styles.bottomContainer}>
        {/* Idle - scan button */}
        {screenState === 'idle' && (
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              requestPermission().then(() => {
                setScreenState('scanning')
                // Auto capture after 1 second
                setTimeout(() => {
                  handleCapture()
                }, 1000)
              })
            }}
          >
            <Ionicons name="scan-outline" size={20} color="#fff" />
            <Text style={styles.scanButtonText}>Scan My Face</Text>
          </TouchableOpacity>
        )}
        {/* Confirm - retake and continue */}
        {screenState === 'confirm' && (
          <View style={styles.confirmButtons}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetake}
            >
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.retakeText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* ── SECURITY BADGE ── */}
      <View style={styles.securityBadge}>
        <Ionicons name="lock-closed" size={11} color="#6B7280" />
        <Text style={styles.securityText}>
          Your face data is encrypted and never stored
        </Text>
      </View>
    </View>
  )
}
// ─── STYLES ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    // backgroundColor:'#fff',
    alignItems: 'center',
  },
  // Permission
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 16,
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  // Back button
  backButton: {
    position: 'absolute',
    top: 54,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  // Top text
  topContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
    marginBottom: 32,
    paddingHorizontal: 30,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Oval container
  ovalContainer: {
    width: OVAL_SIZE,
    height: OVAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  // Dashed circle idle
  dashedCircle: {
    width: OVAL_SIZE,
    height: OVAL_SIZE,
    borderRadius: OVAL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22,163,74,0.08)',
  },
  dashSegment: {
    position: 'absolute',
    width: 16,
    height: 3,
    backgroundColor: '#16A34A',
    borderRadius: 2,
    top: '50%',
    left: '50%',
    marginLeft: -8,
  },
  faceIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Camera oval
  cameraOval: {
    width: OVAL_SIZE,
    height: OVAL_SIZE,
    borderRadius: OVAL_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#16A34A',
    position: 'relative',
  },
  cameraView: {
    width: '100%',
    height: '100%',
  },
  // Scan line
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#16A34A',
    opacity: 0.9,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    zIndex: 10,
  },
  // Corners
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    zIndex: 20,
  },
  cornerTL: { top: 16, left: 16 },
  cornerTR: { top: 16, right: 16 },
  cornerBL: { bottom: 16, left: 16 },
  cornerBR: { bottom: 16, right: 16 },
  cornerLine: {
    position: 'absolute',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  cornerLineH: {
    width: 24, height: 3,
    top: 0, left: 0,
  },
  cornerLineV: {
    width: 3, height: 24,
    top: 0, left: 0,
  },
  // Check overlay
  checkOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 30,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Percentage
  percentageContainer: {
    alignItems: 'center',
    gap: 8,
    width: OVAL_SIZE,
    marginBottom: 16,
  },
  percentageText: {
    color: '#16A34A',
    fontSize: 36,
    fontWeight: '800',
  },
  percentageLabel: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  // Tips
  tipsContainer: {
    gap: 12,
    paddingHorizontal: 30,
    marginBottom: 16,
    marginTop:s(30),
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipText: {
    color: '#6B7280',
    fontSize: 13,
  },
  // Bottom
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  // Scan button
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 20,
    width: '90%',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Confirm buttons
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginLeft:s(35),
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 30,
    // borderWidth: 2,
    // borderColor: 'rgba(255,255,255,0.3)',
  },
  retakeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 30,
    // backgroundColor: '#16A34A',
  },
  continueText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  // Security badge
  securityBadge: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  securityText: {
    fontSize: 11,
    color: '#6B7280',
  },
})