import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native'
import { s, vs } from 'react-native-size-matters'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import WalletCard from '../../Components/Walletcard'
import Selectcountrymodal from '../../Components/Selectcountrymodal'
import { useWallet } from '../../Context/Walletcontext'
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH - s(10)
const CARD_GAP = s(12)
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP
const Walletscreen = ({ navigation, route }: any) => {
  const [ModalOpen, setModalOpen] = useState(false)
  const { wallets } = useWallet()
  const { newWallet, country } = route.params || {}
  const [showSuccess, setShowSuccess] = useState(newWallet || false)
  const [activeIndex, setActiveIndex] = useState(0)
  const slideAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const autoCloseTimer = useRef<any>(null)
  const carouselRef = useRef<ScrollView>(null)
  // ── Clear params on mount so back nav doesn't retrigger success ──
  useEffect(() => {
    if (newWallet) {
      navigation.setParams({ newWallet: false, country: null })
    }
  }, [])
  useEffect(() => {
    if (showSuccess) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 18,
          useNativeDriver: true,
        }),
      ]).start()
    }
    return () => {
      if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
    }
  }, [showSuccess])
  const handleClose = () => {
    if (autoCloseTimer.current) clearTimeout(autoCloseTimer.current)
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setShowSuccess(false))
    slideAnim.setValue(0)
  }
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 10,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) slideAnim.setValue(gesture.dy)
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          handleClose()
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current
  const handlecountryselect = (country: any) => {
    navigation.navigate('phoneconfirmationscreen', { country })
  }
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / SNAP_INTERVAL)
    if (index !== activeIndex) setActiveIndex(index)
  }
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: vs(120) }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Wallet</Text>
        </View>
        {/* ── Wallet carousel (multiple wallets) ── */}
        {wallets.length > 0 ? (
          <View style={styles.carouselContainer}>
            <ScrollView
              ref={carouselRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={SNAP_INTERVAL}
              snapToAlignment="start"
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: s(2) }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {wallets.map((wallet: any, i: number) => (
                <React.Fragment key={i}>
                  <View style={{ width: CARD_WIDTH }}>
                    <WalletCard wallet={wallet} />
                  </View>
                  {i < wallets.length - 1 && (
                    <View style={{ width: CARD_GAP }} />
                  )}
                </React.Fragment>
              ))}
            </ScrollView>
            {/* Pagination dots */}
            {wallets.length > 1 && (
              <View style={styles.dotsRow}>
                {wallets.map((_: any, i: number) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => {
                      carouselRef.current?.scrollTo({
                        x: i * SNAP_INTERVAL,
                        animated: true,
                      })
                      setActiveIndex(i)
                    }}
                  >
                    <View
                      style={[
                        styles.dot,
                        i === activeIndex ? styles.dotActive : styles.dotInactive,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* Add another wallet */}
            <TouchableOpacity
              style={styles.addAnotherBtn}
              onPress={() => setModalOpen(true)}
            >
              <Ionicons name="add-circle-outline" size={s(18)} color="#145a32" />
              <Text style={styles.addAnotherText}>Add Another Wallet</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // ── Empty state ──
          <View style={styles.emptyState}>
            <Image
              style={styles.walletimage}
              source={require('../../../../assets/wallet.png')}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No Wallet Added Yet</Text>
            <Text style={styles.emptySubtitle}>
              Add a wallet to send, receive and manage {'\n'}
              your money across borders instantly
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalOpen(true)}
            >
              <Ionicons name="add-circle-outline" size={s(20)} color="#fff" />
              <Text style={styles.addButtonText}>Add Wallet</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      {/* Country modal */}
      <Selectcountrymodal
        isOpen={ModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handlecountryselect}
      />
      {/* ── Success bottom sheet ── */}
      <Modal
        transparent
        visible={showSuccess}
        animationType="none"
        statusBarTranslucent={false}
        onRequestClose={handleClose}
      >
        <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>
        <View style={styles.sheetWrapper} pointerEvents="box-none">
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.successSheet,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.dragHandle} />
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#666" />
            </TouchableOpacity>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <View style={styles.successcontents}>
              <Text style={styles.successTitle}>
                {country?.name} Wallet Created Successfully!
              </Text>
              <Text style={styles.successSubtitle}>
                Your {country?.name} wallet is ready.{'\n'}
                Start sending and receiving {country?.currency} instantly.
              </Text>
            </View>
            <TouchableOpacity style={styles.successBtn} onPress={handleClose}>
              <Text style={styles.successBtnText}>Go to Wallet</Text>
            </TouchableOpacity>
          </Animated.View>
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

//for the card side//
carouselContainer: {
    marginTop: vs(8),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vs(12),
    gap: s(6),
  },
  dot: {
    borderRadius: 99,
    height: s(8),
  },
  dotActive: {
    width: s(22),        // elongated pill for active
    backgroundColor: '#14c661',
  },
  dotInactive: {
    width: s(8),
    backgroundColor: '#D1D5DB',
  },
  addAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: s(6),
    marginTop: vs(106),
    paddingVertical: vs(8),
    paddingHorizontal: s(16),
    borderRadius: 99,
    borderWidth: 1.5,
    borderColor: '#19a556',
    backgroundColor: '#e2f1e9',
  },
  addAnotherText: {
    color: '#145a32',
    fontWeight: '600',
    fontSize: s(13),
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
  overlay: {
  flex: 1,
  justifyContent: 'flex-end',
},


//for success modal//

successSheet: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  padding: 20,
  paddingBottom: 30,
  height:s(320),
},
successcontents:{
  alignItems:'center',
 
},
successTitle:{
   fontSize:s(14),
    fontWeight:'500',
    color: '#222',
    letterSpacing: s(0.5),
    marginBottom: s(8),
   
},
successSubtitle:{
 textAlign:'center',
  fontSize: s(12),
    color: '#666',
    fontWeight: '400',
    lineHeight:s(17),

},
checkCircle: {
  width: s(60),
  height: s(60),
  borderRadius: s(35),
  backgroundColor: '#22c55e',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginBottom: s(32),
  
},
dragHandle: {
  width: 40,
  height: 5,
  backgroundColor: '#ddd',
  borderRadius: 10,
  alignSelf: 'center',
  marginBottom: 10,
},
closeBtn: {
  position: 'absolute',
  right: s(15),
  top: s(10),
  zIndex: s(10),
},
successBtn:{
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
   marginTop:s(60),
},
successBtnText: {
    color: '#fff',
    fontSize: s(13),
    fontWeight: 'bold',
  },
  sheetWrapper:{
    position:'absolute',
    bottom:s(0),
    left:s(0),
    right:s(0),
  }
  ,
 
})
