// components/materials/BlurMaterial.ts
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { FC, useRef } from 'react';
import { Color, MathUtils, ShaderMaterial, Texture } from 'three';

export const RawBlurMaterial = shaderMaterial(
  {
    uTexture: null,
    opacity: 1,
    blurStrength: 1,
    blurSize: 2,
    colorOverlay: new Color(0x000000),
    hovered: 0,
    zoomFactor: 2.0, // 👈 добавлено
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float opacity;
    uniform float blurStrength;
    uniform float blurSize;
    uniform vec3 colorOverlay;
    uniform float hovered;
    uniform float zoomFactor;

    void main() {
      vec4 color = vec4(0.0);
      float total = 0.0;

      // 👇 масштабируем координаты UV
      vec2 zoomedUv = 0.5 + (vUv - 0.5) / (1.0 + hovered * zoomFactor);

      float blurStep = (blurStrength + hovered * 2.0) / 256.0;

      for (float x = -blurSize; x <= blurSize; x++) {
        for (float y = -blurSize; y <= blurSize; y++) {
          vec2 offset = vec2(x, y) * blurStep;
          color += texture2D(uTexture, zoomedUv + offset);
          total += 1.0;
        }
      }

      color /= total;
      color.rgb = mix(color.rgb, colorOverlay, 0.3);
      color.a *= opacity * hovered;

      gl_FragColor = color;
    }
  `
);

extend({ RawBlurMaterial });

type TBlurMaterial = {
  uTexture: Texture;
  opacity: number;
  blurStrength: number;
  blurSize: number;
  transparent: boolean;
  colorOverlay?: string | Color;
  hovered?: number;
  zoomFactor?: number;
};

export const BlurMaterial: FC<TBlurMaterial> = ({
  colorOverlay,
  hovered,
  ...rest
}) => {
  const blurRef = useRef<ShaderMaterial>(null);

  useFrame(() => {
    if (blurRef.current) {
      blurRef.current.uniforms.hovered.value = MathUtils.lerp(
        blurRef.current.uniforms.hovered.value,
        hovered ? 1 : 0,
        0.5
      );
    }
  });

  return (
    <rawBlurMaterial
      ref={blurRef}
      {...rest}
      colorOverlay={
        typeof colorOverlay === 'string'
          ? new Color(colorOverlay)
          : colorOverlay
      }
    />
  );
};

BlurMaterial.displayName = 'BlurMaterial';
