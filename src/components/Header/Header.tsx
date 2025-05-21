'use client';

import { useAnimationInOut } from '@/hooks';

import { Button } from '../ui';
import classes from './styles.module.sass';

export const Header = () => {
  const { animatePageIn } = useAnimationInOut();

  const handleClick = (href: string) => {
    animatePageIn({ href, mainColor: '#222', secondaryColor: '#fff' });
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo} onClick={() => handleClick('/')}>
        NX
      </div>

      <div className={classes.tag}>
        We create <i>solutions</i>
        <br /> that work <i>for business</i>
      </div>

      <Button
        className={classes.cta}
        onClick={() => {
          animatePageIn({
            href: '/connect-page',
            mainColor: '#3F88C5',
            secondaryColor: '#fff',
          });
        }}
      >
        Let`s Talk
      </Button>
    </header>
  );
};
