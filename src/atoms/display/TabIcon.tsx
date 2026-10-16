import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Colors } from '../../theme';

export type TabIconName = 'home' | 'list' | 'chart' | 'more';

interface Props {
  name: TabIconName;
  color?: string;
  size?: number;
  active?: boolean;
}

/**
 * Iconos de la barra inferior dibujados como una única silueta.
 * Relleno (activo) y contorno (inactivo) comparten la misma geometría,
 * así que el cambio de estado es consistente en los 4 tabs.
 */
export function TabIcon({ name, color = Colors.brand, size = 20, active = false }: Props) {
  const shape = {
    fill: active ? color : 'none',
    stroke: active ? 'none' : color,
    strokeWidth: active ? 0 : 1.9,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' ? (
        <Path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z" {...shape} />
      ) : null}

      {name === 'list' ? (
        <>
          <Circle cx={5} cy={7} r={1.6} {...shape} />
          <Circle cx={5} cy={12} r={1.6} {...shape} />
          <Circle cx={5} cy={17} r={1.6} {...shape} />
          <Rect x={9.5} y={5.9} width={11} height={2.2} rx={1.1} {...shape} />
          <Rect x={9.5} y={10.9} width={11} height={2.2} rx={1.1} {...shape} />
          <Rect x={9.5} y={15.9} width={11} height={2.2} rx={1.1} {...shape} />
        </>
      ) : null}

      {name === 'chart' ? (
        <>
          <Rect x={4} y={13.5} width={3.6} height={7.5} rx={1.4} {...shape} />
          <Rect x={10.2} y={8.5} width={3.6} height={12.5} rx={1.4} {...shape} />
          <Rect x={16.4} y={3.5} width={3.6} height={17.5} rx={1.4} {...shape} />
        </>
      ) : null}

      {name === 'more' ? (
        <>
          <Circle cx={5.5} cy={12} r={1.9} {...shape} />
          <Circle cx={12} cy={12} r={1.9} {...shape} />
          <Circle cx={18.5} cy={12} r={1.9} {...shape} />
        </>
      ) : null}
    </Svg>
  );
}
