"use client";

import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Billboard } from "@react-three/drei";
import { WebGLCard } from "../WebGLCard/WebGLCard";

type InfiniteImageGridProps = {
  textureUrls: string[];
  gridSize?: number;
  spacing?: number;
  imageSize?: [number, number];
  lerpFactor?: number;
};

const SENSITIVITY = 0.1;

export const InfiniteImageGrid: React.FC<InfiniteImageGridProps> = ({
  textureUrls,
  gridSize = 10,
  spacing = 6,
  imageSize = [5, 5],
  lerpFactor = 0.15,
}) => {
  const textures = useLoader(TextureLoader, textureUrls);
  const meshRefs = useRef<THREE.Object3D[]>([]);

  const velocity = useRef(new THREE.Vector2(0, 0));
  const targetOffset = useRef(new THREE.Vector2(0, 0));
  const currentOffset = useRef(new THREE.Vector2(0, 0));

  const pointerDown = useRef(false);
  const lastPos = useRef<THREE.Vector2 | null>(null);

  const activeIndex = useRef<number | null>(null);
  const scales = useRef<number[]>([]);
  const displacements = useRef<THREE.Vector2[]>([]);

  const fieldSize = gridSize * spacing;
  const overdraw = 2;
  const half = Math.floor(gridSize / 2) + overdraw;

  const basePositions = useMemo(() => {
    const result: THREE.Vector3[] = [];
    for (let x = -half; x <= half; x++) {
      for (let y = -half; y <= half; y++) {
        result.push(new THREE.Vector3(x * spacing, y * spacing, 0));
      }
    }
    return result;
  }, [half, spacing]);

  useEffect(() => {
    scales.current = basePositions.map(() => 1);
    displacements.current = basePositions.map(() => new THREE.Vector2());
  }, [basePositions]);

  useEffect(() => {
    if (basePositions.length === 0) return;
    const centerIndex = Math.floor(basePositions.length / 2);
    const center = basePositions[centerIndex];
    targetOffset.current.set(-center.x, -center.y);
    currentOffset.current.set(-center.x, -center.y);
  }, [basePositions]);

  //   const handleTileClick = (index: number) => {
  //     activeIndex.current = index === activeIndex.current ? null : index;
  //   };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDown.current = true;
    lastPos.current = new THREE.Vector2(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDown.current || !lastPos.current) return;
    const current = new THREE.Vector2(e.clientX, e.clientY);
    const delta = current.clone().sub(lastPos.current);
    lastPos.current = current;
    velocity.current.set(delta.x * SENSITIVITY, -delta.y * SENSITIVITY);
  };

  const handlePointerUp = () => {
    pointerDown.current = false;
    lastPos.current = null;
  };

  const handleWheel = (e: WheelEvent) => {
    velocity.current.set(e.deltaX * SENSITIVITY, -e.deltaY * SENSITIVITY);
  };

  useFrame(() => {
    targetOffset.current.add(velocity.current);
    velocity.current.multiplyScalar(0.85);
    currentOffset.current.lerp(targetOffset.current, lerpFactor);

    const offsetX = currentOffset.current.x;
    const offsetY = currentOffset.current.y;

    const wrap = (v: number) => {
      while (v > fieldSize / 2) v -= fieldSize;
      while (v < -fieldSize / 2) v += fieldSize;
      return v;
    };

    let activePos: THREE.Vector2 | null = null;

    if (activeIndex.current !== null) {
      const base = basePositions[activeIndex.current];

      const wrapped = new THREE.Vector2(
        wrap(base.x + offsetX),
        wrap(base.y + offsetY)
      );
      const shifts = [-fieldSize, 0, fieldSize];

      let minDist = Infinity;

      for (const dx of shifts) {
        for (const dy of shifts) {
          const candidate = new THREE.Vector2(wrapped.x + dx, wrapped.y + dy);
          const dist = candidate.length();

          if (dist < minDist) {
            minDist = dist;
            activePos = candidate;
          }
        }
      }
    }

    for (let i = 0; i < basePositions.length; i++) {
      const base = basePositions[i];
      const mesh = meshRefs.current[i];

      if (!mesh) continue;

      let x = base.x + offsetX;
      let y = base.y + offsetY;

      x = wrap(x);
      y = wrap(y);

      const thisPos = new THREE.Vector2(x, y);

      let isRealActive = false;
      let isCloneOfActive = false;

      if (activeIndex.current !== null && activePos) {
        const isSameIndex = i === activeIndex.current;
        const isSamePos = thisPos.distanceTo(activePos) < 0.1;

        if (isSameIndex && isSamePos) {
          isRealActive = true;
        } else if (isSameIndex && !isSamePos) {
          isCloneOfActive = true;
        }
      }

      const ax = activePos?.x ?? 0;
      const ay = activePos?.y ?? 0;

      let disp = new THREE.Vector2(0, 0);

      if (!isRealActive && !isCloneOfActive && activePos) {
        const dx = x - ax;
        const dy = y - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushStrength = Math.exp(-dist * 0.25) * spacing;

        if (pushStrength > 0) {
          disp = new THREE.Vector2(dx, dy)
            .normalize()
            .multiplyScalar(pushStrength);
        }
      }

      if (!displacements.current[i])
        displacements.current[i] = new THREE.Vector2();
      displacements.current[i].lerp(disp, 0.15);

      const finalZ = isRealActive ? 0.5 : 0;
      const finalPos = new THREE.Vector3(
        x + displacements.current[i].x,
        y + displacements.current[i].y,
        finalZ
      );

      const targetScale = isRealActive ? 1.5 : 1;
      scales.current[i] += (targetScale - scales.current[i]) * 0.15;

      mesh.position.copy(finalPos);
      mesh.scale.setScalar(scales.current[i]);
    }
  });

  return (
    <>
      <mesh
        position={[0, 0, -0.01]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <planeGeometry args={[fieldSize * 3, fieldSize * 3]} />
        <meshBasicMaterial opacity={0} />
      </mesh>

      {basePositions.map((pos, i) => {
        const texture = textures[i % textures.length];
        return (
          <Billboard
            key={i}
            position={pos.toArray()}
            ref={(el) => {
              if (el) meshRefs.current[i] = el;
            }}
            follow={false}
          >
            <>
              <mesh>
                <planeGeometry args={imageSize} />
                <meshBasicMaterial transparent map={texture} color="#181717" />
                {/* <meshBasicMaterial map={texture} transparent  /> */}
              </mesh>

              <WebGLCard img={texture.source.data.currentSrc} />

              {/* <Html center transform occlude position={[0, 0, 0.01]}>
                <Card key={i} img={texture.source.data.currentSrc} />
              </Html> */}
            </>
          </Billboard>
        );
      })}
    </>
  );
};
