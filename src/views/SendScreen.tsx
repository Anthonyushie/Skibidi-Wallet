import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrutalistButton } from '../components/BrutalistButton';
import { useWallet } from '../viewmodels/useWallet';
import { globalStyles } from '../theme/styles';
import { colors } from '../theme/colors';

interface SendScreenProps {
  navigation: any;
}

export const SendScreen: React.FC<SendScreenProps> = ({ navigation }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiNarration, setAiNarration] = useState('');
  
  const { sendPayment, loading } = useWallet();

  const handleSend = async () => {
    if (!recipient.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amountSats = parseInt(amount);
    if (isNaN(amountSats) || amountSats <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      const isLightning = recipient.toLowerCase().startsWith('ln');
      const paymentRequest = {
        [isLightning ? 'bolt11' : 'address']: recipient,
        amount: amountSats,
        description: description || undefined,
      };

      const result = await sendPayment(paymentRequest);
      setAiNarration(result.aiNarration);
      setShowSuccess(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send payment');
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setRecipient('');
    setAmount('');
    setDescription('');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView>
        <Text style={[globalStyles.neonText, { textAlign: 'center', marginBottom: 30 }]}>
          SEND SATS
        </Text>

        <View style={globalStyles.brutalistCard}>
          <Text style={{ color: colors.neonYellow, fontSize: 16, marginBottom: 10 }}>
            Lightning Invoice or Bitcoin Address:
          </Text>
          <TextInput
            style={globalStyles.brutalistInput}
            placeholder="ln... or bc1..."
            placeholderTextColor={colors.lightGray}
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={{ color: colors.neonYellow, fontSize: 16, marginBottom: 10, marginTop: 20 }}>
            Amount (sats):
          </Text>
          <TextInput
            style={globalStyles.brutalistInput}
            placeholder="1000"
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
            title={loading ? "SENDING..." : "SEND SATS"}
            onPress={handleSend}
            color={colors.neonPink}
            disabled={loading}
          />
        </View>

        <BrutalistButton
          title="← BACK"
          onPress={() => navigation.goBack()}
          color={colors.neonBlue}
        />
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={[globalStyles.brutalistCard, { borderColor: colors.neonGreen }]}>
            <Text style={[globalStyles.neonText, { textAlign: 'center', marginBottom: 20 }]}>
              PAYMENT SENT! 🚀
            </Text>
            <Text style={{ 
              color: colors.white, 
              fontSize: 16, 
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 24,
            }}>
              {aiNarration}
            </Text>
            <BrutalistButton
              title="CLOSE"
              onPress={handleSuccessClose}
              color={colors.neonGreen}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};