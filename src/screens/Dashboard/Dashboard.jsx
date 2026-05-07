import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context'
import Dashboardtopbar from './Dashboardtopbar'
import {LinearGradient} from 'expo-linear-gradient';
import Balancecard from './Balancecard';
import Searchbar from './Searchbar';

const Dashboard = () => {
  return (
    <SafeAreaProvider >
        <SafeAreaView style={styles.container}>
           
            {/* <LinearGradient
            colors={["#94bf9f","#ffffff","#c8e6c9"]}
            style={{flex:1}}
            
            > */}
                
                <Dashboardtopbar />
                <Balancecard />
              
                
            {/* </LinearGradient> */}
            
     
            
       
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    container:{
     flex:1,
     backgroundColor:"#f0f7f1",
    }
})