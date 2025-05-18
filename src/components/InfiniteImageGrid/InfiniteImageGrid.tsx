"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  MathUtils,
  Object3D,
  PerspectiveCamera,
  TextureLoader,
  Vector2,
  Vector3,
} from "three";
import { Billboard } from "@react-three/drei";
import { WebGLCard } from "../WebGLCard/WebGLCard";

type InfiniteImageGridProps = {
  textureUrls: string[];
  gridSize?: number;
  spacing?: number;
  imageSize?: [number, number];
  lerpFactor?: number;
};

const BASE_CAMERA_Z = 15; // твоя "нормальная" дистанция камеры
const SENSITIVITY = 1; // можно подстроить под пальцы / мышь
const MAX_WORLD_DELTA = 2.5; // защита от "рывков"

export const InfiniteImageGrid: React.FC<InfiniteImageGridProps> = ({
  textureUrls,
  gridSize = 10,
  spacing = 6,
  imageSize = [5, 5],
  lerpFactor = 0.15,
}) => {
  const textures = useLoader(TextureLoader, textureUrls);
  const meshRefs = useRef<Object3D[]>([]);

  const targetOffset = useRef(new Vector2(0, 0));
  const currentOffset = useRef(new Vector2(0, 0));

  const pointerDown = useRef(false);
  const lastPos = useRef<Vector2 | null>(null);

  const activeIndex = useRef<number | null>(null);
  const scales = useRef<number[]>([]);
  const displacements = useRef<Vector2[]>([]);

  const fieldSize = gridSize * spacing;
  const overdraw = 2;
  const half = Math.floor(gridSize / 2) + overdraw;

  const [isDrag, setIsDrag] = useState(false);

  const { camera, size } = useThree();

  useFrame(() => {
    const targetZ = isDrag ? 14 : 12;
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ, 0.3);
  });

  const basePositions = useMemo(() => {
    const result: Vector3[] = [];
    for (let x = -half; x <= half; x++) {
      for (let y = -half; y <= half; y++) {
        result.push(new Vector3(x * spacing, y * spacing, 0));
      }
    }
    return result;
  }, [half, spacing]);

  useEffect(() => {
    if (basePositions.length === 0) return;
    const centerIndex = Math.floor(basePositions.length / 2);
    const center = basePositions[centerIndex];
    targetOffset.current.set(-center.x, -center.y);
    currentOffset.current.set(-center.x, -center.y);

    scales.current = basePositions.map(() => 1);
    displacements.current = basePositions.map(() => new Vector2());
  }, [basePositions]);

  //   const handleTileClick = (index: number) => {
  //     activeIndex.current = index === activeIndex.current ? null : index;
  //   };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDown.current = true;
    lastPos.current = new Vector2(e.clientX, e.clientY);
    setIsDrag(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerDown.current || !lastPos.current) return;

    const perspectiveCamera = camera as PerspectiveCamera;

    const current = new Vector2(e.clientX, e.clientY);
    const delta = current.clone().sub(lastPos.current);
    lastPos.current = current;

    // === Точный пересчёт worldHeight/Width с учётом текущего Z
    const fovInRadians = (perspectiveCamera.fov * Math.PI) / 180;
    const distance = perspectiveCamera.position.z;

    const worldHeight = 2 * Math.tan(fovInRadians / 2) * distance;
    const aspect = size.width / size.height;
    const worldWidth = worldHeight * aspect;

    const baseDelta = new Vector2(
      (delta.x / size.width) * worldWidth,
      (-delta.y / size.height) * worldHeight
    );

    // === Ограничим резкие рывки
    const clampedDelta = baseDelta.clampLength(0, MAX_WORLD_DELTA);

    // === Компенсируем увеличение области при увеличении Z
    // const zRatio = distance / BASE_CAMERA_Z;
    const zRatio = distance / perspectiveCamera.position.z;
    const finalDelta = clampedDelta.multiplyScalar(SENSITIVITY / zRatio);

    targetOffset.current.add(finalDelta);
  };

  const handlePointerUp = () => {
    pointerDown.current = false;
    lastPos.current = null;

    setIsDrag(false);
  };

  const handleWheel = (e: WheelEvent) => {
    const perspectiveCamera = camera as PerspectiveCamera;

    const fovInRadians = (perspectiveCamera.fov * Math.PI) / 180;
    const distance = perspectiveCamera.position.z;

    const worldHeight = 2 * Math.tan(fovInRadians / 2) * distance;
    const aspect = size.width / size.height;
    const worldWidth = worldHeight * aspect;

    const baseDelta = new Vector2(
      (e.deltaX / size.width) * worldWidth,
      (-e.deltaY / size.height) * worldHeight
    );

    const clampedDelta = baseDelta.clampLength(0, 2.5); // чтобы не "вырвало"
    const zRatio = distance / BASE_CAMERA_Z;

    const finalDelta = clampedDelta.multiplyScalar(SENSITIVITY / zRatio);
    targetOffset.current.add(finalDelta);
  };

  useFrame(() => {
    // targetOffset.current.add(velocity.current);
    // velocity.current.multiplyScalar(0.85);
    currentOffset.current.lerp(targetOffset.current, lerpFactor);

    const offsetX = currentOffset.current.x;
    const offsetY = currentOffset.current.y;

    const wrap = (v: number) => {
      while (v > fieldSize / 2) v -= fieldSize;
      while (v < -fieldSize / 2) v += fieldSize;
      return v;
    };

    let activePos: Vector2 | null = null;

    if (activeIndex.current !== null) {
      const base = basePositions[activeIndex.current];

      const wrapped = new Vector2(
        wrap(base.x + offsetX),
        wrap(base.y + offsetY)
      );
      const shifts = [-fieldSize, 0, fieldSize];

      let minDist = Infinity;

      for (const dx of shifts) {
        for (const dy of shifts) {
          const candidate = new Vector2(wrapped.x + dx, wrapped.y + dy);
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

      const thisPos = new Vector2(x, y);

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

      let disp = new Vector2(0, 0);

      if (!isRealActive && !isCloneOfActive && activePos) {
        const dx = x - ax;
        const dy = y - ay;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushStrength = Math.exp(-dist * 0.25) * spacing;

        if (pushStrength > 0) {
          disp = new Vector2(dx, dy).normalize().multiplyScalar(pushStrength);
        }
      }

      if (!displacements.current[i]) displacements.current[i] = new Vector2();
      displacements.current[i].lerp(disp, 0.15);

      const finalZ = isRealActive ? 0.5 : 0;
      const finalPos = new Vector3(
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
        position={[0, 0, 0]}
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
            follow={false}
            ref={(el) => {
              if (el) meshRefs.current[i] = el;
            }}
            position={pos.toArray()}
          >
            <mesh>
              <planeGeometry args={imageSize} />
              <meshBasicMaterial transparent map={texture} color="#181717" />
            </mesh>

            <WebGLCard i={i} img={texture.source.data.currentSrc} />

            {/* <Html center transform occlude position={[0, 0, 0.01]}>
                <Card key={i} img={texture.source.data.currentSrc} />
              </Html> */}
          </Billboard>
        );
      })}
    </>
  );
};
