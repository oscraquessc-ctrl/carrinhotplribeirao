import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { colors } from "../theme";

export const Outro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 18, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ textAlign: "center", color: "white" }}>
        <div style={{
          fontSize: 110, fontWeight: 800, letterSpacing: -3,
          opacity: s, transform: `scale(${0.9 + s*0.1})`,
        }}>
          Vamos começar?
        </div>
        <div style={{
          fontSize: 32, fontWeight: 500, marginTop: 20, opacity: sub * 0.95,
          transform: `translateY(${interpolate(sub,[0,1],[20,0])}px)`,
        }}>
          Congregação Ribeirão da Ilha
        </div>
      </div>
    </AbsoluteFill>
  );
};
