import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useState } from "react";
import { PerspectiveCamera } from "three";
import { useMediaQuery } from "usehooks-ts";

type TuseResponsiveImageSize = {
  tilesPerRow?: number;
  gap?: number;
  imageSize: [number, number];
};

export function useResponsiveImageSize({
  tilesPerRow = 2,
  gap = 0,
  imageSize,
}: TuseResponsiveImageSize) {
  const matches = useMediaQuery("(max-width: 768px)");

  const { camera, size } = useThree();
  const [imageSizes, setImageSizes] = useState<[number, number]>(imageSize);

  useLayoutEffect(() => {
    if (!camera) return;

    const perspectiveCamera = camera as PerspectiveCamera;
    const fov = (perspectiveCamera.fov * Math.PI) / 180;
    const distance = perspectiveCamera.position.z;
    const aspect = size.width / size.height;

    const worldHeight = 2 * Math.tan(fov / 2) * distance;
    const worldWidth = worldHeight * aspect;

    const tileWidth = (worldWidth - (tilesPerRow - 1) * gap) / tilesPerRow;
    setImageSizes([tileWidth, tileWidth]);
  }, [camera, size.width, size.height, tilesPerRow, gap]);

  if (!matches) {
    return {
      imageSizes: imageSize,
      spacing: imageSize[0],
    };
  }

  return {
    imageSizes: imageSizes,
    spacing: imageSizes[0],
  };
}
