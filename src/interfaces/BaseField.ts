import type { FormikValues } from 'formik';

import type { UseFormReturn } from '@interfaces';

/**
 * Represents the base props that can be used with a form field component.
 *
 * @typeParam T - The type of form values that the form field component deals
 * with.
 */
export interface BaseFieldProps<T extends FormikValues> {
  /**
   * The form handler object returned from the `useForm` hook.
   *
   * It provides access to form-related functions and data.
   *
   * This property is optional and can be omitted if the form handler is not
   * required for the field component.
   */
  formhandler?: UseFormReturn<T>;
}
