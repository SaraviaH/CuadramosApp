import { IconName } from '../../atoms';
import { Colors } from '../../theme';
import { Movimiento } from '../../types';
import { movimientoSqliteRepository, loadBoxHistory } from '../../storage';

export interface DailyBarItem {
  dayIndex: number;
  dayLabel: string;
  dayName: string;
  dateKey: string;
  ingresos: number;
  gastos: number;
}

export interface HighlightedMetric {
  id: string;
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}

export interface FinancialSummaryData {
  periodLabel: string;
  totalIngresosMes: number;
  totalGastosMes: number;
  totalRetirosMes: number;
  balanceNetoMes: number;
  hasMovementsMonth: boolean;

  // Weekly data
  hasWeeklyMovements: boolean;
  weeklyDays: DailyBarItem[];
  weeklyTrendPct: number | null; // null if not enough data to compare

  // Dynamic metrics backed strictly by data
  metrics: HighlightedMetric[];
}

const SPANISH_MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAY_FULL_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const formatLocalKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseMovementDate = (m: Movimiento): Date | null => {
  if (m.fechaHoraOrigen) {
    const parsed = new Date(m.fechaHoraOrigen);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return null;
};

export const fetchAllLocalMovements = async (): Promise<Movimiento[]> => {
  try {
    const sqliteMovements = await movimientoSqliteRepository.getAllMovimientos();
    const boxHistory = await loadBoxHistory();

    const existingIds = new Set(sqliteMovements.map(m => m.id));
    const merged = [...sqliteMovements];

    for (const box of boxHistory) {
      if (box.movimientos && Array.isArray(box.movimientos)) {
        for (const mov of box.movimientos) {
          if (!existingIds.has(mov.id)) {
            existingIds.add(mov.id);
            merged.push(mov);
          }
        }
      }
    }
    return merged;
  } catch {
    return [];
  }
};

export const calculateFinancialSummary = (
  movements: Movimiento[],
  referenceDate = new Date(),
): FinancialSummaryData => {
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth();
  const periodLabel = `${SPANISH_MONTHS[currentMonth]} ${currentYear}`;

  // 1. Filtrar movimientos del mes actual
  const monthMovements = movements.filter(m => {
    const d = parseMovementDate(m);
    if (!d) return true; // Si no tiene fecha parseable, incluirlo en la actividad actual
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const hasMovementsMonth = monthMovements.length > 0;

  const totalIngresosMes = monthMovements
    .filter(m => m.tipo === 'INGRESO')
    .reduce((acc, m) => acc + m.monto, 0);

  const totalGastosMes = monthMovements
    .filter(m => m.tipo === 'EGRESO')
    .reduce((acc, m) => acc + m.monto, 0);

  const totalRetirosMes = monthMovements
    .filter(m => m.tipo === 'RETIRO')
    .reduce((acc, m) => acc + m.monto, 0);

  // Balance neto = ingresos confirmados - egresos confirmados
  const balanceNetoMes = totalIngresosMes - totalGastosMes;

  // 2. Calcular semana actual (Lunes a Domingo)
  const dayOfWeek = referenceDate.getDay(); // 0 es Domingo, 1 es Lunes...
  const distToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() + distToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Semana previa para cálculo de variación real
  const prevMonday = new Date(monday);
  prevMonday.setDate(monday.getDate() - 7);
  const prevSunday = new Date(monday);
  prevSunday.setDate(monday.getDate() - 1);
  prevSunday.setHours(23, 59, 59, 999);

  const weeklyDays: DailyBarItem[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weeklyDays.push({
      dayIndex: i,
      dayLabel: DAY_LABELS[i],
      dayName: DAY_FULL_NAMES[i],
      dateKey: formatLocalKey(d),
      ingresos: 0,
      gastos: 0,
    });
  }

  let prevWeekIncome = 0;
  let currentWeekIncome = 0;
  let weeklyMovementsCount = 0;

  for (const m of movements) {
    const d = parseMovementDate(m);
    if (!d) continue;

    // Verificar si cae en la semana previa
    if (d >= prevMonday && d <= prevSunday && m.tipo === 'INGRESO') {
      prevWeekIncome += m.monto;
    }

    // Verificar si cae en la semana actual
    if (d >= monday && d <= sunday) {
      const key = formatLocalKey(d);
      const dayItem = weeklyDays.find(w => w.dateKey === key);
      if (dayItem) {
        if (m.tipo === 'INGRESO') {
          dayItem.ingresos += m.monto;
          currentWeekIncome += m.monto;
          weeklyMovementsCount++;
        } else if (m.tipo === 'EGRESO') {
          dayItem.gastos += m.monto;
          weeklyMovementsCount++;
        }
      }
    }
  }

  const hasWeeklyMovements = weeklyMovementsCount > 0;

  // Variación solo calculada si hay base comparable real
  let weeklyTrendPct: number | null = null;
  if (prevWeekIncome > 0 && currentWeekIncome > 0) {
    weeklyTrendPct = Math.round(((currentWeekIncome - prevWeekIncome) / prevWeekIncome) * 100);
  }

  // 3. Métricas destacadas reales
  const metrics: HighlightedMetric[] = [];

  // Métrica A: Principal categoría de gasto (requiere gastos reales)
  const monthExpenses = monthMovements.filter(m => m.tipo === 'EGRESO');
  if (totalGastosMes > 0 && monthExpenses.length > 0) {
    const categoryTotals: Record<string, number> = {};
    for (const exp of monthExpenses) {
      const cat = exp.categoria || exp.concepto || 'Varios';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.monto;
    }

    let topCategory = '';
    let topCatAmount = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > topCatAmount) {
        topCatAmount = amt;
        topCategory = cat;
      }
    }

    if (topCategory && topCatAmount > 0) {
      const pct = Math.round((topCatAmount / totalGastosMes) * 100);
      metrics.push({
        id: 'top-expense',
        icon: 'tag',
        iconBg: Colors.brandSoft,
        iconColor: Colors.brand,
        title: `Principal gasto: ${topCategory}`,
        subtitle: `Representa el ${pct}% de los gastos del mes (S/ ${topCatAmount.toFixed(2)})`,
      });
    }
  }

  // Métrica B: Mayor venta registrada (requiere ingresos reales con fecha)
  const monthIncomes = monthMovements.filter(m => m.tipo === 'INGRESO');
  if (monthIncomes.length > 0) {
    const dayIncomeTotals: Record<string, { total: number; name: string }> = {};

    for (const inc of monthIncomes) {
      const d = parseMovementDate(inc);
      const key = d ? formatLocalKey(d) : 'Día registrado';
      const dayName = d ? DAY_FULL_NAMES[(d.getDay() + 6) % 7] : 'Día registrado';
      if (!dayIncomeTotals[key]) {
        dayIncomeTotals[key] = { total: 0, name: dayName };
      }
      dayIncomeTotals[key].total += inc.monto;
    }

    let bestDayName = '';
    let bestDayTotal = 0;
    for (const item of Object.values(dayIncomeTotals)) {
      if (item.total > bestDayTotal) {
        bestDayTotal = item.total;
        bestDayName = item.name;
      }
    }

    if (bestDayTotal > 0 && bestDayName) {
      metrics.push({
        id: 'top-income-day',
        icon: 'trendingUp',
        iconBg: '#FFF7DB',
        iconColor: Colors.orange,
        title: `Mayor venta: ${bestDayName}`,
        subtitle: `S/ ${bestDayTotal.toFixed(2)} registrados en ingresos de la jornada`,
      });
    }

    // Métrica C: Promedio diario si hay más de 1 día con ventas
    const distinctDays = Object.keys(dayIncomeTotals).length;
    if (distinctDays >= 2 && totalIngresosMes > 0) {
      const avg = totalIngresosMes / distinctDays;
      metrics.push({
        id: 'avg-daily-sales',
        icon: 'dollar',
        iconBg: Colors.greenLight,
        iconColor: Colors.green,
        title: 'Promedio diario de ingresos',
        subtitle: `S/ ${avg.toFixed(2)} por cada día con ventas registradas`,
      });
    }
  }

  return {
    periodLabel,
    totalIngresosMes,
    totalGastosMes,
    totalRetirosMes,
    balanceNetoMes,
    hasMovementsMonth,
    hasWeeklyMovements,
    weeklyDays,
    weeklyTrendPct,
    metrics,
  };
};

export const financialSummaryService = {
  async getSummary(referenceDate = new Date()): Promise<FinancialSummaryData> {
    const movements = await fetchAllLocalMovements();
    return calculateFinancialSummary(movements, referenceDate);
  },
};
