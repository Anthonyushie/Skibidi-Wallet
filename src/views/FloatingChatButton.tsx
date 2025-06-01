import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChatModal } from './ChatModal';
import { colors } from '../theme/colors';

export const FloatingChatButton: React.FC = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowChat(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>💬</Text>
      </TouchableOpacity>
      
      <ChatModal
        visible={showChat}
        onClose={() => setShowChat(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    backgroundColor: colors.black,
    borderWidth: 3,
    borderColor: colors.neonBlue,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    fontSize: 24,
  },
});