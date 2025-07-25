import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
      const { loginUser, loading, error } = useUsers();
  const { login: setAuthToken } = useAuth();
  const navigate = useNavigate();

    const onFinish = async (values: any) => {
    try {
            const data = await loginUser(values);
      if (data.token) {
        setAuthToken(data.token);
        navigate('/'); // Redirect to the dashboard
      }
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
    >
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
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '24px' }} />}

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Log In
        </Button>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
