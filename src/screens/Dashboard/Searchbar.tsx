import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
export default function Searchbar({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <Text style={styles.placeholder}>
          Send to name, phone or email...
        </Text>
      </View>
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  placeholder: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
})