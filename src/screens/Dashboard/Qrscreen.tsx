import React, { useState, useEffect, useRef } from 'react'
import { s, vs } from 'react-native-size-matters';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  Modal,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { CameraView, useCameraPermissions } from 'expo-camera'
import QRCode from 'react-native-qrcode-svg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScannerScreen } from './Scanner';
import Amountscreen from './Amountscreen';

const { width, height } = Dimensions.get('window')
const FRAME_SIZE = width * 0.65
const RECENT_KEY = 'callipay_recent_searches'
// ─────────────────────────────────────────────
// MOCK USERS — Replace with real API later
// GET /api/users/search?q=benjamin
// ─────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 'CP_001',
    firstName: 'Benjamin',
    lastName: 'Mensah',
    fullName: 'Benjamin Mensah',
    phone: '+233 24 123 4567',
    country: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    username: '@benjamin',
  },
  {
    id: 'CP_002',
    firstName: 'Amara',
    lastName: 'Diallo',
    fullName: 'Amara Diallo',
    phone: '+234 80 234 5678',
    country: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    username: '@amara',
  },
  {
    id: 'CP_003',
    firstName: 'Kofi',
    lastName: 'Asante',
    fullName: 'Kofi Asante',
    phone: '+233 55 345 6789',
    country: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    username: '@kofi',
  },
  {
    id: 'CP_004',
    firstName: 'Fatima',
    lastName: 'Bah',
    fullName: 'Fatima Bah',
    phone: '+224 62 456 7890',
    country: 'Guinea',
    flag: '🇬🇳',
    currency: 'GNF',
    username: '@fatima',
  },
  {
    id: 'CP_005',
    firstName: 'David',
    lastName: 'Osei',
    fullName: 'David Osei',
    phone: '+233 26 567 8901',
    country: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    username: '@david',
  },
  {
    id: 'CP_006',
    firstName: 'Benjamin',
    lastName: 'Owusu',
    fullName: 'Benjamin Owusu',
    phone: '+233 20 678 9012',
    country: 'Ghana',
    flag: '🇬🇭',
    currency: 'GHS',
    username: '@benjaminO',
  },
]
















