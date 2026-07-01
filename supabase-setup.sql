-- =============================================
-- SETUP SUPABASE - Ejecuta esto en SQL Editor
-- =============================================

-- 1. Tabla de perfiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de cotizaciones
CREATE TABLE IF NOT EXISTS quotations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- 4. Políticas profiles
CREATE POLICY "Ver perfil propio" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Actualizar perfil propio" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Crear perfil propio" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Políticas quotations
CREATE POLICY "Ver cotizaciones propias" ON quotations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Crear cotizaciones" ON quotations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Actualizar cotizaciones propias" ON quotations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Eliminar cotizaciones propias" ON quotations FOR DELETE USING (auth.uid() = user_id);

-- 6. Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
