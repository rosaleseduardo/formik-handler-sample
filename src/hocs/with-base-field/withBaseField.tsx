import { useEffect } from 'react';
import type { FormikValues } from 'formik';
import { omit } from 'lodash';

import { useWithBaseField } from '@hooks';
import type { BaseFieldProps } from '@interfaces';

/**
 * Enhances a given React component by providing form handling capabilities.
 *
 * It wraps the `WrappedComponent` with additional props such as `onChange`,
 * `onBlur`, `value`, `error`, and `helperText`.
 *
 * The form handling is powered by a `formhandler` instance implementing
 * specific methods.
 *
 * @param WrappedComponent - The React component to be enhanced with form
 * handling props.
 * @param ComponentType - The type of component to be enhanced
 *
 * @typeParam T - The type of form values managed by the form handler.
 *
 * @returns The enhanced component with form handling props.
 */
const withBaseField = <T extends FormikValues>(WrappedComponent: React.FC<T>, ComponentType: string) => {
  /**
   * The enhanced functional component with form handling capabilities.
   *
   * @param props - Props to be passed to the enhanced component.
   *
   * @returns JSX representing the enhanced component.
   */
  return function WithFormHandlerField(props: T & BaseFieldProps<T>) {
    /**
     * List of properties that should be excluded from being passed to HTML
     * elements.
     *
     * These properties are typically custom props used in custom components
     * and should not be injected into the final rendered HTML elements.
     */
    const PROPERTIES_TO_BE_EXCLUDED = ['formHandler'];

    const { debouncedBlurChange, debouncedHandleChange, setInitialValue, value, handleBlur, handleChange } =
      useWithBaseField(props, ComponentType);

    useEffect(() => {
      setInitialValue();

      // Clean up debounced functions when component is unmounted
      return () => {
        debouncedHandleChange.cancel();
        debouncedBlurChange.cancel();
      };
    }, [props.formHandler?.formState().currentState]);

    /**
     * Injects the additional props related to form handling to the
     * WrappedComponent.
     */
    return (
      <WrappedComponent
        {...(omit(props, PROPERTIES_TO_BE_EXCLUDED) as T)}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value}
        error={props.formHandler?.fieldState(props.name).invalid ?? props.error}
        /**
         * IMPORTANT
         *
         * If you are using an internationalization package (such as
         * react-i18next or react-intl), ensure that you call the package
         * translation function here (through the locallization provider). This
         * ensures the error message is translated and displayed seamlessly.
         *
         * NOTE
         *
         * Validation schema messages should only include the translation
         * token. This is the appropriate place to handle the translation of
         * the error message.
         */
        helperText={props.formHandler?.fieldState(props.name).error ?? props.helperText}
      />
    );
  };
};

export default withBaseField;
