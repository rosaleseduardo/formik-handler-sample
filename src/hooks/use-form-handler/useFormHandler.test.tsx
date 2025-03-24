import { afterEach, describe, expect, it, vi } from 'vitest';

import { act, cleanup, renderHook } from '@testing-library/react';

import { initialValues, validationSchema } from './mocks';
import useFormHandler from './useFormHandler';

const performRender = (onSubmitHandler = vi.fn()) =>
  renderHook(() =>
    useFormHandler({
      initialValues,
      validationSchema,
      onSubmitHandler,
    }),
  );

describe('useFormHandler Hook', () => {
  afterEach(() => {
    cleanup();
  });

  it('Returns methods exposing individual functions to manage the form state', () => {
    const { result } = performRender();

    expect(Object.keys(result.current)).toEqual([
      'setFormValue',
      'formState',
      'fieldState',
      'resetForm',
      'triggerValidation',
      'onSubmitHandler',
      'debugMode',
      'clearErrors',
    ]);
  });

  it('Type definitions for the previous methods returned are the expected', () => {
    const { result } = performRender();

    expect(result.current).toEqual({
      setFormValue: expect.any(Function),
      formState: expect.any(Function),
      fieldState: expect.any(Function),
      resetForm: expect.any(Function),
      triggerValidation: expect.any(Function),
      onSubmitHandler: expect.any(Function),
      debugMode: expect.any(Function),
      clearErrors: expect.any(Function),
    });
  });

  describe('Hook functionalities work as expected', () => {
    it('formState - Returns an object containing information about the entire form state', () => {
      const { result } = performRender();

      expect(result.current.formState()).toStrictEqual({
        initialValues,
        currentState: initialValues,
        isValid: false,
        hasBeenUpdated: false,
        errors: {},
      });
    });

    it('fieldState - Returns individual field state', () => {
      const { result } = performRender();

      expect(result.current.fieldState('email')).toStrictEqual({
        invalid: false,
        error: '',
      });
    });

    it('setFormValue - Updates form field value', async () => {
      const { result } = performRender();

      await act(async () => {
        await result.current.setFormValue({
          field: 'email',
          value: 'test@example.com',
        });
      });

      expect(result.current.formState().currentState.email).toBe('test@example.com');
    });

    it('resetForm - Resets the form state', async () => {
      const { result } = performRender();

      await act(async () => {
        await result.current.setFormValue({
          field: 'email',
          value: 'changed@example.com',
        });
      });

      expect(result.current.formState().currentState.email).toBe('changed@example.com');

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formState().currentState.email).toBe(initialValues.email);
    });

    it('resetForm - Resets the form state with nextState object', async () => {
      const { result } = performRender();
      const nextState = {
        email: 'newemail@example.com',
        name: 'John',
      };

      act(() => {
        result.current.resetForm(nextState);
      });

      expect(result.current.formState().currentState).toStrictEqual({
        email: 'newemail@example.com',
        lastName: 'Rosales',
        name: 'John',
        sex: 'M',
      });
    });

    it('triggerValidation - Triggers validation for a specific field', async () => {
      const { result } = performRender();

      await act(async () => {
        await result.current.triggerValidation('email');
      });

      expect(result.current.fieldState('email').invalid).toBe(false);
    });

    it('onSubmitHandler - Calls the submit handler', async () => {
      const mockSubmitHandler = vi.fn();
      const { result } = performRender(mockSubmitHandler);

      await act(async () => {
        await result.current.onSubmitHandler();
      });

      expect(mockSubmitHandler).toHaveBeenCalled();
    });

    it('debugMode - Returns the Form State to be used as debug information', () => {
      const { result } = performRender();

      expect(result.current.debugMode()).toStrictEqual({
        initialValues,
        currentState: initialValues,
        isValid: true,
        hasBeenUpdated: false,
        errors: {},
      });
    });
  });
});
