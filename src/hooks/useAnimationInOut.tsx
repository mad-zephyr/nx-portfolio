'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useAppStore } from '@/context';
import {
  animatePageIn,
  animatePageOut,
  TAnimatePageProps,
} from '@/libs/animations';

export const useAnimationInOut = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { setIsMainpage } = useAppStore.getState();

  return {
    animatePageOut: () => {
      animatePageOut();
    },

    animatePageIn: ({
      href,
      mainColor,
      secondaryColor,
    }: Omit<TAnimatePageProps, 'router'>) => {
      if (pathname !== href) {
        setIsMainpage(href === '/');
        animatePageIn({ href, router, mainColor, secondaryColor });
      }
    },
  };
};
