# Análisis Integral del Código: CuadramosApp

Documento actualizado a partir de la revisión actual del código y la estructura disponible en `src/`.

---

He realizado una revisión exhaustiva y completa de todo el código dentro del directorio src/. No se ha editado ni modificado ningún archivo; a continuación te presento el informe detallado de cómo funciona la arquitectura de la aplicación y la responsabilidad de cada archivo.

## 1. Visión General de la Arquitectura


CuadramosApp es una aplicación en React Native con TypeScript orientada al control diario de caja (arqueo, movimientos en efectivo y conciliación de cobros digitales) para comercios.

La arquitectura dentro de src/ combina dos patrones principales de ingeniería de software:

┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│  [Screens]  ───>  [Organisms]  ───>  [Molecules]  ───> [Atoms]  │
│        │                                                    │
│        └──> [Navigation] (AppNavigator: control de flujo)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Consume
┌──────────────────────────────▼──────────────────────────────┐
│                    CAPA DE ESTADO & HOOKS                   │
│  JornadaContext / useJornada (Estado reactivo, refresh)     │
│  useCompactLayout (Diseño adaptativo para pantallas <340dp) │
└──────────────────────────────┬──────────────────────────────┘
                               │ Invoca
┌──────────────────────────────▼──────────────────────────────┐
│                    CAPA DE SERVICIOS                        │
│  jornadaService, movimientoService, eventoPagoService       │
│  (Reglas de negocio contable, validaciones, inmutabilidad)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Accede
┌──────────────────────────────▼──────────────────────────────┐
│                  CAPA DE ALMACENAMIENTO                     │
│  cuadramosRepository (AsyncStorage: @cuadramos/state-v1)    │
└─────────────────────────────────────────────────────────────┘
          ▲                         ▲                 ▲
     [Types/Modelos]         [Utils/Cálculos]   [Theme/Tokens]
### Principios Fundamentales

Atomic Design en la UI: La interfaz se divide estrictamente en Átomos (piezas elementales), Moléculas (uniones de átomos con función propia), Organismos (bloques completos de funcionalidad) y Pantallas (vistas finales integradas).
Arquitectura Multicapa Desacoplada:
Tipos / Modelos (types): Fuente única de verdad tipada para el dominio.
Almacenamiento (storage): Aislamiento de la persistencia física local (mediante @react-native-async-storage/async-storage).
Servicios (services): Lógica pura del negocio contable (validar saldos, impedir jornadas duplicadas, prohibir cierres con pagos pendientes).
Estado Reactivo (context + hooks): Unifica la carga de datos, el refresco y la propagación de eventos y notificaciones hacia la UI.
Navegación Personalizada (navigation): Enrutador propio y ligero que implementa una máquina de estados para obligar a abrir la caja si no existe una jornada activa antes de ingresar al sistema.
## 2. Flujo y Reglas de Negocio Principales

Ciclo de Jornada:
El sistema exige abrir una jornada con saldo inicial
≥
0
≥0.
Solo puede haber una jornada en estado 'ABIERTA' en simultáneo.
Regla de Cierre: No es posible cerrar la jornada si existen eventos de pago en estado 'PENDIENTE'.
Cálculo de Cuadre:
Saldo Actual
=
Saldo Inicial
+
Ingresos
−
Egresos
−
Retiros
Saldo Actual=Saldo Inicial+Ingresos−Egresos−Retiros
Manejo de Pagos Digitales (Simulador):
Todo cobro o pago digital entra como 'PENDIENTE'. En este estado no afecta el saldo de caja.
Al ser confirmado, se genera automáticamente un Movimiento con origen 'AUTOMATICO' que suma o resta al saldo.
Al ser cancelado, se descarta sin afectar los números contables.
## 3. Detalle Archivo por Archivo dentro de src/

### src/types/ (Modelos y Definición de Tipos)


Define todos los contratos e interfaces del dominio contable y de navegación de la app.

#### `src/types/jornada/jornada.types.ts`
**Función:** Define el tipo EstadoJornada ('ABIERTA' | 'CERRADA') y la interfaz Jornada (id, saldo inicial, estado, fechas de apertura y cierre).

