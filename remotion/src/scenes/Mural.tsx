import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { colors } from "../theme";

const features = [
  { icon: "📅", title: "Agenda", desc: "Veja todos os horários da semana" },
  { icon: "✋", title: "Disponibilizar-se", desc: "Ofereça-se para uma dupla" },
  { icon: "📢", title: "Mural de Avisos", desc: "Notícias e mensagens em tempo real" },
  { icon: "👤", title: "Perfil", desc: "Atualize seus dados e foto" },
];

export const Mural = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: colors.bg, padding: "70px 100px" }}>
      <div style={{
        textAlign: "center", marginBottom: 50,
        opacity: head, transform: `translateY(${interpolate(head,[0,1],[-20,0])}px)`,
      }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: colors.text, letterSpacing: -1.5 }}>
          Tudo num só lugar
        </div>
        <div style={{ fontSize: 24, color: colors.muted, marginTop: 10 }}>
          Organize a designação dos carrinhos com facilidade
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {features.map((f, i) => {
          const s = spring({ frame: frame - (15 + i * 12), fps, config: { damping: 18 } });
          return (
            <div key={i} style={{
              background: "white", borderRadius: 22, padding: 36,
              border: `1px solid ${colors.border}`,
              boxShadow: "0 14px 40px rgba(20,40,60,0.07)",
              display: "flex", alignItems: "center", gap: 24,
              opacity: s, transform: `translateY(${interpolate(s,[0,1],[40,0])}px) scale(${0.95 + s*0.05})`,
            }}>
              <div style={{
                width: 88, height: 88, borderRadius: 22, fontSize: 44,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 10px 24px ${colors.primary}44`,
              }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: colors.text }}>{f.title}</div>
                <div style={{ fontSize: 20, color: colors.muted, marginTop: 4 }}>{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
