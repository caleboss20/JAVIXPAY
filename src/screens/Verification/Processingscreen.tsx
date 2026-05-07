import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { s, vs } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect } from '@react-navigation/native'  // ← added
const { width, height } = Dimensions.get('window')
const CHECKS = [
  { id: 1, text: 'Document authentic', delay: 1500 },
  { id: 2, text: 'Face matched', delay: 2500 },
  { id: 3, text: 'Liveness confirmed', delay: 3500 },
]
export default function Processingscreen({ navigation, route }) {
  const { passportImage, selfieImage } = route.params
  const [currentCheck, setCurrentCheck]   = useState(0)
  const [isDone, setIsDone]               = useState(false)
  const [showModal, setShowModal]         = useState(false)
  const [modalWasClosed, setModalWasClosed] = useState(false)
  const [apiError, setApiError]           = useState(null)
  // Animations
  const passportSlide = useRef(new Animated.Value(-width)).current
  const selfieSlide   = useRef(new Animated.Value(width)).current
  const dotsAnim      = useRef(new Animated.Value(0)).current
  const successAnim   = useRef(new Animated.Value(0)).current
  const checkAnims    = useRef(CHECKS.map(() => new Animated.Value(0))).current
  const glowAnim      = useRef(new Animated.Value(0)).current
  const buttonAnim    = useRef(new Animated.Value(0)).current
  // ── FIX 1: reset modal whenever user leaves this screen ──
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setShowModal(false)
      }
    }, [])
  )
  // ---------------------------------------------
  // API CALL GOES HERE
  // ---------------------------------------------
  // const runVerification = async () => {
  //   try {
  //     const result = await kycService.verify({ passportImage, selfieImage })
  //     if (result.success) {
  //       setIsDone(true)
  //       showSuccess()
  //       setTimeout(() => setShowModal(true), 800)
  //     } else {
  //       setApiError(result.message)
  //       navigation.navigate('VerificationFailed', { reason: result.message })
  //     }
  //   } catch (error) {
  //     setApiError('Verification failed. Please try again.')
  //     navigation.navigate('VerificationFailed', { reason: 'Something went wrong. Please try again.' })
  //   }
  // }
  // ---------------------------------------------
  const startGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start()
  }
  const startDots = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotsAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(dotsAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start()
  }
  const showSuccess = () => {
    Animated.spring(successAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 5,
    }).start()
  }
  const showContinueButton = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start()
  }
  const handleModalClose = () => {
    setShowModal(false)
    setModalWasClosed(true)
    showContinueButton()
  }
  // ── FIX 2: close modal BEFORE navigating ──
  const handleNavigateToSuccess = () => {
    setShowModal(false)  // ← always close first
    navigation.navigate('summarykyc', {
      passportImage,
      selfieImage,
    })
  }
  const animateChecks = () => {
    CHECKS.forEach((check, index) => {
      setTimeout(() => {
        Animated.spring(checkAnims[index], {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 6,
        }).start()
        setCurrentCheck(index + 1)
        if (index === CHECKS.length - 1) {
          setTimeout(() => {
            setIsDone(true)
            showSuccess()
            setTimeout(() => {
              setShowModal(true)
            }, 800)
          }, 800)
        }
      }, check.delay)
    })
  }
  useEffect(() => {
    Animated.parallel([
      Animated.spring(passportSlide, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(selfieSlide, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start(() => {
      startDots()
      startGlow()
      animateChecks()
      // runVerification()
    })
  }, [])
  return (
    <View style={styles.container}>
      {/* -- TITLE -- */}
      <View style={styles.topContainer}>
        <Text style={styles.title}>
          {isDone ? 'Identity Verified!' : 'Verifying Identity...'}
        </Text>
        <Text style={styles.subtitle}>
          {isDone
            ? 'All checks passed successfully'
            : 'Please wait while we verify your documents'}
        </Text>
      </View>
      {/* -- IMAGES COMPARISON -- */}
      <View style={styles.comparisonContainer}>
        {/* Passport */}
        <Animated.View
          style={[
            styles.imageWrapper,
            { transform: [{ translateX: passportSlide }] }
          ]}
        >
          <Image
            source={{ uri: passportImage }}
            style={styles.docImage}
            resizeMode="cover"
          />
          <View style={styles.imagepassport}>
            <Ionicons name="card-outline" size={12} color="#16A34A" />
            <Text style={styles.imageLabelText}>Passport</Text>
          </View>
        </Animated.View>
        {/* Middle dots */}
        <View style={styles.middleContainer}>
          {!isDone ? (
            <View style={styles.dotsContainer}>
              {[0, 1, 2].map((i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      opacity: dotsAnim.interpolate({
                        inputRange: [0, 0.3, 0.6, 1],
                        outputRange:
                          i === 0
                            ? [1, 0.3, 0.1, 0.1]
                            : i === 1
                            ? [0.1, 1, 0.3, 0.1]
                            : [0.1, 0.1, 1, 0.3],
                      }),
                      transform: [
                        {
                          scale: dotsAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: i === 1 ? [1, 1.4, 1] : [1, 1, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              ))}
            </View>
          ) : (
            ""
          )}
        </View>
        {/* Selfie */}
        <Animated.View
          style={[
            styles.imageWrapper,
            { transform: [{ translateX: selfieSlide }] }
          ]}
        >
          <Image
            source={{ uri: selfieImage }}
            style={styles.faceImage}
            resizeMode="cover"
          />
          <View style={styles.imageLabel}>
            <Ionicons name="person-outline" size={12} color="#16A34A" />
            <Text style={styles.imageLabelText}>Selfie</Text>
          </View>
          {!isDone && (
            <Animated.View
              style={[
                styles.glowBorder,
                { opacity: glowAnim }
              ]}
            />
          )}
        </Animated.View>
      </View>
      {/* -- CHECKS LIST -- */}
      <View style={styles.checksContainer}>
        {CHECKS.map((check, index) => (
          <Animated.View
            key={check.id}
            style={[
              styles.checkItem,
              {
                opacity: checkAnims[index],
                transform: [
                  {
                    translateY: checkAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={[
              styles.checkIconContainer,
              index < currentCheck && styles.checkIconDone
            ]}>
              {index < currentCheck ? (
                <Ionicons name="checkmark" size={14} color="#fff" />
              ) : (
                <View style={styles.checkPending} />
              )}
            </View>
            <Text style={[
              styles.checkText,
              index < currentCheck && styles.checkTextDone
            ]}>
              {check.text}
            </Text>
          </Animated.View>
        ))}
      </View>
      {/* -- ACTIVITY INDICATOR -- */}
      {!isDone && (
        <ActivityIndicator
          color="#16A34A"
          size="small"
          style={{ marginTop: 8 }}
        />
      )}
      {/* -- CONTINUE BUTTON -- */}
      {modalWasClosed && (
        <Animated.View
          style={[
            styles.continueButtonContainer,
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleNavigateToSuccess}
          >
            <Text style={styles.continueButtonText}>View Summary</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {/* -- SECURITY BADGE -- */}
      <View style={styles.securityBadge}>
        <Ionicons name="lock-closed" size={11} color="#6B7280" />
        <Text style={styles.securityText}>
          256-bit encrypted · Your data is secure
        </Text>
      </View>
      {/* -- SUCCESS MODAL -- */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Close */}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={handleModalClose}
            >
              <Ionicons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            {/* Icon */}
            <View style={styles.modalIconCircle}>
              <View style={styles.modalIconRing}>
                <Ionicons name="checkmark" size={36} color="#fff" />
              </View>
            </View>
            {/* Text */}
            <Text style={styles.modalStatus}>
              Status:{' '}
              <Text style={styles.modalStatusGreen}>Successful</Text>
            </Text>
            <Text style={styles.modalTitle}>
              You have successfully completed
            </Text>
            <Text style={styles.modalSubtitle}>KYC Verification</Text>
            {/* Button */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleNavigateToSuccess}
            >
              <Text style={styles.modalButtonText}>View Summary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}
// ─── STYLES ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  // Top
  topContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
    marginBottom: 36,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Comparison
  comparisonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 36,
    width: '100%',
  },
  imageWrapper: {
    alignItems: 'center',
    gap: 8,
    position: 'relative',
  },
  docImage: {
    width: width * 0.32,
    height: width * 0.22,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  faceImage: {
    width: width * 0.28,
    height: width * 0.28,
     borderRadius: 12,
    borderRadius: width * 0.14,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  imageLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(22,163,74,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop:s(10),
    borderRadius: 20,
  },
  imagepassport:{
  flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(22,163,74,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop:s(30),
    borderRadius: 20,
  },
  imageLabelText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '600',
  },
  glowBorder: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: 20,
    borderRadius: width * 0.18,
    borderWidth: 3,
    borderColor: '#16A34A',
  },
  // Middle
  middleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  dotsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A',
  },
  matchIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Checks
  checksContainer: {
    width: '100%',
    gap: 14,
    marginBottom: 32,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  checkIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconDone: {
    backgroundColor: '#15A34A',
  },
  checkPending: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B7280',
  },
  checkText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  checkTextDone: {
    color: '#fff',
    fontWeight: '600',
  },
  // Continue button
  continueButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Security badge
  securityBadge: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  securityText: {
    fontSize: 11,
    color: '#6B7280',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 60,
    width: '100%',
    alignItems: 'center',
    minHeight: height * 0.55,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(22,163,74,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  modalIconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStatus: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  modalStatusGreen: {
    color: '#16A34A',
  },
  modalTitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 4,
  },
  modalButton: {
    backgroundColor: '#16A34A',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 48,
    left: 28,
    right: 28,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})