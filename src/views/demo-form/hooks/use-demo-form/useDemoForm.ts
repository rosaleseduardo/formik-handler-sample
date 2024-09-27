import { useMemo, useState } from 'react';
import { useFormHandler } from 'hooks';
import * as yup from 'yup';

import type { FormMode, UseFormHelperReturn } from '@interfaces';

import type { DemoFormSchema } from '../../interfaces';

/**
 * Custom hook for handling a demo form. It provides the form handler and
 * context value for the form.
 *
 * @returns An object containing the form handler and context value for the
 * demo form.
 *
 * @example
 * ```tsx
 * import { useDemoForm } from './path/to/useDemoForm';
 * import { DemoFormContext } from './path/to/DemoForm.context';
 * import { FormContent } from './path/to/DemoForm.component.Content';
 *
 * const Component = () => {
 *   const { contextValue } = useDemoForm();
 *
 *   return (
 *     <DemoFormContext.Provider value={contextValue}>
 *       <FormContent debugMode />
 *     </DemoFormContext.Provider>
 *   );
 * };
 * ```
 */
const useDemoForm = (): UseFormHelperReturn<DemoFormSchema> => {
  /**
   * NOTE: Apply the logic to determine the Form Mode, which will serve to fuel
   * the right context to the local state.
   */
  const [mode] = useState<FormMode>('create');
  const initialValues: Record<keyof DemoFormSchema, string> = {
    name: '',
    lastName: '',
  };

  const validationSchema = yup
    .object()
    .shape<Record<keyof DemoFormSchema, yup.Schema>>({
      name: yup.string().required('This field is required'),
      lastName: yup.string().required('This field is required'),
    });

  const onSubmit = (values: DemoFormSchema) => {
    console.log('Data ', values);
  };

  const formHandler = useFormHandler<DemoFormSchema>({
    initialValues,
    validationSchema,
    onSubmitHandler: onSubmit,
  });

  /** IMPORTANT: This prevents non-stable values (i.e. object identities)
   * from being used as a value for Context.Provider. */
  const contextValue = useMemo(
    () => ({
      formHandler,
      mode,
    }),
    [formHandler, mode],
  );

  return {
    initialValues,
    validationSchema,
    onSubmit,
    formHandler,
    contextValue,
  };
};

export default useDemoForm;
