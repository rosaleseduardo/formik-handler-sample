import { type ChangeEvent, type FocusEvent, useRef, useState } from 'react';

import { withBaseField } from '@hocs';
import { TextField as MUITextField, type TextFieldProps } from '@mui/material';

/**
 * Custom TextField component that integrates with form handling utilities.
 *
 * @typeParam T - The type of form values managed by the form handler.
 *
 * @param props - The properties for the TextField.
 *
 * @returns A form-aware TextField component.
 */
const BaseTextField = (props: TextFieldProps) => {
  const [value, setValue] = useState<string>('');

  /**
   * A reference to the underlying HTML input element.
   *
   * It can be used to interact with the input element directly if needed.
   */
  const ref = useRef<HTMLInputElement>(null);

  return (
    <MUITextField
      {...props}
      ref={ref}
      autoComplete="off"
      value={value}
      onChange={(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setValue(event.target.value);

        props.onChange?.(event);
      }}
      onBlur={(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(event.target.value);

        props.onBlur?.(event);
      }}
    />
  );
};

/**
 * A form-aware TextField component created by enhancing the `BaseTextField`
 * component with form handling capabilities.
 *
 * @typeParam T - The type of form values managed by the form handler.
 *
 * @param props - The properties for the TextField, including form handling
 * props.
 *
 * @returns A form-aware TextField component.
 */
const TextField = withBaseField(BaseTextField, 'TextField');

export default TextField;
