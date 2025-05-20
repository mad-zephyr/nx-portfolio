'use client';

import { Billboard } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Group,
  MathUtils,
  PerspectiveCamera,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';

import { useAnimationInOut } from '@/hooks';
import { useResponsiveImageSize } from '@/hooks/useResponsiveImageSize';

import { TCard, WebGLCard } from '../WebGLCard/WebGLCard';

const BASE_CAMERA_Z = 15;
const SENSITIVITY = 1;
const MAX_WORLD_DELTA = 2.5;

type InfiniteImageGridProps = {
  gridSize?: number;
  imageSize?: [number, number];
  lerpFactor?: number;
  cards: TCard[];
};

function generateSpiralPositions(gridSize: number, spacing: number): Vector3[] {
  const half = Math.floor(gridSize / 2);
  const total = gridSize * gridSize;

  let x = 0;
  let y = 0;
  let dx = 0;
  let dy = -1;

  const rawPositions: { x: number; y: number }[] = [];

  // Этап 1: спиральное заполнение
  for (let i = 0; i < total; i++) {
    if (-half <= x && x <= half && -half <= y && y <= half) {
      rawPositions.push({ x, y });
    }

    if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
      const temp = dx;
      dx = -dy;
      dy = temp;
    }

    x += dx;
    y += dy;
  }

  // Этап 2: группировка по рядам
  const rows = new Map<number, { x: number; y: number }[]>();
  for (const pos of rawPositions) {
    if (!rows.has(pos.y)) rows.set(pos.y, []);
    rows.get(pos.y)!.push(pos);
  }

  // Этап 3: симметричное смещение рядов от центра
  const result: Vector3[] = [];

  const sortedYs = [...rows.keys()].sort((a, b) => a - b); // сверху вниз
  for (const y of sortedYs) {
    const row = rows.get(y)!;
    const shift = Math.abs(y);

    let shiftedRow: { x: number; y: number }[];

    if (y > 0) {
      // вниз — сдвигаем влево, переносим слева вправо
      shiftedRow = [...row.slice(shift), ...row.slice(0, shift)];
    } else if (y < 0) {
      // вверх — сдвигаем вправо, переносим справа влево
      shiftedRow = [...row.slice(-shift), ...row.slice(0, -shift)];
    } else {
      shiftedRow = row; // центр без сдвига
    }

    for (const pos of shiftedRow) {
      result.push(new Vector3(pos.x * spacing, pos.y * spacing, 0));
    }
  }

  return result;
}

export const InfiniteImageGrid: FC<InfiniteImageGridProps> = ({
  cards,
  gridSize = 10,
  imageSize = [5, 5],
  lerpFactor = 0.15,
}) => {
  const textures = useLoader(
    TextureLoader,
    cards.map((card) => card.image)
  );

  const { animatePageOut } = useAnimationInOut();

  const meshRefs = useRef<Group[]>([]);

  const targetOffset = useRef(new Vector2(0, 0));
  const currentOffset = useRef(new Vector2(0, 0));
  const pointerDown = useRef(false);

  const isDraggingRef = useRef(false);

  const lastPos = useRef<Vector2 | null>(null);

  const { camera, size } = useThree();

  const { imageSizes, spacing } = useResponsiveImageSize({ imageSize });
  const [tileWidth, tileHeight] = imageSizes;

  const fieldWidth = gridSize * tileWidth;
  const fieldHeight = gridSize * tileHeight;

  const fieldSize = gridSize * spacing;

  const tilePositions = useMemo(() => {
    return generateSpiralPositions(gridSize, spacing);
  }, [gridSize, spacing]);

  useEffect(() => {
    if (tilePositions.length < 4) return;

    const p1 = tilePositions[0];
    const p2 = tilePositions[1];
    const p3 = tilePositions[2];
    const p4 = tilePositions[3];

    const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
    const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;

    targetOffset.current.set(-centerX, -centerY);
    currentOffset.current.set(-centerX, -centerY);
  }, [tilePositions]);

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

    const targetZ = isDraggingRef.current ? 14 : 12;
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ, 0.5);
  });

  const handlePointerDown = (e: PointerEvent) => {
    pointerDown.current = true;
    isDraggingRef.current = false;
    lastPos.current = new Vector2(e.clientX, e.clientY);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const current = new Vector2(e.clientX, e.clientY);

      if (!lastPos.current) {
        lastPos.current = current;
        return;
      }

      const DRAG_THRESHOLD = 3;

      if (pointerDown.current && lastPos.current) {
        const dragDistance = current.distanceTo(lastPos.current);
        if (dragDistance > DRAG_THRESHOLD) {
          isDraggingRef.current = true;
        }
      }

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

      if (pointerDown.current && isDraggingRef.current) {
        // полный scroll при перетаскивании
        targetOffset.current.add(finalDelta);
      } else {
        // небольшое движение — hover drift
        targetOffset.current.add(finalDelta.multiplyScalar(0.05));
      }
    },
    [camera, size.height, size.width]
  );

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

    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);
  };

  return (
    <>
      <mesh
        position={[0, 0, 0]}
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <planeGeometry args={[fieldWidth * 3, fieldHeight * 3]} />
        <meshBasicMaterial transparent opacity={0.0} />
      </mesh>

      {tilePositions.map((pos, i) => {
        const texture = textures[i % textures.length];

        const handleClick = (href: string) => {
          if (!isDraggingRef.current) {
            animatePageOut(href);
          }
        };

        return (
          <Billboard
            key={i}
            onClick={() => handleClick(cards[i % textures.length].url)}
            ref={(el) => {
              if (el) meshRefs.current[i] = el;
            }}
            position={pos.toArray()}
          >
            <WebGLCard
              img={texture.source.data.currentSrc}
              imageSize={imageSizes}
              card={cards[i % textures.length]}
            />
          </Billboard>
        );
      })}
    </>
  );
};
