import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaProvider ,SafeAreaView} from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { s, vs } from 'react-native-size-matters';
import { useTransactions } from '../Context/Transactions';


const History = () => {
  const {transactions}=useTransactions();
  return (
    <SafeAreaProvider style={styles.container}>
    <SafeAreaView>
      {transactions.length===0?
      <View style={styles.content}>
        <Ionicons name="wallet-outline" size={s(140)} />
        <View style={styles.middlecontain}>
         <Text style={styles.transactionTitle}>No Transactions Yet</Text>
         <Text style={styles.subTitle}>Your transactions will appear here once you send 
          or receive money
         </Text>
         <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Money</Text>
         </TouchableOpacity>
        </View>
      </View>
      :
      ""
      
      }
    </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default History

const styles = StyleSheet.create({
container:{
  flex:1,
  alignItems:'center',
  justifyContent:'center',
  position:'relative',

},
 button:{
       minWidth:s(265),
       flexDirection:'row',
       gap:s(7),
       backgroundColor:'#0a813b',
       height:s(45),
       justifyContent:'center',
       alignItems:'center',
       alignSelf:'center',
       borderRadius:s(10),
      
       marginTop:s(40),
       cursor:'pointer',
       boxShadow:' rgba(10 30 0 0.45)',
       
       bottom:s(0),

      
      },
      buttonText:{
        color:'#fff',
         fontSize:s(13),
      },
      content:{
        justifyContent:'center',
        alignItems:'center',
        // paddingHorizontal:s(20),
      },
      middlecontain:{
     justifyContent:'center',
        alignItems:'center',
      },
      transactionTitle:{
       fontSize:s(18),
    fontWeight:'400',
    color: '#333',
    letterSpacing: 0.5,
    marginBottom: 8,
      },
      subTitle:{
    fontSize: s(12),
    textAlign:'center',
    paddingHorizontal:s(30),
    color: '#666',
    fontWeight: '400',
    lineHeight:s(19),
      },





})