import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters'
import AsyncStorage from '@react-native-async-storage/async-storage'
const { width } = Dimensions.get('window')
// ── Settings items data ──
const SETTINGS_ITEMS_TOP = [
  { id: 1, label: 'Change Password',          hasArrow: true,  hasToggle: false, route: 'changepasswordscreen'     },
  { id: 2, label: '2FA Authentication',       hasArrow: true,  hasToggle: false, route: 'twofactorauthentication'  },
  { id: 3, label: 'Notification',             hasArrow: false, hasToggle: true,  route: null                       },
  { id: 4, label: 'Refer Friends & Business', hasArrow: true,  hasToggle: false, route: 'referscreen'              },
  { id: 5, label: 'Privacy & Policy',         hasArrow: true,  hasToggle: false, route: 'privacyscreen'            },
   

]
const SETTINGS_ITEMS_BOTTOM = [
  { id: 6, icon: 'help-circle-outline',        label: 'FAQs',               hasArrow: true, hasToggle: false, route: 'faqscreen'   },
  { id: 7, icon: 'information-circle-outline', label: 'Terms & Conditions', hasArrow: true, hasToggle: false, route: 'termsscreen' },
 { id: 5, label: 'Customer Support',         hasArrow: true,  hasToggle: false, route: 'supportscreen'      },
]
export default function Accountscreen({ navigation, route }) {
  const [logout, setLogout] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [profileImage, setProfileImage] = useState(
    'https://randomuser.me/api/portraits/men/32.jpg'
  )
  const [profileName, setProfileName] = useState('Caleb Antwi')
  // ── Load on first mount ──
  useEffect(() => {
    const loadProfile = async () => {
      const image = await AsyncStorage.getItem('profileImage')
      const name  = await AsyncStorage.getItem('profileName')
      if (image) setProfileImage(image)
      if (name)  setProfileName(name)
    }
    loadProfile()
  }, [])
  // ── Reload every time screen comes into focus ──
  // This fixes the issue when navigating back from dashboard or any screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const image = await AsyncStorage.getItem('profileImage')
      const name  = await AsyncStorage.getItem('profileName')
      if (image) setProfileImage(image)
      if (name)  setProfileName(name)
    })
    return unsubscribe
  }, [navigation])
  // ── Navigate to item's screen if route exists ──
  const handleItemPress = (item) => {
    if (item.route) {
      navigation.navigate(item.route)
    }
  }
  const handleLogout = () => {
    setLogout(true)
    setTimeout(() => {
      navigation.navigate('loginscreen')
    }, 3000)
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('dashboard')}
        >
          <Ionicons name="chevron-back" size={s(20)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Settings</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={s(18)} color="#333" />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── PROFILE SECTION ── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('profilepage')}
          style={styles.profileSection}
        >
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={s(13)} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profileName}</Text>
          <Text style={styles.profileRole}>Banker</Text>
        </TouchableOpacity>
        {/* ── TOP SETTINGS LIST ── */}
        <View style={styles.settingsCard}>
          {SETTINGS_ITEMS_TOP.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.settingsRow}
                onPress={() => !item.hasToggle && handleItemPress(item)}
                activeOpacity={item.hasToggle ? 1 : 0.7}
              >
                <Text style={styles.settingsLabel}>{item.label}</Text>
                {item.hasToggle ? (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#ddd', true: '#22c55e' }}
                    thumbColor={'#fff'}
                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={s(16)} color="#aaa" />
                )}
              </TouchableOpacity>
              {index < SETTINGS_ITEMS_TOP.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>
        <View style={styles.line} />
        {/* ── BOTTOM SETTINGS LIST ── */}
        <View style={styles.settingsCard}>
          {SETTINGS_ITEMS_BOTTOM.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.settingsRow}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.settingsLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={s(16)} color="#aaa" />
              </TouchableOpacity>
              {index < SETTINGS_ITEMS_BOTTOM.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>
        {/* ── LOG OUT BUTTON ── */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          {logout ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={s(18)} color="#fff" style={{ marginRight: s(8) }} />
              <Text style={styles.logoutText}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // ── TOP BAR ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
    // backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: s(17),
    fontWeight: '700',
    color: '#111',
  },
  moreButton: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
  },
  // ── PROFILE ──
  profileSection: {
    alignItems: 'center',
    paddingVertical: vs(24),
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: vs(12),
  },
  profileImage: {
    width: s(70),
    height: s(70),
    borderRadius: s(45),
    borderWidth: s(0.5),
    borderColor: '#333',
  },
  // Camera icon on bottom right of image
  cameraButton: {
    position: 'absolute',
    bottom: s(0),
    right: s(2),
    width: s(26),
    height: s(26),
    borderRadius: s(13),
    backgroundColor: '#8e8e8e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: s(18),
    fontWeight: '700',
    color: '#111',
    marginBottom: vs(4),
  },
  profileRole: {
    fontSize: s(13),
    color: '#888',
  },
  line:{
  width:'90%',
  alignSelf:'center',
  height:s(1),
  backgroundColor:'#E5E7EB',
  },
  // ── SETTINGS CARD ──
  settingsCard: {
    // backgroundColor: '#fff',
    borderRadius: s(16),
    paddingHorizontal: s(12),
    marginBottom: vs(10),
   
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(14),
  },
  // Green icon background box
  iconBox: {
    width: s(36),
    height: s(36),
    borderRadius: s(10),
    backgroundColor: '#e0f1e5',  // very light green bg
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(14),
  },
  settingsLabel: {
    flex: 1,
    fontSize:s(14),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
   
    // fontSize:s(14),
    // fontWeight:'500',
    // color: '#333',
    // letterSpacing: 0.5,
    // marginBottom: 8,



  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: s(50),
  },
  // ── LOGOUT ──
  logoutButton: {
     width:'90%',
   backgroundColor:'green',
   height:s(45),
   justifyContent:'center',
   alignItems:'center',
   alignSelf:'center',
   borderRadius:s(10),
   marginTop:s(20),
   flexDirection:'row',
  
  },
  logoutText: {
    color: '#fff',
    fontSize: s(15),
    fontWeight: '700',
  },
})