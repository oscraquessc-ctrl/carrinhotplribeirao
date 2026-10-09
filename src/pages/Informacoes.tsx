import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, User, Crown, Phone, Monitor, Navigation, ChevronRight, ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { locais, enderecoMapa, formatarTelefone } from "@/lib/locais";

const Informacoes = () => {
  const [selectedId, setSelectedId] = useState<string>(locais[0].id);
  const selected = locais.find(local => local.id === selectedId) ?? locais[0];
  const query = encodeURIComponent(enderecoMapa(selected.endereco));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="shrink-0" aria-label="Voltar ao início">
              <Link to="/">
              <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <span className="text-sm font-semibold text-foreground">Carrinho TPL <span className="hidden sm:inline text-muted-foreground">/ Ribeirão da Ilha</span></span>
          </div>
          <MapPin className="h-5 w-5 shrink-0 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-8 pt-7 sm:px-6 sm:pt-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-primary">Florianópolis · Santa Catarina</p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Nossos locais</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">Carrinhos e display · Congregação Ribeirão da Ilha</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>3 pontos de testemunho público</span>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0" aria-label="Mapa e endereço do local selecionado">
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <iframe
                key={selected.id}
                title={`Mapa: ${selected.nome}`}
                src={`https://maps.google.com/maps?q=${query}&z=16&output=embed`}
                className="h-[310px] w-full border-0 sm:h-[420px]"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border py-5">
              <div className="min-w-0 flex-1 basis-60" aria-live="polite">
                <p className="mb-1 text-xs font-semibold text-primary">{selected.tipo} · {selected.bairro}</p>
                <h2 className="text-xl font-semibold leading-snug">{selected.nome}</h2>
                <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />{selected.endereco}
                </p>
              </div>
              <Button asChild className="h-11">
                <a href={directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation />Como chegar</a>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Responsável pelo local</p>
                  <p className="text-sm font-semibold">{selected.responsavel}</p>
                </div>
              </div>
              <Button asChild variant="secondary" className="h-11">
                <a href={`tel:${selected.telefone}`}><Phone />{formatarTelefone(selected.telefone)}</a>
              </Button>
            </div>
            <Button asChild variant="link" className="h-auto px-0 py-2 text-xs text-muted-foreground">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Abrir no Google Maps<ExternalLink className="h-3 w-3" /></a>
            </Button>
          </section>

          <aside aria-label="Locais e responsáveis" className="min-w-0">
            <h2 className="mb-3 text-sm font-semibold">Locais <span className="ml-1 text-muted-foreground">(3)</span></h2>
            <div className="grid gap-3">
              {locais.map((local, index) => {
                const Icon = local.tipo === "Display" ? Monitor : ShoppingCart;
                const active = selected.id === local.id;
                return (
                  <Button
                    key={local.id}
                    variant="outline"
                    aria-pressed={active}
                    onClick={() => setSelectedId(local.id)}
                    className={cn("h-auto w-full justify-start gap-3 whitespace-normal rounded-lg p-4 text-left hover:bg-primary/5 hover:text-foreground", active && "border-primary bg-primary/5 ring-1 ring-primary/20")}
                  >
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground", active && "bg-primary text-primary-foreground")}><Icon /></span>
                    <span className="min-w-0 flex-1">
                      <span className="mb-1 block text-xs font-normal text-muted-foreground">0{index + 1} / {local.tipo}</span>
                      <span className="block text-sm font-semibold leading-snug">{local.nome}</span>
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">{local.bairro}</span>
                    </span>
                    <ChevronRight className={cn("shrink-0 text-muted-foreground", active && "text-primary")} />
                  </Button>
                );
              })}
            </div>
            <div className="mt-6 border-t border-border pt-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Crown className="h-4 w-4 text-accent" />Responsável geral</div>
              <p className="text-base font-semibold">Yuri Serrão</p>
              <Button asChild variant="link" className="mt-1 h-10 px-0">
                <a href="tel:48988425163"><Phone />{formatarTelefone("48988425163")}</a>
              </Button>
            </div>
          </aside>
        </div>
        <footer className="mt-7 border-t border-border pt-5 text-xs text-muted-foreground">TPL · Congregação Ribeirão da Ilha</footer>
      </main>
    </div>
  );
};

export default Informacoes;
