// ProgressiveBlurEffect.tsx
import { wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";

const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uBlurStrength;
uniform vec4 blurArea;
uniform vec3 overlayColor;
uniform float overlayAlpha;
uniform sampler2D tMap;

float tvNoise(vec2 p, float ta, float tb) {
  return fract(sin(p.x * ta + p.y * tb) * 8678.0);
}

vec3 draw(sampler2D image, vec2 uv) {
  return texture(image, uv).rgb;
}

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 blur(vec2 uv, sampler2D image, float blurAmount, float strength) {
  vec3 blurred = vec3(0.0);
  const float steps = 8.0;

  for (float x = -steps; x <= steps; x++) {
    for (float y = -steps; y <= steps; y++) {
      vec2 offset = vec2(x, y) * blurAmount * strength;
      blurred += draw(image, uv + offset);
    }
  }

  float total = (2.0 * steps + 1.0) * (2.0 * steps + 1.0);
  return blurred / total;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outColor) {
  bool inBlurArea = (
    uv.x >= blurArea.x &&
    uv.x <= (blurArea.x + blurArea.z) &&
    uv.y >= blurArea.y &&
    uv.y <= (blurArea.y + blurArea.w)
  );

  float blurStart = blurArea.y;
  float blurEnd = blurArea.y + blurArea.w * 0.7;
  float verticalFade = inBlurArea ? smoothstep(blurStart, blurEnd, uv.y) : 0.0;

  float effectiveStrength = uBlurStrength * verticalFade;

  vec3 base = draw(tMap, uv);
  vec3 blurred = inBlurArea
    ? blur(uv, tMap, 0.0015, effectiveStrength)
    : base;

  blurred = mix(blurred, overlayColor, verticalFade * overlayAlpha);

  float t = uTime + 123.0;
  float ta = t * 0.654321;
  float tb = t * (ta * 0.123456);
  float noise = tvNoise(uv * 100.0 + vec2(uTime * 0.5, uTime * 0.8), ta, tb) * 0.01 * verticalFade;

  // vec3 final = blurred - vec3(noise); // или mix(blurred, vec3(1.0), noise * 0.5);
  vec3 final = mix(blurred, vec3(1.0), noise * 0.5);

  outColor = vec4(final, 1.0);
}

`;

export class ProgressiveBlurEffectImpl extends Effect {
  constructor({
    blurStrength = 1.0,
    blurArea = [0.0, 0.8, 1.0, 0.2],
    overlayColor = [1.0, 1.0, 1.0], // белый по умолчанию
    overlayAlpha = 0.25,
  } = {}) {
    super("ProgressiveBlurEffect", fragmentShader, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      uniforms: new Map<string, any>([
        ["uBlurStrength", { value: blurStrength }],
        ["blurArea", { value: new Float32Array(blurArea) }],
        ["overlayColor", { value: new Float32Array(overlayColor) }],
        ["overlayAlpha", { value: overlayAlpha }],
        ["uTime", { value: 0 }],
      ]),
    });
  }

  updateTime(delta: number) {
    const time = this.uniforms.get("uTime");
    if (time) time.value += delta;
  }
}

export const ProgressiveBlurEffect = wrapEffect(ProgressiveBlurEffectImpl);
