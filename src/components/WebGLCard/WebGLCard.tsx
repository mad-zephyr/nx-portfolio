/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Flex, Box } from "@react-three/flex";
import { useLoader } from "@react-three/fiber";
import { Group, TextureLoader } from "three";
import { useRef } from "react";

export function WebGLCard({ img }: { img: string }) {
  const texture = useLoader(TextureLoader, img);

  const group = useRef<Group>(null);

  return (
    <group ref={group}>
      {/* @ts-ignore */}
      <Flex
        dir="column"
        centerAnchor
        position={[0, 0, 0.01]} // позиция на сцене
        size={[2, 2, 0.1]} // размер "контейнера"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* @ts-ignore */}
        <Box centerAnchor>
          <mesh>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial map={texture} transparent />
          </mesh>
        </Box>
      </Flex>
    </group>
  );
}
