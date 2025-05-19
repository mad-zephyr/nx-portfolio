/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box as B, BoxProps } from '@react-three/flex';
import { FC, PropsWithChildren } from 'react';

type TBox = {} & Partial<BoxProps>;

export const Box: FC<PropsWithChildren<TBox>> = ({ children, ...props }) => {
  //@ts-ignore
  return <B {...props}>{children}</B>;
};
