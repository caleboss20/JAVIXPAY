import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { Dimensions } from 'react-native'
import React, { useState } from 'react'
import { s, vs } from 'react-native-size-matters'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
const { width: W } = Dimensions.get('window')
const Balancecard = () => {
  const navigation=useNavigation();
  const [showeye,setshoweye]=useState(false);
  return (
    <View>
      <LinearGradient
        colors={['#044314', '#61d255', '#1c8f37','#6ad35e']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* ── Top Row: Balance + Top Up ── */}
        <View style={styles.cardtop}>
          <View>
            <Text style={styles.balancetext}>Total Balance</Text>
              {showeye?
            <Ionicons
            onPress={()=>setshoweye(!showeye)}
             name="eye-off-outline" size={s(20)} style={styles.eyeicon} />
          :  
          <Ionicons
            onPress={()=>setshoweye(!showeye)}
             name="eye-outline"size={s(20)} style={styles.eyeicon} />
          }
            <Text style={styles.balanceamount}>
              {showeye?`GHS ****`:`GHS 0.00`}
            </Text>
          </View>
          <View>
          
            <TouchableOpacity style={styles.topupcard} activeOpacity={0.8}>
              <Ionicons name="add-outline" size={s(14)} color={"#6DBF82"} />
              <Text style={styles.topupText}>Top up</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* ── Bottom Row: Quick Actions ── */}
        <View style={styles.cardbottom}>

          <TouchableOpacity
          onPress={()=>navigation.navigate("QR")} 
          style={styles.actionitem} activeOpacity={0.8}>
            <View style={styles.roundbox}>
              <Ionicons name="send-sharp" size={s(16)} color={"#fff"} />
            </View>
            <Text style={styles.actionlabel}>Send</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.actionitem} activeOpacity={0.8}>
            <View style={styles.roundbox}>
              <Ionicons name="swap-horizontal-outline" size={s(16)} color={"#fff"} />
            </View>
            <Text style={styles.actionlabel}>Convert</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionitem} activeOpacity={0.8}>
            <View style={styles.roundbox}>
              <Ionicons name="radio-button-on-outline" size={s(16)} color={"#fff"} />
            </View>
            <Text style={styles.actionlabel}>Track</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionitem} activeOpacity={0.8}>
            <View style={styles.roundbox}>
              <Ionicons name="ellipsis-horizontal" size={s(16)} color={"#fff"} />
            </View>
            <Text style={styles.actionlabel}>More</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  )
}
export default Balancecard
const styles = StyleSheet.create({
  card: {
    width: W - s(32),
    alignSelf: 'center',
    marginTop: s(30),
    borderRadius: s(12),
    paddingHorizontal: s(22),
    paddingTop: vs(20),
    paddingBottom: vs(20),
    overflow: 'hidden',
    shadowColor: '#2D7A3A',
    shadowOffset: { width: 2, height: s(8) },
    shadowOpacity: 0.9,
    shadowRadius: s(26),
    elevation: 24,
  },
  cardtop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balancetext: {
    fontSize: s(15),
    color: 'white',
    fontWeight: '500',
  },
  balanceamount: {
    fontSize: s(30),
    marginTop: s(20),
    color: 'white',
    fontWeight: '600',
  },
  topupcard: {
    flexDirection: 'row',
    gap: s(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: s(30),
    backgroundColor: '#fff',
    paddingVertical: s(6),
    paddingHorizontal: s(12),
    marginTop: s(47),
  },
  topupText: {
    fontSize: s(12),
    color: 'green',
    fontWeight: '500',
  },
  cardbottom: {
    width: '100%',
    paddingVertical: vs(10),
    marginTop: s(30),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  roundbox: {
    width: s(40),
    height: s(40),
    borderRadius: s(40),
    backgroundColor: '#72c088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionitem: {
    alignItems: 'center',
    gap: s(6),
  },
  actionlabel: {
    color: '#ffffff',
    fontSize: s(11),
    fontWeight: '600',
  },
  eyeicon:{
  position:'absolute',
  left:s(117),
  color:'#fff',
  }
})