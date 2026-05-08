// src/Components/Selectcountrymodal.tsx
import React, { useState, useEffect, useRef } from 'react'
import {
  View, Text, TouchableOpacity, TextInput, FlatList,
  Modal, Animated, StyleSheet, Pressable, Image,
} from 'react-native'
import { s, vs } from 'react-native-size-matters'
import { Ionicons } from '@expo/vector-icons'
const COUNTRIES = [
  { code: 'GH', name: 'Ghana',    dial: '+233', currency: 'GHS', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya',    dial: '+254', currency: 'KES',  flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria',  dial: '+234', currency: 'NGN',  flag: '🇳🇬' },
  { code: 'UG', name: 'Uganda',   dial: '+256', currency: 'UGX',  flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', dial: '+255', currency: 'TZS',  flag: '🇹🇿' },
]
type Country = typeof COUNTRIES[0]
interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect?: (country: Country) => void
}
export default function Selectcountrymodal({ isOpen, onClose, onSelect }: Props) {
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Country | null>(null)
  const slideAnim                 = useRef(new Animated.Value(600)).current
  const backdropAnim              = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
          speed: 14,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setSearch('')
        setSelected(null)
      })
    }
  }, [isOpen])
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  )
  const handleContinue = () => {
    if (!selected) return
    onSelect?.(selected)
    onClose()
  }
  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      {/* Sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Drag Handle */}
        <View style={styles.handleWrapper}>
          <View style={styles.handle} />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Select Country</Text>
            <Text style={styles.subtitle}>Choose the country for your mobile wallet</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={s(18)} color="#6B7280" />
          </TouchableOpacity>
        </View>
        {/* Search */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={s(16)} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search for a country..."
            placeholderTextColor="#616161"
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={s(16)} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        {/* Country List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.code}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: vs(8) }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>No countries found</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isSel = selected?.code === item.code
            return (
              <TouchableOpacity
                onPress={() => setSelected(item)}
                style={[styles.countryRow, isSel && styles.countryRowSelected]}
                activeOpacity={0.7}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.countryMeta}>{item.currency}</Text>
                
                </View>
                 <Text style={styles.dial}>{item.dial}</Text>
              </TouchableOpacity>
            )
          }}
        />
        {/* CTA */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selected}
          style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
          activeOpacity={0.85}
        >
          <Text style={[styles.continueBtnText, !selected && styles.continueBtnTextDisabled]}>
            Continue
          </Text>
          {/* {selected && <Ionicons name="arrow-forward" size={s(18)} color="#fff" style={{ marginLeft: s(6) }} />} */}
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeBtn:{
  position:'absolute',
  top:s(-7),
  right:s(12),
  } ,
   sheet: {
    position: 'absolute',
    bottom: s(0), 
    left: s(0),
     right: s(0),
    backgroundColor: '#fff',
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    maxHeight: '98%',
    paddingBottom: vs(32),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handleWrapper: {
    alignItems: 'center',
    paddingTop: vs(12),
    paddingBottom: vs(4),
  },
  handle: {
    width: s(40), height: vs(4),
    borderRadius: 99,
    backgroundColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: s(24),
    paddingVertical: vs(12),
  },
  title: {
     fontSize:s(18),
    fontWeight:'500',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
     fontSize: s(13),
    color: '#333',
    fontWeight: '400',
  },

  searchWrapper: {
    flexDirection: 'row',
     alignItems: 'center', 
     gap: s(10),
    marginHorizontal: s(24),
     marginBottom: vs(12),
    borderWidth: 1.5, 
    marginTop:s(20),
    borderColor: '#E5E7EB',
    borderRadius: s(10), 
    paddingHorizontal: s(14),
     paddingVertical: vs(4),
  },
  searchInput: {
    flex: 1, 
    fontSize: s(13),
     color: '#111827',
  },
  list: {
    paddingHorizontal: s(24),
  },
  emptyWrapper: {
    alignItems: 'center', 
 paddingVertical: vs(32),
  },
  emptyText: {
   fontSize: s(13),
    color: '#666',
    fontWeight: '400',
  },
  countryRow: {
    flexDirection: 'row',
     alignItems: 'center', gap: s(14),
    padding: s(14),
     marginBottom: vs(14),
    borderRadius: s(7), 
   
  },
  countryRowSelected: {
    borderColor: '#16A34A',
    borderWidth:s(0.4),
     backgroundColor: '#F0FDF4',
  },
  flag: {
    fontSize: s(20),
  },
  countryInfo: { 
    flex: 1
 },
  countryName: {
    fontSize:s(14),
    fontWeight:'400',
    color: '#333',
    letterSpacing: s(0.5),
    marginBottom:s(1),
    
  },
  countryMeta: {
   fontSize: s(11),
    color: '#666',
    fontWeight: '400',
  },
  dial:{
 fontSize:s(13),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  radio: {
    width: s(15), 
    height: s(15), borderRadius: s(11),
    borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#16A34A',
     backgroundColor: '#16A34A',
  },
  continueBtn: {
      width:'85%',

     backgroundColor:'#145a32',
   height:s(45),
   justifyContent:'center',
   alignItems:'center',
   alignSelf:'center',
   borderRadius:s(10),
   marginTop:s(20),
    
    
  },
  continueBtnDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    fontSize: s(14), fontWeight: '700', color: '#fff',
  },
  continueBtnTextDisabled: {
    color: '#9CA3AF',
  },
})