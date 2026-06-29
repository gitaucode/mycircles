import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { USER_AVATARS } from '../constants/assets';

type Props = {
  avatarIds: string[];
  size?: number;
};

export default function AvatarStack({ avatarIds, size = 24 }: Props) {
  return (
    <View style={styles.container}>
      {avatarIds.map((id, i) => {
        const source = USER_AVATARS[id as keyof typeof USER_AVATARS] || USER_AVATARS['avatar_1'];
        return (
          <Image
            key={`${id}-${i}`}
            source={source}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: i === 0 ? 0 : -(size * 0.3),
                zIndex: avatarIds.length - i,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    backgroundColor: '#D1D5DB', // light grey fallback (never blank)
  },
});
