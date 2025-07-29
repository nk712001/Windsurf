import React from 'react';
import styled from 'styled-components';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

const StyledButton = styled(AntButton)`
  /* Example: custom styles or overrides */
`;

export type ButtonProps = AntButtonProps & {
  /**
   * Optional: Add your own props here
   */
};

export const Button: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};
