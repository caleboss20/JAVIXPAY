import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Aboutscreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aboutscreen</Text>
    </View>
  )
}

export default Aboutscreen

const styles = StyleSheet.create({
    container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'black',
    },
    text:{
      color:'#fff',
      fontSize:23

    }
})