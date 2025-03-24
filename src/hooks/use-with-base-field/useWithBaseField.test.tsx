import { afterEach, describe, expect, it } from 'vitest';

import { act, cleanup, renderHook } from '@testing-library/react';

import { useWithBaseField } from '.';

/**
 * Creates a simple form handler object to manage form state.
 */
const createTestFormHandler = () => {
  let state: Record<string, unknown> = {};

  return {
    formState: () => ({ currentState: state }),
    setFormValue: ({ field, value }: { field: string; value: string }) => {
      state = { ...state, [field]: value };
    },
  };
};

describe('useWithBaseField Hook', () => {
  afterEach(() => {
    cleanup();
  });

  it('Initializes with the provided value', () => {
    const { result } = renderHook(() => useWithBaseField({ name: 'testField', value: 'initialValue' }));

    expect(result.current.value).toBe('');
  });

  it('Sets initial value from formHandler state', () => {
    const formHandler = createTestFormHandler();
    formHandler.setFormValue({ field: 'testField', value: 'preset value' });

    const { result } = renderHook(() =>
      useWithBaseField({
        name: 'testField',
        // @ts-expect-error: This formHandler instance is missing the rest of the methods. Only the required were
        // included
        formHandler,
      }),
    );

    act(() => {
      result.current.setInitialValue();
    });

    expect(result.current.value).toBe('preset value');
  });

  it('Defaults to `props.value` if no formHandler state exists', () => {
    const { result } = renderHook(() => useWithBaseField({ name: 'testField', value: 'defaultVal' }));

    act(() => {
      result.current.setInitialValue();
    });

    expect(result.current.value).toBe('defaultVal');
  });
});
