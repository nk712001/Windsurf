import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Result } from 'antd';
import { useUsers } from '../../hooks/useUsers';

const ResetPasswordForm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { resetPassword, loading, error } = useUsers();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onFinish = async (values: any) => {
    if (!token) {
      // This should ideally not happen if the routing is correct
      alert('Reset token is missing.');
      return;
    }
    try {
      await resetPassword(token, { password: values.password });
      setIsSubmitted(true);
    } catch (err) {
      // Error is handled in the hook
    }
  };

  if (isSubmitted) {
    return (
      <Result
        status="success"
        title="Password Reset Successful!"
        subTitle="Your password has been changed. You can now log in with your new password."
        extra={[
          <Button type="primary" key="login" onClick={() => navigate('/login')}>
            Go to Login
          </Button>,
        ]}
      />
    );
  }

  return (
    <Form name="reset_password" onFinish={onFinish} layout="vertical">
       <Form.Item
        name="password"
        label="New Password"
        rules={[
          { required: true, message: 'Please input your new password!' },
          { min: 8, message: 'Password must be at least 8 characters long.' },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm New Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: 'Please confirm your new password!' },
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
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ResetPasswordForm;
