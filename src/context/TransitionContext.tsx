'use client';

import React, { createContext, ReactElement } from 'react';
import { useState } from 'react';

type TTransitionContext = {
  completed: boolean;
  toggleCompleted: (compleated: boolean) => void;
};

const TransitionContext = createContext<TTransitionContext>({
  completed: false,
  toggleCompleted: () => null,
});

export const TransitionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [completed, setCompleted] = useState(false);

  const toggleCompleted = (value: boolean) => {
    setCompleted(value);
  };

  return (
    <TransitionContext.Provider
      value={{
        toggleCompleted,
        completed,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionContext;
