import React, { useState } from 'react';
import { Form, Input, Button, Alert, Result } from 'antd';
import { useUsers } from '../../hooks/useUsers';

const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, loading, error } = useUsers();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = async (values: { email: string }) => {
    try {
      await forgotPassword(values.email);
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  if (isSubmitted) {
    return (
      <Result
        status="success"
        title="Check Your Email"
        subTitle="If an account with that email exists, we have sent a password reset link to it."
      />
    );
  }

  return (
    <Form name="forgot_password" onFinish={onFinish} layout="vertical">
      <Form.Item
        name="email"
        label="Email Address"
        rules={[
          { required: true, message: 'Please input your email address!' },
          { type: 'email', message: 'Please enter a valid email address!' },
        ]}
      >
        <Input placeholder="Enter your registered email" />
      </Form.Item>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Send Password Reset Link
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPasswordForm;
