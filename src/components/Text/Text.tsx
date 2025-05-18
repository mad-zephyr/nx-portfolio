import { useReflow } from "@react-three/flex";
import { Text as TextImpl, TextProps } from "@react-three/drei";
import { FC } from "react";

type TText = {
  bold?: boolean;
} & TextProps;

export const Text: FC<TText> = ({
  anchorX = "left",
  anchorY = "top",
  textAlign = "left",
  ...props
}) => {
  const reflow = useReflow();
  const font = "/fonts/onest-regular.woff";
  return (
    <TextImpl
      anchorX={anchorX}
      anchorY={anchorY}
      textAlign={textAlign}
      font={font}
      onSync={reflow}
      {...props}
    />
  );
};
