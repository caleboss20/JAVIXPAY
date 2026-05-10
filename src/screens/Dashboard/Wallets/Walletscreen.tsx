
// src/screens/wallet/WalletScreen.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { s, vs } from 'react-native-size-matters';
import {SafeAreaView,} from "react-native-safe-area-context"
import { Ionicons } from '@expo/vector-icons';
import WalletCard from '../../Components/Walletcard';
import Selectcountrymodal from '../../Components/Selectcountrymodal';
import { useTransactions } from '../../Context/Transactions';
import { useWallet } from '../../Context/Walletcontext';
const Walletscreen = ({ navigation }: any) => {
  const [ModalOpen,setModalOpen]=useState(false);
 const {wallets,addwallet}=useWallet()
  const handlecountryselect=(country:any)=>{
  navigation.navigate("phoneconfirmationscreen",{country})
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:vs(100)}}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <TouchableOpacity style={styles.downloadBtn}>
          
          </TouchableOpacity>
        </View>
      <WalletCard />
     
        {/* Transactions Section */}
        {wallets.length === 0 ? (
          // Empty State
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
              <Ionicons style={styles.plusicon}name="add-circle-outline" size={s(20)}/>
              <Text style={styles.addButtonText}>Add Wallet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Transaction List
        ""
        )}
      </ScrollView>
      {/* Modal outside ScrollView */}
      <Selectcountrymodal
        isOpen={ModalOpen}
        onClose={()=>setModalOpen(false)}
        onSelect={handlecountryselect}
      />
    </SafeAreaView>
  )
}

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
export default Walletscreen