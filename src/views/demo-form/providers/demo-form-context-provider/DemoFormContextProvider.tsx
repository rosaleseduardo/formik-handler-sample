import type { FC, ReactNode } from 'react';

import { useDemoForm } from '../../hooks';

import { DemoFormContext } from '.';

const DemoFormContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { contextValue } = useDemoForm();

  return (
    <DemoFormContext.Provider value={contextValue}>
      {children}
    </DemoFormContext.Provider>
  );
};

export default DemoFormContextProvider;
