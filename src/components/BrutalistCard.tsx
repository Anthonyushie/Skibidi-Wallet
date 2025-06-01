import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface BrutalistCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderColor?: string;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  children,
  style,
  borderColor = colors.neonPink,
}) => {
  return (
    <View style={[styles.card, { borderColor }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.black,
    borderWidth: 3,
    borderRadius: 0,
    padding: 20,
    marginVertical: 10,
  },
});
