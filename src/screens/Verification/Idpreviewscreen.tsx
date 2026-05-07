import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  Button,
} from 'react-native'
import { s, vs } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')
export default function IdpreviewScreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const { passportImage } = route.params
  const [imageLoaded, setImageLoaded] = useState(false)
  const qualityChecks = [
    { id: 1, text: 'Document is clearly readable' },
    { id: 2, text: 'No glare or shadows visible' },
    { id: 3, text: 'All four corners are visible' },
    { id: 4, text: 'Photo is not blurry' },
  ]
  const handleRetake = () => {
    navigation.goBack()
  }
  const handleContinue = () => {
    // Navigate to face scan
    navigation.navigate('facecapture', { passportImage })
  }
  return (
    <View style={styles.container}>
      {/* ── HEADER ── */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleRetake}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Passport</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── STEP INDICATOR ── */}
        {/* <View style={styles.stepIndicator}>
          <View style={styles.stepDot} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={styles.stepDot} />
        </View> */}
        {/* <View style={styles.stepLabels}>
          <Text style={styles.stepLabel}>Scan</Text>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>
            Review
          </Text>
          <Text style={styles.stepLabel}>Face</Text>
        </View> */}
        {/* ── TITLE ── */}
        <Text style={styles.title}>Does this look clear?</Text>
        <Text style={styles.subtitle}>
          Make sure your passport details are fully visible
          before continuing
        </Text>
        {/* ── PASSPORT IMAGE ── */}
        <View style={styles.imageContainer}>
          {/* Corner decorations */}
          <View style={[styles.imageCorner, styles.imageCornerTL]} />
          <View style={[styles.imageCorner, styles.imageCornerTR]} />
          <View style={[styles.imageCorner, styles.imageCornerBL]} />
          <View style={[styles.imageCorner, styles.imageCornerBR]} />
          <Image
            source={{ uri: passportImage }}
            style={styles.passportImage}
            resizeMode="cover"
            onLoad={() => setImageLoaded(true)}
          />
          {/* Verified badge */}
          {imageLoaded && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#16A34A"
              />
              <Text style={styles.verifiedText}>Captured</Text>
            </View>
          )}
        </View>
        {/* ── QUALITY CHECKLIST ── */}
        <View style={styles.qualityCard}>
          <Text style={styles.qualityTitle}>Quality Check</Text>
          {qualityChecks.map((check) => (
            <View key={check.id} style={styles.qualityItem}>
              <View style={styles.qualityIconContainer}>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#16A34A"
                />
              </View>
              <Text style={styles.qualityText}>{check.text}</Text>
            </View>
          ))}
        </View>
        {/* ── WARNING NOTE ── */}
        <View style={styles.warningCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#F59E0B"
          />
          <Text style={styles.warningText}>
            If any details look blurry or cut off,
            please retake the photo for faster verification.
          </Text>
        </View>
      </ScrollView>
      {/* ── BOTTOM BUTTONS ── */}
      <View style={[styles.bottomContainer,
        { paddingBottom: insets.bottom + 16 }]}>
         <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Next</Text>
               </TouchableOpacity>
      </View>
      
        
      
      {/* ── SECURITY BADGE ── */}
      <View style={[styles.securityBadge,
        { paddingBottom: insets.bottom + 4 }]}>
        <Ionicons
          name="lock-closed"
          size={11}
          color="#9CA3AF"
        />
        <Text style={styles.securityText}>
          Your data is encrypted and secure
        </Text>
      </View>
    </View>
  )
}
// ─── STYLES ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
   
  },
  // Scroll
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  // Step indicator
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    marginTop: 8,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D1D5DB',
  },
  stepDotActive: {
    backgroundColor: '#16A34A',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 36,
    marginBottom: 20,
  },
  stepLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#16A34A',
    fontWeight: '700',
  },
  // Title
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
     marginTop:s(10),
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 24,
  },
  // Image
  imageContainer: {
    width: '100%',
    aspectRatio: 1.58,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#E5E7EB',
   
  },
  passportImage: {
    width: '100%',
    height: '100%',
  },
  // Image corners
  imageCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    zIndex: 10,
    borderColor: '#16A34A',
  },
  imageCornerTL: {
    top: 8, left: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  imageCornerTR: {
    top: 8, right: 8,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  imageCornerBL: {
    bottom: 8, left: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  imageCornerBR: {
    bottom: 8, right: 8,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },
  // Verified badge
  verifiedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 10,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  // Quality card
  qualityCard: {
    // backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    gap: 12,
   
  },
  qualityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  qualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qualityIconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    // backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  // Warning card
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
  // Bottom buttons
  bottomContainer: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  retakeText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: '#16A34A',
  },
  continueText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  // Security badge
  securityBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  securityText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  button:{
  alignSelf:'center',
  marginTop:s(10),
  backgroundColor:'green',
  width:'100%',
  alignItems:'center',
  justifyContent:'center',
  padding:s(10),
  height:s(45),
  borderRadius:s(12),
  paddingBottom:s(10),

  },
  buttonText:{
    color:'white',
  },
})
