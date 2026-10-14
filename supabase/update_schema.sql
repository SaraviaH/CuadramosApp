-- ==============================================================================
-- CUADRAMOSAPP: ACTUALIZACIÓN / MIGRACIÓN DE ESQUEMA EN SUPABASE
-- ==============================================================================
-- Ejecuta este script en el SQL Editor del panel de Supabase para actualizar
-- tu base de datos existente con la versión que elimina RETIRO y homologa
-- las restricciones con la versión actual de CuadramosApp.

-- 1. Actualizar la restricción de tipo en movimientos (elimina RETIRO)
ALTER TABLE public.movimientos DROP CONSTRAINT IF EXISTS movimientos_tipo_check;
ALTER TABLE public.movimientos ADD CONSTRAINT movimientos_tipo_check CHECK (tipo IN ('INGRESO', 'EGRESO'));

-- 2. Asegurar que 'retiros' en historial_cajas tenga valor por defecto 0
ALTER TABLE public.historial_cajas ALTER COLUMN retiros SET DEFAULT 0;

-- 3. Asegurar permisos de acceso a todos los roles para sincronización
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

-- 4. Notificación de éxito
DO $$
BEGIN
  RAISE NOTICE '✅ Esquema de Supabase actualizado correctamente: RETIRO retirado y permisos concedidos.';
END $$;
