// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RawBlurMaterial } from "@/components/materials/BlurMaterial";

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      rawBlurMaterial: ReactJSX.IntrinsicElements["shaderMaterial"] & {
        uTexture: THREE.Texture;
        opacity?: number;
        blurStrength?: number;
        blurSize?: number;
        colorOverlay?: string | THREE.Color;
        transparent?: boolean;
      };
    }
  }
}
