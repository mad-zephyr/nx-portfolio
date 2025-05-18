"use client";

import { FC, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  MathUtils,
  PerspectiveCamera,
  TextureLoader,
  Vector2,
  Vector3,
  Group,
} from "three";
import { Billboard } from "@react-three/drei";
import { WebGLCard } from "../WebGLCard/WebGLCard";

const BASE_CAMERA_Z = 15;
const SENSITIVITY = 1;
const MAX_WORLD_DELTA = 2.5;

type InfiniteImageGridProps = {
  textureUrls: string[];
  gridSize?: number;
  spacing?: number;
  imageSize?: [number, number];
  lerpFactor?: number;
};

export const InfiniteImageGrid: FC<InfiniteImageGridProps> = ({
  textureUrls,
  gridSize = 10,
  spacing = 6,
  imageSize = [5, 5],
  lerpFactor = 0.15,
}) => {
  console.log("IMAGE: ", imageSize);
  const textures = useLoader(TextureLoader, textureUrls);
  const meshRefs = useRef<Group[]>([]);
  const [isDrag, setIsDrag] = useState(false);

  const targetOffset = useRef(new Vector2(0, 0));
  const currentOffset = useRef(new Vector2(0, 0));
  const pointerDown = useRef(false);
  const lastPos = useRef<Vector2 | null>(null);

  const { camera, size } = useThree();

  const fieldSize = gridSize * spacing;

  const tileWidth = imageSize[0];
  const tileHeight = imageSize[1];
  const fieldWidth = gridSize * tileWidth;
  const fieldHeight = gridSize * tileHeight;

  const tilePositions = useMemo(() => {
    const halfGrid = Math.floor(gridSize / 2);

    const tiles = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        tiles.push(
          new Vector3((x - halfGrid) * spacing, (y - halfGrid) * spacing, 0)
        );
      }
    }
    return tiles;
  }, [gridSize, spacing]);

  useFrame(() => {
    currentOffset.current.lerp(targetOffset.current, lerpFactor);

    const offsetX = currentOffset.current.x;
    const offsetY = currentOffset.current.y;

    for (let i = 0; i < tilePositions.length; i++) {
      const ref = meshRefs.current[i];
      if (!ref) continue;

      let x = tilePositions[i].x + offsetX;
      let y = tilePositions[i].y + offsetY;

      while (x > fieldSize / 2) x -= fieldWidth;
      while (x < -fieldSize / 2) x += fieldWidth;
      while (y > fieldSize / 2) y -= fieldHeight;
      while (y < -fieldSize / 2) y += fieldHeight;

      ref.position.set(x, y, 0);
    }

    const targetZ = isDrag ? 14 : 12;
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ, 0.3);
  });

  const handlePointerDown = (e: PointerEvent) => {
    pointerDown.current = true;
    lastPos.current = new Vector2(e.clientX, e.clientY);
    setIsDrag(true);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!pointerDown.current || !lastPos.current) return;
    const current = new Vector2(e.clientX, e.clientY);
    const delta = current.clone().sub(lastPos.current);
    lastPos.current = current;

    const perspectiveCamera = camera as PerspectiveCamera;
    const fovInRadians = (perspectiveCamera.fov * Math.PI) / 180;
    const distance = perspectiveCamera.position.z;

    const worldHeight = 2 * Math.tan(fovInRadians / 2) * distance;
    const aspect = size.width / size.height;
    const worldWidth = worldHeight * aspect;

    const baseDelta = new Vector2(
      (delta.x / size.width) * worldWidth,
      (-delta.y / size.height) * worldHeight
    );

    const clampedDelta = baseDelta.clampLength(0, MAX_WORLD_DELTA);
    const zRatio = distance / perspectiveCamera.position.z;
    const finalDelta = clampedDelta.multiplyScalar(SENSITIVITY / zRatio);

    targetOffset.current.add(finalDelta);
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

  const handlePointerUp = () => {
    pointerDown.current = false;
    lastPos.current = null;
    setIsDrag(false);
  };

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
        <planeGeometry args={[fieldWidth * 3, fieldHeight * 3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {tilePositions.map((pos, i) => {
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
            <WebGLCard
              i={i}
              img={texture.source.data.currentSrc}
              imageSize={imageSize}
            />
          </Billboard>
        );
      })}
    </>
  );
};
