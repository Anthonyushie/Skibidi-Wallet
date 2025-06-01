import React, { useState } from 'react';
import { View, Text, TextInput, Share, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { BrutalistButton } from '../components/BrutalistButton';
import { useWallet } from '../viewmodels/useWallet';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';

interface ReceiveScreenProps {
  navigation: any;
}

export const ReceiveScreen: React.FC<ReceiveScreenProps> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [invoice, setInvoice] = useState('');
  
  const { generateInvoice, loading } = useWallet();

  const handleGenerateInvoice = async () => {
    const amountSats = parseInt(amount) || 0;
    
    try {
      const bolt11 = await generateInvoice(amountSats, description || undefined);
      setInvoice(bolt11);
    } catch (error) {
      console.error('Failed to generate invoice:', error);
    }
  };

  const handleCopyInvoice = async () => {
    await Clipboard.setStringAsync(invoice);
    // You could add a toast notification here
  };

  const handleShareInvoice = async () => {
    await Share.share({
      message: invoice,
      title: 'Lightning Invoice',
    });
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <Text style={[globalStyles.neonText, { textAlign: 'center', marginBottom: 30 }]}>
          RECEIVE SATS
        </Text>

        <View style={globalStyles.brutalistCard}>
          <Text style={{ color: colors.neonYellow, fontSize: 16, marginBottom: 10 }}>
            Amount (sats):
          </Text>
          <TextInput
            style={globalStyles.brutalistInput}
            placeholder="1000 (optional)"
            placeholderTextColor={colors.lightGray}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={{ color: colors.neonYellow, fontSize: 16, marginBottom: 10, marginTop: 20 }}>
            Description (optional):
          </Text>
          <TextInput
            style={globalStyles.brutalistInput}
            placeholder="What's this payment for?"
            placeholderTextColor={colors.lightGray}
            value={description}
            onChangeText={setDescription}
          />

          <BrutalistButton
            title={loading ? "GENERATING..." : "GENERATE INVOICE"}
            onPress={handleGenerateInvoice}
            color={colors.neonGreen}
            disabled={loading}
          />
        </View>

        {invoice && (
          <View style={[globalStyles.brutalistCard, { alignItems: 'center' }]}>
            <Text style={{ color: colors.neonGreen, fontSize: 16, marginBottom: 20 }}>
              Lightning Invoice Generated! ⚡
            </Text>
            
            <View style={{ 
              backgroundColor: colors.white, 
              padding: 20, 
              borderWidth: 3,
              borderColor: colors.neonGreen,
            }}>
              <QRCode
                value={invoice}
                size={200}
                backgroundColor={colors.white}
                color={colors.black}
              />
            </View>

            <Text style={{ 
              color: colors.white, 
              fontSize: 12, 
              textAlign: 'center',
              marginTop: 20,
              marginBottom: 20,
              padding: 10,
              backgroundColor: colors.mediumGray,
            }}>
              {invoice}
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
              <BrutalistButton
                title="COPY"
                onPress={handleCopyInvoice}
                color={colors.neonBlue}
                style={{ flex: 1, marginRight: 10 }}
              />
              <BrutalistButton
                title="SHARE"
                onPress={handleShareInvoice}
                color={colors.neonPink}
                style={{ flex: 1, marginLeft: 10 }}
              />
            </View>
          </View>
        )}

        <BrutalistButton
          title="← BACK"
          onPress={() => navigation.goBack()}
          color={colors.neonBlue}
        />
      </ScrollView>
    </SafeAreaView>
  );
};