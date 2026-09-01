CREATE TABLE IF NOT EXISTS public.equipamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('carrinho','display')),
  local text NOT NULL,
  status text NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel','manutencao','indisponivel')),
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.equipamentos TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.equipamentos TO authenticated;
GRANT ALL ON public.equipamentos TO service_role;

ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view equipamentos" ON public.equipamentos
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert equipamentos" ON public.equipamentos
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update equipamentos" ON public.equipamentos
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete equipamentos" ON public.equipamentos
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.equipamentos (nome, tipo, local)
SELECT * FROM (VALUES
  ('Carrinho das Areias', 'carrinho', 'Areias'),
  ('Carrinho do Ribeirão da Ilha', 'carrinho', 'Ribeirão'),
  ('Display Trevo do Erasmo', 'display', 'Trevo do Erasmo')
) AS v(nome, tipo, local)
WHERE NOT EXISTS (SELECT 1 FROM public.equipamentos);

-- Admin pode alterar qualquer agendamento
DROP POLICY IF EXISTS "Admin can update any agendamento" ON public.agendamentos;
CREATE POLICY "Admin can update any agendamento" ON public.agendamentos
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin pode editar avisos
DROP POLICY IF EXISTS "Admins can update avisos" ON public.avisos;
CREATE POLICY "Admins can update avisos" ON public.avisos
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
