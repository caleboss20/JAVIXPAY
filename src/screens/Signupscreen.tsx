import { StyleSheet, Text, Button, Pressable,
  View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react';
import { s, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Backarrow from './Components/Backarrow';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserAuth } from './Context/UserAuthcontext';
export default function Signupscreen(){
  const navigation = useNavigation();
  const {register}=useUserAuth();


  const [showspinner, setShowspinner] = useState(false);
  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  // Errors state
  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });
  // Validation
  const validate = () => {
    let valid = true;
    let newErrors = { fullName: '', phone: '', email: '', password: '' };
    // Full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      newErrors.fullName = 'Name must contain letters only';
      valid = false;
    }
    // Phone
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^\d{9,15}$/.test(phone)) {
      newErrors.phone = 'Enter a valid phone number';
      valid = false;
    }
    // Email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
      valid = false;
    }
    // Password
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
      valid = false;
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
      valid = false;
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*)';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };
  const handleNext = () => {
    if (!validate()) return;

      register({fullName,phone,email,password})

    setShowspinner(true);
    const timer = setTimeout(() => {
      navigation.navigate("verification");
    }, 2000);
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Backarrow />
          </TouchableOpacity>
          <View style={styles.stepWrapper}>
            <Text style={styles.stepText}>Step 2/3</Text>
            <View style={styles.progressRow}>
              <View style={[styles.bar, styles.barActive]} />
              <View style={[styles.bar, styles.barActive]} />
              <View style={styles.bar} />
            </View>
          </View>
        </View>
        {/* Middle content */}
        <View style={styles.contentContainer}>
          <Text style={styles.bigText}>Let's get you started</Text>
          <Text style={styles.introText}>Provide your personal details below</Text>
        </View>
        {/* Form */}
        <View style={{ paddingHorizontal: s(20), marginTop: s(35) }}>
          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name (As shown on ID)</Text>
          <TextInput
            style={[styles.input, errors.fullName ? styles.inputError : null]}
            placeholder=""
            placeholderTextColor="#aaa"
            keyboardType="default"
            autoCapitalize="words"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) setErrors(p => ({ ...p, fullName: '' }));
            }}
          />
          {errors.fullName ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={s(13)} color="#e53935" />
              <Text style={styles.errorText}>{errors.fullName}</Text>
            </View>
          ) : null}
          {/* Phone */}
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            placeholder=""
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            autoCapitalize="none"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) setErrors(p => ({ ...p, phone: '' }));
            }}
          />
          {errors.phone ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={s(13)} color="#e53935" />
              <Text style={styles.errorText}>{errors.phone}</Text>
            </View>
          ) : null}
          {/* Email */}
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder=""
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(p => ({ ...p, email: '' }));
            }}
          />
          {errors.email ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={s(13)} color="#e53935" />
              <Text style={styles.errorText}>{errors.email}</Text>
            </View>
          ) : null}
          {/* Password */}
          <Text style={styles.inputLabel}>Password</Text>
          <View style={[styles.passwordRow, errors.password ? styles.inputError : null]}>
            <TextInput
              style={styles.passwordInput}
              placeholder=""
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors(p => ({ ...p, password: '' }));
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={s(20)}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle-outline" size={s(13)} color="#e53935" />
              <Text style={styles.errorText}>{errors.password}</Text>
            </View>
          ) : null}
          <View style={styles.bottomtext} />
          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={{ color: '#fff', fontSize: s(15), fontWeight: '400' }}>Next</Text>
            {showspinner ? <ActivityIndicator size={"small"} color={"white"} /> : null}
          </TouchableOpacity>
          <View style={styles.bottomtext}>
            <Text style={{ color: '#555', fontSize: s(14) }}>Already a user?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("loginscreen")}>
              <Text style={{ color: 'green', fontSize: s(14) }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};




const styles = StyleSheet.create({
  container:{
     flex: 1,      
    backgroundColor: '#fff',
    paddingHorizontal:s(2),
    paddingBottom:s(30),
  },
  stepWrapper: {
  alignItems: 'flex-end',
  gap: vs(6),
},
stepText: {
  fontSize: s(13),
  color: '#333',
  fontWeight: '500',
},
progressRow: {
  flexDirection: 'row',
  gap: s(6),
},
bar: {
  width: s(55),
  height: vs(4),
  backgroundColor: '#ddd',
  borderRadius: s(4),
},
barActive: {
  backgroundColor: 'green',
},
  topbar:{
  flexDirection:'row',
  justifyContent:'space-between',
   alignItems: 'center',       //center vertically
    paddingHorizontal: s(15),
    paddingTop: s(25),
    
  },
   backButton: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText:{
    fontWeight:'bold',
    color:'green',
    fontSize:s(16),
  },  
  contentContainer:{
  paddingTop:s(32),
  paddingHorizontal:s(20),
  },
  bigText:{
    fontSize:s(24),
    fontWeight:'bold',
    color:'black',
    
  },
  introText:{
  fontSize:s(14),
  paddingTop:s(10),
  color:'gray',
  paddingHorizontal:s(2),
  },
    inputLabel: {
    fontSize: s(14),
    paddingHorizontal:s(2),
    color: '#555',
    marginBottom: s(10),
    
  },
 
  input:{
    backgroundColor: '#f2f2f2',
    borderRadius: s(12),
    height: s(45),
    paddingHorizontal: s(16),
    fontSize: s(15),
    color: '#333',
    marginBottom: s(15),
  },
  button:{
   width:'100%',
  
   backgroundColor:'green',
   height:s(45),
   justifyContent:'center',
   alignItems:'center',
   alignSelf:'center',
   borderRadius:s(10),
   marginTop:s(10),
   flexDirection:'row',
   gap:7,
  
  },
  bottomtext:{
    flexDirection:'row',
    color:'black',
    gap:3,
    alignItems:'center',
    // marginTop:s(20),
    justifyContent:'center',
    paddingBottom:s(20),
    
  },
  spinner:{
    marginLeft:s(6),
  },
  inputError: {
    borderColor: '#e53935',
    borderWidth: 1.5,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    marginTop: s(4),
    marginBottom: s(6),
  },
  errorText: {
    color: '#e53935',
    fontSize: s(11),
    fontWeight: '500',
    flex: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: s(12),
  },
  passwordInput: {
    flex: 1,
  },
})