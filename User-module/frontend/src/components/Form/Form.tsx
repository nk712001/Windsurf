import React from 'react';
import { Form as AntForm, FormProps as AntFormProps } from 'antd';
import styled from 'styled-components';

const FormWrapper = styled.div`
  /* Accessibility and responsive styles here */
`;

export type RenderProps = (form: any) => React.ReactNode;
export type FormProps = AntFormProps & { children?: React.ReactNode | RenderProps };

const InternalForm: React.FC<FormProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <FormWrapper>
      <AntForm {...rest}>
        {typeof children === 'function' ? (children as RenderProps)({}) : children}
      </AntForm>
    </FormWrapper>
  );
};

// Forward static properties (like Item, List, etc.) from AntD Form to our wrapper
export const Form = Object.assign(InternalForm, AntForm) as typeof AntForm;
