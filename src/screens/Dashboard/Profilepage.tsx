import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters'
import * as ImagePicker from 'expo-image-picker'
const { width } = Dimensions.get('window')
// ── Field Row Component ──────────────────────────────────────────────────────
function FieldRow({ label, value, onChangeText, isEditing, keyboardType = 'default', icon }) {
  return (
    <View style={styles.fieldRow}>
      {/* Icon box */}
      <View>
        <Ionicons name={icon} size={s(16)} color="#22c55e" />
      </View>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          // ── EDIT MODE: white input ──
          <TextInput
            style={styles.fieldInput}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
        ) : (
          // ── VIEW MODE: grey text ──
          <Text style={styles.fieldValue}>{value}</Text>
        )}
      </View>
      {/* Lock icon on view mode — shows field is secure */}
      {!isEditing && (
        <Ionicons name="lock-closed" size={s(12)} color="#ccc" />
      )}
    </View>
  )
}
// ── Main Component ───────────────────────────────────────────────────────────
export default function Profilescreen({ navigation }) {
  const [isEditing, setIsEditing]       = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [hasChanges, setHasChanges]     = useState(false)
  // ── User data state ──
  const [profileImage, setProfileImage] = useState(
    'https://randomuser.me/api/portraits/men/32.jpg'
  )
  const [fullName,  setFullName]  = useState('Alex Dordan')
  const [email,     setEmail]     = useState('alex.dordan@gmail.com')
  const [phone,     setPhone]     = useState('+233 XX XXX XXXX')
  const [dob,       setDob]       = useState('01 / 01 / 1995')
  const [country,   setCountry]   = useState('Ghana')
  const [address,   setAddress]   = useState('Accra, Ghana')
  // ── Track changes ──
  const handleFieldChange = (setter) => (value) => {
    setter(value)
    setHasChanges(true)
  }
  // ── SAVE ──
  const handleSave = () => {
    // Later: API call to Spring Boot to update user profile
    // await axios.put('/api/user/profile', { fullName, email, phone })
    setIsEditing(false)
    setHasChanges(false)
    Alert.alert(
      'Profile Updated ',
      'Your profile has been saved successfully.',
      [{ text: 'OK' }]
    )
  }
  // ── CANCEL EDIT ──
  const handleCancelEdit = () => {
    // TODO: reset fields to original values when backend connected
    setIsEditing(false)
    setHasChanges(false)
  }
  // ── BACK with unsaved changes check ──
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Stay',     style: 'cancel' },
          { text: 'Discard',  style: 'destructive',
            onPress: () => navigation.goBack()
          },
        ]
      )
    } else {
      navigation.goBack()
    }
  }
  // ── CAMERA / GALLERY ──
  const handleTakePhoto = async () => {
    setShowPhotoModal(false)
    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera permission is required.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],   // square crop
      quality: 0.8,
    })
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
      setHasChanges(true)
    }
  }
  const handleChooseGallery = async () => {
    setShowPhotoModal(false)
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Gallery permission is required.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
      setHasChanges(true)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={s(20)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>My Profile</Text>
        {/* Edit or Save button */}
        {isEditing ? (
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={s(16)} color="#888" />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── PROFILE PHOTO ── */}
          <View style={styles.photoSection}>
            <View style={styles.photoWrapper}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profilePhoto}
              />
              {/* Camera button — always visible */}
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => setShowPhotoModal(true)}
              >
                <Ionicons name="camera" size={s(14)} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoName}>{fullName}</Text>
            {/* Verified badge */}
            <View style={styles.verifiedBadge}>
              {/* <Ionicons name="checkmark-circle" size={s(14)} color="#22c55e" /> */}
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          </View>
          {/* ── SECURITY NOTICE (shows in view mode) ── */}
          {!isEditing && (
            <View style={styles.securityNotice}>
              {/* <Ionicons name="shield-checkmark" size={s(14)} color="#22c55e" /> */}
              <Text style={styles.securityNoticeText}>
                Your information is encrypted and secure
              </Text>
            </View>
          )}
          {/* ── EDIT MODE NOTICE ── */}
          {isEditing && (
            <View style={styles.editNotice}>
              <Ionicons name="information-circle" size={s(14)} color="#f59e0b" />
              <Text style={styles.editNoticeText}>
                Changes will require re-verification for security
              </Text>
            </View>
          )}
          {/* ── PERSONAL INFO CARD ── */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Personal Information</Text>
          </View>
          <View style={styles.card}>
            <FieldRow
              label="Full Name"
              value={fullName}
              onChangeText={handleFieldChange(setFullName)}
              isEditing={isEditing}
              icon=""
            />
            <View style={styles.fieldDivider} />
            <FieldRow
              label="Date of Birth"
              value={dob}
              onChangeText={handleFieldChange(setDob)}
              isEditing={isEditing}
              icon=""
            />
            <View style={styles.fieldDivider} />
            <FieldRow 
              label="Country"
              value={country}
              onChangeText={handleFieldChange(setCountry)}
              isEditing={isEditing}
              icon=""
            />
            <View style={styles.fieldDivider} />
            <FieldRow
              label="Address"
              value={address}
              onChangeText={handleFieldChange(setAddress)}
              isEditing={isEditing}
              icon=""
            />
          </View>
          {/* ── CONTACT INFO CARD ── */}
          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Contact Information</Text>
          </View>
          <View style={styles.card}>
            <FieldRow
              label="Email Address"
              value={email}
              onChangeText={handleFieldChange(setEmail)}
              isEditing={isEditing}
              keyboardType="email-address"
              icon=""
            />
            <View style={styles.fieldDivider} />
            <FieldRow
              label="Phone Number"
              value={phone}
              onChangeText={handleFieldChange(setPhone)}
              isEditing={isEditing}
              keyboardType="phone-pad"
              icon=""
            />
          </View>
          {/* ── CANCEL BUTTON (edit mode only) ── */}
          {isEditing && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {/* ── SAVE BUTTON (edit mode only) ── */}
          {isEditing && (
            <TouchableOpacity
              style={styles.saveButtonFull}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              {/* <Ionicons name="checkmark" size={s(18)} color="#fff" /> */}
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {/* ══════════════════════════════════════
          PHOTO PICKER MODAL
          Small modal — camera or gallery
      ══════════════════════════════════════ */}
      <Modal
        visible={showPhotoModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPhotoModal(false)}
      >
        <TouchableOpacity
          style={styles.photoModalOverlay}
          activeOpacity={1}
          onPress={() => setShowPhotoModal(false)}
        >
          <TouchableOpacity
            style={styles.photoModalBox}
            activeOpacity={1}
          >
            <Ionicons
              onPress={() => setShowPhotoModal(false)}
             style={styles.closebtn}
            name="close-outline" size={s(20)} />
            <View style={styles.photoModalHandle} />
            
              <Text style={styles.photoModalTitle}>Update Profile Photo</Text>
              
            
            {/* Take Photo */}
            <TouchableOpacity
              style={styles.photoModalOption}
              onPress={handleTakePhoto}
            >
              {/* <View style={styles.photoModalIconBox}>
                <Ionicons name="camera" size={s(22)} color="#22c55e" />
              </View> */}
              <View>
                <Text style={styles.photoModalOptionTitle}>Take Photo</Text>
                <Text style={styles.photoModalOptionSub}>Use your camera</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.photoModalDivider} />
            {/* Choose from Gallery */}
            <TouchableOpacity
              style={styles.photoModalOption}
              onPress={handleChooseGallery}
            >
              {/* <View style={styles.photoModalIconBox}>
                <Ionicons name="image" size={s(22)} color="#22c55e" />
              </View> */}
              <View>
                <Text style={styles.photoModalOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.photoModalOptionSub}>Pick from your photos</Text>
              </View>
            </TouchableOpacity>
            {/* Cancel */}
            <TouchableOpacity
              style={styles.photoModalCancel}
              onPress={() => setShowPhotoModal(false)}
            >
              <Text style={styles.photoModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}
// ── Styles ───────────────────────────────────────────────────────────────────
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
    paddingVertical: vs(12),
    backgroundColor: '#f5f5f5',
  },
  topBarBtn: {
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
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
   
  },
  editBtnText: {
    fontSize: s(13),
    color: '#000',
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(6),
    borderRadius: s(20),
    backgroundColor: '#22c55e',
  },
  saveBtnText: {
    fontSize: s(11),
    color: '#fff',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(40),
  },
  // ── PHOTO SECTION ──
  photoSection: {
    alignItems: 'center',
    paddingVertical: vs(20),
  },
  photoWrapper: {
    position: 'relative',
    marginBottom: vs(12),
  },
  profilePhoto: {
    width: s(70),
    height: s(70),
    borderRadius: s(45),
    borderWidth: s(0.5),
    borderColor: '#333',
  },
  cameraBtn: {
     position: 'absolute',
    bottom: s(0),
    right: s(2),
    width: s(26),
    height: s(26),
    borderRadius: s(13),
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  photoName: {
    fontSize: s(20),
    fontWeight: '700',
    color: '#111',
    marginBottom: vs(6),
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: '#f0fdf4',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginTop:s(10),
  },
  verifiedText: {
    fontSize: s(11),
    color: 'green',
    fontWeight: '400',

  },
  // ── NOTICES ──
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: s(6),
    backgroundColor: '#f3fbf7',
    borderRadius: s(10),
    padding: s(8),
    marginBottom: vs(26),
    marginTop:s(5),
    borderWidth: 1,
    borderColor: '#d0f9de',
    width:s(230),
    alignSelf:'center',
  },
  securityNoticeText: {
     fontSize: s(11),
    fontWeight: '400',
    color: '#16a34a',
    flex: 1,
    textAlign:'center',
  },
  editNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: '#fffbeb',
    borderRadius: s(10),
    padding:vs(8),
    marginBottom: vs(26),
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  editNoticeText: {
    fontSize: s(11),
    color: '#92400e',
    flex: 1,
    fontWeight: '400',
  },

  // ── SECTION TITLE ──
  sectionTitle: {
    marginBottom: vs(8),
    marginTop: vs(4),
  },
  sectionTitleText: {
   fontSize:s(14),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform:"uppercase",
  },
  // ── CARD ──
  card: {
    
    marginBottom: vs(16),
   
  },
  // ── FIELD ROW ──
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(14),
  },
 
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    
    marginBottom: vs(3),
     fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
  fieldValue: {
    fontSize: s(14),
    color: '#222',
    fontWeight: '500',
  },
  fieldInput: {
    fontSize: s(14),
    color: '#111',
    fontWeight: '500',
    paddingVertical: vs(2),
    paddingBottom:s(10),
    borderBottomWidth: s(.5),
    borderBottomColor: '#22c55e',
  },
  fieldDivider: {
    height: 1,
    backgroundColor: '#f5f5f5',
    marginLeft: s(46),
  },
  // ── BUTTONS ──
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: vs(14),
    marginBottom: vs(10),
  },
  cancelBtnText: {
    fontSize: s(14),
    color: '#888',
    fontWeight: '500',
    // textAlign:'center',
  },
  saveButtonFull: {
       minWidth:s(265),
   backgroundColor:'green',
   height:s(45),
   justifyContent:'center',
   alignItems:'center',
   alignSelf:'center',
   borderRadius:s(10),
   marginTop:s(10),
   
  },
  saveButtonText: {
    color: '#fff',
    fontSize: s(13),
    fontWeight: '700',
  },
  // ── PHOTO MODAL ──
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  photoModalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    paddingHorizontal: s(24),
    paddingBottom: vs(40),
    paddingTop: vs(12),
  },
  photoModalHandle: {
    width: s(40),
    height: s(4),
    backgroundColor: '#e0e0e0',
    borderRadius: s(2),
    alignSelf: 'center',
    marginBottom: vs(20),
  },
  photoModalTitle: {
    fontSize: s(16),
    fontWeight: '700',
    color: '#111',
    marginBottom: vs(20),
  },
  photoModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
    paddingVertical: vs(12),
  },
  photoModalIconBox: {
    width: s(46),
    height: s(46),
    borderRadius: s(13),
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoModalOptionTitle: {
    fontSize: s(15),
    fontWeight: '600',
    color: '#111',
    marginBottom: vs(2),
  },
  photoModalOptionSub: {
    fontSize: s(12),
    color: '#888',
  },
  photoModalDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: vs(4),
  },
  photoModalCancel: {
    alignItems: 'center',
    paddingVertical: vs(16),
    marginTop: vs(8),
  },
  photoModalCancelText: {
    fontSize: s(15),
    color: '#ef4444',
    fontWeight: '600',
  },
 closebtn:{
  position:'absolute',
  right:s(12),
  top:s(13),
 },
})