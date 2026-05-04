import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { colors } from "../theme";

type Item = { dia: string; hora: string; nome: string; dupla?: string; local: string; sem?: boolean };

const ITEMS: Item[] = [
  { dia: "Segunda", hora: "08:00", nome: "Maria Souza", dupla: "Ana Lima", local: "Carrinho" },
  { dia: "Terça", hora: "14:30", nome: "Pedro Alves", sem: true, local: "Areias" },
  { dia: "Quarta", hora: "09:00", nome: "Lucas Pereira", dupla: "Tiago Ramos", local: "Ribeirão" },
  { dia: "Quinta", hora: "16:00", nome: "Beatriz Silva", dupla: "Clara Mota", local: "Display" },
  { dia: "Sexta", hora: "10:00", nome: "Paulo Reis", dupla: "Marcos Dias", local: "Carrinho" },
];

const localColor = (l: string) => ({
  Carrinho: colors.primary, Areias: colors.accent, "Ribeirão": "#5C7184", Display: colors.primaryLight,
}[l] || colors.primary);

export const Agenda = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headS = spring({ frame, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: colors.bg, padding: "60px 80px" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30,
        opacity: headS, transform: `translateY(${interpolate(headS, [0,1], [-20, 0])}px)`,
      }}>
        <div>
          <div style={{ fontSize: 56, fontWeight: 800, color: colors.text, letterSpacing: -1 }}>Agenda</div>
          <div style={{ fontSize: 22, color: colors.muted, marginTop: 4 }}>Carrinhos da semana</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {["Todos", "Carrinho", "Areias"].map((t, i) => (
            <div key={t} style={{
              padding: "12px 22px", borderRadius: 999, fontSize: 18, fontWeight: 600,
              background: i === 0 ? colors.primary : "white", color: i === 0 ? "white" : colors.text,
              border: `1px solid ${colors.border}`,
            }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {ITEMS.map((it, i) => {
          const delay = 12 + i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 18 } });
          const lc = localColor(it.local);
          return (
            <div key={i} style={{
              background: "white", borderRadius: 18, padding: 28,
              border: `1px solid ${colors.border}`,
              borderLeft: it.sem ? `5px solid ${colors.orange}` : `1px solid ${colors.border}`,
              boxShadow: "0 10px 30px rgba(20,40,60,0.06)",
              opacity: s, transform: `translateX(${interpolate(s,[0,1],[40,0])}px)`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 18, color: colors.muted, fontWeight: 600 }}>{it.dia}</div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: colors.text }}>{it.hora}</div>
                </div>
                <div style={{
                  padding: "8px 16px", borderRadius: 999, fontSize: 16, fontWeight: 700,
                  background: `${lc}1A`, color: lc, border: `1px solid ${lc}55`,
                }}>{it.local}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: colors.text, marginBottom: 6 }}>{it.nome}</div>
              {it.sem ? (
                <div style={{ color: colors.orange, fontWeight: 600, fontSize: 18 }}>⚠ Sem dupla</div>
              ) : (
                <div style={{ color: colors.muted, fontSize: 18 }}>com {it.dupla}</div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
