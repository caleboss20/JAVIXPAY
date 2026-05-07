import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react';
import { s, vs } from 'react-native-size-matters';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COUNTRIES } from './Verification';
import Backarrow from './Components/Backarrow';
import axios from 'axios';
const Welcomepage = ({ navigation }) => {
  const [fromCountry, setFromCountry] = useState(COUNTRIES[0]);
  const [toCountry,   setToCountry]   = useState(COUNTRIES[1]);
  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal,   setShowToModal]   = useState(false);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo,   setSearchTo]   = useState('');
  // ── NEW: live rate state ──
  const [liveRate, setLiveRate] = useState(null);   // stores the real rate
  const [loading,  setLoading]  = useState(false);  // shows spinner while fetching
  const [error,    setError]    = useState(null);   // stores error if fetch fails
  // ── FETCH RATE FROM API ──
  // useEffect runs fetchRate whenever fromCountry or toCountry changes
  useEffect(() => {
    fetchRate();
  }, [fromCountry, toCountry]);
  const fetchRate = async () => {
    setLoading(true);   // show spinner
    setError(null);     // clear any old error
    try {
      // Call open.er-API
      const response = await axios.get(
  `https://open.er-api.com/v6/latest/${fromCountry.currency}`
);
const rate = response.data.rates[toCountry.currency];
setLiveRate(rate);
    } catch (err) {
      console.log('Rate fetch error:', err);
      setError('Could not fetch rate');
      setLiveRate(null);
    } finally {
      setLoading(false); // hide spinner whether success or fail
    }
  };
  // ── DISPLAY RATE ──
  // Shows '...' while loading, 'Error' if failed, real rate if success
  const displayRate = loading
    ? '...'
    : error
    ? '...'
    : liveRate
    ? liveRate.toFixed(2)
    : '...';
  const handleSwap = () => {
    setFromCountry(toCountry);
    setToCountry(fromCountry);
  };
  const filteredFrom = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchFrom.toLowerCase())
  );
  const filteredTo = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchTo.toLowerCase())
  );
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Backarrow />
          </TouchableOpacity>
          <View style={styles.stepWrapper}>
            <Text style={styles.stepText}>Step 1/3</Text>
            <View style={styles.progressRow}>
              <View style={[styles.bar, styles.barActive]} />
              <View style={styles.bar} />
              <View style={styles.bar} />
            </View>
          </View>
        </View>
        {/* MAIN CONTENT */}
        <View style={styles.content}>
          <Text style={styles.toptext}>Welcome to JavixPay</Text>
          <Text style={styles.introText}>Provide your country details</Text>
          {/* CURRENCY ROW */}
          <View style={styles.currencyRow}>
            <TouchableOpacity
              style={styles.currencyBox}
              onPress={() => setShowFromModal(true)}
            >
              <Text style={styles.currencyFlag}>{fromCountry.flag}</Text>
              <Text style={styles.currencyText}>1 {fromCountry.currency}</Text>
              <Ionicons name="chevron-down" size={s(14)} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.swapCircle} onPress={handleSwap}>
              <Ionicons name="swap-horizontal" size={s(12)} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.currencyBox}
              onPress={() => setShowToModal(true)}
            >
              <Text style={styles.currencyFlag}>{toCountry.flag}</Text>
              {/* Shows live rate here */}
              <Text style={styles.currencyText}>
                {displayRate} {toCountry.currency}
              </Text>
              <Ionicons name="chevron-down" size={s(14)} color="#555" />
            </TouchableOpacity>
          </View>
          {/* RATE CARD */}
          <View style={styles.rateCard}>
            <Text style={styles.rateLabel}>Today's Rate</Text>
            {/* Show spinner while loading, rate when done */}
            {loading ? (
              <ActivityIndicator size="small" color="green" />
            ) : error ? (
              <Text style={styles.errorText}>Could not fetch rate. retry?</Text>
            ) : (
              <Text style={styles.rateValue}>
                {displayRate} {toCountry.currency}
              </Text>
            )}
            {/* Retry button shows when there's an error */}
            {error && (
              <TouchableOpacity onPress={fetchRate} style={styles.retryButton}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.line} />
          <View style={styles.sendingBox}>
            <Text style={styles.sectionLabel}>I'm sending from</Text>
            <TouchableOpacity
              style={styles.selectorBox}
              onPress={() => setShowFromModal(true)}
            >
              <View style={styles.selectorLeft}>
                <Text style={styles.selectorFlag}>{fromCountry.flag}</Text>
                <Text style={styles.selectorName}>{fromCountry.name}</Text>
              </View>
              <Ionicons name="swap-vertical" size={s(18)} color="#1a1a2e" />
            </TouchableOpacity>
            <Text style={styles.sectionLabel}>I'm sending to</Text>
            <TouchableOpacity
              style={styles.selectorBox}
              onPress={() => setShowToModal(true)}
            >
              <View style={styles.selectorLeft}>
                <Text style={styles.selectorFlag}>{toCountry.flag}</Text>
                <Text style={styles.selectorName}>{toCountry.name}</Text>
              </View>
              <Ionicons name="swap-vertical" size={s(18)} color="#1a1a2e" />
            </TouchableOpacity>
          </View>
        </View>
        {/* NEXT BUTTON */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.nextButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('signupscreen', {
              fromCountry,
              toCountry,
              liveRate  // pass real rate to next screen too!
            })}
          >
           <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        {/* FROM MODAL */}
        <Modal
          visible={showFromModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFromModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => { setShowFromModal(false); setSearchFrom(''); }}
          >
            <TouchableOpacity style={styles.modalBox} activeOpacity={1}>
              <Text style={styles.modalTitle}>Select your Country</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#aaa"
                value={searchFrom}
                onChangeText={setSearchFrom}
              />
              <View style={styles.searchLine} />
              <FlatList
                data={filteredFrom}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => {
                      setFromCountry(item);
                      setShowFromModal(false);
                      setSearchFrom('');
                    }}
                  >
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.name}</Text>
                    <Text style={styles.countryCode}>{item.code}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        {/* TO MODAL */}
        <Modal
          visible={showToModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowToModal(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => { setShowToModal(false); setSearchTo(''); }}
          >
            <TouchableOpacity style={styles.modalBox} activeOpacity={1}>
              <Text style={styles.modalTitle}>Select your Country</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#aaa"
                value={searchTo}
                onChangeText={setSearchTo}
              />
              <View style={styles.searchLine} />
              <FlatList
                data={filteredTo}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.countryItem}
                    onPress={() => {
                      setToCountry(item);
                      setShowToModal(false);
                      setSearchTo('');
                    }}
                  >
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.name}</Text>
                    <Text style={styles.countryCode}>{item.code}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
