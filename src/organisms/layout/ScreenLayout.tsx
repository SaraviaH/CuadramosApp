import React, { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '../../atoms';
import { ConfirmationMessage } from '../../molecules';
import { NotificationMessage } from '../../services';
import { Colors, Radius, Sizes, Spacing } from '../../theme';

interface Props extends PropsWithChildren {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  notification?: NotificationMessage | null;
  onDismissNotification?: () => void;
}

export function ScreenLayout({
  title,
  subtitle,
  onBack,
  notification,
  onDismissNotification,
  children,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Barra superior de marca */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <View style={styles.brandDot} />
            </View>
            <View>
              <AppText variant="label" color={Colors.brand} style={styles.brandTitle}>
                CUADRAMOS
              </AppText>
              <AppText variant="caption" color={Colors.textMuted} style={styles.brandTagline}>
                CONTROL DE CAJA DIARIA
              </AppText>
            </View>
          </View>

          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver a la pantalla anterior"
              onPress={onBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => [
                styles.backButton,
                { opacity: pressed ? 0.7 : 1, backgroundColor: pressed ? Colors.neutralSoft : Colors.surface },
              ]}
            >
              <AppText variant="label" color={Colors.brand}>
                ‹ Volver
              </AppText>
            </Pressable>
          ) : null}
        </View>

        {/* Notificación activa si existe */}
        {notification && onDismissNotification ? (
          <ConfirmationMessage
            notification={notification}
            onDismiss={onDismissNotification}
          />
        ) : null}

        {/* Encabezado de la pantalla */}
        <View style={styles.header}>
          <AppText variant="title" color={Colors.text}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="body" color={Colors.textMuted}>
              {subtitle}
            </AppText>
          ) : null}
        </View>

        {/* Contenido inyectado */}
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  },
  content: {
    width: '100%',
    maxWidth: Sizes.contentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.xs,
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  brandTitle: {
    letterSpacing: 1,
    fontSize: 12,
    lineHeight: 14,
  },
  brandTagline: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    gap: Spacing.xxs,
    marginTop: Spacing.xs,
  },
});

