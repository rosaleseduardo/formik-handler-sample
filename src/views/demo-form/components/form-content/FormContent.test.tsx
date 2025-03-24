import { vitest } from 'vitest';

import { render, screen } from '@testing-library/react';

import { useDemoForm } from '../../hooks';
import { DemoFormContext } from '../../providers';

import { FormContent } from '.';

describe('FormContent', () => {
  const mockFormHandler = {
    onSubmitHandler: vitest.fn(),
    formState: vitest.fn().mockReturnValue({ isValid: true }),
  };

  const renderComponent = (debugMode = false) =>
    render(<FormContent debugMode={debugMode} />, {
      wrapper: ({ children }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { contextValue } = useDemoForm();

        return (
          <DemoFormContext.Provider value={contextValue}>
            <div>{children}</div>
          </DemoFormContext.Provider>
        );
      },
    });

  afterEach(() => {
    vitest.restoreAllMocks();
  });

  it('Renders input fields and submit button', () => {
    renderComponent();

    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('lastName-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('phoneNumber-input')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('Submit button is valid once the form loads', () => {
    mockFormHandler.formState.mockReturnValue({ isValid: true });
    renderComponent();

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeEnabled();
  });

  it('Renders DebugModeUI when debugMode is true', () => {
    renderComponent(true);

    const debugModeUI = screen.getByTestId('debug-mode-ui');
    expect(debugModeUI).toBeInTheDocument();
  });
});
