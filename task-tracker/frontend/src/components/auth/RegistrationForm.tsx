import React, { useState } from 'react';
import { Form, Input, Button, Alert, Result } from 'antd';
import { useUsers } from '../../hooks/useUsers';

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const { registerUser, loading, error } = useUsers();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = async (values: any) => {
    try {
      await registerUser(values);
      setIsSubmitted(true);
    } catch (err) {
      // Error is already handled in the hook, but we catch it here to prevent unhandled promise rejection
      console.error('Failed to register:', err);
    }
  };

    if (isSubmitted) {
    return (
      <Result
        status="success"
        title="Registration Successful!"
        subTitle="Please check your email to find the verification link. You must verify your email before you can log in."
      />
    );
  }

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input your name!', whitespace: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: 'email', message: 'The input is not a valid E-mail!' },
          { required: true, message: 'Please input your E-mail!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 8, message: 'Password must be at least 8 characters long.' },
          {
            pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
            message: 'Password must contain both letters and numbers.',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
