import { useLoader } from '@react-three/fiber';
import { FC, PropsWithChildren, useState } from 'react';
import { TextureLoader } from 'three';
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
} from 'three';

import { Box } from '../Box/Box';
import { Flex } from '../Flex/Flex';
import { BlurMaterial } from '../shader/BlurMaterial';
import { Text } from '../Text/Text';

type TBorderBox = { width: number; height: number };

const BorderBox: FC<PropsWithChildren<TBorderBox>> = ({
  width,
  height,
  children,
}) => {
  const geometry = new BufferGeometry();
  const positions = new Float32Array([
    // bottom
    -width / 2,
    -height / 2,
    0.001,
    width / 2,
    -height / 2,
    0.001,

    // right
    width / 2,
    -height / 2,
    0.001,
    width / 2,
    height / 2,
    0.001,

    // top
    width / 2,
    height / 2,
    0.001,
    -width / 2,
    height / 2,
    0.001,

    // left
    -width / 2,
    height / 2,
    0.001,
    -width / 2,
    -height / 2,
    0.001,
  ]);

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

  return (
    <group position={[0, 0, 0.001]}>
      <primitive
        object={
          new LineSegments(
            geometry,
            new LineBasicMaterial({
              color: 'white',
              linewidth: 1,
              transparent: true,
              opacity: 0.04,
            })
          )
        }
      />
      {children}
    </group>
  );
};

type TCard = {
  image: string;
  brand: string;
  project: string;
  experience: string[];
  year: number;
};

type TWebGLCard = {
  img: string;
  imageSize: [number, number];
  card: TCard;
};

export const WebGLCard: FC<TWebGLCard> = ({ img, imageSize, card }) => {
  const texture = useLoader(TextureLoader, img);
  const [hovered, setHovered] = useState<number>(0);

  const GAP = 1 / imageSize[0];

  const [width, height] = imageSize;

  return (
    <group position={[0, 0, 0.001]}>
      <BorderBox width={width} height={height} />
      <Flex
        size={[width, height, 0]}
        position={[0, 0, 0.2]}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex
          size={[width - GAP * 2, height - GAP * 2, 0]}
          flexDirection="column"
          justifyContent="space-between"
          centerAnchor
        >
          {/* Top */}
          <Box
            width={width - GAP * 2}
            height={0.2}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* текст */}
            <Box>
              <Text fontSize={0.16}>{card.brand}</Text>
            </Box>
            <Box>
              <Text fontSize={0.16}>{card.project}</Text>
            </Box>
          </Box>

          {/* Center (image) */}
          <Box
            width={width - GAP * 2}
            height={height - GAP * 4}
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            centerAnchor
          >
            <mesh>
              <planeGeometry args={[width / 2 + GAP, height / 2 + GAP]} />
              <meshBasicMaterial map={texture} transparent />
            </mesh>
          </Box>

          {/* Bottom */}
          <Box
            width={width - GAP * 2}
            height={0.2}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flexGrow={0}
          >
            <Box>
              <Text fontSize={0.13} anchorX="left">
                EXPERIENCE:
              </Text>
            </Box>

            {card.experience.map((item, i) => (
              <Box key={i}>
                <Text fontSize={0.13}>{item}</Text>
              </Box>
            ))}

            <Box>
              <Text fontSize={0.13}>{card.year}</Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
      <mesh
        position={[0, 0, 0.00001]}
        onPointerOver={() => setHovered(1)}
        onPointerOut={() => setHovered(0)}
      >
        <planeGeometry args={[width, height]} />

        <BlurMaterial
          uTexture={texture}
          opacity={0.8}
          blurStrength={0}
          blurSize={4}
          zoomFactor={1.1}
          colorOverlay="#ffffff"
          hovered={hovered}
          transparent
        />
      </mesh>
    </group>
  );
};
