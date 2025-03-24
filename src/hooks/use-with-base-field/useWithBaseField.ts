import { type ChangeEvent, type FocusEvent, useState } from 'react';
import { type FormikValues } from 'formik';
import { debounce } from 'lodash';

import type { BaseFieldProps } from '@interfaces';
import { getPropPathValue } from '@utils';

/**
 * A hook for handling form field input with optional Formik integration.
 *
 * @typeparam T - The type of Formik values.
 *
 * @param props - The properties to configure the form field.
 * @param componentType - The type of component
 *
 * @returns An object containing handlers for `onChange` and `onBlur` events,
 * the current input value, and a method to set the initial value.
 */
const useWithBaseField = <T extends FormikValues>(props: T & BaseFieldProps<T>, componentType?: string) => {
  const [value, setValue] = useState<string>('');

  const parseValue = (input: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    switch (componentType) {
      case 'TextField':
        return input.target.value;
      default:
        return input;
    }
  };

  /**
   * A debounced version of the `onChange` function.
   */
  const debouncedHandleChange = debounce(async (input: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // This will update Formik's state
    await props.formHandler?.setFormValue({
      field: props.name,
      value: parseValue(input),
    });

    // This will update local input state
    props.onChange?.(input);
  }, 300);

  /**
   * A debounced version of the `onBlur` function.
   */
  const debouncedBlurChange = debounce(async (input: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // This will update Formik's state
    await props.formHandler?.setFormValue({
      field: props.name,
      value: parseValue(input),
    });

    // This will update local input state
    props.onBlur?.(input);
  }, 300);

  /**
   * Handles the `onChange` event for the input element.
   *
   * @param e - The `ChangeEvent` object.
   */
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);

    await debouncedHandleChange(e);
  };

  /**
   * Handles the `onBlur` event for the input element.
   *
   * @param e - The `FocusEvent` object.
   */
  const handleBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);

    await debouncedBlurChange(e);
  };

  /**
   * Sets the initial value of the input field based on:
   *
   * - Formik's current state, if formHandler is provided
   * - Initial value assigned to the field when implemented outside of a form
   */
  const setInitialValue = () => {
    const currentState = props.formHandler?.formState().currentState;

    setValue(!currentState ? props.value : getPropPathValue(currentState, props.name));
  };

  return {
    handleBlur,
    handleChange,
    debouncedBlurChange,
    debouncedHandleChange,
    value,
    setInitialValue,
  };
};

export default useWithBaseField;
