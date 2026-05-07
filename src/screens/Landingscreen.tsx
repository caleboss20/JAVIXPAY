import { StyleSheet, Text, View, Animated, Dimensions, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import { s, vs } from 'react-native-size-matters';
import Buttons from './Components/Buttons';
import { useNavigation } from '@react-navigation/native';
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const IMAGES = [
  require("../../assets/img1 (2).jpg"),
  require("../../assets/img1 (3).jpg"),
  // require("../../assets/img1 (4).jpg"),
  // require("../../assets/img1 (5).jpg"),
  require("../../assets/img1 (6).jpg"),
]
const TEXTS = [
  "The future of cross border \npayment is here.",
  "Instant transfers. Anywhere.\n Anytime.",
  // "Your money moves\nat the speed of life.",
  "Your transfer. Their smile.\nGuaranteed.",
]
const Landingscreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState(1)
  const slideAnim = useRef(new Animated.Value(40)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const textFadeAnim = useRef(new Animated.Value(1)).current
  const isAnimating = useRef(false)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnimating.current) return
      isAnimating.current = true
      const next = (currentIndex + 1) % IMAGES.length
      setIncomingIndex(next)
      slideAnim.setValue(40)
      fadeAnim.setValue(0)
      // fade out text first, then bring in image + new text together
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setDisplayIndex(next)
          setCurrentIndex(next)
          slideAnim.setValue(40)
          fadeAnim.setValue(0)
          isAnimating.current = false
        })
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [currentIndex])
  return (
    <View style={styles.container}>
      {/* Current image underneath */}
      <Image
        source={IMAGES[displayIndex]}
        style={styles.image}
        resizeMode="cover"
      />
      {/* Incoming image drifts in subtly from slight right with fade */}
      <Animated.Image
        source={IMAGES[incomingIndex]}
        style={[styles.image, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}
        resizeMode="cover"
      />
      {/* Overlay */}
      <View style={styles.overlay}>
        <View style={styles.textcontainer}>
          {/* Dot indicators */}
          <View style={styles.dotsRow}>
            {IMAGES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
          <Animated.Text style={[styles.overlayText, { opacity: textFadeAnim }]}>
            {TEXTS[incomingIndex]}
          </Animated.Text>
        </View>
        <Buttons />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
  },
  overlayText: {
    color: '#fff',
    fontWeight: '400',
    fontSize: s(25),
    textAlign: 'center',
    lineHeight: s(40),
  },
  textcontainer: {
    marginTop: s(530),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: s(12),
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: s(4),
  },
  dotActive: {
    width: s(20),
    height: s(7),
    backgroundColor: '#fff',
    borderRadius: s(10),
  },
  dotInactive: {
    width: s(7),
    height: s(7),
    borderRadius: s(10),
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
})
export default Landingscreen;