import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Onboarding1 from "../screens/Onboarding1";
import Onboarding2 from "../screens/Onboarding2";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import HomeScreen from "../screens/HomeScreen";
import { AgeGenderScreen } from "../screens/AgeGenderScreen";
import HealthProfileScreen from "../screens/HealthProfileScreen";
import CameraScan from "../screens/CameraScan";
import GalleryScan from '../screens/GalleryScan';
import ScanAnalysis from '../screens/ScanAnalysis';
import ScanHistory from "../screens/ScanHistory";
import ScanDetails from '../screens/ScanDetails';
import NotificationScreen from "../screens/NotificationScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="AgeGender" component={AgeGenderScreen} />
        <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CameraScan" component={CameraScan} />
        <Stack.Screen name="GalleryScan" component={GalleryScan} />
        <Stack.Screen name="ScanAnalysis" component={ScanAnalysis} />
        <Stack.Screen name="ScanHistory" component={ScanHistory} />
        <Stack.Screen name="ScanDetails" component={ScanDetails} />
         <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
