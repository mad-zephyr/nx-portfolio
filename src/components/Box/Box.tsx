/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, PropsWithChildren } from "react";
import { Box as B, BoxProps } from "@react-three/flex";

type TBox = {} & Partial<BoxProps>;

export const Box: FC<PropsWithChildren<TBox>> = ({ children, ...props }) => {
  //@ts-ignore
  return <B {...props}>{children}</B>;
};
