import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RegistrationProvider } from './contexts/RegistrationContext';
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <RegistrationProvider>
        <AppNavigator />
      </RegistrationProvider>
    </SafeAreaProvider>
  );
}