export default function QrScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [screenState, setScreenState] = useState('search')
  // 'search' | 'result' | 'scanner' | 'confirm'
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [scannedData, setScannedData] = useState(null)
  const [permission, requestPermission] = useCameraPermissions()
  const cardAnim = useRef(new Animated.Value(0)).current
  const inputRef = useRef(null)
  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches()
  }, [])
  // Search logic
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      setScreenState('search')
      return
    }
    // ─────────────────────────────────────────
    // REPLACE WITH REAL API CALL LATER
    // const res = await fetch(`/api/users/search?q=${query}`)
    // setResults(await res.json())
    // ─────────────────────────────────────────
    const filtered = MOCK_USERS.filter(user =>
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.phone.includes(query)
    )
    setResults(filtered)
  }, [query])
  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_KEY)
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch (e) {
      console.log('Error loading recent searches:', e)
    }
  }
  const saveRecentSearch = async (user) => {
    try {
      let recents = [...recentSearches]
      recents = recents.filter(r => r.id !== user.id)
      recents.unshift(user)
      recents = recents.slice(0, 8)
      setRecentSearches(recents)
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(recents))
    } catch (e) {
      console.log('Error saving recent search:', e)
    }
  }
  const removeRecentSearch = async (userId) => {
    try {
      const updated = recentSearches.filter(r => r.id !== userId)
      setRecentSearches(updated)
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(updated))
    } catch (e) {
      console.log('Error removing recent search:', e)
    }
  }
  // Animate card in
  const animateCardIn = () => {
    cardAnim.setValue(0)
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start()
  }
  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setScreenState('result')
    saveRecentSearch(user)
    animateCardIn()
  }
  const handleSendToUser = async () => {
    const granted = await requestPermission()
    if (granted.granted) {
      setScreenState('scanner')
    } else {
      Alert.alert(
        'Camera Required',
        'Please allow camera access to scan QR code'
      )
    }
  }
  const handleQRScanned = ({ data }) => {
    if (scannedData) return
    setScannedData(data)
    setScreenState('confirm')
  }
  const handleConfirm = () => {
    // ─────────────────────────────────────────
    // NAVIGATE TO SEND MONEY SCREEN
    // Pass selected user details
    navigation.navigate('amountscreen', {
      recipient: selectedUser
    })
    // ─────────────────────────────────────────
    Alert.alert(
      'Confirmed!',
      `Proceeding to send money to ${selectedUser?.fullName}`
    )
  }
  const handleBack = () => {
    if (screenState === 'result') {
      setScreenState('search')
      setSelectedUser(null)
    } else if (screenState === 'scanner') {
      setScreenState('result')
      setScannedData(null)
    } else if (screenState === 'confirm') {
      setScreenState('scanner')
      setScannedData(null)
    }
  }
  // ── SEARCH SCREEN ──
  if (screenState === 'search') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.searchHeader}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search name or contact"
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {/* Search results */}
        {query.length > 0 && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectUser(item)}
                activeOpacity={0.7}
              >
                <View style={styles.resultAvatar}>
                  <Text style={styles.resultAvatarText}>
                    {item.firstName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.fullName}</Text>
                  <Text style={styles.resultSub}>
                    {item.username} · {item.flag} {item.country}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          />
        )}
        {/* No results */}
        {query.length > 0 && results.length ===0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="person-outline" size={40} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No user found</Text>
            <Text style={styles.emptySubtitle}>
              No JavixPay user matches "{query}"
            </Text>
            <TouchableOpacity style={styles.inviteButton}>
              <Ionicons name="share-outline" size={16} color="#16A34A" />
              <Text style={styles.inviteText}>Invite them to JavixPay</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Recent searches */}
        {query.length === 0 && recentSearches.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent searches</Text>
            {recentSearches.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.recentItem}
                onPress={() => handleSelectUser(user)}
                activeOpacity={0.7}
              >
                <View style={styles.recentIconContainer}>
                  <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{user.fullName}</Text>
                  <Text style={styles.resultSub}>
                    {user.username} · {user.flag} {user.country}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeRecentSearch(user.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* Empty state — new user */}
        {query.length === 0 && recentSearches.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons name="search-outline" size={40} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>Find a CalliPay user</Text>
            <Text style={styles.emptySubtitle}>
              Search by name, phone number{'\n'}or @username to send money
            </Text>
          </View>
        )}
      </View>
    )
  }
  // ── RESULT SCREEN ──
  if (screenState === 'result') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.resultHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.resultHeaderTitle}>Send Money</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.resultContent}>
          <Text style={styles.resultScreenSubtitle}>
            Verify recipient details before sending
          </Text>
          {/* User card */}
          <Animated.View
            style={[
              styles.userCard,
              {
                opacity: cardAnim,
                transform: [
                  {
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Left — user details */}
            <View style={styles.userCardLeft}>
              {/* Person icon box */}
              <View style={styles.personIconBox}>
                 <Image
                  style={styles.image} 
                    source={require("../../../assets/profile.png")}
                    />
                {/* <Ionicons name="person" size={36} color="#16A34A" /> */}
              </View>
              {/* Details */}
              <View style={styles.userDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser?.fullName}
                  </Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser?.phone}
                  </Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Country</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser?.flag} {selectedUser?.country}
                  </Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Currency</Text>
                  <Text style={styles.detailValue}>
                    {selectedUser?.currency}
                  </Text>
                </View>
              </View>
            </View>
            {/* Vertical divider */}
            <View style={styles.cardDivider} />
            {/* Right — QR code */}
            <View style={styles.userCardRight}>
              <Text style={styles.qrLabel}>QR Code</Text>
              <View style={styles.qrContainer}>
                <QRCode
                  value={JSON.stringify({
                    app: 'callipay',
                    userId: selectedUser?.id,
                    version: '1',
                  })}
                  size={110}
                  color="#111827"
                  backgroundColor="#fff"
                />
              </View>
              <Text style={styles.qrUsername}>
                {selectedUser?.username}
              </Text>
            </View>
          </Animated.View>
          {/* Send button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendToUser}
            activeOpacity={0.85}
          >
            <Ionicons name="scan-outline" size={20} color="#fff" />
            <Text style={styles.sendButtonText}>
              Scan & Send to {selectedUser?.firstName}
            </Text>
          </TouchableOpacity>
          {/* Security note */}
          <View style={styles.securityNote}>
            <Ionicons name="lock-closed-outline" size={12} color="#9CA3AF" />
            <Text style={styles.securityNoteText}>
              Scan their QR code to verify and send securely
            </Text>
          </View>
        </View>
      </View>
    )
  }
  // ── SCANNER SCREEN ──
   if (screenState === 'scanner') {
    return < ScannerScreen
      selectedUser={selectedUser}
      insets={insets}
      onBack={handleBack}
      onScanComplete={() => setScreenState('confirm')}
    />
  }
  // ── AMOUNT SCREEN ──
 if (screenState === 'confirm') {
    return < Amountscreen
      selectedUser={selectedUser}
      navigation={navigation}
      
    />
  }
 
}
// ─── STYLES ───────────────────────────────────────────────
const FRAME_TOP = height * 0.28
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Search header
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: s(13),
    color: '#111827',
    fontWeight: '400',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 15,
    color: '#16A34A',
    fontWeight: '600',
  },
  // List
  listContent: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0e9841',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
  fontSize:s(14),
  fontWeight:'400',
  },
  resultSub: {
    fontSize: s(12),
    color: '#666',
    fontWeight: '400',
  },
  // Recent searches
  recentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  recentTitle: {
    fontSize:s(14),
  fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal:s(2),
  },
  recentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize:s(14),
    fontWeight:'500',
  },
  emptySubtitle: {
    // fontSize: 14,
    // color: '#9CA3AF',
    // textAlign: 'center',
    // lineHeight: 22,
    fontSize:s(11),
    fontWeight:'400',
    color: '#666',
    lineHeight:s(16),
    textAlign:'center',

  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 20,
    paddingVertical: s(15),
    borderRadius: 30,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  inviteText: {
    fontWeight:'500',
    color: '#16A34A',
    fontSize:s(12),
  },
  // Result screen
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  resultContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  resultScreenSubtitle: {
    fontSize: s(13),
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  // User card
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    // borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    // borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop:s(22),
  },
  image:{
 width:"100%",
  height:'100%',
  borderRadius:s(36),
 
 
  },
  userCardLeft: {
    flex: 1,
    padding: 16,
    gap: 6,
  },
  personIconBox: {
    width: s(70),
    height: s(70),
    borderRadius: s(36),
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    marginBottom: 4,
  },
  userDetails: {
    gap: 1,
  },
  detailRow: {
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize:s(14),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
    
  },
  detailValue: {
    fontSize: s(11),
    color: '#666',
    fontWeight: '400',
   
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  cardDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
  },
  userCardRight: {
    width: 140,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  qrLabel: {
    fontSize: s(11),
    fontWeight: '700',
    color: '#666',
    letterSpacing: 0.5,
  },
  qrContainer: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qrUsername: {
    fontSize: s(12),
    color: '#16A34A',
    fontWeight: '600',
  },
  // Send button
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    borderRadius: s(22),
    marginBottom: 12,
    marginTop:s(45),
    width:'90%',
    alignSelf:'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: s(13),
    fontWeight: '700',
  },
  // Security note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  securityNoteText: {
    fontSize: s(11),
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Scanner
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scanOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  scanOverlayTop: {
    top: 0, left: 0, right: 0,
    height: FRAME_TOP,
  },
  scanOverlayBottom: {
    top: FRAME_TOP + FRAME_SIZE,
    left: 0, right: 0, bottom: 0,
  },
  scanOverlayLeft: {
    top: FRAME_TOP,
    left: 0,
    width: (width - FRAME_SIZE) / 2,
    height: FRAME_SIZE,
  },
  scanOverlayRight: {
    top: FRAME_TOP,
    right: 0,
    width: (width - FRAME_SIZE) / 2,
    height: FRAME_SIZE,
  },
  scanClose: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTopText: {
    position: 'absolute',
    top: FRAME_TOP - 80,
    left: 0, right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  scanTitle: {
    color: '#fff',
    fontSize: s(15),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  scanSubtitle: {
    color: '#9CA3AF',
    fontSize: s(12),
    textAlign: 'center',
  },
  scanFrame: {
    position: 'absolute',
    top: FRAME_TOP,
    left: (width - FRAME_SIZE) / 2,
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
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
  scanBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  scanUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanUserAvatarText: {
    fontSize: s(15),
    fontWeight: '700',
    color: '#16A34A',
  },
  scanUserName: {
    color: '#fff',
    fontSize: s(15),
    fontWeight: '600',
  },
  scanUserCountry: {
    color: '#9CA3AF',
    fontSize: s(12),
  },
  // Confirm screen
});