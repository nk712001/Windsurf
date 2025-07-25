import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row, Col, Typography, Alert } from 'antd';
import LoginForm from '../components/auth/LoginForm';

const { Title } = Typography;

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('sessionExpired') === 'true';
  return (
    <Row justify="center" align="middle" style={{ minHeight: 'fit-content' }}>
      <Col xs={22} sm={16} md={12} lg={20} xl={20}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Log In to Your Account
        </Title>
        {sessionExpired && (
          <Alert
            message="Session Expired"
            description="Your session has expired. Please log in again."
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}
        <LoginForm />
      </Col>
    </Row>
  );
};

export default Login;
