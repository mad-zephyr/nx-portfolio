"use client";

import { InfiniteImageGrid } from "@/components";
import { AntiFisheye } from "@/components/shader/AntiFisheye";

import classes from "./page.module.sass";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { useMediaQuery } from "usehooks-ts";

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
        <EffectComposer renderPriority={1} autoClear>
          <AntiFisheye strength={matches ? 0.05 : 0.1} />
          <Noise opacity={0.05} />
          <Vignette offset={0.15} darkness={1} />
        </EffectComposer>
      </Canvas>
    </section>
  );
}
