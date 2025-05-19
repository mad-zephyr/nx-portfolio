'use client';

import { useRouter } from 'next/navigation';

import { Button } from '../ui';
import classes from './styles.module.sass';

export const Header = () => {
  const { push } = useRouter();

  return (
    <header className={classes.header}>
      <div className={classes.logo} onClick={() => push('/')}>
        NX
      </div>

      <div className={classes.tag}>
        We create <i>solutions</i>
        <br /> that work <i>for business</i>
      </div>

      <Button className={classes.cta} onClick={() => push('/google')}>
        Let`s Talk
      </Button>
    </header>
  );
};
