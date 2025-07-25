import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const { Title } = Typography;

const ForgotPasswordPage: React.FC = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: 'fit-content' }}>
      <Col xs={24} sm={16} md={12} lg={24} xl={24}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Forgot Your Password?
          </Title>
          <p style={{ textAlign: 'center', marginBottom: '24px' }}>
            No problem. Enter your email address below and we'll send you a link to reset it.
          </p>
          <ForgotPasswordForm />
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;
