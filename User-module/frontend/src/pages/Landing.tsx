import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '../components/Form/Form';
import { Button } from '../components/Button/Button';
import { Input, message, Tabs } from 'antd';
import { useAuth } from '../context/AuthContext';

const Landing: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        login(data.user, data.token);
        message.success('Login successful!');
        navigate('/home');
      } else {
        message.error(data.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        message.success('Signup successful! Please login.');
        setShowLogin(true);
      } else {
        message.error(data.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 32, boxShadow: '0 2px 8px #e0e0e0', borderRadius: 8 }}>
      <h1 style={{ textAlign: 'center' }}>Welcome</h1>
      <Tabs
        activeKey={showLogin ? 'login' : 'signup'}
        onChange={key => setShowLogin(key === 'login')}
        centered
        items={[
          {
            key: 'login',
            label: 'Login',
            children: (
              <Form layout="vertical" onFinish={handleLogin} style={{ marginTop: 16 }}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}> 
                  <Input type="email" autoComplete="username" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}> 
                  <Input.Password autoComplete="current-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>Login</Button>
              </Form>
            ),
          },
          {
            key: 'signup',
            label: 'Sign Up',
            children: (
              <Form layout="vertical" onFinish={handleSignup} style={{ marginTop: 16 }}>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name' }]}> 
                  <Input />
                </Form.Item>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name' }]}> 
                  <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}> 
                  <Input type="email" autoComplete="username" />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }, { min: 8, message: 'Password must be at least 8 characters' }]}> 
                  <Input.Password autoComplete="new-password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>Sign Up</Button>
              </Form>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Landing;
