
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON public.agendamentos (data ASC);
CREATE INDEX IF NOT EXISTS idx_agendamentos_user_id ON public.agendamentos (user_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_local ON public.agendamentos (local);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_local ON public.agendamentos (data, local);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_agendamento_id ON public.disponibilidade (agendamento_id);
CREATE INDEX IF NOT EXISTS idx_disponibilidade_user_id ON public.disponibilidade (user_id);
CREATE INDEX IF NOT EXISTS idx_avisos_created_at ON public.avisos (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_avisos_user_id ON public.avisos (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);
