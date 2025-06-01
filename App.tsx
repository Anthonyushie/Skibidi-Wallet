import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <PaperProvider>
      <StatusBar style="light" backgroundColor={colors.black} />
      <AppNavigator />
    </PaperProvider>
  );
}