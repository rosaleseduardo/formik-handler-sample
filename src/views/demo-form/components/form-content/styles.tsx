import styled from '@emotion/styled';
import { Box as MuiBox } from '@mui/material';

/**
 * Represents a styled form container component.
 *
 * This component applies custom styles to the form element.
 */
// @ts-expect-error: This is not introducing a bug
export const Box = styled(MuiBox)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };
});
