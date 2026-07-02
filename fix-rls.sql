-- PASO 1: Eliminar políticas viejas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IFACES "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- PASO 2: Crear políticas nuevas
-- Cualquiera puede ver su propio perfil
CREATE POLICY "select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Los admin pueden ver todos los perfiles
CREATE POLICY "select_admin_all" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cualquiera puede insertar su propio perfil
CREATE POLICY "insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Cualquiera puede actualizar su propio perfil
CREATE POLICY "update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- PASO 3: Actualizar emails faltantes
UPDATE profiles SET email = 'rzbrnl@gmail.com'
WHERE full_name = 'rzbrnl' AND email IS NULL;

-- PASO 4: Asegurar que el admin tenga el rol correcto
UPDATE profiles SET role = 'admin'
WHERE email = 'hi@josue.work';
