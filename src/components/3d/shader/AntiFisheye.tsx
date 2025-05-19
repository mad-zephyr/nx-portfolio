// AntiFisheyeEffect.js
import { Uniform, Vector2 } from 'three';
import { Effect } from 'postprocessing';
import { wrapEffect } from '@react-three/postprocessing';

const fragmentShader = /* glsl */ `
  uniform float uStrength;
  uniform vec2 uResolution;

  void mainUv(inout vec2 uv) {
    vec2 centered = uv * 2.0 - 1.0;
    float r = length(centered);
    float factor = 1.0 + uStrength * r * r;
    centered /= factor;
    uv = (centered + 1.0) / 2.0;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
  }
`;

class AntiFisheyeImpl extends Effect {
  constructor({ strength = 0.3 } = {}) {
    super('AntiFisheyeEffect', fragmentShader, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uniforms: new Map<string, Uniform<any>>([
        ['uStrength', new Uniform(strength)],
        ['uResolution', new Uniform(new Vector2())],
      ]),
    });
  }
}

export const AntiFisheye = wrapEffect(AntiFisheyeImpl);
