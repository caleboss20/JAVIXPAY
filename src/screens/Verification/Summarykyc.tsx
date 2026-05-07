import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')
export default function Summarykyc({ navigation, route }) {
  const insets = useSafeAreaInsets()
  // ─────────────────────────────────────────────
  // REAL DATA COMES FROM API LATER
  // Replace placeholder with route.params.userData
  // ─────────────────────────────────────────────
  const userData = route.params?.userData || {
    firstName: 'Caleb',
    lastName: 'Mensah',
    documentNumber: 'A1234567',
    nationality: 'Ghana',
    dateOfBirth: 'Jan 15, 2004',
    expiryDate: 'Mar 20, 2029',
    verifiedAt: new Date().toLocaleDateString(),
  }
  const limits = [
    { label: 'Send limit', value: '$1,000 / day' },
    { label: 'Receive limit', value: '$5,000 / month' },
    { label: 'Max per transfer', value: '$500' },
    { label: 'Supported regions', value: 'Africa · Europe · UK' },
  ]
  const features = [
    'Send money internationally',
    'Receive cross border payments',
    'Access all transfer features',
    'Real time exchange rates',
  ]
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Verification Summary</Text>
        <View style={styles.headerLeft} />
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
      >
        {/* ── SUCCESS BADGE ── */}
        <View style={styles.successBadge}>
          <View style={styles.successIconCircle}>
            <Ionicons name="shield-checkmark" size={32} color="#16A34A" />
          </View>
          <View>
            <Text style={styles.successTitle}>Verification Complete</Text>
            <Text style={styles.successDate}>
              Verified on {userData.verifiedAt}
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>KYC L1</Text>
          </View>
        </View>
        <View style={styles.divider} />
        {/* ── IDENTITY SECTION ── */}
        <Text style={styles.sectionLabel}>IDENTITY</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Full Name</Text>
            <Text style={styles.rowValue}>
              {userData.firstName} {userData.lastName}
            </Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Date of Birth</Text>
            <Text style={styles.rowValue}>{userData.dateOfBirth}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Nationality</Text>
            <Text style={styles.rowValue}>{userData.nationality}</Text>
          </View>
        </View>
        {/* ── DOCUMENT SECTION ── */}
        <Text style={styles.sectionLabel}>DOCUMENT</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Document Type</Text>
            <Text style={styles.rowValue}>Passport</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Document Number</Text>
            <Text style={styles.rowValue}>{userData.documentNumber}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Expiry Date</Text>
            <Text style={styles.rowValue}>{userData.expiryDate}</Text>
          </View>
          <View style={styles.rowDivider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Verified</Text>
            </View>
          </View>
        </View>
        {/* ── TRANSACTION LIMITS ── */}
        <Text style={styles.sectionLabel}>TRANSACTION LIMITS</Text>
        <View style={styles.section}>
          {limits.map((limit, index) => (
            <View key={index}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{limit.label}</Text>
                <Text style={styles.rowValue}>{limit.value}</Text>
              </View>
              {index < limits.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </View>
          ))}
        </View>
        {/* ── WHAT YOU CAN DO ── */}
        <Text style={styles.sectionLabel}>YOU CAN NOW</Text>
        <View style={styles.section}>
          {features.map((feature, index) => (
            <View key={index}>
              <View style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color="#16A34A"
                  />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
              {index < features.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </View>
          ))}
        </View>
        {/* ── SECURITY NOTE ── */}
        <View style={styles.securityNote}>
          <Ionicons
          
            name="lock-closed-outline"
            size={14}
            color="#9CA3AF"
          />
          <Text style={styles.securityNoteText}>
            Your data is encrypted and stored securely.
            We never share your information with third parties.
          </Text>
        </View>
      </ScrollView>
      {/* ── BOTTOM BUTTON ── */}
      <View style={[
        styles.bottomContainer,
        { paddingBottom: insets.bottom + 16 }
      ]}>
        <TouchableOpacity
          style={styles.dashboardButton}
          onPress={() => {
            // ─────────────────────────────────────────
            // NAVIGATE TO YOUR MAIN APP DASHBOARD
            // Change 'Dashboard' to your home screen
            // ─────────────────────────────────────────
            navigation.navigate('pinauth')
          }}
        >
          <Text style={styles.dashboardButtonText}>
            Go to Dashboard
          </Text>
          {/* <Ionicons name="arrow-forward" size={18} color="#fff" /> */}
        </TouchableOpacity>
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
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  // Scroll
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  // Success badge
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  successIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  successDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  levelBadge: {
    marginLeft: 'auto',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 8,
  },
  // Section
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  // Status badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  // Feature row
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  // Security note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    gap: 8,
    paddingVertical: 16,
  },
  securityNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  // Bottom button
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 12,
    // borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#16A34A',
    paddingVertical: 18,
    borderRadius: 30,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})