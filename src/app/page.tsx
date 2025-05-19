"use client";

import { InfiniteImageGrid } from "@/components";
import { AntiFisheye } from "@/components/3d/shader/AntiFisheye";

import classes from "./page.module.sass";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useMediaQuery } from "usehooks-ts";
import { ProgressiveBlurEffect } from "@/components/3d/shader/ProgressiveBlur";

const imagePaths = Array.from(
  { length: 25 },
  (_, i) => `/images/${i + 1}.avif`
);

export default function Home() {
  const matches = useMediaQuery("(max-width: 768px)");

  return (
    <section className={classes.canvas}>
      <Canvas
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          autoClear: true,
        }}
        className={classes.wrapper}
        camera={{ position: [0, 0, 12], fov: 65 }}
      >
        <InfiniteImageGrid
          textureUrls={imagePaths}
          gridSize={10}
          imageSize={[6, 6]}
        />

        <EffectComposer multisampling={2} autoClear>
          <ProgressiveBlurEffect
            blurStrength={1.0}
            overlayAlpha={0.05}
            overlayColor={[1.0, 1.0, 1.0]}
            blurArea={matches ? [0.0, 0.82, 1, 0.2] : [0.0, 0.86, 1, 0.085]}
          />
          <AntiFisheye strength={matches ? 0.05 : 0.15} />
          <Noise opacity={0.04} />
          <Vignette offset={0.15} darkness={1.2} />
        </EffectComposer>
      </Canvas>
    </section>
  );
}
