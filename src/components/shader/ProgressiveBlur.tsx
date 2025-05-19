// ProgressiveBlurEffect.tsx
import { wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";

const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D tDiffuse;
uniform vec4 blurArea;
uniform float blurStrength;
 
// noise utils
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 10.0) * x);
}
float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  // (3.0-sqrt(3.0))/6.0
    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
   -0.577350269189626,  // -1.0 + 2.0 * C.x
    0.024390243902439   // 1.0 / 41.0
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) +
    i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );
  m *= m;
  m *= m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outColor) {
  vec2 texCoords = uv;

  float areaTop = blurArea.y + blurArea.w;
  float areaBottom = blurArea.y;
  float factor = smoothstep(areaBottom, areaTop, uv.y);

  float noise = snoise(gl_FragCoord.xy * 0.3 + uTime * 5.0);
  vec2 distortion = vec2(noise) * factor * blurStrength * 0.01;

  texCoords += distortion;

  vec3 texColor = texture(tDiffuse, texCoords).rgb;
  outColor = vec4(texColor, 1.0);
}
`;

export class ProgressiveBlurEffectImpl extends Effect {
  constructor({
    blurStrength = 1.0,
    blurSize = 2.0,
    blurArea = [0.0, 0.8, 1.0, 0.2],
  } = {}) {
    super("ProgressiveBlurEffect", fragmentShader, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uniforms: new Map<string, any>([
        ["blurStrength", { value: blurStrength }],
        ["blurSize", { value: blurSize }],
        ["blurArea", { value: new Float32Array(blurArea) }],
      ]),
    });
  }
}

export const ProgressiveBlurEffect = wrapEffect(ProgressiveBlurEffectImpl);
