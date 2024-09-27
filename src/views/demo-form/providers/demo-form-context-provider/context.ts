import { createContext, useContext } from 'react';

import type { FormContext } from '@interfaces';

import type { DemoFormSchema } from '../../interfaces';

/**
 * Context for managing the state and operations related to a demo form.
 *
 * This context provides a shared state and functions for managing form data
 * and operations in the demo form component.
 */
export const DemoFormContext = createContext<FormContext<DemoFormSchema>>(
  {} as never,
);

/**
 * Hook to access the demo form context.
 *
 * This hook allows components to consume the `DemoFormContext` and
 * access the state and functions provided for managing the demo form.
 *
 * @returns The context value, including state and operations for managing
 * the demo form.
 */
export const useDemoFormContext = (): FormContext<DemoFormSchema> =>
  useContext(DemoFormContext);
