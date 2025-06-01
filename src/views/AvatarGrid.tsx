import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useAvatars } from '../viewmodels/useAvatars';
import { colors } from '../theme/colors';

export const AvatarGrid: React.FC = () => {
  const { avatars, loading } = useAvatars();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.neonGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {avatars.map((avatar) => (
          <View key={avatar.id} style={styles.avatarContainer}>
            <Image source={{ uri: avatar.url }} style={styles.avatar} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarContainer: {
    margin: 5,
    borderWidth: 2,
    borderColor: colors.neonPink,
    borderRadius: 0,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 0,
  },
});