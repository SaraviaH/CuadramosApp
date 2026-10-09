import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme';
import { AppButton, AppText, Icon } from '../../atoms';
import { BrandHeader, ScreenTitle } from '../../molecules';
import { useJornada } from '../../hooks';

const QUICK_AMOUNTS = ['0', '50', '100', '200'];

export function OpenDayScreen() {
  const { openDay } = useJornada();
  const [amount, setAmount] = useState('100');
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
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <BrandHeader />
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

        <View style={styles.amountInputWrap}>
          <AppText style={styles.currencyPrefix}>S/</AppText>
          <AppText
            accessibilityRole="text"
            style={styles.amountDisplay}
          >
            {amount || '0.00'}
          </AppText>
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
        <AppText style={styles.illustrationText}>Control diario seguro con Compartamos Banco</AppText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  openingCard: {
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.line,
    shadowColor: '#28151E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
    fontSize: 9,
    fontWeight: '800',
    color: Colors.muted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ink,
  },
  cardSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.muted,
    marginTop: 2,
  },
  amountInputWrap: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBFD',
    borderWidth: 2,
    borderColor: '#F1CADB',
    borderRadius: 16,
    paddingHorizontal: Spacing.md,
  },
  currencyPrefix: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.brand,
  },
  amountDisplay: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.ink,
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
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: '600',
    color: Colors.muted,
    textAlign: 'center',
  },
});
