import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { s, vs } from 'react-native-size-matters';

const Backarrow = () => {
  return (
    <View>
      <Ionicons name="chevron-back" size={s(18)} color="#666" />
    </View>
  )
}

export default Backarrow

const styles = StyleSheet.create({
    
})