import gsap from 'gsap';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

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
        '--main-color': getStyles('--main-color'),
        '--secondary-color': getStyles('--secondary-color'),
      })
      .to(body, {
        duration: 0.8,
        '--main-color': mainColor,
        '--secondary-color': secondaryColor,
      });

    tl.set(animationWrapper, {
      yPercent: 100,
      opacity: 1,
      display: 'unset',
    })
      .to(animationWrapper, {
        yPercent: 0,
        duration: 0.8,
        onComplete: () => {
          router.push(href);
        },
      })

      .to(
        animationWrapper,
        {
          duration: 0.4,
        },
        '<'
      );
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
      .to(animationWrapper, {
        // yPercent: -100,
        opacity: 0,
        duration: 0.8,
      })
      .set(animationWrapper, {
        display: 'none',
      })
      .to(
        animationWrapper,
        {
          duration: 0.4,
        },
        '<'
      );
  }
};
