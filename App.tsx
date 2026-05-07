import MainStackNavigator from './src/screens/Navigation/MainstackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { TransactionProvider } from './src/screens/Transaction/Transactions';
//transactionprovider as using for state management
// for transactions data to made available to all screens//
//any screen can read or add transactionswithout passing props
export default function App() {
  return (
  <TransactionProvider>
     <NavigationContainer>
    <MainStackNavigator />
   </NavigationContainer>
  </TransactionProvider>
  );
}
