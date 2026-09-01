import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable";
import coverImage from "@/assets/cover.webp";

const Auth = () => {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user && !loading) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        setMode("login");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
      } else {
        if (password.length < 8) {
          toast.error("A senha deve ter pelo menos 8 caracteres");
          setSubmitting(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { nome: nome.trim() },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao autenticar");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.redirected) return;
      if (result.error) throw result.error;
    } catch (err: any) {
      toast.error(err.message || "Erro ao entrar com Google");
      setSubmitting(false);
    }
  };

  const titles = {
    login: { title: "Bem-vindo!", desc: "Faça login para acessar a agenda dos carrinhos" },
    signup: { title: "Criar Conta", desc: "Cadastre-se para participar da agenda" },
    forgot: { title: "Recuperar Senha", desc: "Enviaremos um link para redefinir sua senha" },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-xs mb-6 rounded-2xl overflow-hidden shadow-lg border border-primary/15 animate-fade-in">
        <img src={coverImage} alt="Carrinho TPL Ribeirão" className="w-full h-auto" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <Card className="border border-primary/15 shadow-lg overflow-hidden">
          <CardHeader className="bg-primary/5 text-center pb-3">
            <CardTitle className="text-xl text-primary">
              {titles[mode].title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {titles[mode].desc}
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5 pb-1">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="h-10"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="h-10"
                />
              </div>

              {mode !== "forgot" && (
                <div className="space-y-1.5 pb-1">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                    className="h-10"
                  />
                  {mode === "signup" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      A senha deve ter pelo menos 8 caracteres.
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full font-semibold text-base h-11" disabled={submitting}>
                {submitting
                  ? "Aguarde..."
                  : mode === "login"
                  ? "Entrar"
                  : mode === "signup"
                  ? "Confirmar"
                  : "Enviar Link de Recuperação"}
              </Button>
            </form>

            {mode !== "forgot" && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">ou</span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full font-semibold h-11 gap-2"
                  onClick={handleGoogle}
                  disabled={submitting}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.09 3.58-5.16 3.58-8.81z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.86-3c-1.07.72-2.44 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.97H1.29v3.1A12 12 0 0 0 12 24z"/>
                    <path fill="#FBBC05" d="M5.25 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.29a12 12 0 0 0 0 10.74l3.96-3.1z"/>
                    <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.63l3.96 3.1c.95-2.85 3.61-4.96 6.75-4.96z"/>
                  </svg>
                  Entrar com Google
                </Button>
              </>
            )}

            <div className="mt-5 text-center space-y-3">
              {mode === "login" && (
                <>
                  <button
                    type="button"
                    className="block w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setMode("forgot")}
                  >
                    Esqueceu a senha?
                  </button>
                  <div className="border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground mb-2">Ainda não tem conta?</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full font-semibold"
                      onClick={() => setMode("signup")}
                    >
                      Criar Conta
                    </Button>
                  </div>
                </>
              )}
              {mode === "signup" && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setMode("login")}
                >
                  Já tem conta? Entrar
                </button>
              )}
              {mode === "forgot" && (
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => setMode("login")}
                >
                  Voltar ao login
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center animate-fade-in">
        Congregação Ribeirão da Ilha
      </p>
    </div>
  );
};

export default Auth;
