import { FC, PropsWithChildren } from 'react';

import { Header } from '@/components';

const Template: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Template;