#### `src/types/movimientos/movimiento.types.ts`
**Función:** Define TipoMovimiento ('INGRESO' | 'EGRESO' | 'RETIRO'), OrigenMovimiento ('MANUAL' | 'AUTOMATICO') y la interfaz Movimiento para registrar cada transacción en la caja.

#### `src/types/pagos/eventoPago.types.ts`
**Función:** Modela los eventos de pagos electrónicos o simulados. Define EstadoEventoPago ('PENDIENTE' | 'CONFIRMADO' | 'CANCELADO'), TipoEventoPago ('PAGO_RECIBIDO' | 'PAGO_REALIZADO') y la interfaz EventoPago.

#### `src/types/estado/estado.types.ts`
**Función:** Define la estructura global del almacén local (EstadoCuadramos: listas de jornadas, movimientos y eventosPago) y la interfaz Balance (saldoInicial, ingresos, egresos, retiros, saldoActual).

#### `src/types/navegacion/ruta.types.ts`
**Función:** Define las rutas soportadas en la aplicación: 'INICIO', 'ABRIR_JORNADA', 'MOVIMIENTO', 'BALANCE', 'HISTORIAL', 'CERRAR_JORNADA', 'CONFIGURACION' y 'DEMO'.

#### `src/types/index.ts`
**Función:** Archivo de barril (barrel export) que expone todos los tipos para importaciones limpias.

### src/theme/ (Sistema de Diseño y Tokens)


Centraliza la guía de estilos visuales de la aplicación.

#### `src/theme/foundations/tokens.ts`
**Función:** Declara todas las constantes de diseño:

