// components/ProfileImage.tsx
import React, { useState } from 'react';
import { View, Image, StyleProp, ImageStyle, StyleSheet } from 'react-native';
import Colors from '../constants/color';
import Icons from '../constants/svgPath';
import { moderateScale } from '../constants/responsive';

interface ProfileImageProps {
  photoURL?: string | null;
  style?: StyleProp<ImageStyle>;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ photoURL, style }) => {
  const [imageError, setImageError] = useState(false);

  if (photoURL && !imageError) {
    return (
      <Image
        source={{ uri: photoURL }}
        style={[styles.profileImage, style]}
        resizeMode="cover"
        onError={() => {
          console.log('Profile image failed to load, showing default icon.');
          setImageError(true);
        }}
      />
    );
  }

  // Fallback to SVG icon if no photoURL or image failed
  return (
    <View
      style={[
        styles.profileImage,
        {
          backgroundColor: Colors.grayDark,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Icons.Profile height={20} width={20} fill={Colors.white} />
    </View>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(20),
  },
});
