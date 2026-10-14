import { IconName } from '../../atoms';
import { Colors } from '../../theme';
import { Movimiento } from '../../types';
import { formatAmount } from '../../utils';
import { movimientoService } from '../movements/movimientoService';

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

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface FinancialSummaryData {
  periodLabel: string;
  totalIngresosMes: number;
  totalGastosMes: number;
  totalRetirosMes: number;
  balanceNetoMes: number;
  hasMovementsMonth: boolean;

  // Desglose estructurado por categoría
  expenseCategories: CategoryBreakdownItem[];
  incomeCategories: CategoryBreakdownItem[];

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
    return await movimientoService.getAllForUser();
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

  const totalRetirosMes = 0;

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

  // 3. Métricas destacadas prioritarias (Subtarea 4)
  const metrics: HighlightedMetric[] = [];
  const monthIncomes = monthMovements.filter(m => m.tipo === 'INGRESO');
  const monthExpenses = monthMovements.filter(m => m.tipo === 'EGRESO');

  // Métrica 1: Mayor venta registrada y día en que ocurrió
  if (monthIncomes.length > 0) {
    const sortedIncomes = [...monthIncomes].sort((a, b) => b.monto - a.monto);
    const topSale = sortedIncomes[0];
    if (topSale && topSale.monto > 0) {
      const dayLabel = topSale.fechaLegible || 'este periodo';
      metrics.push({
        id: 'top-income-day',
        icon: 'trendingUp',
        iconBg: Colors.brandSoft,
        iconColor: Colors.brand,
        title: `Mayor venta: ${formatAmount(topSale.monto)}`,
        subtitle: `${topSale.descripcion || topSale.concepto || 'Venta'} registrada el ${dayLabel}`,
      });
    }
  }

  // Métrica 2: Categoría que genera más ingresos
  if (totalIngresosMes > 0 && monthIncomes.length > 0) {
    const incomeCats: Record<string, number> = {};
    for (const inc of monthIncomes) {
      const cat = inc.categoria || inc.concepto || 'Ventas';
      incomeCats[cat] = (incomeCats[cat] || 0) + inc.monto;
    }

    let topIncCat = '';
    let topIncAmt = 0;
    for (const [cat, amt] of Object.entries(incomeCats)) {
      if (amt > topIncAmt) {
        topIncAmt = amt;
        topIncCat = cat;
      }
    }

    if (topIncCat && topIncAmt > 0) {
      const pct = Math.round((topIncAmt / totalIngresosMes) * 100);
      metrics.push({
        id: 'top-income-category',
        icon: 'store',
        iconBg: Colors.greenLight,
        iconColor: Colors.green,
        title: `Categoría líder: ${topIncCat}`,
        subtitle: `Generó ${formatAmount(topIncAmt)} (${pct}% del total de ingresos)`,
      });
    }
  }

  // Métrica 3: Categoría en la que se concentra el mayor gasto
  if (totalGastosMes > 0 && monthExpenses.length > 0) {
    const expenseCats: Record<string, number> = {};
    for (const exp of monthExpenses) {
      const cat = exp.categoria || exp.concepto || 'Varios';
      expenseCats[cat] = (expenseCats[cat] || 0) + exp.monto;
    }

    let topExpCat = '';
    let topExpAmt = 0;
    for (const [cat, amt] of Object.entries(expenseCats)) {
      if (amt > topExpAmt) {
        topExpAmt = amt;
        topExpCat = cat;
      }
    }

    if (topExpCat && topExpAmt > 0) {
      const pct = Math.round((topExpAmt / totalGastosMes) * 100);
      metrics.push({
        id: 'top-expense',
        icon: 'tag',
        iconBg: Colors.redLight,
        iconColor: Colors.red,
        title: `Mayor gasto: ${topExpCat}`,
        subtitle: `Concentra el ${pct}% de los gastos (${formatAmount(topExpAmt)})`,
      });
    }
  }

  // Métrica 4: Método de pago más utilizado
  if (monthMovements.length > 0) {
    const methodCounts: Record<string, { count: number; total: number }> = {};
    for (const m of monthMovements) {
      const method = m.metodoPago || 'Efectivo';
      if (!methodCounts[method]) {
        methodCounts[method] = { count: 0, total: 0 };
      }
      methodCounts[method].count++;
      methodCounts[method].total += m.monto;
    }

    let topMethod = '';
    let topMethodCount = 0;
    let topMethodTotal = 0;
    for (const [method, data] of Object.entries(methodCounts)) {
      if (data.count > topMethodCount) {
        topMethodCount = data.count;
        topMethodTotal = data.total;
        topMethod = method;
      }
    }

    if (topMethod && topMethodCount > 0) {
      const pct = Math.round((topMethodCount / monthMovements.length) * 100);
      metrics.push({
        id: 'top-payment-method',
        icon: 'wallet',
        iconBg: Colors.accentSoft,
        iconColor: Colors.orange,
        title: `Método preferido: ${topMethod}`,
        subtitle: `${topMethodCount} operaciones registradas (${pct}% del total, ${formatAmount(topMethodTotal)})`,
      });
    }
  }

  // Métrica 5: Promedio diario de ingresos en los días con ventas
  const dayIncomeTotals: Record<string, number> = {};
  for (const inc of monthIncomes) {
    const d = parseMovementDate(inc);
    const key = d ? formatLocalKey(d) : 'hoy';
    dayIncomeTotals[key] = (dayIncomeTotals[key] || 0) + inc.monto;
  }
  const salesDaysCount = Object.keys(dayIncomeTotals).length;
  if (salesDaysCount >= 1 && totalIngresosMes > 0) {
    const avg = totalIngresosMes / salesDaysCount;
    metrics.push({
      id: 'avg-daily-sales',
      icon: 'dollar',
      iconBg: Colors.greenLight,
      iconColor: Colors.green,
      title: `Promedio: ${formatAmount(avg)} / día`,
      subtitle: `Calculado sobre ${salesDaysCount} ${salesDaysCount === 1 ? 'día' : 'días'} con ventas registradas`,
    });
  }

  // Métrica 6: Comparación con la mejor venta diaria anterior
  const todayKey = formatLocalKey(referenceDate);
  const todayIncome = dayIncomeTotals[todayKey] || 0;
  const previousDays = Object.entries(dayIncomeTotals).filter(([key]) => key !== todayKey);

  if (previousDays.length > 0) {
    let bestPrevTotal = 0;
    for (const [, amt] of previousDays) {
      if (amt > bestPrevTotal) bestPrevTotal = amt;
    }

    if (bestPrevTotal > 0) {
      if (todayIncome >= bestPrevTotal) {
        metrics.push({
          id: 'record-sales-day',
          icon: 'check',
          iconBg: Colors.greenLight,
          iconColor: Colors.green,
          title: '¡Superaste tu mejor venta previa!',
          subtitle: `Hoy llevas ${formatAmount(todayIncome)}, superando el récord anterior de ${formatAmount(bestPrevTotal)}.`,
        });
      } else if (todayIncome > 0) {
        const diff = bestPrevTotal - todayIncome;
        metrics.push({
          id: 'near-record-day',
          icon: 'trendingUp',
          iconBg: Colors.brandSoft,
          iconColor: Colors.brand,
          title: 'Cerca de tu mejor venta diaria',
          subtitle: `Hoy llevas ${formatAmount(todayIncome)} (a ${formatAmount(diff)} de tu mejor día de ${formatAmount(bestPrevTotal)}).`,
        });
      }
    }
  }

  // 4. Desglose ordenado por categorías para gráficos
  const CATEGORY_COLORS = [
    Colors.brand,
    Colors.green,
    Colors.accent,
    Colors.brandDark,
    '#2E2A2C',
    '#5C5450',
    '#9E3B3B',
  ];

  const buildCategoryBreakdown = (
    movs: Movimiento[],
    total: number,
  ): CategoryBreakdownItem[] => {
    if (total <= 0 || movs.length === 0) return [];
    const catMap: Record<string, number> = {};
    for (const m of movs) {
      const cat = m.categoria || m.concepto || 'Varios';
      catMap[cat] = (catMap[cat] || 0) + m.monto;
    }
    const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    return entries.map(([category, amount], idx) => ({
      category,
      amount,
      percentage: Math.round((amount / total) * 100),
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));
  };

  const expenseCategories = buildCategoryBreakdown(monthExpenses, totalGastosMes);
  const incomeCategories = buildCategoryBreakdown(monthIncomes, totalIngresosMes);

  return {
    periodLabel,
    totalIngresosMes,
    totalGastosMes,
    totalRetirosMes,
    balanceNetoMes,
    hasMovementsMonth,
    expenseCategories,
    incomeCategories,
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
