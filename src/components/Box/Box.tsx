/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, PropsWithChildren } from "react";
import { Box as B } from "@react-three/flex";
import { TBoxProps } from "@/types/types";

type TBox = {} & Partial<TBoxProps>;

export const Box: FC<PropsWithChildren<TBox>> = ({ children, ...props }) => {
  //@ts-ignore
  return <B {...props}>{children}</B>;
};
