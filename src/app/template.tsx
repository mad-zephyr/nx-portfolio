'use client';

import { useGSAP } from '@gsap/react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';

import { Header } from '@/components';
import { useAppStore } from '@/context';
import { animatePageOut } from '@/libs/animations';

import classes from './page.module.sass';

const Template: FC<PropsWithChildren> = ({ children }) => {
  const num = useRef<HTMLSpanElement>(null);
  const panthName = usePathname();
  const dataProgress = useProgress();
  const isMainPage = useAppStore((state) => state.isMainPage);

  const { setIsMainpage } = useAppStore.getState();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsMainpage(panthName === '/');
  }, [panthName, setIsMainpage]);

  useEffect(() => {
    if (!isMainPage || dataProgress.progress === 100) {
      setIsLoaded(true);
    }
  }, [dataProgress, isMainPage]);

  useEffect(() => {
    if (isLoaded) {
      animatePageOut();
    }
  }, [isLoaded]);

  useGSAP(
    () => {
      gsap.to(num.current, {
        duration: 0.25,
        textContent: Math.round(dataProgress.progress),
        snap: { textContent: 1 },
        ease: 'circ.in',
      });
    },
    { scope: num, dependencies: [dataProgress] }
  );

  return (
    <>
      <div id="transition-element" className={classes.transiton}>
        {isMainPage && (
          <span ref={num} className={classes.transitonProgress}>
            0
          </span>
        )}
      </div>
      <Header />
      {children}
    </>
  );
};

export default Template;
