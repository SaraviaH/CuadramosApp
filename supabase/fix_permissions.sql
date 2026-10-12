-- ==============================================================================
-- CUADRAMOSAPP: PRIVILEGIOS DE POSTGRESQL PARA POSTGREST (SUPABASE)
-- ==============================================================================
-- Ejecuta este script en el SQL Editor de Supabase si recibes el error 42501:
-- "permission denied for table movimientos" o "permission denied for table perfiles"

-- 1. Permitir uso del esquema public a todos los roles de Supabase
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Otorgar permisos completos sobre las tablas de CuadramosApp
GRANT ALL ON TABLE public.perfiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.jornadas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.movimientos TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.eventos_pago TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.historial_cajas TO anon, authenticated, service_role;

-- 3. Otorgar permisos sobre secuencias y funciones
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 4. Establecer privilegios por defecto para cualquier tabla futura
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
