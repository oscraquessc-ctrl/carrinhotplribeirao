import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";
import { colors } from "../theme";

export const Intro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14 } });
  const titleY = interpolate(s, [0, 1], [40, 0]);
  const subS = spring({ frame: frame - 12, fps, config: { damping: 18 } });
  const imgS = spring({ frame: frame - 6, fps, config: { damping: 16 } });

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
        <div style={{ width: 460, borderRadius: 32, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", transform: `scale(${0.7 + imgS * 0.3})`, opacity: imgS }}>
          <Img src={staticFile("images/cover.webp")} style={{ width: "100%", display: "block" }} />
        </div>
        <div style={{ textAlign: "center", color: "white", transform: `translateY(${titleY}px)`, opacity: s }}>
          <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>Carrinho TPL</div>
          <div style={{ fontSize: 38, fontWeight: 500, opacity: subS, marginTop: 8 }}>
            Ribeirão da Ilha
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
