import { FC } from 'react';

import { View } from './_components/view';

type TPage = {
  params: Promise<{
    project: string;
  }>;
};

const Page: FC<TPage> = async () => {
  return <View />;
};

export default Page;
