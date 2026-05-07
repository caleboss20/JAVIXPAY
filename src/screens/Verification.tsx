import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { s, vs } from 'react-native-size-matters';
import Backarrow from './Components/Backarrow';
const { width } = Dimensions.get('window');

export const COUNTRIES = [
  { flag: '🇬🇭', code: '+233', name: 'Ghana',        currency: 'GHS', rate: 1 },
  { flag: '🇳🇬', code: '+234', name: 'Nigeria',      currency: 'NGN', rate: 47.5 },
  { flag: '🇰🇪', code: '+254', name: 'Kenya',        currency: 'KES', rate: 9.2 },
  { flag: '🇷🇼', code: '+250', name: 'Rwanda',       currency: 'RWF', rate: 85 },
  { flag: '🇹🇿', code: '+255', name: 'Tanzania',     currency: 'TZS', rate: 175 },
  { flag: '🇺🇬', code: '+256', name: 'Uganda',       currency: 'UGX', rate: 245 },
  { flag: '🇸🇳', code: '+221', name: 'Senegal',      currency: 'XOF', rate: 42 },
  { flag: '🇨🇮', code: '+225', name: 'Ivory Coast',  currency: 'XOF', rate: 42 },
  { flag: '🇿🇦', code: '+27',  name: 'South Africa', currency: 'ZAR', rate: 1.2 },
]


