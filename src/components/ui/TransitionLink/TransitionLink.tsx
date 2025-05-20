'use client';

import { useRouter } from 'next/navigation';
import { MouseEvent, PropsWithChildren } from 'react';

import { animatePageOut } from '@/libs/animations';

type TTransitionLink = {
  href: string;
  label?: string;
};

export default function TransitionLink({
  href,
  children,
}: PropsWithChildren<TTransitionLink>) {
  const router = useRouter();

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    animatePageOut(href, router);
  };

  return <a onClick={(e) => handleClick(e)}>{children}</a>;
}
