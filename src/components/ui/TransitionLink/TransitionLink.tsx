'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, PropsWithChildren } from 'react';

import { animatePageIn } from '@/libs/animations';

type TTransitionLink = {
  href: string;
  label?: string;
  mainColor: string;
  secondaryColor: string;
};

export default function TransitionLink({
  href,
  children,
  mainColor,
  secondaryColor,
}: PropsWithChildren<TTransitionLink>) {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    animatePageIn({ href, router, mainColor, secondaryColor });
  };

  return <a onClick={(e) => handleClick(e)}>{children}</a>;
}
