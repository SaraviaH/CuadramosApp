# Arquitectura de Cuadramos

Cada carpeta responde a una única pregunta: **qué es**, **a qué dominio pertenece** o **qué responsabilidad tiene**. No se mezclan pantallas con reglas de negocio ni persistencia con componentes visuales.

```text
src/
├── atoms/
│   ├── actions/       # botones
│   ├── display/       # texto, iconos, montos y estados
│   ├── form/          # campos de entrada
│   └── layout/        # tarjeta y separador
├── molecules/
│   ├── balance/       # resumen de importes
│   ├── feedback/      # mensajes de éxito o error
│   ├── movements/     # selector e ítem de movimiento
│   ├── navigation/    # accesos rápidos
│   └── payments/      # ítem de pago pendiente
├── organisms/
│   ├── jornada/       # resumen, cierre y cabecera de jornada
│   ├── layout/        # marco común de pantallas
│   ├── movements/     # formulario e historial
│   └── payments/      # simulación y listado de pagos
├── screens/
│   ├── home/
│   ├── jornada/
│   ├── movements/
│   ├── payments/
│   ├── settings/
│   └── system/
├── services/
│   ├── jornada/       # abrir y cerrar según reglas
│   ├── movements/     # registrar y calcular saldo
│   ├── payments/      # confirmar o cancelar eventos
│   └── notifications/
├── storage/repositories/ # AsyncStorage y su clave
├── context/jornada/      # estado compartido de la jornada activa
├── hooks/jornada/        # acceso al contexto
├── types/                # contratos, separados por dominio
├── theme/foundations/    # tokens visuales globales
└── utils/
    ├── financial/        # cálculos y validación
    └── formatters/       # formato de dinero y fechas
```

Reglas de dependencia:

```text
screens → organisms → molecules → atoms
screens → hooks/context → services → storage
types y theme pueden ser consumidos por las demás capas
```

Los archivos `index.ts` son únicamente entradas públicas de cada capa. Para encontrar una regla de negocio se navega a `services/<dominio>`; para encontrar el aspecto de un elemento se navega a su nivel visual y dominio correspondiente.
