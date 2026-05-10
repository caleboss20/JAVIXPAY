// src/screens/wallet/WalletScreen.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet
} from 'react-native'
import { s, vs } from 'react-native-size-matters';
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from '@expo/vector-icons';
import WalletCard from '../../Components/Walletcard';
import Selectcountrymodal from '../../Components/Selectcountrymodal';
import { useWallet } from '../../Context/Walletcontext';
/**
* WalletScreen
*
* Main wallet management screen for JavixPay.
* Handles two states:
* 1. Empty — no wallets added yet → shows onboarding UI
* 2. Has wallets — renders list of user's cross-border wallets
*
* Also handles the wallet creation success popup
* which appears when navigating from WalletPin screen
* after a new wallet has been created successfully.
*/
const Walletscreen = ({ navigation, route }: any) => {
  // ── Modal state for country selection ──
  const [ModalOpen, setModalOpen] = useState(false);
  // ── Wallet context — source of truth for all wallets ──
  const { wallets } = useWallet()
  /**
   * Read route params passed from WalletPin screen.
   * newWallet — true if user just created a wallet
   * country   — the country object selected during wallet creation
   * phone     — the phone number linked to the new wallet
   *
   * Falls back to empty object to prevent crashes
   * when screen is accessed via bottom tab navigation
   * without any params.
   */
  const { newWallet, country, phone } = route.params || {}
  // ── Success popup — only shown when arriving from WalletPin ──
  const [showSuccess, setShowSuccess] = useState(newWallet || false)
  /**
   * Handles country selection from the modal.
   * Navigates to phone confirmation screen
   * passing the selected country as a route param.
   */
  const handlecountryselect = (country: any) => {
    navigation.navigate("phoneconfirmationscreen", { country })
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(100) }}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <TouchableOpacity style={styles.downloadBtn} />
        </View>
        {/* ── Global wallet balance card ── */}
        <WalletCard />
        {/*
         * ── Wallet List / Empty State ──
         * Conditionally renders based on whether
         * the user has any wallets in context.
         */}
        {wallets.length === 0 ? (
          // ── Empty State ──
          // Shown when user has no wallets yet.
          // Prompts user to add their first wallet.
          <View style={styles.emptyState}>
            <Image
              style={styles.walletimage}
              source={require('../../../../assets/wallet.png')}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Wallet Added Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add a wallet to send, receive and
              manage {'\n'} your money across borders instantly
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalOpen(true)}
            >
              <Ionicons style={styles.plusicon} name="add-circle-outline" size={s(20)} />
              <Text style={styles.addButtonText}>Add Wallet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ── Wallet List ──
          // Renders all wallets from context.
          // Each wallet is stored with a unique phone-based key in AsyncStorage.
          // <View style={styles.walletList}>
          //   {wallets.map((wallet: any) => (
          //     <View key={wallet.id} style={styles.walletItem}>
          //       <Text style={styles.walletFlag}>{wallet.flag}</Text>
          //       <View style={styles.walletInfo}>
          //         <Text style={styles.walletCountry}>{wallet.country}</Text>
          //         <Text style={styles.walletPhone}>{wallet.phone}</Text>
          //       </View>
          //       <Text style={styles.walletBalance}>
          //         {wallet.currency} {wallet.balance.toFixed(2)}
          //       </Text>
          //     </View>
          //   ))}
          //   {/* ── Add another wallet CTA ── */}
          //   <TouchableOpacity
          //     style={styles.addButton}
          //     onPress={() => setModalOpen(true)}
          //   >
          //     <Ionicons name="add-circle-outline" size={s(20)} />
          //     <Text style={styles.addButtonText}>Add Another Wallet</Text>
          //   </TouchableOpacity>
          // </View>

          ""
        )}
      </ScrollView>
      {/*
       * ── Country Selection Modal ──
       * Bottom sheet modal for selecting a country
       * when adding a new wallet.
       * Rendered outside ScrollView to avoid z-index issues.
       */}
      <Selectcountrymodal
        isOpen={ModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handlecountryselect}
      />
      {/*
       * ── Wallet Created Success Popup ──
       * Modal overlay shown immediately after wallet creation.
       * Receives country and phone from WalletPin via route params.
       * Dismissed by user tapping "Go to Wallet".
       *
       * TODO: BACKEND
       * After backend integration, wallet data will be
       * fetched from the server instead of local context.
       */}
      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
      >
        <View style={styles.overlay}>
          <View style={styles.successCard}>
            {/* ── Success checkmark ── */}
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={s(40)} color="#fff" />
            </View>
            {/* ── Country flag ── */}
            <Text style={styles.successFlag}>{country?.flag}</Text>
            {/* ── Success title — dynamic country name ── */}
            <Text style={styles.successTitle}>
              {country?.name} Wallet Created!
            </Text>
            {/* ── Wallet details ── */}
            <View style={styles.successDetails}>
              <Text style={styles.successDetailText}>
                💰 {country?.currency} 0.00
              </Text>
              <Text style={styles.successDetailText}>
                📱 {phone}
              </Text>
            </View>
            {/* ── Success message ── */}
            <Text style={styles.successSubtitle}>
              Your {country?.name} wallet is ready.{'\n'}
              Start sending and receiving {country?.currency} instantly.
            </Text>
            {/* ── Dismiss button ── */}
            <TouchableOpacity
              style={styles.successBtn}
              onPress={() => setShowSuccess(false)}
            >
              <Text style={styles.successBtnText}>Go to Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
export default Walletscreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingTop: s(20),
    paddingBottom: s(15),
    // backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: s(20),
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  downloadBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    // borderWidth: 1.5,
    borderColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  // Green Card
  card: {
    backgroundColor: '#2E7D32',
    marginHorizontal: s(15),
    marginTop: s(20),
    borderRadius: s(12),
    padding: s(20),
    height: s(170),
    justifyContent: 'space-between',
    marginBottom:s(20),
   
  },
  balance: {
  color:"#fff",
  fontWeight:'600',
  fontSize:s(32),
    
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardName: {
     fontSize: s(15),
    color: '#fff',
    fontWeight: '500',
    marginBottom:s(4),
  },
  cardNumber: {
    color: 'rgba(255,255,255,0.8)',
     fontSize: s(15),
     letterSpacing:s(3),
    fontWeight: '400',
  },
  cardIcon: {
    width: s(40),
    height: s(40),
    borderRadius: s(23),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingTop: s(60),
  },
 walletimage:{
   width:s(150),
   height:s(150),
 },
  emptyTitle: {
     fontSize:s(16),
    fontWeight:'700',
    color: '#333',
    // letterSpacing: s(0.5),
    marginBottom: s(8),
  },
  emptySubtitle: {
    textAlign: 'center',
    lineHeight: s(20),
    marginBottom: 35,
     fontSize: s(13),
    color: '#666',
    fontWeight: '400',
  },
  addButton: {
    width:'60%',
  //  backgroundColor:'green',
  backgroundColor:'#145a32',
   height:s(45),
   justifyContent:'center',
   flexDirection:'row',
   gap:s(10),
   alignItems:'center',
   alignSelf:'center',
   borderRadius:s(10),
   marginTop:s(20),
  },
plusicon:{
 color: '#fff',
 fontWeight: 'bold',
},
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
})
