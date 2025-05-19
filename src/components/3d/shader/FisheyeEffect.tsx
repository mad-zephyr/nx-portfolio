import { useFrame, useThree } from '@react-three/fiber';
import {
  CubeCamera,
  LinearMipmapLinearFilter,
  Mesh,
  RGBAFormat,
  WebGLCubeRenderTarget,
} from 'three';
import { useRef, useEffect } from 'react';

export function FisheyeEffect() {
  const { scene, gl } = useThree();

  const cubeRenderTarget = useRef(
    new WebGLCubeRenderTarget(256, {
      format: RGBAFormat,
      generateMipmaps: true,
      minFilter: LinearMipmapLinearFilter,
    })
  );

  const cubeCamera = useRef(new CubeCamera(1, 1000, cubeRenderTarget.current));
  const sphereRef = useRef<Mesh>(null);

  useEffect(() => {
    scene.add(cubeCamera.current);
  }, [scene]);

  useFrame(() => {
    cubeCamera.current.update(gl, scene);
  });

  return (
    <mesh ref={sphereRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial envMap={cubeCamera.current.renderTarget.texture} />
    </mesh>
  );
}
