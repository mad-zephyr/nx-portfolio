import { FC } from 'react';

import TransitionComponent from '@/components/Transitions';

const Page: FC = async () => {
  return (
    <TransitionComponent>
      <>
        <section>Section</section>
      </>
    </TransitionComponent>
  );
};
export default Page;
