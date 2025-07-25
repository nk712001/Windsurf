import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const { Title } = Typography;

const ResetPasswordPage: React.FC = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: 'fit-content' }}>
      <Col xs={24} sm={16} md={12} lg={20} xl={20}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Reset Your Password
          </Title>
          <p style={{ textAlign: 'center', marginBottom: '24px' }}>
            Please enter your new password below.
          </p>
          <ResetPasswordForm />
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPasswordPage;
