import { DebugModeUI } from 'hooks';

import { TextField } from '@components';
import type { FormDebugOption } from '@interfaces';

import { ActionButtons } from '../../components';
import { useDemoFormContext } from '../../providers';

import * as S from './styles';

/**
 * Renders the form content with input fields and action buttons.
 *
 * @param debugMode - Determines whether to display the form in debug mode.
 *
 * @returns The JSX element representing the form content.
 */
const FormContent = ({ debugMode = false }: FormDebugOption) => {
  const { formHandler } = useDemoFormContext();

  return (
    <S.Box data-testid="form-container">
      <TextField
        data-testid="name-input"
        name="name"
        label="Name"
        formhandler={formHandler}
      />
      <TextField
        data-testid="lastName-input"
        name="lastName"
        label="Last Name"
        formhandler={formHandler}
      />
      <button
        type="button"
        onClick={formHandler.onSubmitHandler}
        disabled={formHandler.formState().isValid}
      >
        Submit
      </button>
      <ActionButtons />
      {debugMode && DebugModeUI(formHandler)}
    </S.Box>
  );
};

export default FormContent;
