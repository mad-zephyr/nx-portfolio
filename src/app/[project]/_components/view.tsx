'use client';

import { usePathname } from 'next/navigation';

import classes from './styles.module.sass';

export const View = () => {
  const pathname = usePathname();

  return <section className={classes.section}>Section: {pathname}</section>;
};
