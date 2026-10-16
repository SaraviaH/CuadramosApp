import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Colors } from '../../theme';
import { getInitials } from '../../utils';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface Props {
  uri?: string;
  name?: string;
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Avatar circular con imagen del usuario.
 * Fallback: iniciales del nombre; si no hay nombre, ícono de usuario.
 */
export function Avatar({
  uri,
  name,
  size = 40,
  borderColor = Colors.white,
  backgroundColor = Colors.brandSoft,
  textColor = Colors.brandDark,
}: Props) {
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          borderColor,
        },
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      ) : name?.trim() ? (
        <AppText style={[styles.text, { fontSize: size * 0.38, color: textColor }]}>
          {getInitials(name)}
        </AppText>
      ) : (
        <Icon name="user" color={textColor} size={size * 0.5} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: '800',
  },
});