export default function Verification({ navigation }) {
  const [phone, setPhone]                   = useState('');
  const [showOTP, setShowOTP]               = useState(false);
  const [otp, setOtp]                       = useState(['', '', '', '', '']); // ← 5 boxes
  const [timer, setTimer]                   = useState(60);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Ghana default
  const [showCountryModal, setShowCountryModal] = useState(false); // ← country modal
  const otpRefs = useRef([]);
  // ── TIMER ──
  useEffect(() => {
    let interval;
    if (showOTP && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTP, timer]);
  const formatTimer = () => {
    const mins = Math.floor(timer / 60).toString().padStart(2, '0');
    const secs = (timer % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  // ── OTP HANDLERS ──
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // auto jump to next box
    if (text && index < 4) {
      otpRefs.current[index + 1].focus();
    }
  };
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };
  const handleSendCode = () => {
    if (phone.length < 6) return;
    setTimer(60);
    setOtp(['', '', '', '', '']);
    setShowOTP(true);
  };
  const handleVerify = () => {
    const code = otp.join('');
    console.log('OTP entered:', code);
    setShowOTP(false);
    navigation.navigate('introkyc');
  };
  // ── SELECT COUNTRY ──
  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
        <Backarrow />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>PHONE VERIFICATION</Text>
      </View>
      {/* ── CONTENT ── */}
      <View style={styles.content}>
        <Text style={styles.title}>Please verify your{'\n'}phone number</Text>
        <Text style={styles.subtitle}>
          We will send you a code via text message.{'\n'}
          Please enter when you receive it.
        </Text>
        <Text style={styles.inputLabel}>Phone Number</Text>
        {/* Phone Input Row */}
        <View style={styles.phoneInputRow}>
          {/* ← Tap flag+code to open country modal */}
          <TouchableOpacity
            style={styles.countryPicker}
            onPress={() => setShowCountryModal(true)}
          >
            <Text style={styles.flag}>{selectedCountry.flag}</Text>
            <Text style={styles.dialCode}>{selectedCountry.code}</Text>
            <Ionicons name="chevron-down" size={s(14)} color="#666" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#aaa"
            maxLength={12}
          />
        </View>
      </View>
      {/* ── BOTTOM BUTTONS ── */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            phone.length < 6 && styles.sendButtonDisabled
          ]}
          onPress={handleSendCode}
          activeOpacity={0.8}
        >
          <Text style={styles.sendButtonText}>Send Verification code</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("loginscreen")}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      {/* ══════════════════════════════════════
          COUNTRY SELECTOR MODAL
      ══════════════════════════════════════ */}
      <Modal
        visible={showCountryModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCountryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryModal(false)}
        >
          <TouchableOpacity style={styles.modalBox} activeOpacity={1}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    // highlight selected country
                    selectedCountry.code === item.code && styles.countryItemSelected
                  ]}
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <Text style={styles.countryItemName}>{item.name}</Text>
                  <Text style={styles.countryItemCode}>{item.code}</Text>
                  {/* Checkmark on selected */}
                  {selectedCountry.code === item.code && (
                    <Ionicons name="checkmark" size={s(18)} color="green" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={styles.separator} />
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      {/* ══════════════════════════════════════
          OTP MODAL
      ══════════════════════════════════════ */}
      <Modal
        visible={showOTP}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOTP(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOTP(false)}
        >
          <TouchableOpacity style={styles.modalBox} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.modalTitle}>Enter verification code</Text>
            {/* ── 5 OTP BOXES ── */}
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpRefs.current[index] = ref)}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
              activeOpacity={0.8}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>
                Didn't receive a verification code?{'  '}
              </Text>
              {timer > 0 ? (
                <Text style={styles.timerText}>{formatTimer()}</Text>
              ) : (
                <TouchableOpacity onPress={() => setTimer(60)}>
                  <Text style={styles.resendLink}>Resend</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingTop: vs(42),
    marginBottom: vs(10),
  },
  backButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: s(14),
    fontWeight: '700',
    color: 'green',
    letterSpacing: 1.2,
  },
  content: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingTop: vs(20),
  },
  title: {
    fontSize: s(24),
    fontWeight: '700',
    color: '#1a1a2e',
    lineHeight: s(34),
    marginBottom: vs(12),
  },
  subtitle: {
    fontSize: s(13),
    color: '#666',
    lineHeight: s(20),
    marginBottom: vs(35),
  },
  inputLabel: {
    fontSize: s(13),
    color: '#555',
    marginBottom: vs(8),
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: s(12),
    height: vs(56),
    paddingHorizontal: s(14),
  },
  // Tappable country picker area
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  flag: {
    fontSize: s(22),
    marginRight: s(4),
  },
  dialCode: {
    fontSize: s(15),
    color: '#333',
    fontWeight: '600',
    marginRight: s(2),
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#ccc',
    marginHorizontal: s(10),
  },
  phoneInput: {
    flex: 1,
    fontSize: s(15),
    color: '#333',
  },
  bottomSection: {
    paddingHorizontal: s(20),
    paddingBottom: vs(30),
    alignItems: 'center',
    gap: vs(14),
  },
  sendButton: {
    backgroundColor: 'green',
    borderRadius: s(14),
    height: vs(56),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: s(16),
    fontWeight: '700',
  },
  logoutText: {
    fontSize: s(14),
    color: '#666',
  },
  // ── SHARED MODAL STYLES ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    width: '88%',
    maxHeight: '70%',
    borderRadius: s(20),
    padding: s(24),
    overflow:'hidden',
   
  
  },
  modalTitle: {
    fontSize: s(16),
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: vs(16),
  },
  // ── COUNTRY LIST ──
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(4),
    borderRadius: s(8),
  },
  countryItemSelected: {
    backgroundColor: '#f0fff5',   // light green bg on selected
  },
  countryItemFlag: {
    fontSize: s(24),
    marginRight: s(12),
  },
  countryItemName: {
    flex: 1,
    fontSize: s(15),
    color: '#1a1a2e',
    fontWeight: '500',
  },
  countryItemCode: {
    fontSize: s(13),
    color: '#888',
    marginRight: s(8),
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  // ── OTP ──
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height:vs(100),
    gap:s(10),
  },
  otpBox: {
    width: s(45),       // slightly wider since only 5 boxes now
    height: s(50),
    backgroundColor: '#f2f2f2',
    marginTop:s(12),
    borderRadius: s(10),
    fontSize: s(22),
    fontWeight: '700',
    color: '#1a1a2e',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  otpBoxFilled: {
    borderColor: '#2ecc71',
    backgroundColor: '#f0fff9',
  },
  verifyButton: {
    backgroundColor: 'green',
    borderRadius: s(14),
    height: vs(48),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
    
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: s(16),
    fontWeight: '700',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: s(13),
    color: 'black',
  },
  timerText: {
    fontSize: s(13),
    fontWeight: '700',
    color: 'green',
  },
  resendLink: {
    fontSize: s(13),
    fontWeight: '700',
    color: '#2ecc71',
  },
});