import { cleanup, render, screen } from '@testing-library/react';

import { DemoForm } from '.';

describe('DemoForm Component', () => {
  afterEach(() => {
    /** Unmount React trees that were mounted with render */
    cleanup();
  });

  it('it should display the FormContent Component', () => {
    render(<DemoForm />);

    expect(screen.getByTestId('form-container')).toBeInTheDocument();
  });
});
