import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { OnboardingScreen } from '../views/OnboardingScreen';
import { MainScreen } from '../views/MainScreen';
import { SendScreen } from '../views/SendScreen';
import { ReceiveScreen } from '../views/ReceiveScreen';
import { useWallet } from '../viewmodels/useWallet';
import { colors } from '../theme/colors';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  const { wallet } = useWallet();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={wallet.isOnboarded ? 'Main' : 'Onboarding'}
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.black,
            borderBottomWidth: 2,
            borderBottomColor: colors.neonGreen,
          },
          headerTitleStyle: {
            color: colors.neonGreen,
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTintColor: colors.neonPink,
          cardStyle: { backgroundColor: colors.black },
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Send" 
          component={SendScreen}
          options={{ title: 'SEND SATS' }}
        />
        <Stack.Screen 
          name="Receive" 
          component={ReceiveScreen}
          options={{ title: 'RECEIVE SATS' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};