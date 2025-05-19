import { useEffect, useRef } from "react";
import { ProgressiveBlurEffectImpl } from "../shader/ProgressiveBlur";
import { useThree, useFrame } from "@react-three/fiber";
import { Mesh, MeshBasicMaterial, PlaneGeometry, Scene } from "three";
import { EffectComposer, MaskPass, EffectPass } from "postprocessing";

export function HeaderBlurEffect() {
  const { gl, camera, viewport } = useThree();
  const composer = useRef<EffectComposer | null>(null);
  const maskScene = useRef(new Scene());

  useEffect(() => {
    const maskHeight = viewport.height * 0.2;

    const plane = new Mesh(
      new PlaneGeometry(viewport.width, maskHeight),
      new MeshBasicMaterial({ color: 0xffffff })
    );

    plane.position.y = viewport.height / 2 - maskHeight / 2;
    maskScene.current.add(plane);
  }, [viewport]);

  useEffect(() => {
    const blurEffect = new ProgressiveBlurEffectImpl({
      blurStrength: 2.0,
      blurSize: 3.0,
    });

    const composerInstance = new EffectComposer(gl);
    const maskPass = new MaskPass(maskScene.current, camera);
    const blurPass = new EffectPass(camera, blurEffect);

    composerInstance.addPass(maskPass);
    composerInstance.addPass(blurPass);

    composer.current = composerInstance;

    return () => {
      composerInstance.dispose();
    };
  }, [gl, camera]);

  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1);

  return null;
}
