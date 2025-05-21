'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import { useMediaQuery } from 'usehooks-ts';

import { InfiniteImageGrid } from '@/components';
import { AntiFisheye } from '@/components/3d/shader/AntiFisheye';
import { ProgressiveBlurEffect } from '@/components/3d/shader/ProgressiveBlur';
import { jsonData } from '@/mock/mock';

import classes from './page.module.sass';

export default function Home() {
  const matches = useMediaQuery('(max-width: 768px)');

  return (
    <section className={classes.canvas}>
      <Canvas
        gl={{
          powerPreference: 'high-performance',
          autoClear: false,
          alpha: true,
        }}
        className={classes.wrapper}
        camera={{ position: [0, 0, 12], fov: 65 }}
      >
        <color attach="background" args={['#222']} />
        <InfiniteImageGrid gridSize={10} imageSize={[6, 6]} cards={jsonData} />

        <EffectComposer autoClear>
          <ProgressiveBlurEffect
            blurStrength={1.5}
            overlayAlpha={0.03}
            overlayColor={[1.0, 1.0, 1.0]}
            blurArea={matches ? [0.0, 0.82, 1, 0.2] : [0.0, 0.86, 1, 0.085]}
          />
          <AntiFisheye strength={matches ? 0.05 : 0.15} />
          {/* <Noise opacity={0.14} /> */}
          <Vignette offset={0.15} darkness={1.2} />
        </EffectComposer>
      </Canvas>
    </section>
  );
}
