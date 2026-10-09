import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextScaleLevel } from '../../theme/typography/textScale';

const TEXT_SCALE_KEY = '@cuadramos/text_scale-v1';

export const loadSavedTextScale = async (): Promise<TextScaleLevel> => {
  try {
    const raw = await AsyncStorage.getItem(TEXT_SCALE_KEY);
    if (raw === 'pequeno' || raw === 'mediano' || raw === 'grande') {
      return raw;
    }
    return 'pequeno';
  } catch {
    return 'pequeno';
  }
};

export const saveTextScale = async (level: TextScaleLevel): Promise<void> => {
  try {
    await AsyncStorage.setItem(TEXT_SCALE_KEY, level);
  } catch {
    // Ignore storage errors in offline mode
  }
};
