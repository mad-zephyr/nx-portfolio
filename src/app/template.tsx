'use client';

import { FC, PropsWithChildren, useEffect } from 'react';

import { Header } from '@/components';
import { animatePageOut } from '@/libs/animations';

const Template: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    animatePageOut();
  }, []);

  return (
    <>
      <div
        id="transition-element"
        style={{ background: 'var(--main-color)' }}
      />
      <Header />
      {children}
    </>
  );
};

export default Template;
