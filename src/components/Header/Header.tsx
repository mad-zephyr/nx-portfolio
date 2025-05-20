'use client';

import { useAnimationInOut } from '@/hooks';

import { Button } from '../ui';
import classes from './styles.module.sass';

export const Header = () => {
  const { animatePageOut } = useAnimationInOut();

  const handleClick = (href: string) => {
    animatePageOut(href);
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
        onClick={() => handleClick('/connect-page')}
      >
        Let`s Talk
      </Button>
    </header>
  );
};
