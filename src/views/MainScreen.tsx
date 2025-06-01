import React, { useEffect } from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrutalistButton } from '../components/BrutalistButton';
import { AvatarGrid } from './AvatarGrid';
import { FloatingChatButton } from './FloatingChatButton';
import { useWallet } from '../viewmodels/useWallet';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';

interface MainScreenProps {
  navigation: any;
}

export const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { wallet, refreshBalances, loading } = useWallet();

  const formatBalance = (sats: number) => {
    return sats.toLocaleString();
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshBalances} />
        }
      >
        <Text style={[globalStyles.neonText, { textAlign: 'center', marginBottom: 20 }]}>
          SKIBIDI WALLET
        </Text>

        <AvatarGrid />

        {/* Balance Display */}
        <View style={[globalStyles.brutalistCard, { borderColor: colors.bitcoin }]}>
          <Text style={{ color: colors.bitcoin, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
            ON-CHAIN BALANCE
          </Text>
          <Text style={[globalStyles.balanceText, { color: colors.bitcoin }]}>
            {formatBalance(wallet.onchainBalance)} sats
          </Text>
        </View>

        <View style={[globalStyles.brutalistCard, { borderColor: colors.lightning }]}>
          <Text style={{ color: colors.lightning, fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
            LIGHTNING BALANCE
          </Text>
          <Text style={[globalStyles.balanceText, { color: colors.lightning }]}>
            {formatBalance(wallet.lightningBalance)} sats
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{ marginTop: 30 }}>
          <BrutalistButton
            title="💸 SEND SATS"
            onPress={() => navigation.navigate('Send')}
            color={colors.neonPink}
          />
          
          <BrutalistButton
            title="📥 RECEIVE SATS"
            onPress={() => navigation.navigate('Receive')}
            color={colors.neonGreen}
          />
        </View>

        <Text style={{ 
          color: colors.lightGray, 
          textAlign: 'center', 
          marginTop: 40,
          fontSize: 12 
        }}>
          Pull to refresh • Stay skibidi 🚀
        </Text>
      </ScrollView>

      <FloatingChatButton />
    </SafeAreaView>
  );
};