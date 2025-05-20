'use client';

import { FC, PropsWithChildren, useEffect } from 'react';

import { Header } from '@/components';
import { animatePageIn } from '@/libs/animations';

const Template: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    animatePageIn();
  }, []);

  return (
    <div>
      <div id="transition-element" />
      <Header />
      {children}
    </div>
  );
};

export default Template;
