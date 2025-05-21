'use client';

import { usePathname, useRouter } from 'next/navigation';

import {
  animatePageIn,
  animatePageOut,
  TAnimatePageProps,
} from '@/libs/animations';

export const useAnimationInOut = () => {
  const router = useRouter();
  const pathname = usePathname();

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
        animatePageIn({ href, router, mainColor, secondaryColor });
      }
    },
  };
};
