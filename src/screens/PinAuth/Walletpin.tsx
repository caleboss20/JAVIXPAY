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
import { useWallet } from '../Context/Walletcontext';
const PIN_LENGTH = 4;

async function hashPin(pin: string) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin
  );
}
// ── Dot Indicators ──
function PinDots({ value }: { value: string }) {
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
// ── Numpad ──
function Numpad({ onPress, onDelete }: { onPress: (k: string) => void; onDelete: () => void }) {
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
  return (
    <View style={styles.keypad}>
      {keys.map((key, index) => {
        if (key === '') return <View key={index} style={styles.keyEmpty} />;
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
// ── Main Component ──
export default function WalletPin({ navigation, route }: any) {
  //  dynamic from route
  const { country, phone } = route.params
  //  unique key per wallet using phone number



  const WALLET_PIN_KEY = `@wallet_pin_hash_${phone}`
  const [screen,   setScreen]   = useState<'set' | 'confirm'>('set');
  const [pin,      setPin]      = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
 

 //for context for adding to wallets after pin confirmation//
  const {addWallet}=useWallet();
 

  const shakeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      const timeout = setTimeout(() => handleSubmit(pin), 100);
      return () => clearTimeout(timeout);
    }
  }, [pin]);
  function shake() {
    setPin('');
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  }
  function handlePress(digit: string) {
    if (pin.length < PIN_LENGTH) {
      setErrorMsg('');
      setPin(prev => prev + digit);
    }
  }
  function handleDelete() {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  }
  async function handleSubmit(currentPin: string) {
    if (screen === 'set') {
      // step 1 — save first PIN and move to confirm
      setFirstPin(currentPin);
      setPin('');
      setScreen('confirm');
    } else if (screen === 'confirm') {
      // step 2 — check if PINs match
      if (currentPin !== firstPin) {
        setErrorMsg("PINs don't match. Try again.");
        shake();
        setScreen('set');
        setFirstPin('');
        return;
      }
      // PINs match — hash and save
      setLoading(true);
      try {
        const hashed = await hashPin(currentPin);
        // save under this wallet's unique key
        await AsyncStorage.setItem(WALLET_PIN_KEY, hashed);

         //Adding wallet to context here//
     addWallet({
    country:country.name,
    currency:country.currency,
    countryCode:country.dial,
    flag:country.flag,
    phone:phone
  })

        setPin('');
        setTimeout(() => {
          setLoading(false);
          // navigate to wallet success with country info
          navigation.navigate('walletscreen',
             {
            newWallet:true, 
            country,
            phone ,
            }
            );
        }, 4000);
      } catch (e) {
        setErrorMsg('Something went wrong. Try again.');
        setLoading(false);
      }
    }
  }
  // dynamic title and subtitle using country
  const title = screen === 'set'
    ? `Create ${country.name} Wallet PIN `
    : 'Confirm your PIN '
  const subtitle = screen === 'set'
    ? `Secure your ${country.currency} wallet with a 4 digit PIN`
    : 'Re-enter your PIN to confirm'
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.inner}>
        {/* Back arrow — only on confirm step */}
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
            <Ionicons name="chevron-back" 
            size={s(22)} color="#333" />
          </TouchableOpacity>
        )}
        {/* Title */}
        <View style={styles.topcontain}>
          {/* Dynamic country flag + name */}
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {/* Dots with shake */}
          <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <PinDots value={pin} />
          </Animated.View>
        </View>
        {/* Error */}
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        {/* Numpad */}
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: vs(30) }}>
          <Numpad onPress={handlePress} onDelete={handleDelete} />
        </View>
      </View>
      {/* Loading overlay */}
      {loading && (
        <View style={styles.overlay}>
          <View style={styles.blurBackground} />
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#22c55e" />
            <Text style={styles.loadingText}>
              {screen === 'confirm'
                ? `Creating your ${country.name} wallet.\nPlease wait...`
                : 'Verifying...'}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

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
    marginLeft: s(10),
    
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
    lineHeight:s(35),
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
    paddingHorizontal:s(3),
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
    marginLeft:s(45),
    marginHorizontal: s(40),
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(24),
    // paddingHorizontal: s(1),
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
    paddingHorizontal: s(30),
    alignItems: 'center',
    gap: vs(16),
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
  flag:{
   fontSize:s(20),
   marginBottom:s(20),
  },
})