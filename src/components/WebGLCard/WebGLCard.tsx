import { useLoader } from "@react-three/fiber";
import { Group, TextureLoader } from "three";
import { FC, PropsWithChildren, useRef } from "react";
import { Text } from "../Text/Text";

import {
  LineSegments,
  LineBasicMaterial,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { Box } from "../Box/Box";
import { Flex } from "../Flex/Flex";

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
    0.005,
    width / 2,
    -height / 2,
    0.005,

    // right
    width / 2,
    -height / 2,
    0.005,
    width / 2,
    height / 2,
    0.005,

    // top
    width / 2,
    height / 2,
    0.005,
    -width / 2,
    height / 2,
    0.005,

    // left
    -width / 2,
    height / 2,
    0.005,
    -width / 2,
    -height / 2,
    0.005,
  ]);

  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

  return (
    <group position={[0, 0, 0.01]}>
      <primitive
        object={
          new LineSegments(
            geometry,
            new LineBasicMaterial({
              color: "white",
              linewidth: 0.2,
              transparent: true,
              opacity: 0.02,
            }) // `linewidth` работает только в native canvas (не WebGL)
          )
        }
      />
      {children}
    </group>
  );
};

export function WebGLCard({ img, i }: { img: string; i: number }) {
  const texture = useLoader(TextureLoader, img);

  const group = useRef<Group>(null);

  return (
    <group ref={group} position={[0, 0, 0.001]}>
      <BorderBox width={5} height={5} />
      <Flex
        size={[5, 5, 0]}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex
          size={[4.6, 4.6, 0]}
          flexDirection="column"
          justifyContent="space-between"
          centerAnchor
        >
          {/* Top */}
          <Box
            width={4.6}
            height={0.2}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text fontSize={0.16}>Google {i}</Text>
            </Box>

            <Box>
              <Text fontSize={0.16}>ZEDD IN THE PARK</Text>
            </Box>
          </Box>

          {/* Center (image) */}
          <Box
            width={4.6}
            height={4.2}
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            centerAnchor
          >
            <mesh>
              <planeGeometry args={[3.2, 3.2]} />
              <meshBasicMaterial map={texture} transparent />
            </mesh>
          </Box>

          {/* Bottom */}
          <Box
            width={4.6}
            height={0.2}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            flexGrow={0}
          >
            <Box>
              <Text fontSize={0.13} anchorX="left">
                EXPERIENCE
              </Text>
            </Box>
            <Box>
              <Text fontSize={0.13}>GAME</Text>
            </Box>
            <Box>
              <Text fontSize={0.13}>3D</Text>
            </Box>
            <Box>
              <Text fontSize={0.13}>2024 {i}</Text>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </group>
  );
}
