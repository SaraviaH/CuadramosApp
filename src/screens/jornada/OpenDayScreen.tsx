import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Colors, Radius, Spacing, Surfaces, Typography } from '../../theme';
import { AppButton, AppText, Icon, sanitizeAmountInput } from '../../atoms';
import { BackButton, ScreenContainer, ScreenTitle } from '../../molecules';
import { useJornada } from '../../hooks';

const QUICK_AMOUNTS = ['0', '50', '100', '200'];

export function OpenDayScreen({ goBack }: { goBack: () => void }) {
  const { openDay } = useJornada();
  const [amount, setAmount] = useState('');
  const [focused, setFocused] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const value = amount.trim() === '' ? 0 : Number(amount.replace(',', '.'));
    if (!Number.isFinite(value) || value < 0) return;
    setBusy(true);
    try {
      await openDay(value);
    } catch {
      // Notified via context
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer keyboardShouldPersistTaps="handled">
      <BackButton onPress={goBack} />
      <ScreenTitle title="Apertura de jornada" />

      <View style={styles.openingCard}>
        <View style={styles.topRow}>
          <View style={styles.featureIcon}>
            <Icon name="wallet" color={Colors.brand} size={22} />
          </View>
          <View style={styles.headerInfo}>
            <AppText style={styles.eyebrow}>EFECTIVO INICIAL</AppText>
            <AppText style={styles.cardTitle}>Efectivo en caja</AppText>
            <AppText style={styles.cardSubtitle}>
              Monto inicial para iniciar las ventas y calcular el arqueo final.
            </AppText>
          </View>
        </View>

        <View style={[styles.amountInputWrap, focused && styles.amountInputWrapFocused]}>
          <AppText style={styles.currencyPrefix}>S/</AppText>
          <TextInput
            accessibilityLabel="Efectivo inicial en soles"
            value={amount}
            onChangeText={text => {
              setAmount(sanitizeAmountInput(text));
            }}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors.placeholder}
            style={styles.amountDisplay}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            selectTextOnFocus
            returnKeyType="done"
            maxLength={12}
          />
        </View>

        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map(val => {
            const isSelected = amount === val;
            return (
              <Pressable
                key={val}
                accessibilityRole="button"
                onPress={() => setAmount(val)}
                style={[
                  styles.quickButton,
                  isSelected && styles.quickButtonSelected,
                ]}
              >
                <AppText
                  style={[
                    styles.quickButtonText,
                    isSelected && styles.quickButtonTextSelected,
                  ]}
                >
                  S/ {val}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <AppButton
        label="Abrir jornada"
        loading={busy}
        onPress={submit}
        showChevron
        style={{ marginTop: Spacing.sm }}
      />

      {/* Ilustración de caja segura */}
      <View style={styles.illustrationWrap}>
        <Image
          source={require('../../assets/images/cash-box-opening.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
          accessibilityLabel="Apertura de caja segura"
        />
        <AppText style={styles.illustrationText}>Control diario seguro de tu negocio con Yupay</AppText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  openingCard: {
    ...Surfaces.card,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  eyebrow: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: Typography.micro.fontSize,
    lineHeight: 15,
    color: Colors.text,
    marginTop: 2,
  },
  amountInputWrap: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.brandSoft,
    borderWidth: 2,
    borderColor: Colors.brandBorder,
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
  },
  currencyPrefix: {
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.brand,
  },
  amountInputWrapFocused: {
    borderColor: Colors.brand,
    backgroundColor: Colors.surface,
  },
  amountDisplay: {
    flex: 1,
    padding: 0,
    minHeight: 44,
    fontSize: Typography.title.fontSize,
    fontWeight: '800',
    color: Colors.text,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  quickButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickButtonSelected: {
    backgroundColor: Colors.brand,
  },
  quickButtonText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  quickButtonTextSelected: {
    color: Colors.white,
  },
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: 12,
  },
  illustrationImage: {
    width: 220,
    height: 180,
  },
  illustrationText: {
    fontSize: Typography.micro.fontSize,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
});
