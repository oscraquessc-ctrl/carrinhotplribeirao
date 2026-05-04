import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Intro } from "./scenes/Intro";
import { Cadastro } from "./scenes/Cadastro";
import { Agenda } from "./scenes/Agenda";
import { Criar } from "./scenes/Criar";
import { Mural } from "./scenes/Mural";
import { Outro } from "./scenes/Outro";
import { colors } from "./theme";

loadFont("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

export const MainVideo = () => (
  <AbsoluteFill style={{ background: colors.bg, fontFamily: "Inter, sans-serif" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={110}><Intro /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
      <TransitionSeries.Sequence durationInFrames={150}><Cadastro /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })} />
      <TransitionSeries.Sequence durationInFrames={170}><Agenda /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })} />
      <TransitionSeries.Sequence durationInFrames={170}><Criar /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })} />
      <TransitionSeries.Sequence durationInFrames={150}><Mural /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 20 })} />
      <TransitionSeries.Sequence durationInFrames={110}><Outro /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
