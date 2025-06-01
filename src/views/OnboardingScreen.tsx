import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrutalistButton } from '../components/BrutalistButton';
import { useWallet } from '../viewmodels/useWallet';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [isRestore, setIsRestore] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [generatedSeed, setGeneratedSeed] = useState<string | null>(null);
  const [showSeed, setShowSeed] = useState(false);

  const { createWallet, restoreWallet, loading } = useWallet();

  const handleCreateWallet = async () => {
    try {
      const seed = await createWallet();
      setGeneratedSeed(seed);
      setShowSeed(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet');
    }
  };

  const handleRestoreWallet = async () => {
    if (!seedPhrase.trim()) {
      Alert.alert('Error', 'Please enter your seed phrase');
      return;
    }

    try {
      await restoreWallet(seedPhrase);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore wallet');
    }
  };

  const handleSeedConfirmed = () => {
    Alert.alert(
      'Seed Phrase Backed Up?',
      'Have you securely backed up your seed phrase? You will need it to recover your wallet!',
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Yes, Continue',
          onPress: () => navigation.replace('Main'),
        },
      ]
    );
  };

  if (showSeed && generatedSeed) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Text style={[globalStyles.neonText, { textAlign: 'center', marginBottom: 30 }]}>
            BACKUP YOUR SEED PHRASE!
          </Text>

          <View style={[globalStyles.brutalistCard, { borderColor: colors.error }]}>
            <Text style={{ color: colors.error, fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>
              ⚠️ CRITICAL: WRITE THIS DOWN AND KEEP IT SAFE!
            </Text>
            <Text style={{ color: colors.white, fontSize: 16, lineHeight: 24 }}>
              {generatedSeed}
            </Text>
          </View>

          <Text style={{ color: colors.white, textAlign: 'center', marginVertical: 20 }}>
            Your seed phrase is the ONLY way to recover your wallet. Store it securely offline!
          </Text>

          <BrutalistButton
            title="I've Backed Up My Seed"
            onPress={handleSeedConfirmed}
            color={colors.neonGreen}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={[globalStyles.neonText, { textAlign: 'center', marginBottom: 50 }]}>
          SKIBIDI WALLET
        </Text>

        <View style={globalStyles.brutalistCard}>
          <Text style={{ color: colors.white, fontSize: 18, textAlign: 'center', marginBottom: 30 }}>
            Welcome to Skibidi Wallet! Choose how you'd like to proceed.
          </Text>

          {isRestore ? (
            <>
              <TextInput
                placeholder="Enter seed phrase"
                placeholderTextColor={colors.white}
                style={[globalStyles.brutalistInput, { marginBottom: 20 }]}
                multiline
                numberOfLines={3}
                value={seedPhrase}
                onChangeText={setSeedPhrase}
              />
              <BrutalistButton
                title={loading ? "Restoring..." : "Restore Wallet"}
                onPress={handleRestoreWallet}
                color={colors.neonOrange}
                disabled={loading}
              />
            </>
          ) : (
            <BrutalistButton
              title={loading ? "Creating..." : "Create New Wallet"}
              onPress={handleCreateWallet}
              color={colors.neonGreen}
              disabled={loading}
            />
          )}

          <BrutalistButton
            title={isRestore ? "Back to Create Wallet" : "Restore Existing Wallet"}
            onPress={() => setIsRestore(!isRestore)}
            color={colors.mediumGray}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
