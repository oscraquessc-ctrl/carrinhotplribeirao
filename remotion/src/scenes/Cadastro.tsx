import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { colors } from "../theme";

const Field = ({ label, value, delay, typed }: { label: string; value: string; delay: number; typed: number }) => {
  const visibleChars = Math.max(0, Math.min(value.length, Math.floor((typed - delay) * 0.8)));
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 22, color: colors.muted, marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{
        height: 64, border: `2px solid ${colors.border}`, borderRadius: 12,
        background: "white", padding: "0 20px", display: "flex", alignItems: "center",
        fontSize: 28, color: colors.text, fontWeight: 500,
      }}>
        {value.slice(0, visibleChars)}
        {visibleChars < value.length && visibleChars > 0 && <span style={{ opacity: 0.5 }}>|</span>}
      </div>
    </div>
  );
};

export const Cadastro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardS = spring({ frame, fps, config: { damping: 18 } });
  const btnS = spring({ frame: frame - 110, fps, config: { damping: 12 } });
  const headerY = interpolate(cardS, [0, 1], [-20, 0]);

  return (
    <AbsoluteFill style={{ background: colors.bg, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 700, background: "white", borderRadius: 24, padding: 48,
        boxShadow: "0 30px 80px rgba(20,40,60,0.12)", border: `1px solid ${colors.border}`,
        transform: `translateY(${interpolate(cardS, [0, 1], [60, 0])}px) scale(${0.95 + cardS * 0.05})`,
        opacity: cardS,
      }}>
        <div style={{ textAlign: "center", marginBottom: 36, transform: `translateY(${headerY}px)` }}>
          <div style={{ fontSize: 42, fontWeight: 700, color: colors.primary }}>Criar Conta</div>
          <div style={{ fontSize: 20, color: colors.muted, marginTop: 8 }}>
            Cadastre-se para participar da agenda
          </div>
        </div>
        <Field label="Nome" value="Yuri Serrão" delay={20} typed={frame} />
        <Field label="E-mail" value="joao@email.com" delay={45} typed={frame} />
        <Field label="Senha" value="••••••••" delay={75} typed={frame} />
        <div style={{ fontSize: 16, color: colors.muted, marginTop: -10, marginBottom: 22 }}>
          A senha deve ter pelo menos 8 caracteres.
        </div>
        <div style={{
          height: 64, borderRadius: 12, background: colors.primary, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, fontWeight: 700, boxShadow: btnS > 0.3 ? `0 14px 30px ${colors.primary}55` : "none",
          transform: `scale(${0.94 + btnS * 0.06})`,
        }}>
          Confirmar
        </div>
      </div>
    </AbsoluteFill>
  );
};
