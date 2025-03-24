import { afterEach, describe, expect, it, vi } from 'vitest';
import * as yup from 'yup';

import { act, cleanup, renderHook } from '@testing-library/react';

import { useDemoForm } from '.';

describe('useDemoForm Hook', () => {
  afterEach(() => {
    cleanup();
  });

  const performRender = () => renderHook(() => useDemoForm());

  it('Exposes expected methods and properties', () => {
    const { result } = performRender();

    expect(Object.keys(result.current)).toEqual([
      'initialValues',
      'validationSchema',
      'onSubmit',
      'formHandler',
      'contextValue',
    ]);
  });

  it('Ensures returned types match expected definitions', () => {
    const { result } = performRender();

    expect(result.current).toEqual({
      initialValues: expect.any(Object),
      validationSchema: expect.any(yup.Schema),
      onSubmit: expect.any(Function),
      formHandler: expect.any(Object),
      contextValue: expect.any(Object),
    });
  });

  it('Contains the expected default initial values', () => {
    const { result } = performRender();

    expect(result.current.initialValues).toEqual({
      name: '',
      lastName: '',
      contactDetails: {
        email: '',
        phoneNumber: '',
      },
    });
  });

  it('Validation schema includes the correct fields', () => {
    const { result } = performRender();

    expect(Object.keys(result.current.validationSchema.fields)).toEqual(['name', 'lastName', 'contactDetails']);

    expect(
      // @ts-expect-error: Property 'fields' does not exist on type 'Reference<unknown>'
      Object.keys(result.current.validationSchema.fields.contactDetails.fields),
    ).toEqual(['email', 'phoneNumber']);
  });

  it('Calls onSubmit with correct values', () => {
    const { result } = performRender();
    const mockValues = {
      name: 'John',
      lastName: 'Doe',
      contactDetails: {
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
      },
    };

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    act(() => {
      result.current.onSubmit(mockValues);
    });

    expect(consoleSpy).toHaveBeenCalledWith('Data ', mockValues);

    consoleSpy.mockRestore();
  });

  it('Returns a stable contextValue containing formHandler and mode', () => {
    const { result } = performRender();

    expect(result.current.contextValue).toHaveProperty('formHandler');
    expect(result.current.contextValue).toHaveProperty('mode', 'create');
  });
});
