
import { StyleSheet, Text, View } from 'react-native';
import Homescreen from './src/screens/Loginscreen';
import Splashscreen from './src/screens/Splashscreen';
import Aboutscreen from './src/screens/Aboutscreen';
import MainStackNavigator from './src/screens/Navigation/MainstackNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
   <NavigationContainer>
    <MainStackNavigator />
   </NavigationContainer>
  );
}
