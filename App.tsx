import { TransactionProvider } from './src/screens/Context/Transactions';
import { UserAuthProvider } from './src/screens/Context/UserAuthcontext';
import MainStackNavigator from './src/screens/Navigation/MainstackNavigator';
import { NavigationContainer } from '@react-navigation/native';

//transactionprovider as using for state management
// for transactions data to made available to all screens//
//any screen can read or add transactionswithout passing props
export default function App() {
  return (
 <UserAuthProvider>
   <TransactionProvider>
     <NavigationContainer>
    <MainStackNavigator />
   </NavigationContainer>
  </TransactionProvider>
 </UserAuthProvider>
  );
}
