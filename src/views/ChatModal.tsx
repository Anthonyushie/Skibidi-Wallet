import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrutalistButton } from '../components/BrutalistButton';
import { useChatBot } from '../viewmodels/useChatBot';
import { colors } from '../theme/colors';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ visible, onClose }) => {
  const [inputText, setInputText] = useState('');
  const { messages, loading, sendMessage } = useChatBot();

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const message = inputText.trim();
    setInputText('');
    await sendMessage(message);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>SKIBIDI BOT 🤖</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView style={styles.messagesContainer}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.isUser ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.text}</Text>
              </View>
            ))}
            {loading && (
              <View style={[styles.messageContainer, styles.botMessage]}>
                <Text style={styles.messageText}>Skibidi bot is thinking... 🤔</Text>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor={colors.lightGray}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <BrutalistButton
              title="SEND"
              onPress={handleSend}
              color={colors.neonGreen}
              disabled={loading || !inputText.trim()}
              style={styles.sendButton}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.neonBlue,
  },
  headerText: {
    color: colors.neonBlue,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: colors.neonPink,
    fontSize: 18,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 0,
    borderWidth: 2,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.darkGray,
    borderColor: colors.neonPink,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.mediumGray,
    borderColor: colors.neonGreen,
  },
  messageText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 2,
    borderTopColor: colors.neonBlue,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.darkGray,
    borderWidth: 2,
    borderColor: colors.neonBlue,
    borderRadius: 0,
    padding: 15,
    color: colors.white,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    marginVertical: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
});