Colors: Colores de marca (#D5005D magenta principal, tonos secundarios, alertas, fondos y bordes).
Spacing: Escala métrica de espaciado (xxs a xxl).
Radius: Radios de curvatura de esquinas (xs a pill).
Sizes: Tamaños estándar para botones (50dp), inputs (52dp), áreas táctiles mínimas (48dp).
Shadows: Sombras nativas adaptadas condicionalmente a iOS (shadowOffset/shadowOpacity) y Android (elevation).
Typography: Escalas tipográficas (display, title, heading, subheading, body, label, caption).
#### `src/theme/index.ts`
**Función:** Exporta los tokens del tema.

### src/utils/ (Utilidades y Lógica Financiera Pura)


Funciones auxiliares sin efectos secundarios para operaciones matemáticas y formateo.

#### `src/utils/financial/business.ts`
**Función:** 

validateAmount: Valida que un número sea finito y estrictamente positivo.
calculateBalance: Suma ingresos, resta egresos y retiros al saldo inicial para obtener el balance contable exacto.
createId: Genera identificadores únicos basados en prefijo, timestamp y hash aleatorio.
#### `src/utils/formatters/format.ts`
**Función:** 

formatCurrency: Formatea valores numéricos a moneda peruana (PEN / S/) con 2 decimales usando Intl.NumberFormat.
formatDate y formatTime: Convierte timestamps ISO en fechas y horas legibles para Perú (es-PE).
#### `src/utils/index.ts`
**Función:** Barril de utilidades de negocio y formateadores.

### src/storage/ (Persistencia Local)


Capa encargada de la lectura y escritura en almacenamiento no volátil.

#### `src/storage/repositories/cuadramosRepository.ts`
**Función:** Implementa las operaciones CRUD básicas sobre AsyncStorage bajo la clave @cuadramos/state-v1:

loadState: Lee y deserializa el estado; si falla o no existe, retorna un estado vacío seguro.
saveState: Serializa y almacena el estado completo.
clearState: Limpia los datos de almacenamiento.
#### `src/storage/index.ts`
**Función:** Exporta las funciones del repositorio de persistencia.

### src/services/ (Servicios de Dominio / Casos de Uso)


Encapsulan las reglas de negocio y las mutaciones del estado almacenado.

#### `src/services/jornada/jornadaService.ts`
**Función:** 

getActive: Busca la jornada actualmente en estado 'ABIERTA'.
open: Valida el saldo inicial, verifica que no exista otra jornada abierta y registra una nueva jornada.
close: Valida que exista una jornada activa, bloquea el cierre si hay eventos de pago pendientes, y sella la jornada como 'CERRADA'.
pendingEvents: Lista los pagos pendientes asociados a la jornada activa.
#### `src/services/movements/movimientoService.ts`
**Función:** 

createIngreso, createEgreso, createRetiro: Valida importes (> 0), descripciones no vacías, comprueba que haya una jornada abierta y almacena el movimiento prependiéndolo a la lista.
getForActiveJornada: Devuelve todos los movimientos de la jornada actual.
calculateActiveBalance: Calcula el balance consolidado de la jornada activa.
#### `src/services/payments/eventoPagoService.ts`
**Función:** 

create: Crea un pago digital con estado 'PENDIENTE' ligado a la jornada activa.
confirm: Toma un evento pendiente, lo marca 'CONFIRMADO' y genera automáticamente el movimiento respectivo ('INGRESO' para cobranzas o 'EGRESO' para pagos).
cancel: Marca el evento como 'CANCELADO' sin alterar la caja.
getPendingForActiveJornada: Filtra únicamente los pagos pendientes de resolver.
#### `src/services/notifications/notificationService.ts`
**Función:** Fábrica de mensajes de retroalimentación en la UI (success, error, info).

#### `src/services/index.ts`
**Función:** Barril de exportación de todos los servicios.

### src/context/ (Gestión de Estado Global Reactivo)

#### `src/context/jornada/JornadaContext.tsx`
**Función:** Es el corazón reactivo de la aplicación:

Mantiene en memoria el estado actual (isLoading, jornadaActual, movimientos, eventosPendientes, balance, notification).
Provee el método refresh() que recarga el estado desde el storage y recalcula el balance.
Implementa runAction() para ejecutar operaciones de servicios, gestionar captura de excepciones y disparar notificaciones de éxito o error.
Expone métodos de acción hacia la UI: openDay, closeDay, addMovement, createPaymentEvent, confirmPaymentEvent, cancelPaymentEvent, dismissNotification.
Provee el hook useJornada() y el componente JornadaProvider.
#### `src/context/index.ts`
**Función:** Re-exporta el contexto de jornada.

### src/hooks/ (Custom Hooks)

#### `src/hooks/useCompactLayout.ts`
**Función:** Detecta mediante useWindowDimensions() si el ancho del dispositivo es menor a 340dp (COMPACT_BREAKPOINT). Se recalcula reactivamente ante giros de pantalla para decidir si apilar elementos en una sola columna en pantallas muy estrechas.

#### `src/hooks/jornada/useJornada.ts`
**Función:** Re-exporta el hook useJornada desde la capa de contexto para simplificar las rutas de importación.

#### `src/hooks/index.ts`
**Función:** Barril de hooks personalizados.

### src/atoms/ (Componentes Primitivos de Interfaz)


Componentes visuales puros y reutilizables sin lógica de negocio propia.

#### `src/atoms/actions/AppButton.tsx`
**Función:** Botón personalizable con variantes (primary, secondary, accent, danger, ghost, outline), estado de carga (loading con ActivityIndicator), soporte de ícono y microinteracción de pulsación con escala suave.

#### `src/atoms/display/AmountDisplay.tsx`
**Función:** Renderiza importes numéricos con el formateo oficial de moneda (S/), permitiendo tamaños tipográficos (sm, md, lg, display) y tonos semánticos (success, danger, warning, brand, etc.).

#### `src/atoms/display/AppText.tsx`
**Función:** Wrapper del <Text> nativo que normaliza las tipografías del sistema, alinea textos y desactiva el padding de fuente de Android para consistencia de altura de línea.

#### `src/atoms/display/Icon.tsx`
**Función:** Renderiza símbolos o glifos tipográficos con color y tamaño configurables.

#### `src/atoms/display/StatusBadge.tsx`
**Función:** Insignia tipo píldora para estados con fondos suaves, bordes armónicos y punto indicador opcional (showDot).

#### `src/atoms/form/AppInput.tsx`
**Función:** Campo de entrada de texto accesible con etiqueta superior animable por foco, prefijo visual (ej. 'S/'), estado de error o mensaje de pista (hint).

#### `src/atoms/layout/Card.tsx`
**Función:** Contenedor de superficie con variantes (default con sombra, flat, elevated, accent, brand).

#### `src/atoms/layout/Divider.tsx`
**Función:** Línea divisoria sutil (hairlineWidth) con espaciado vertical personalizable.

#### `src/atoms/index.ts`
**Función:** Barril de exportación de todos los átomos.

### src/molecules/ (Combinaciones de Átomos con Propósito Específico)

#### `src/molecules/balance/BalanceSummary.tsx`
**Función:** Muestra la tarjeta principal del saldo disponible en caja en tamaño destacado y una fila inferior con tres chips métricos: Ingresos (↗), Egresos (↘) y Retiros (⇱).

#### `src/molecules/feedback/ConfirmationMessage.tsx`
**Función:** Banner de alerta contextual flotante (éxito, advertencia o error) con botón para descartar (×).

#### `src/molecules/movements/MovementItem.tsx`
**Función:** Fila individual de movimiento dentro del historial, mostrando símbolo distintivo, concepto, fecha/hora, badge (indicando si fue Manual o Automático) y el monto con su respectivo signo + o -.

#### `src/molecules/movements/MovementTypeSelector.tsx`
**Función:** Selector de pestañas segmentadas para elegir entre Ingreso, Egreso o Retiro con colores semánticos activos.

#### `src/molecules/navigation/QuickActionCard.tsx`
**Función:** Tarjeta táctil interactiva para accesos directos del dashboard (Balance, Historial, Pagos, Ajustes), con soporte de badge de conteo pendiente.

#### `src/molecules/payments/PendingEventItem.tsx`
**Función:** Tarjeta para cobros o pagos digitales en espera, destacada con borde ámbar de advertencia y botones directos de acción: Descartar o ✓ Confirmar e ingresar.

#### `src/molecules/index.ts`
**Función:** Barril de exportación de todas las moléculas.

### src/organisms/ (Bloques Complejos de la Interfaz)

#### `src/organisms/layout/ScreenLayout.tsx`
**Función:** Plantilla estructural base para todas las pantallas. Incluye barra superior de marca CUADRAMOS, botón de retorno ‹ Volver (si aplica), renderizado de notificaciones activas, títulos y un ScrollView con contención de ancho responsivo (maxWidth: 640).

#### `src/organisms/jornada/JornadaHero.tsx`
**Función:** Bloque de cabecera visual en color de marca oscuro que muestra el indicador de jornada en vivo, hora de apertura, saldo principal y cápsulas de desglose de efectivo (adaptables a 1 columna en móviles compactos gracias a useCompactLayout).

#### `src/organisms/jornada/HomeSummary.tsx`
**Función:** Panel central del Home. Integra el JornadaHero, una tarjeta guía inteligente (orienta el siguiente paso según si hay pagos pendientes o caja vacía), el botón primario de registro, la cuadrícula de accesos directos y el acceso al cierre de caja.

#### `src/organisms/jornada/CloseDayPanel.tsx`
**Función:** Panel de arqueo para cerrar el turno. Evalúa la condición de seguridad: si pendingCount > 0, deshabilita el botón de cierre y alerta que existen pagos pendientes. Si está libre de pendientes, habilita el botón de cierre definitivo.

#### `src/organisms/movements/MovementForm.tsx`
**Función:** Formulario completo para asentar movimientos. Contiene selector de tipo, input monetario con validaciones numéricas, campo de concepto y una botonera de conceptos frecuentes sugeridos (chipsRow como 'Venta del día', 'Pago de servicios', etc.).

#### `src/organisms/movements/MovementList.tsx`
**Función:** Lista que itera y presenta los MovementItem, o en su defecto un estado vacío gráfico instructivo si la jornada no registra operaciones.

#### `src/organisms/payments/DemoPaymentForm.tsx`
**Función:** Formulario del simulador para emitir eventos de cobro o pago digital de prueba.

#### `src/organisms/payments/PendingEventsPanel.tsx`
**Función:** Cola de gestión de eventos pendientes con bloqueo interactivo durante el procesamiento asíncrono para evitar dobles confirmaciones.

#### `src/organisms/index.ts`
**Función:** Barril de exportación de todos los organismos.

### src/screens/ (Pantallas de la Aplicación)


Conectan el estado global de useJornada con los organismos para renderizar los flujos de usuario.

#### `src/screens/system/LoadingScreen.tsx`
**Función:** Pantalla de arranque o splash interno que muestra el logotipo de la app y un spinner mientras se lee el almacenamiento persistente.

#### `src/screens/jornada/OpenDayScreen.tsx`
**Función:** Pantalla de apertura de caja. Permite ingresar el efectivo base manual o elegir montos frecuentes rápidos (S/ 0, S/ 50, S/ 100, S/ 200) para inicializar el turno.

#### `src/screens/home/HomeScreen.tsx`
**Función:** Pantalla principal de la aplicación donde se visualiza el resumen general de la jornada activa y los atajos hacia las demás secciones.

#### `src/screens/movements/MovementScreen.tsx`
**Función:** Pantalla para añadir nuevos ingresos, egresos o retiros manuales.

#### `src/screens/jornada/BalanceScreen.tsx`
**Función:** Pantalla de arqueo y auditoría contable. Desglosa paso a paso la fórmula de cuadre de caja (Saldo Inicial

±
± Movimientos
=
= Saldo Neto).
#### `src/screens/movements/MovementHistoryScreen.tsx`
**Función:** Pantalla de historial cronológico que muestra métricas del total de movimientos, cantidad de ingresos y salidas, y el listado de transacciones.

#### `src/screens/payments/DemoToolsScreen.tsx`
**Función:** Pantalla del simulador de pagos digitales (Yape, tarjetas, transferencias). Permite alternar entre simular cobros entrantes o pagos salientes y resolver la cola de pagos pendientes.

#### `src/screens/jornada/CloseDayScreen.tsx`
**Función:** Pantalla de verificación final para ejecutar el cierre y sellado de la jornada.

#### `src/screens/settings/SettingsScreen.tsx`
**Función:** Pantalla informativa de la versión del MVP, características del sistema offline y acceso directo a herramientas de prueba.

#### `src/screens/index.ts`
**Función:** Barril de exportación de todas las pantallas.

### src/navigation/ (Enrutador de la Aplicación)

#### `src/navigation/AppNavigator.tsx`
**Función:** Gestor de navegación de la aplicación:

Monitorea el estado isLoading y jornadaActual.
Guarda de navegación: Si no hay ninguna jornada abierta, redirige automáticamente y fuerza a mostrar OpenDayScreen.
Maneja una pila de retroceso en memoria (useRef<Ruta[]>) que alimenta las funciones navigate(route) y goBack().
Renderiza la pantalla correspondiente según el estado de la ruta dentro de un SafeAreaView.
#### `src/navigation/index.ts`
**Función:** Exporta AppNavigator.

## 4. Resumen Conclusivo


El código en src/ está estructurado de forma modular, escalable y con separación estricta de responsabilidades:

- La lógica de negocio no está acoplada a las pantallas; vive en services/ y utils/.
- La interfaz de usuario es predecible, reutilizable y homogénea gracias al desglose en Atomic Design (atoms, molecules, organisms) y tokens en theme/.
- La navegación y estado global están sincronizados, garantizando que el usuario nunca pueda registrar transacciones fuera de una jornada abierta ni cerrar caja con transacciones pendientes.

---

## Cambios de legibilidad incorporados

La estructura actual documenta los cambios de la rama `feat/legibilidad-ui`:

- `src/atoms/form/AppInput.tsx`: incorpora `accessibilityLabel={label}` para mejorar la accesibilidad del campo.
- `src/hooks/index.ts`: exporta `useCompactLayout`.
- `src/hooks/useCompactLayout.ts`: nuevo hook que detecta anchos menores a `340dp` para adaptar el layout a pantallas estrechas.