export default Welcomepage;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingTop: vs(8),
    marginBottom: vs(8),
  },
  backButton: {
    width: s(40), height: s(40), borderRadius: s(20),
    borderWidth: 1, borderColor: '#ddd',
    justifyContent: 'center', alignItems: 'center', marginTop: s(2),
  },
  stepWrapper: { alignItems: 'flex-end', gap: vs(6) },
  stepText: { fontSize: s(13), color: '#333', fontWeight: '500' },
  progressRow: { flexDirection: 'row', gap: s(6) },
  bar: { width: s(55), height: vs(4), backgroundColor: '#ddd', borderRadius: s(4) },
  barActive: { backgroundColor: 'green' },

  content: { flex: 1, paddingHorizontal: s(20), paddingTop: vs(16) },

  toptext: { fontSize: s(24), fontWeight: 'bold', color: '#1a1a2e', marginBottom: vs(4) },
  introText: { fontSize: s(14), color: 'gray', marginBottom: vs(24) },
  currencyRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: vs(16),
  },
  currencyBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f2f2f2', borderRadius: s(12),
    paddingHorizontal: s(12), paddingVertical: vs(8), gap: s(6), flex: 1,
  },
  currencyFlag: { fontSize: s(16) },
  currencyText: { fontSize: s(10), fontWeight: '600', color: '#1a1a2e', flex: 1 },
  swapCircle: {
    width: s(33), height: s(33), borderRadius: s(19),
    backgroundColor: 'green', justifyContent: 'center',
    alignItems: 'center', marginHorizontal: s(8),
  },
  rateCard: {
    backgroundColor: '#f2f2f2', borderRadius: s(14),
    paddingVertical: vs(18), alignItems: 'center',
    marginBottom: vs(24), marginTop: s(15),
  },
  rateLabel: { fontSize: s(13), color: '#888', marginBottom: vs(6) },
  rateValue: { fontSize: s(35), fontWeight: '700', color: '#1a1a2e' },
  errorText: { fontSize: s(11), color: 'red',  },
  retryButton: { marginTop: vs(8) },
  retryText: { fontSize: s(13), color: 'green', fontWeight: '600' },
  sendingBox: { marginTop: s(10) },
  line: { width: '100%', backgroundColor: '#f0f0f0', height: s(.3), marginTop: s(20) },
  sectionLabel: { fontSize: s(13), color: '#555', marginBottom: vs(8) },
  selectorBox: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#f2f2f2', borderRadius: s(12),
    height: vs(50), paddingHorizontal: s(16), marginBottom: vs(29),
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: s(10) },
  selectorFlag: { fontSize: s(20) },
  selectorName: { fontSize: s(15), fontWeight: '400', color: '#1a1a2e' },
  bottomSection: { paddingHorizontal: s(20), paddingBottom: vs(30) },
  nextButton: {
    backgroundColor: 'green', borderRadius: s(14),
    height: vs(40), justifyContent: 'center', alignItems: 'center',
  },
  nextButtonText: { color: '#fff',
     fontSize: s(16), fontWeight: '700' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff', width: '88%',
    maxHeight: '65%', borderRadius: s(20), padding: s(24),
  },
  modalTitle: {
    fontSize: s(18), fontWeight: '700', color: '#1a1a2e',
    marginBottom: vs(16), textAlign: 'center',
  },
  searchInput: {
    fontSize: s(15), color: '#333',
    paddingVertical: vs(8), paddingHorizontal: s(4),
  },
  searchLine: { height: 1, backgroundColor: '#ddd', marginBottom: vs(12) },
  countryItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12) },
  countryFlag: { fontSize: s(24), marginRight: s(12) },
  countryName: { flex: 1, fontSize: s(15), color: '#1a1a2e', fontWeight: '400' },
  countryCode: { fontSize: s(13), color: '#888' },
  separator: { height: 1, backgroundColor: '#f5f5f5' },
});