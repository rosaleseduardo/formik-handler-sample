import { useState } from 'react';
import { type FormikErrors, type FormikValues, useFormik } from 'formik';
import { isEqual } from 'lodash';

import { type FormHandlerProps, type SetValueProps } from '@interfaces';
import { getPropPathValue } from '@utils';

import type { DebugModeState, FieldState, FormState } from './interfaces';

/**
 * Custom hook to manage a form
 *
 * @see
 *  [useFormik](https://formik.org/docs/api/useFormik)
 *
 * @returns Methods exposing individual functions to manage the form state.
 */
const useFormHandler = <T extends FormikValues>(props: FormHandlerProps<T>) => {
  /**
   * Formik, by default, display error messages even when the field is untouched
   * (which is not ideal)
   *
   * With this piece of state we provide a workaround for that unwanted
   * behaviour
   */
  const [manualValTriggered, setManualValTriggered] = useState<boolean>(false);

  /**
   * The Formik instance for managing form state and validation.
   *
   * @typeParam T - The type of the form values.
   *
   * @see [Official Docs - API Reference](https://formik.org/docs/api/formik)
   */
  const formInstance = useFormik<T>({
    initialValues: props.initialValues,
    validationSchema: props.validationSchema,
    onSubmit: props.onSubmitHandler,
    enableReinitialize: true,
  });

  /**
   * Sets the value of a form field in the form instance.
   *
   * @param  args - The arguments for setting the form field value.
   *
   * @returns  A Promise that resolves after setting the value.
   */
  const setFormValue = async (args: SetValueProps) => {
    await formInstance.setFieldValue(args.field, args.value, args.shouldValidate ?? true);

    /**
     * This is done so that when it is required to show a validation error
     * we can be sure that the field has been touched (For some reason we have
     * to set this state manually, formik doesn't do it on its own)
     *
     * Reference: https://github.com/jaredpalmer/formik/issues/955
     */
    await formInstance.setFieldTouched(args.field, true, false);
  };

  /**
   * Get the current state of the form instance.
   *
   * @returns An object representing the current form state.
   */
  const formState = (): FormState => ({
    initialValues: formInstance.initialValues,
    currentState: formInstance.values,
    isValid: !formInstance.isValid,
    errors: formInstance.errors,
    hasBeenUpdated: !isEqual(formInstance.initialValues, formInstance.values),
  });

  /**
   * Get the state of a specific form field in the form instance.
   *
   * @param  field - The name of the form field.
   *
   * @returns An object representing the state of the specified form field.
   */
  const fieldState = (field: string): FieldState => {
    if (!manualValTriggered) {
      const fieldIsVisitedAndInvalid =
        Boolean(getPropPathValue(formInstance.touched, field)) && Boolean(getPropPathValue(formInstance.errors, field));

      return {
        invalid: fieldIsVisitedAndInvalid,
        error: !fieldIsVisitedAndInvalid ? '' : (getPropPathValue(formInstance.errors, field) as string),
      };
    }

    return {
      invalid: Boolean(getPropPathValue(formInstance.errors, field)),
      error: getPropPathValue(formInstance.errors, field) as string,
    };
  };

  /**
   * This function can manually clear errors in the form.
   */
  const clearErrors = (input?: FormikErrors<Partial<T>>) => {
    if (typeof input === 'string') formInstance.setFieldError(input, '');
    if (typeof input === 'object') formInstance.setErrors(input);

    formInstance.setErrors({});
  };

  /**
   * Reset the form instance to its initial state.
   *
   * IMPORTANT: nextState should match the type T (FormikValues). In case they
   * are provided, they will be set as the current form values
   *
   * @param  nextState - (Optional) The state to reset the form to.
   */
  const resetForm = (nextState?: Partial<T>): void => {
    clearErrors();
    /** Flag to determine data to be returned in method `fieldState` */
    setManualValTriggered(false);

    if (nextState !== undefined) {
      const { currentState } = formState();

      formInstance.setValues({
        ...(currentState as T),
        ...(nextState as T),
      });

      return;
    }

    formInstance.resetForm({ values: props.initialValues });
  };

  /**
   * Trigger form validation for the entire form instance or a specific field.
   *
   * @param  input - (Optional) The name of the field to validate. If not
   * provided, validates the entire form.
   *
   * @returns  A Promise that resolves after validation is performed.
   */
  const triggerValidation = async (input?: string): Promise<void> => {
    /** Flag to determine data to be returned in method `fieldState` */
    setManualValTriggered(true);

    if (input !== undefined) {
      await formInstance.validateField(input);
      return;
    }

    await formInstance.validateForm();
  };

  /**
   * The default form submission handler for the form instance.
   *
   * @typeParam M - The type of the form values upon submission.
   *
   * @param data - The form values upon submission.
   */
  const onSubmitHandler = (): void => {
    formInstance.handleSubmit();
  };

  /**
   * Get a debug snapshot of the current state of the form instance.
   *
   * @returns An object representing the debug snapshot of the current form
   * state.
   */
  const debugMode = (): DebugModeState => {
    const { initialValues, currentState, isValid, errors, hasBeenUpdated } = formState();

    return {
      initialValues,
      currentState,
      isValid: !isValid,
      errors,
      hasBeenUpdated,
    };
  };

  return {
    setFormValue,
    formState,
    fieldState,
    resetForm,
    triggerValidation,
    onSubmitHandler,
    debugMode,
    clearErrors,
  };
};

export default useFormHandler;
