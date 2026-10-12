-- ==============================================================================
-- CUADRAMOSAPP: ESQUEMA POSTGRESQL PARA SUPABASE CON ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. TABLA: perfiles (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  business_name TEXT NOT NULL DEFAULT 'Mi negocio',
  email TEXT,
  avatar_uri TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TABLA: jornadas
CREATE TABLE IF NOT EXISTS public.jornadas (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saldo_inicial NUMERIC(12, 2) NOT NULL CHECK (saldo_inicial >= 0),
  estado TEXT NOT NULL CHECK (estado IN ('ABIERTA', 'CERRADA')),
  fecha_hora_apertura TIMESTAMPTZ NOT NULL,
  fecha_hora_cierre TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA: movimientos
CREATE TABLE IF NOT EXISTS public.movimientos (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  jornada_id TEXT NOT NULL REFERENCES public.jornadas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('INGRESO', 'EGRESO', 'RETIRO')),
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
CREATE TABLE IF NOT EXISTS public.eventos_pago (
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
CREATE TABLE IF NOT EXISTS public.historial_cajas (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fecha TEXT NOT NULL,
  hora_apertura TEXT NOT NULL,
  hora_cierre TEXT NOT NULL,
  saldo_inicial NUMERIC(12, 2) NOT NULL,
  ingresos NUMERIC(12, 2) NOT NULL,
  gastos NUMERIC(12, 2) NOT NULL,
  retiros NUMERIC(12, 2) NOT NULL,
  saldo_esperado NUMERIC(12, 2) NOT NULL,
  saldo_real NUMERIC(12, 2) NOT NULL,
  diferencia NUMERIC(12, 2) NOT NULL,
  movimientos_json JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ÍNDICES PARA RENDIMIENTO
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_jornadas_user_id ON public.jornadas(user_id);
CREATE INDEX IF NOT EXISTS idx_jornadas_user_estado ON public.jornadas(user_id, estado);
CREATE INDEX IF NOT EXISTS idx_movimientos_user_id ON public.movimientos(user_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_jornada_id ON public.movimientos(jornada_id);
CREATE INDEX IF NOT EXISTS idx_eventos_pago_user_id ON public.eventos_pago(user_id);
CREATE INDEX IF NOT EXISTS idx_eventos_pago_jornada_estado ON public.eventos_pago(jornada_id, estado);
CREATE INDEX IF NOT EXISTS idx_historial_cajas_user_id ON public.historial_cajas(user_id);
CREATE INDEX IF NOT EXISTS idx_historial_cajas_fecha ON public.historial_cajas(user_id, id DESC);

-- ==============================================================================
-- TRIGGER PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_perfiles_updated_at ON public.perfiles;
CREATE TRIGGER trigger_perfiles_updated_at
BEFORE UPDATE ON public.perfiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

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

-- ==============================================================================
-- TRIGGER PARA CREAR PERFIL AUTOMÁTICAMENTE AL REGISTRARSE EN auth.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, name, business_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Nuevo Emprendedor'),
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi negocio'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = CASE WHEN public.perfiles.name = '' THEN EXCLUDED.name ELSE public.perfiles.name END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ACTIVACIÓN DE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historial_cajas ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- POLÍTICAS RLS: perfiles
-- ==============================================================================
DROP POLICY IF EXISTS "perfiles_select_own" ON public.perfiles;
CREATE POLICY "perfiles_select_own" ON public.perfiles
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "perfiles_insert_own" ON public.perfiles;
CREATE POLICY "perfiles_insert_own" ON public.perfiles
FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "perfiles_update_own" ON public.perfiles;
CREATE POLICY "perfiles_update_own" ON public.perfiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ==============================================================================
-- POLÍTICAS RLS: jornadas
-- ==============================================================================
DROP POLICY IF EXISTS "jornadas_select_own" ON public.jornadas;
CREATE POLICY "jornadas_select_own" ON public.jornadas
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "jornadas_insert_own" ON public.jornadas;
CREATE POLICY "jornadas_insert_own" ON public.jornadas
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "jornadas_update_own" ON public.jornadas;
CREATE POLICY "jornadas_update_own" ON public.jornadas
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "jornadas_delete_own" ON public.jornadas;
CREATE POLICY "jornadas_delete_own" ON public.jornadas
FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- POLÍTICAS RLS: movimientos
-- ==============================================================================
DROP POLICY IF EXISTS "movimientos_select_own" ON public.movimientos;
CREATE POLICY "movimientos_select_own" ON public.movimientos
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "movimientos_insert_own" ON public.movimientos;
CREATE POLICY "movimientos_insert_own" ON public.movimientos
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "movimientos_update_own" ON public.movimientos;
CREATE POLICY "movimientos_update_own" ON public.movimientos
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "movimientos_delete_own" ON public.movimientos;
CREATE POLICY "movimientos_delete_own" ON public.movimientos
FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- POLÍTICAS RLS: eventos_pago
-- ==============================================================================
DROP POLICY IF EXISTS "eventos_pago_select_own" ON public.eventos_pago;
CREATE POLICY "eventos_pago_select_own" ON public.eventos_pago
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "eventos_pago_insert_own" ON public.eventos_pago;
CREATE POLICY "eventos_pago_insert_own" ON public.eventos_pago
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "eventos_pago_update_own" ON public.eventos_pago;
CREATE POLICY "eventos_pago_update_own" ON public.eventos_pago
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "eventos_pago_delete_own" ON public.eventos_pago;
CREATE POLICY "eventos_pago_delete_own" ON public.eventos_pago
FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- POLÍTICAS RLS: historial_cajas
-- ==============================================================================
DROP POLICY IF EXISTS "historial_cajas_select_own" ON public.historial_cajas;
CREATE POLICY "historial_cajas_select_own" ON public.historial_cajas
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "historial_cajas_insert_own" ON public.historial_cajas;
CREATE POLICY "historial_cajas_insert_own" ON public.historial_cajas
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "historial_cajas_update_own" ON public.historial_cajas;
CREATE POLICY "historial_cajas_update_own" ON public.historial_cajas
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "historial_cajas_delete_own" ON public.historial_cajas;
CREATE POLICY "historial_cajas_delete_own" ON public.historial_cajas
FOR DELETE USING (auth.uid() = user_id);

-- ==============================================================================
-- PRIVILEGIOS DE POSTGRESQL PARA POSTGREST (SUPABASE)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON TABLE public.perfiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.jornadas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.movimientos TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.eventos_pago TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.historial_cajas TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

