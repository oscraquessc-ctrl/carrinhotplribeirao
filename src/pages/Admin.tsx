import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Wrench, CalendarDays, Megaphone, Trash2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const emailSchema = z.string().trim().email("Email inválido").max(255);

type Equipamento = {
  id: string; nome: string; tipo: string; local: string;
  status: string; observacao: string | null;
};

const STATUS_OPTIONS = [
  { value: "disponivel", label: "Disponível" },
  { value: "manutencao", label: "Em manutenção" },
  { value: "indisponivel", label: "Indisponível" },
];

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [obsDraft, setObsDraft] = useState<Record<string, string>>({});

  const { data: equipamentos = [] } = useQuery({
    queryKey: ["equipamentos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("equipamentos").select("*").order("nome");
      if (error) throw error;
      return data as Equipamento[];
    },
    enabled: isAdmin,
  });

  const { data: agendamentos = [] } = useQuery({
    queryKey: ["agendamentos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agendamentos").select("*").order("data", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
    enabled: isAdmin,
  });

  const { data: avisos = [] } = useQuery({
    queryKey: ["avisos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("avisos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: isAdmin,
  });

  const updateEquip = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Equipamento> }) => {
      const { error } = await supabase.from("equipamentos").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipamentos"] });
      toast.success("Equipamento atualizado!");
    },
    onError: () => toast.error("Erro ao atualizar equipamento."),
  });

  const deleteAgendamento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("agendamentos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
      toast.success("Agendamento removido!");
    },
    onError: () => toast.error("Erro ao remover agendamento."),
  });

  const deleteAviso = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("avisos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avisos"] });
      toast.success("Aviso removido!");
    },
    onError: () => toast.error("Erro ao remover aviso."),
  });

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Email inválido");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("assign-admin-role", {
        body: { email: parsed.data },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Usuário ${parsed.data} agora é admin!`);
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message || "Erro ao atribuir role de admin.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">Painel Admin</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Equipamentos */}
        <Card className="border border-primary/15 shadow-md">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-primary text-base">
              <Wrench className="h-5 w-5" />Equipamentos (Carrinhos e Display)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {equipamentos.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum equipamento cadastrado.</p>
            )}
            {equipamentos.map(eq => (
              <div key={eq.id} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{eq.nome}</p>
                    <p className="text-xs text-muted-foreground">{eq.local} · {eq.tipo}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {STATUS_OPTIONS.map(opt => (
                    <Button
                      key={opt.value}
                      size="sm"
                      variant={eq.status === opt.value ? "default" : "outline"}
                      className={cn("text-xs h-8", eq.status === opt.value && opt.value !== "disponivel" && "bg-destructive hover:bg-destructive/90")}
                      onClick={() => updateEquip.mutate({ id: eq.id, patch: { status: opt.value } })}
                      disabled={updateEquip.isPending}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    className="h-9 text-sm"
                    placeholder="Observação (ex: roda quebrada)"
                    value={obsDraft[eq.id] ?? eq.observacao ?? ""}
                    onChange={e => setObsDraft(d => ({ ...d, [eq.id]: e.target.value }))}
                    maxLength={200}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9"
                    onClick={() => updateEquip.mutate({ id: eq.id, patch: { observacao: (obsDraft[eq.id] ?? eq.observacao ?? "") || null } })}
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Agendamentos */}
        <Card className="border border-primary/15 shadow-md">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-primary text-base">
              <CalendarDays className="h-5 w-5" />Moderar Agendamentos ({agendamentos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-2 max-h-96 overflow-y-auto">
            {agendamentos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum agendamento.</p>}
            {agendamentos.map(a => (
              <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg bg-secondary p-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {a.nome}{a.sem_dupla ? " (sem dupla)" : a.nome_dupla ? ` + ${a.nome_dupla}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.local} · {a.horario} · {a.data ? format(new Date(a.data + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR }) : "sem data"}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10" onClick={() => deleteAgendamento.mutate(a.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Avisos */}
        <Card className="border border-primary/15 shadow-md">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-primary text-base">
              <Megaphone className="h-5 w-5" />Moderar Avisos ({avisos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-2 max-h-80 overflow-y-auto">
            {avisos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum aviso.</p>}
            {avisos.map(av => (
              <div key={av.id} className="flex items-start justify-between gap-2 rounded-lg bg-secondary p-2.5">
                <div className="min-w-0">
                  <p className="text-sm text-foreground line-clamp-2">{av.mensagem || "(mídia)"}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(av.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10" onClick={() => deleteAviso.mutate(av.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Admin por email */}
        <Card className="border border-primary/15 shadow-md">
          <CardHeader className="bg-primary/5 rounded-t-lg pb-3">
            <CardTitle className="flex items-center gap-2 text-primary text-base">
              <ShieldCheck className="h-5 w-5" />Atribuir Admin por Email
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleAssignAdmin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="adminEmail" className="font-semibold text-sm">Email do usuário</Label>
                <Input id="adminEmail" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="usuario@email.com" maxLength={255} required className="h-10" />
                <p className="text-xs text-muted-foreground">O usuário precisa já ter uma conta cadastrada.</p>
              </div>
              <Button type="submit" className="w-full font-semibold h-11" disabled={submitting}>
                {submitting ? "Atribuindo..." : "Tornar Admin"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
