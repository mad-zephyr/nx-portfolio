/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Flex as F, FlexProps } from '@react-three/flex';
import { FC, PropsWithChildren } from 'react';

type TFlex = Partial<FlexProps>;

export const Flex: FC<PropsWithChildren<TFlex>> = ({ children, ...props }) => {
  return (
    //@ts-ignore
    <F size={[5, 5, 0]} flexDirection="column" {...props}>
      {children}
    </F>
  );
};
