"use client";

import { InfiniteImageGrid } from "@/components";
import { AntiFisheye } from "@/components/shader/AntiFisheye";

import classes from "./page.module.css";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

const imagePaths = Array.from(
  { length: 27 },
  (_, i) => `/images/${i + 1}.avif`
);

export default function Home() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        powerPreference: "high-performance",
        alpha: true,
        antialias: true,
        stencil: true,
      }}
      className={classes.canvas}
      camera={{ position: [0, 0, 12], fov: 65 }}
    >
      <InfiniteImageGrid textureUrls={imagePaths} gridSize={10} spacing={5} />
      <EffectComposer multisampling={3} enableNormalPass={true}>
        <AntiFisheye strength={0.15} />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.15} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
