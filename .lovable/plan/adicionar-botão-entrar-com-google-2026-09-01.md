# Adicionar botão "Entrar com Google"

## O que será feito

1. **Botão de login com Google** na página de autenticação (`src/pages/Auth.tsx`):
   - Botão "Entrar com Google" com o ícone oficial do Google, abaixo do formulário de e-mail/senha, separado por um divisor "ou".
   - Ao clicar, chama `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })` — abre o popup do Google e, ao concluir, a sessão entra automaticamente (o `useAuth` já reage via `onAuthStateChange` e redireciona para a agenda).

2. **Ativar o provedor Google no backend** (Lovable Cloud):
   - Configurar o Google como método de login usando as credenciais gerenciadas — sem necessidade de criar chaves no Google Cloud.
   - Sem isso o botão falharia com "Unsupported provider", então é feito na mesma etapa.

3. **Verificação**:
   - Checar build sem erros e confirmar que o botão aparece na tela de login.

## Detalhes técnicos

- O trigger `handle_new_user` já cria o perfil automaticamente para usuários que entrarem pelo Google (usa o nome vindo da conta Google).
- O primeiro admin (`yurimarceloserrao@gmail.com`) continuará admin ao entrar via Google, pois a role está ligada ao e-mail/usuário existente.
- Nenhuma outra tela muda; cadastro com e-mail/senha continua disponível.
