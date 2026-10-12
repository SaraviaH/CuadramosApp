const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gxqwqcmcvmrrluufrlou.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h5ZtBX1yjLfXRK7lMjnywA_P1Mp6Spy';

const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runVerification() {
  console.log('--- INICIANDO VERIFICACIÓN DE PERSISTENCIA REAL EN SUPABASE ---');

  // 1. Iniciar sesión con usuario real
  const email = 'test_user_1791819280459@cuadramos.com';
  const password = 'Password123!';

  console.log('1. Autenticando usuario:', email);
  const loginRes = await client.auth.signInWithPassword({ email, password });
  if (loginRes.error) {
    console.error('❌ Error de autenticación:', loginRes.error.message);
    return;
  }
  const user = loginRes.data.user;
  console.log('✅ Usuario autenticado en Supabase Auth! UUID:', user.id);

  // 2. Insertar jornada de prueba
  const testJornadaId = 'jor_test_' + Date.now();
  console.log('2. Insertando jornada de prueba en public.jornadas...');
  const jornadaRes = await client.from('jornadas').upsert({
    id: testJornadaId,
    user_id: user.id,
    saldo_inicial: 100.0,
    estado: 'ABIERTA',
    fecha_hora_apertura: new Date().toISOString(),
    fecha_hora_cierre: null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (jornadaRes.error) {
    console.error('❌ Error al guardar jornada:', jornadaRes.error.code, jornadaRes.error.message);
    if (jornadaRes.error.code === '42501') {
      console.log('💡 CAUSA: Falta ejecutar supabase/fix_permissions.sql en el SQL Editor de Supabase.');
    }
    return;
  }
  console.log('✅ Jornada guardada en public.jornadas con ID:', testJornadaId);

  // 3. Insertar movimiento de venta de prueba
  const testMovId = 'mov_test_' + Date.now();
  console.log('3. Insertando movimiento de venta en public.movimientos...');
  const movRes = await client.from('movimientos').upsert({
    id: testMovId,
    user_id: user.id,
    jornada_id: testJornadaId,
    tipo: 'INGRESO',
    origen: 'MANUAL',
    monto: 35.5,
    concepto: 'Venta de abarrotes (Prueba Real)',
    categoria: 'Venta del día',
    metodo_pago: 'Efectivo',
    descripcion: 'Prueba de integración end-to-end',
    fecha_hora_origen: new Date().toISOString(),
    hora_legible: '10:45 a. m.',
    fecha_legible: '12 OCT 2026',
    referencia_evento_pago: null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (movRes.error) {
    console.error('❌ Error al guardar movimiento:', movRes.error.code, movRes.error.message);
    return;
  }
  console.log('✅ Movimiento guardado en public.movimientos con ID:', testMovId);

  // 4. Consultar movimientos desde Supabase
  console.log('4. Consultando SELECT * FROM public.movimientos WHERE user_id = ...');
  const { data: rows, error: selectErr } = await client
    .from('movimientos')
    .select('*')
    .eq('user_id', user.id);

  if (selectErr) {
    console.error('❌ Error en SELECT:', selectErr.message);
    return;
  }

  console.log('✅ Filas recuperadas desde Supabase:', rows.length);
  const found = rows.find(r => r.id === testMovId);
  if (found) {
    console.log('🎉 VERIFICACIÓN EXITOSA:');
    console.log('   ID:', found.id);
    console.log('   Concepto:', found.concepto);
    console.log('   Monto: S/', found.monto);
    console.log('   User ID (UUID):', found.user_id);
  } else {
    console.log('⚠️ Movimiento no encontrado en el resultado.');
  }
}

runVerification().catch(console.error);
