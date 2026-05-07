import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Alert,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
const { width, height } = Dimensions.get('window')
const FRAME_WIDTH = width * 0.85
const FRAME_HEIGHT = FRAME_WIDTH * 0.63
const FRAME_TOP = height * 0.28
export default function IdCaptureScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions()
  const [screenState, setScreenState] = useState('camera') // 'camera' | 'scanning' | 'confirm'
  const [capturedImage, setCapturedImage] = useState(null)
  const cameraRef = useRef(null)
  // Scanning line animation
  const scanAnim = useRef(new Animated.Value(0)).current
  const checkAnim = useRef(new Animated.Value(0)).current
  const scanLoop = useRef(null)
  // Start scanning animation
  const startScanAnimation = () => {
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
  }
  // Stop scanning and show checkmark
  const stopScanAnimation = () => {
    if (scanLoop.current) {
      scanLoop.current.stop()
    }
    // Animate checkmark in
    Animated.spring(checkAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start()
  }
  // Start scan when state changes to scanning
  useEffect(() => {
    if (screenState === 'scanning') {
      startScanAnimation()
      setTimeout(() => {
        stopScanAnimation()
        setScreenState('confirm')
      }, 4000)
    }
  }, [screenState])
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanLoop.current) scanLoop.current.stop()
    }
  }, [])
  const scanLinePosition = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_HEIGHT - 2],
  })
  // Capture photo
  const handleCapture = async () => {
    if (!cameraRef.current) return
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      })
      setCapturedImage(photo.uri)
      setScreenState('scanning')
    } catch (error) {
      Alert.alert('Error', 'Failed to capture. Try again.')
    }
  }
  // Upload from gallery
  const handleUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    })
    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri)
      setScreenState('scanning')
    }
  }
  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null)
    checkAnim.setValue(0)
    scanAnim.setValue(0)
    setScreenState('camera')
  }
  // Continue to next screen
  const handleContinue = () => {
    Alert.alert('Success', 'Moving to face scan!')  
  navigation.navigate('idpreviewscreen', {
    passportImage: capturedImage
  })
  }

  // Permission screen
  if (!permission?.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={60} color="#fff" />
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          We need your camera to scan your passport
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
      {/* ── BACKGROUND ── */}
      {/* Camera live view */}
      {screenState === 'camera' && (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
        />
      )}
      {/* Captured image as background */}
      {(screenState === 'scanning' || screenState === 'confirm') && (
        <Image
          source={{ uri: capturedImage }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}
      {/* ── DARK OVERLAYS ── */}
      <View style={[styles.overlay, styles.overlayTop]} />
      <View style={[styles.overlay, styles.overlayBottom]} />
      <View style={[styles.overlay, styles.overlayLeft]} />
      <View style={[styles.overlay, styles.overlayRight]} />
      {/* ── PASSPORT FRAME ── */}
      <View style={styles.frameContainer}>
        {/* Top Left Corner */}
        <View style={[styles.corner, styles.cornerTL]}>
          <View style={[styles.cornerLine, styles.cornerLineH]} />
          <View style={[styles.cornerLine, styles.cornerLineV]} />
        </View>
        {/* Top Right Corner */}
        <View style={[styles.corner, styles.cornerTR,
          { transform: [{ scaleX: -1 }] }]}>
          <View style={[styles.cornerLine, styles.cornerLineH]} />
          <View style={[styles.cornerLine, styles.cornerLineV]} />
        </View>
        {/* Bottom Left Corner */}
        <View style={[styles.corner, styles.cornerBL,
          { transform: [{ scaleY: -1 }] }]}>
          <View style={[styles.cornerLine, styles.cornerLineH]} />
          <View style={[styles.cornerLine, styles.cornerLineV]} />
        </View>
        {/* Bottom Right Corner */}
        <View style={[styles.corner, styles.cornerBR,
          { transform: [{ scaleX: -1 }, { scaleY: -1 }] }]}>
          <View style={[styles.cornerLine, styles.cornerLineH]} />
          <View style={[styles.cornerLine, styles.cornerLineV]} />
        </View>
        {/* Scanning Line - only during scanning */}
        {screenState === 'scanning' && (
          <Animated.View
            style={[
              styles.scanLine,
              { transform: [{ translateY: scanLinePosition }] },
            ]}
          />
        )}
        {/* Checkmark - only on confirm */}
        {screenState === 'confirm' && (
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [{ scale: checkAnim }],
                opacity: checkAnim,
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={60} color="#16A34A" />
          </Animated.View>
        )}
      </View>
      {/* ── BACK BUTTON ── */}
      {screenState === 'camera' && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      {/* ── TOP TEXT ── */}
      <View style={styles.topTextContainer}>
        {screenState === 'camera' && (
          <>
            <Text style={styles.topTitle}>
              Move your passport inside the box
            </Text>
            <Text style={styles.topSubtitle}>
              Make sure all details are clearly visible
            </Text>
          </>
        )}
        {screenState === 'scanning' && (
          <>
            <Text style={styles.topTitle}>Scanning your passport...</Text>
            <Text style={styles.topSubtitle}>
              Please hold still
            </Text>
          </>
        )}
        {screenState === 'confirm' && (
          <>
            <Text style={styles.topTitle}>Passport Scanned!</Text>
            <Text style={styles.topSubtitle}>
              Does everything look clear?
            </Text>
          </>
        )}
      </View>
      {/* ── BOTTOM CONTENT ── */}
      <View style={styles.bottomContainer}>
        {/* Camera state - checklist + capture button */}
        {screenState === 'camera' && (
          <>
            <View style={styles.checklist}>
              {[
                "Your passport hasn't expired",
                "It's entirely in the frame",
                "It's clear and easy to read",
              ].map((item, index) => (
                <View key={index} style={styles.checkItem}>
                  <Ionicons name="checkmark" size={14} color="#16A34A" />
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleUpload}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={18}
                color="#fff"
              />
              <Text style={styles.uploadText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </>
        )}
        {/* Scanning state - progress bar */}
        {screenState === 'scanning' && (
          <View style={styles.scanningInfo}>
            <Text style={styles.scanningText}>
              Analyzing document...
            </Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['30%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}
        {/* Confirm state - retake or continue */}
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
    </View>
  )
}
// ─── STYLES ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    marginTop: 10,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  // Overlays
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  overlayTop: {
    top: 0, left: 0, right: 0,
    height: FRAME_TOP,
  },
  overlayBottom: {
    top: FRAME_TOP + FRAME_HEIGHT,
    left: 0, right: 0, bottom: 0,
  },
  overlayLeft: {
    top: FRAME_TOP,
    left: 0,
    width: (width - FRAME_WIDTH) / 2,
    height: FRAME_HEIGHT,
  },
  overlayRight: {
    top: FRAME_TOP,
    right: 0,
    width: (width - FRAME_WIDTH) / 2,
    height: FRAME_HEIGHT,
  },
  // Frame
  frameContainer: {
    position: 'absolute',
    top: FRAME_TOP,
    left: (width - FRAME_WIDTH) / 2,
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
  },
  // Corners
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
  },
  cornerTL: { top: 0, left: 0 },
  cornerTR: { top: 0, right: 0 },
  cornerBL: { bottom: 0, left: 0 },
  cornerBR: { bottom: 0, right: 0 },
  cornerLine: {
    position: 'absolute',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  cornerLineH: {
    width: 28, height: 3,
    top: 0, left: 0,
  },
  cornerLineV: {
    width: 3, height: 28,
    top: 0, left: 0,
  },
  // Scan line
  scanLine: {
    position: 'absolute',
    left: 0, right: 0,
    height: 2,
    backgroundColor: '#16A34A',
    opacity: 0.9,
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  // Checkmark
  checkmarkContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Back button
  backButton: {
    position: 'absolute',
    top: 50, left: 20,
    zIndex: 10,
    padding: 8,
  },
  // Top text
  topTextContainer: {
    position: 'absolute',
    top: FRAME_TOP - 85,
    left: 0, right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  topTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  topSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },
  // Bottom
  bottomContainer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingBottom: 44,
    alignItems: 'center',
    gap: 16,
  },
  // Checklist
  checklist: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 14,
    gap: 10,
    width: FRAME_WIDTH,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  // Capture button
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    marginTop: 4,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
  },
  // Upload
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  // Scanning progress
  scanningInfo: {
    alignItems: 'center',
    gap: 12,
    width: FRAME_WIDTH,
  },
  scanningText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  // Confirm buttons
  confirmButtons: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 30,
    width: '100%',
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
    borderColor: '#fff',
  },
  retakeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
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
})