import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { s, vs } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
const PIN_LENGTH = 4;
const PIN_STORAGE_KEY = '@secure_pin_hash';
const { width } = Dimensions.get('window');
async function hashPin(pin) {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin
  );
  return hash;
}
// ── Dot Indicators ──────────────────────────────────────────────────────────
function PinDots({ value }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: PIN_LENGTH }).map((_, i) => {
        const filled = i < value.length;
        const isCurrent = i === value.length;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              filled && styles.dotFilled,
              isCurrent && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );
}
// ── Numpad ──────────────────────────────────────────────────────────────────
function Numpad({ onPress, onDelete }) {
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
  return (
    <View style={styles.keypad}>
      {keys.map((key, index) => {
        if (key === '') {
          return <View key={index} style={styles.keyEmpty} />;
        }
        return (
          <TouchableOpacity
            key={index}
            style={styles.key}
            activeOpacity={0.4}
            onPress={() => key === '⌫' ? onDelete() : onPress(key)}
          >
            <Text style={key === '⌫' ? styles.keyDelete : styles.keyText}>
              {key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
// ── Main Component ──────────────────────────────────────────────────────────
export default function PinAuth({ navigation }) {
  const [screen,    setScreen]    = useState('set');
  const [pin,       setPin]       = useState('');
  const [firstPin,  setFirstPin]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState('');
  const [attempts,  setAttempts]  = useState(0);
  const [isChecking, setIsChecking] = useState(true); // ← NEW: wait before showing UI
  const shakeAnim = useRef(new Animated.Value(0)).current;
  // ── CHECK if user already has a PIN ──
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(PIN_STORAGE_KEY);
        if (stored) {
          setScreen('login'); // user already has PIN → go to login
        } else {
          setScreen('set');   // new user → set PIN
        }
      } catch (e) {
        setScreen('set'); // if error default to set
      } finally {
        setIsChecking(false); // ← done checking, show UI now
      }
    })();
  }, []);
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      const timeout = setTimeout(() => handleSubmit(pin), 100);
      return () => clearTimeout(timeout);
    }
  }, [pin]);
  function shake() {
    setPin('');
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }
  function handlePress(digit) {
    if (pin.length < PIN_LENGTH) {
      setErrorMsg('');
      setPin((prev) => prev + digit);
    }
  }
  function handleDelete() {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  }
  async function handleSubmit(currentPin) {
    if (screen === 'set') {
      setFirstPin(currentPin);
      setPin('');
      setScreen('confirm');
    } else if (screen === 'confirm') {
      if (currentPin !== firstPin) {
        setErrorMsg("PINs don't match. Try again.");
        shake();
        setScreen('set');
        setFirstPin('');
        return;
      }
      setLoading(true);
      try {
        const hashed = await hashPin(currentPin);
        await AsyncStorage.setItem(PIN_STORAGE_KEY, hashed);
        setPin('');
        setTimeout(() => {
          setLoading(false);
          navigation.navigate('dashboard');
        }, 4000);
      } catch (e) {
        setErrorMsg('Something went wrong. Try again.');
        setLoading(false);
      }
    } else if (screen === 'login') {
      setLoading(true);
      try {
        const stored = await AsyncStorage.getItem(PIN_STORAGE_KEY);
        const hashed = await hashPin(currentPin);
        if (hashed === stored) {
          // ── CORRECT PIN ──
          setAttempts(0);
          setPin('');
          setTimeout(() => {
            setLoading(false);
            navigation.navigate('dashboard');
          }, 4000);
        } else {
          // ── WRONG PIN ──
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          setLoading(false);
          if (newAttempts >= 3) {
            setErrorMsg('Too many failed attempts. Logging you out...');
            shake();
            setTimeout(async () => {
              await AsyncStorage.removeItem(PIN_STORAGE_KEY);
              setAttempts(0);
              setPin('');
              setErrorMsg('');
              setScreen('set');
              navigation.navigate('loginscreen');
            }, 2000);
          } else {
            setErrorMsg(`Incorrect PIN. Try again.`);
            shake();
          }
        }
      } catch (e) {
        setLoading(false);
        setErrorMsg('Something went wrong. Try again.');
        shake();
      }
    }
  }
  const title =
    screen === 'set'     ? 'Set your security PIN '
    : screen === 'confirm' ? 'Confirm your PIN '
    : 'Enter your PIN ';
  const subtitle =
    screen === 'set'     ? 'Protect your account with a secure PIN.'
    : screen === 'confirm' ? 'Re-enter your PIN to confirm.'
    : 'Enter your PIN to continue.';
  // ── SHOW SPINNER WHILE CHECKING STORAGE ──
  // This prevents the "Set PIN" flash before switching to "Enter PIN"
  if (isChecking) {
    return (
      <View style={styles.checkingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.inner}>
        {/* Back arrow — only on confirm screen */}
        {screen === 'confirm' && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setScreen('set');
              setPin('');
              setFirstPin('');
              setErrorMsg('');
            }}
          >
            <Ionicons name="chevron-back" size={s(22)} color="#333" />
          </TouchableOpacity>
        )}
        {/* Title */}
        <View style={styles.topcontain}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {/* Dots with shake animation */}
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <PinDots value={pin} />
          </Animated.View>
        </View>
        {/* Error message */}
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        {/* Number pad pushed to bottom */}
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: vs(30) }}>
          <Numpad onPress={handlePress} onDelete={handleDelete} />
        </View>
      </View>
      {/* ── LOADING OVERLAY ── */}
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.blurBackground} />
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={styles.loadingText}>
              {screen === 'confirm'
                ? 'Creating your account.\nPlease wait...'
                : 'Verifying...'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
// ── Styles — YOUR ORIGINAL STYLES, NOT TOUCHED ───────────────────────────────
const styles = StyleSheet.create({
  // ← NEW: spinner screen while checking storage
  checkingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    paddingHorizontal: s(1),
    paddingTop: vs(20),
  },
  backBtn: {
    width: s(30),
    height: s(30),
    justifyContent: 'center',
    marginBottom: vs(16),
    marginLeft: s(5),
  },
  backArrow: {
    fontSize: s(22),
    color: '#333',
    fontWeight: '300',
  },
  topcontain: {
    paddingHorizontal: s(40),
  },
  title: {
    fontSize: s(24),
    fontWeight: '700',
    color: '#111',
    marginBottom: vs(6),
  },
  subtitle: {
    fontSize: s(13),
    color: '#888',
    marginBottom: vs(36),
  },
  dotsRow: {
    flexDirection: 'row',
    gap: s(36),
    marginBottom: vs(16),
    marginLeft: s(1),
  },
  dot: {
    width: s(18),
    height: s(18),
    borderRadius: s(10),
    backgroundColor: '#1a1a2e',
  },
  dotFilled: {
    backgroundColor: '#1a1a2e',
  },
  dotActive: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  error: {
    fontSize: s(13),
    color: '#ef4444',
    marginBottom: vs(12),
    textAlign: 'left',
    marginHorizontal: s(40),
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(24),
    paddingHorizontal: s(1),
    position: 'absolute',
    bottom: s(30),
    left: s(1),
  },
  key: {
    width: '33.33%',
    height: vs(72),
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyEmpty: {
    width: '33.33%',
    height: vs(72),
  },
  keyText: {
    fontSize: s(24),
    fontWeight: '400',
    color: '#111',
  },
  keyDelete: {
    fontSize: s(22),
    color: '#555',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  loadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: s(9),
    paddingVertical: vs(32),
    paddingHorizontal: s(10),
    alignItems: 'center',
    gap: vs(16),
    width: width * 0.80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: s(4) },
    shadowOpacity: 0.1,
    shadowRadius: s(12),
    elevation: 8,
  },
  loadingText: {
    fontSize: s(14),
    color: '#666',
    textAlign: 'center',
    lineHeight: s(23),
    fontWeight: '500',
  },
})