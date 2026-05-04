import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { colors } from "../theme";

export const Criar = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18 } });

  const fields = [
    { label: "Local", value: "Carrinho", delay: 10 },
    { label: "Dia", value: "Quarta-feira", delay: 22 },
    { label: "Horário", value: "09:00", delay: 34 },
    { label: "Dupla", value: "Tiago Ramos", delay: 46 },
  ];

  const checkS = spring({ frame: frame - 70, fps, config: { damping: 14 } });
  const btnS = spring({ frame: frame - 95, fps, config: { damping: 12 } });
  const toastS = spring({ frame: frame - 130, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: colors.bg, alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{
        width: 760, background: "white", borderRadius: 24, padding: 48,
        boxShadow: "0 30px 80px rgba(20,40,60,0.12)", border: `1px solid ${colors.border}`,
        opacity: s, transform: `translateY(${interpolate(s,[0,1],[40,0])}px)`,
      }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: colors.primary, marginBottom: 6 }}>Novo agendamento</div>
        <div style={{ fontSize: 20, color: colors.muted, marginBottom: 32 }}>Reserve seu horário no carrinho</div>

        {fields.map((f) => {
          const fs = spring({ frame: frame - f.delay, fps, config: { damping: 18 } });
          return (
            <div key={f.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 22px", borderRadius: 12, border: `2px solid ${colors.border}`,
              marginBottom: 14, background: "white",
              opacity: fs, transform: `translateX(${interpolate(fs,[0,1],[-30,0])}px)`,
            }}>
              <span style={{ fontSize: 20, color: colors.muted, fontWeight: 600 }}>{f.label}</span>
              <span style={{ fontSize: 22, color: colors.text, fontWeight: 700 }}>{f.value}</span>
            </div>
          );
        })}

        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginTop: 12, marginBottom: 24,
          opacity: checkS,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: colors.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 20,
          }}>✓</div>
          <span style={{ fontSize: 20, color: colors.text, fontWeight: 600 }}>Repetir toda semana</span>
        </div>

        <div style={{
          height: 68, borderRadius: 14, background: colors.primary, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, fontWeight: 800, boxShadow: `0 14px 30px ${colors.primary}55`,
          transform: `scale(${0.94 + btnS * 0.06})`, opacity: btnS,
        }}>
          Agendar
        </div>
      </div>

      <div style={{
        position: "absolute", top: 60, right: 60,
        background: "white", borderRadius: 14, padding: "20px 28px",
        boxShadow: "0 20px 50px rgba(20,40,60,0.15)", border: `1px solid ${colors.border}`,
        display: "flex", alignItems: "center", gap: 16,
        opacity: toastS, transform: `translateX(${interpolate(toastS,[0,1],[200,0])}px)`,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: colors.primary, color: "white", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 24, fontWeight: 800 }}>✓</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.text }}>Agendamento criado!</div>
          <div style={{ fontSize: 16, color: colors.muted }}>Sua dupla foi notificada.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
