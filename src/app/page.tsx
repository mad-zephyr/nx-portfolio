"use client";

import { InfiniteImageGrid } from "@/components";
import { AntiFisheye } from "@/components/shader/AntiFisheye";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";

const imagePaths = Array.from(
  { length: 27 },
  (_, i) => `/images/${i + 1}.avif`
);

export default function Home() {
  return (
    <Canvas
      gl={{
        powerPreference: "high-performance",
        alpha: true,
        antialias: true,
        stencil: false,
      }}
      style={{
        width: "100vw",
        height: "100vh",
        cursor: "grab",
      }}
      camera={{ position: [0, 0, 12], fov: 70 }}
    >
      <InfiniteImageGrid textureUrls={imagePaths} gridSize={9} spacing={5} />
      <EffectComposer multisampling={3} enableNormalPass={true}>
        <AntiFisheye strength={0.05} />
        <Noise opacity={0.025} />
        <Vignette eskil={false} offset={0.15} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
