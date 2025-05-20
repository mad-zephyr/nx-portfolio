'use client';

import { usePathname, useRouter } from 'next/navigation';

import { animatePageIn, animatePageOut } from '@/libs/animations';

export const useAnimationInOut = () => {
  const router = useRouter();
  const pathname = usePathname();

  return {
    animatePageOut: (href: string) => {
      if (pathname !== href) {
        animatePageOut(href, router);
      }
    },

    animatePageIn: animatePageIn,
  };
};
