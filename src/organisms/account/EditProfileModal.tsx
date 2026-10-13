import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { AppButton, AppInput, AppText, Icon } from '../../atoms';
import { CuentaUsuario } from '../../types';
import { Colors, Radius, Spacing } from '../../theme';

interface Props {
  visible: boolean;
  user: CuentaUsuario;
  onClose: () => void;
  onSave: (name: string, avatarUri?: string, businessName?: string) => Promise<void>;
}

export function EditProfileModal({ visible, user, onClose, onSave }: Props) {
  const [name, setName] = useState(user.name || '');
  const [businessName, setBusinessName] = useState(user.businessName || '');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(user.avatarUri);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Sincronizar estado cuando se abre el modal
  React.useEffect(() => {
    if (visible) {
      setName(user.name || '');
      setBusinessName(user.businessName || '');
      setAvatarUri(user.avatarUri);
      setError(undefined);
    }
  }, [visible, user]);

  const handlePickImage = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.8,
      });

      if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
        setAvatarUri(response.assets[0].uri);
      }
    } catch {
      // Ignorar cancelación del selector
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Ingresa tu nombre para personalizar tu caja.');
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await onSave(name.trim(), avatarUri, businessName.trim() || 'Mi negocio');
      onClose();
    } catch {
      setError('No se pudo guardar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <AppText style={styles.title}>Mi perfil de comerciante</AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
              onPress={onClose}
              style={styles.closeBtn}
            >
              <AppText style={styles.closeBtnText}>×</AppText>
            </Pressable>
          </View>

          {/* Foto de perfil */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Icon name="user" color={Colors.brand} size={32} />
                </View>
              )}
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={handlePickImage}
              style={({ pressed }) => [styles.photoButton, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Icon name="payments" color={Colors.brandDark} size={15} />
              <AppText style={styles.photoButtonText}>
                {avatarUri ? 'Cambiar foto' : 'Seleccionar foto'}
              </AppText>
            </Pressable>
          </View>

          {/* Campos del formulario */}
          <View style={styles.formFields}>
            <AppInput
              label="Nombre del comerciante"
              placeholder="Ej. María López"
              value={name}
              onChangeText={val => {
                setName(val);
                if (error) setError(undefined);
              }}
              error={error}
            />

            <AppInput
              label="Nombre de tu negocio"
              placeholder="Ej. Bodega San Carlos"
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={styles.cancelBtn}
            >
              <AppText style={styles.cancelBtnText}>Cancelar</AppText>
            </Pressable>

            <AppButton
              label="Guardar perfil"
              tone="magenta"
              loading={saving}
              onPress={handleSave}
              style={styles.saveBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    ...Radius.asymmetricCard,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 24,
    lineHeight: 24,
    color: Colors.muted,
  },
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
    backgroundColor: Colors.brandSoft,
    borderWidth: 2,
    borderColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  photoButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandDark,
  },
  formFields: {
    gap: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: Spacing.xs,
  },
  cancelBtn: {
    flex: 1,
    minHeight: 46,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.muted,
  },
  saveBtn: {
    flex: 1,
  },
});
