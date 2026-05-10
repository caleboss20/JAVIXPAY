import {createStackNavigator } from "@react-navigation/stack"
import Splashscreen from "../Splashscreen";
import Aboutscreen from "../Aboutscreen";

import Signupscreen from "../Signupscreen";
import Loginscreen from "../Loginscreen";
import Landingscreen from "../Landingscreen";
import Verification from "../Verification";
import Welcomepage from "../Welcomepage";
import Idcapturescreen from "../Verification/Idcapturescreen";
import IntroKyc from "../Verification/IntroKyc";
import IdpreviewScreen from "../Verification/Idpreviewscreen";
import FaceCapture from "../Verification/Facecapture";
import Processingscreen from "../Verification/Processingscreen";
import Summarykyc from "../Verification/Summarykyc";
import Dashboard from "../Dashboard/Dashboard";
import Bottomtabbar from "../Dashboard/Bottomtabbar";
import Amountscreen from "../Dashboard/Amountscreen";
import Payconfirmationscreen from "../Dashboard/Payconfirmationscreen";
import Paymentsuccess from "../Dashboard/Paymentsuccess";
import PinAuth from "../PinAuth/PinAuth";
import Profilescreen from "../Dashboard/Profilepage";
import Twofactorauthentication from "../PinAuth/Twofactorauthentication";
import ForgotPassword from "../Forgotpassword/Forgotpassword";
import EmailOtp from "../Forgotpassword/Emailotp";
import Setpasswordscreen from "../Forgotpassword/Setpasswordscreen";
import Walletscreen from "../Dashboard/Wallets/Walletscreen";
import Accountscreen from "../Dashboard/Accountscreen";
import PhoneConfirmationScreen from "../Dashboard/Wallets/Phoneconfirmationscreen";
import WalletPin from "../PinAuth/Walletpin";



const Stack=createStackNavigator();

function MainStackNavigator(){
    return(
        <Stack.Navigator
        screenOptions={{
            headerShown:false
        }}
        initialRouteName="splashscreen"
        >
            <Stack.Screen name="splashscreen" component={Splashscreen} />
            <Stack.Screen name="loginscreen" component={Loginscreen} />
             <Stack.Screen name="signupscreen" component={Signupscreen} />
            <Stack.Screen name="aboutscreen" component={Aboutscreen} />
            <Stack.Screen name="landingscreen" component={Landingscreen} />
             <Stack.Screen name="verification" component={Verification} />
               {/**for the forgot password component screens */}
               <Stack.Screen name="forgotpassword" component={ForgotPassword} />
                 <Stack.Screen name="emailotp" component={EmailOtp} />
                 <Stack.Screen name="setpasswordscreen" component={Setpasswordscreen} />
               {/**enfof the forgot password screens */}
             <Stack.Screen name="welcomepage" component={Welcomepage} />
             <Stack.Screen name="introkyc" component={IntroKyc} />
              <Stack.Screen name="idcapturescreen" component={Idcapturescreen} />
               <Stack.Screen name="idpreviewscreen" component={IdpreviewScreen} />
              <Stack.Screen name="facecapture" component={FaceCapture} />
            <Stack.Screen name="processingscreen" component={Processingscreen} />
             <Stack.Screen name="summarykyc" component={Summarykyc} />
             <Stack.Screen name="pinauth" component={PinAuth} />
             {/* <Stack.Screen name="dashboard" component={Dashboard} /> */}
             <Stack.Screen name="dashboard" component={Bottomtabbar} />
             {/* wallet screens */}
               <Stack.Screen name="walletscreen" component={Walletscreen} />
                <Stack.Screen name="phoneconfirmationscreen" component={PhoneConfirmationScreen} />
                 <Stack.Screen name="walletpin" component={WalletPin} />
                {/* end wallet */}
               <Stack.Screen name="accountscreen" component={Accountscreen} />
              <Stack.Screen name="profilepage" component={Profilescreen} />
             <Stack.Screen name="amountscreen" component={Amountscreen} />
               <Stack.Screen name="twofactorauthentication" component={Twofactorauthentication} />
             <Stack.Screen name="payconfirmationscreen" component={Payconfirmationscreen} />
              <Stack.Screen name="paymentsuccess" component={Paymentsuccess} />
              
        </Stack.Navigator>
    )
}

export default MainStackNavigator;