import {
  StyleSheet,
  View,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { s, vs } from 'react-native-size-matters'
const { width: W } = Dimensions.get('window')
// ─── One ring that expands outward, fades, then repeats ─────────────────────
const PulseRing = ({ delay, size, color, borderWidth = 2, speed = 1800 }) => {
  const scale   = useRef(new Animated.Value(0.85)).current
  const opacity = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          // Scale up from logo outward
          Animated.timing(scale, {
            toValue: 1,
            duration: speed,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          // Fade in then out
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.9,
              duration: speed * 0.25,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: speed * 0.75,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Reset scale instantly before next loop
        Animated.timing(scale, {
          toValue: 0.85,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])
  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth,
        borderColor: color,
        opacity,
        transform: [{ scale }],
      }}
    />
  )
}
// ─── Main Splashscreen ────────────────────────────────────────────────────────
const Splashscreen = () => {
  const navigation = useNavigation()
  const logoOpacity = useRef(new Animated.Value(0)).current
  const logoScale   = useRef(new Animated.Value(0.7)).current
  const shimmerX    = useRef(new Animated.Value(-s(200))).current
  const exitOpacity = useRef(new Animated.Value(1)).current
  // Navigate at 8s with smooth fade out
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => navigation.navigate('landingscreen'))
    }, 8000)
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    Animated.parallel([
      // Logo fades + scales in
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 2,
            tension: 20,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Shimmer loops every ~3.5s
      Animated.sequence([
        Animated.delay(1600),
        Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerX, {
              toValue: s(200),
              duration: 750,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(shimmerX, { toValue: -s(200),
               duration: 0,
               useNativeDriver: true }),
            Animated.delay(2800),
          ])
        ),
      ]),
    ]).start()
  }, [])
  return (
    <Animated.View style={[styles.container, { opacity: exitOpacity }]}>
      {/* ── Pulse rings — staggered so they feel continuous ── */}
      {/* Ring 1 — closest, dark green, starts first */}
      <PulseRing delay={0}    size={s(220)} color="#2D7A3A" borderWidth={2}   speed={2200} />
      {/* Ring 2 — medium, light green */}
      <PulseRing delay={700}  size={s(390)} color="#7EC98A" borderWidth={1.5} speed={2200} />
      {/* Ring 3 — biggest, very light green */}
      <PulseRing delay={1400} size={s(260)} color="#b3e6bc" borderWidth={1}   speed={2200} />
      {/* ── Logo center — white pill hides PNG bg ── */}
      <Animated.View
        style={[
          styles.logoPill,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          style={styles.logo}
          source={require('../../assets/javix.png')}
          resizeMode="contain"
        />
        {/* Shimmer sweep */}
        <Animated.View
          pointerEvents="none"
          style={[styles.shimmerWrapper, { transform: [{ translateX: shimmerX }] }]}
        >
          <View style={styles.shimmerBar} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}
export default Splashscreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoPill: {
    backgroundColor: '#ffffff',
    borderRadius: s(20),
    paddingHorizontal: s(26),
    paddingVertical: vs(16),
    overflow: 'hidden',
   
   
  },
  logo: {
    width: s(200),
    height: vs(95),
  },
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  shimmerBar: {
    width: s(45),
    height: '250%',
    backgroundColor: 'rgba(255,255,255,0.6)',
    transform: [{ rotate: '20deg' }],
  },
})