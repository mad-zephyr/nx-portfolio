import { Vector2 } from "three";

export const PincushionShader = {
  uniforms: {
    tDiffuse: { value: null },
    distortion: { value: -2.0 },
    resolution: { value: new Vector2() },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float distortion;
    uniform vec2 resolution;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      float r = length(uv);
      uv *= 1.0 + distortion * r * r;
      uv = uv * 0.5 + 0.5;

      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0);
      } else {
        gl_FragColor = texture2D(tDiffuse, uv);
      }
    }`,
};
