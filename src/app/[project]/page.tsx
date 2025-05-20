import { FC } from 'react';

import TransitionComponent from '@/components/Transitions';

type TPage = {
  params: Promise<{
    project: string;
  }>;
};

const Page: FC<TPage> = async (props) => {
  const params = await props.params;

  return (
    <TransitionComponent>
      <>
        <section style={{ padding: '5rem 1rem', color: 'wheat' }}>
          Section: {params.project}
        </section>
      </>
    </TransitionComponent>
  );
};
export default Page;
