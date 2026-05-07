import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { s,vs } from 'react-native-size-matters';
import Dashboard from '../Dashboard/Dashboard'
import Wallets from './Walletscreen'
import Qrscreen from './Qrscreen'
import History from './History'
import Settings from './Settings'
import Accountscreen from './Accountscreen';
import Walletscreen from './Wallets/Walletscreen';
const Tab = createBottomTabNavigator()
// ── Custom QR center button ──
function QRTabButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.qrButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.qrButtonInner}>
        <Ionicons name="qr-code" size={28} color="#fff" />
      </View>
    </TouchableOpacity>
  )
}
export default function Bottomtabbar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#16a343',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          let iconName
          if (route.name === 'Home') iconName = 'home'
          else if (route.name === 'Wallets') iconName = 'wallet'
          else if (route.name === 'History') iconName = 'time'
          else if (route.name === 'Account') iconName = 'settings-sharp'
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Wallets" component={Walletscreen} />
      <Tab.Screen
        name="QR"
        component={Qrscreen}
        options={{
          tabBarLabel: '',
          tabBarButton: (props) => <QRTabButton {...props} />,
        }}
      />
      <Tab.Screen name="History" component={History} />
      <Tab.Screen name="Account" component={Accountscreen} />
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  tabBar: {
    height: s(70),
    paddingBottom: 20,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    
  },
  qrButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
})