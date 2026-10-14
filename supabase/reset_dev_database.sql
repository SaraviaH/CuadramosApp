-- ==============================================================================
-- CUADRAMOSAPP: RESTABLECIMIENTO LIMPIO DE BASE DE DATOS DE DESARROLLO (SUPABASE)
-- ==============================================================================
-- ⚠️ ADVERTENCIA: Este script elimina y recrea limpiamente todas las tablas operativas
-- de CuadramosApp en Supabase (jornadas, movimientos, eventos_pago, historial_cajas).
-- Úsalo en el SQL Editor de Supabase cuando quieras limpiar datos de prueba y empezar de cero.

-- 1. Eliminar tablas en orden de dependencias
DROP TABLE IF EXISTS public.movimientos CASCADE;
DROP TABLE IF EXISTS public.eventos_pago CASCADE;
DROP TABLE IF EXISTS public.historial_cajas CASCADE;
DROP TABLE IF EXISTS public.jornadas CASCADE;

-- 2. TABLA: jornadas
CREATE TABLE public.jornadas (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saldo_inicial NUMERIC(12, 2) NOT NULL CHECK (saldo_inicial >= 0),
  estado TEXT NOT NULL CHECK (estado IN ('ABIERTA', 'CERRADA')),
  fecha_hora_apertura TIMESTAMPTZ NOT NULL,
  fecha_hora_cierre TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA: movimientos (solo INGRESO y EGRESO, sin RETIRO)
CREATE TABLE public.movimientos (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jornada_id TEXT NOT NULL REFERENCES public.jornadas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('INGRESO', 'EGRESO')),
  origen TEXT NOT NULL CHECK (origen IN ('MANUAL', 'AUTOMATICO')),
  monto NUMERIC(12, 2) NOT NULL CHECK (monto >= 0),
  concepto TEXT NOT NULL,
  categoria TEXT,
  metodo_pago TEXT,
  descripcion TEXT,
  fecha_hora_origen TIMESTAMPTZ NOT NULL,
  hora_legible TEXT,
  fecha_legible TEXT,
  referencia_evento_pago TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA: eventos_pago
CREATE TABLE public.eventos_pago (
  id_operacion TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jornada_id TEXT NOT NULL REFERENCES public.jornadas(id) ON DELETE CASCADE,
  monto NUMERIC(12, 2) NOT NULL CHECK (monto >= 0),
  concepto TEXT NOT NULL,
  origen_referencia TEXT NOT NULL,
  tipo_evento TEXT NOT NULL CHECK (tipo_evento IN ('PAGO_RECIBIDO', 'PAGO_REALIZADO')),
  estado TEXT NOT NULL CHECK (estado IN ('PENDIENTE', 'CONFIRMADO', 'CANCELADO')),
  fecha_hora_evento TIMESTAMPTZ NOT NULL,
  fecha_hora_procesamiento TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLA: historial_cajas
CREATE TABLE public.historial_cajas (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha TEXT NOT NULL,
  hora_apertura TEXT NOT NULL,
  hora_cierre TEXT NOT NULL,
  saldo_inicial NUMERIC(12, 2) NOT NULL,
  ingresos NUMERIC(12, 2) NOT NULL,
  gastos NUMERIC(12, 2) NOT NULL,
  retiros NUMERIC(12, 2) NOT NULL DEFAULT 0,
  saldo_esperado NUMERIC(12, 2) NOT NULL,
  saldo_real NUMERIC(12, 2) NOT NULL,
  diferencia NUMERIC(12, 2) NOT NULL,
  movimientos_json JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Índices de rendimiento
CREATE INDEX idx_jornadas_user_id ON public.jornadas(user_id);
CREATE INDEX idx_jornadas_user_estado ON public.jornadas(user_id, estado);
CREATE INDEX idx_movimientos_user_id ON public.movimientos(user_id);
CREATE INDEX idx_movimientos_jornada_id ON public.movimientos(jornada_id);
CREATE INDEX idx_eventos_pago_user_id ON public.eventos_pago(user_id);
CREATE INDEX idx_eventos_pago_jornada_estado ON public.eventos_pago(jornada_id, estado);
CREATE INDEX idx_historial_cajas_user_id ON public.historial_cajas(user_id);
CREATE INDEX idx_historial_cajas_fecha ON public.historial_cajas(user_id, id DESC);

-- 7. Triggers para updated_at automático
DROP TRIGGER IF EXISTS trigger_jornadas_updated_at ON public.jornadas;
CREATE TRIGGER trigger_jornadas_updated_at
BEFORE UPDATE ON public.jornadas
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_movimientos_updated_at ON public.movimientos;
CREATE TRIGGER trigger_movimientos_updated_at
BEFORE UPDATE ON public.movimientos
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_eventos_pago_updated_at ON public.eventos_pago;
CREATE TRIGGER trigger_eventos_pago_updated_at
BEFORE UPDATE ON public.eventos_pago
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_historial_cajas_updated_at ON public.historial_cajas;
CREATE TRIGGER trigger_historial_cajas_updated_at
BEFORE UPDATE ON public.historial_cajas
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Activar RLS
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_cajas ENABLE ROW LEVEL SECURITY;

-- 9. Políticas RLS
CREATE POLICY "jornadas_all_own" ON public.jornadas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "movimientos_all_own" ON public.movimientos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "eventos_pago_all_own" ON public.eventos_pago FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "historial_cajas_all_own" ON public.historial_cajas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 10. Privilegios completos para roles de PostgREST
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.jornadas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.movimientos TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.eventos_pago TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.historial_cajas TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
