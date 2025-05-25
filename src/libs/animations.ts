import gsap from 'gsap';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import { hexToRgb } from './hexToRgb';

export type TAnimatePageProps = {
  href: string;
  router: AppRouterInstance;
  mainColor: string;
  secondaryColor: string;
};

export const animatePageIn = ({
  href,
  router,
  mainColor,
  secondaryColor,
}: TAnimatePageProps) => {
  const animationWrapper = document.getElementById('transition-element');

  if (animationWrapper) {
    const tl = gsap.timeline();
    const tl2 = gsap.timeline();

    const body = document.body;

    const getStyles = (key: string) => (i: unknown, el: Element) =>
      getComputedStyle(el).getPropertyValue(key);

    tl2
      .set(body, {
        '--transition-color': getStyles('--transition-color'),
      })
      .to(body, {
        duration: 0.8,
        '--transition-color': hexToRgb(mainColor),
      })
      .set(body, {
        '--main-color': hexToRgb(mainColor),
        '--secondary-color': hexToRgb(secondaryColor),
      });

    tl.set(animationWrapper, {
      yPercent: 0,
      opacity: 1,
      display: 'grid',
    }).to(animationWrapper, {
      yPercent: 0,
      '--a-start': 1, // 0 → 1
      '--a-mid': 1, // 0.6 → 1
      '--stop': '100%',
      duration: 1.2,
      ease: 'power1.inOut',
      onComplete: () => {
        router.push(href);
      },
    });

    // .to(
    //   animationWrapper,
    //   {
    //     duration: 0.4,
    //   },
    //   '<'
    // );
  }
};

export const animatePageOut = () => {
  const animationWrapper = document.getElementById('transition-element');

  if (animationWrapper) {
    const tl = gsap.timeline();

    tl.set(animationWrapper, {
      yPercent: 0,
      opacity: 1,
    })
      .to(
        animationWrapper,
        {
          // yPercent: -100,
          opacity: 0,
          duration: 0.8,
        },
        1.2
      )
      .set(animationWrapper, {
        display: 'none',
        yPercent: -100,
      });

    // .to(
    //   animationWrapper,
    //   {
    //     duration: 0.4,
    //   },
    //   '<'
    // );
  }
};
