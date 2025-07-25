import React from 'react';
import { Row, Col, Typography } from 'antd';
import RegistrationForm from '../components/auth/RegistrationForm';

const { Title } = Typography;

const Register: React.FC = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: 'fit-content' }}>
      <Col xs={22} sm={16} md={12} lg={20} xl={20}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          Create Your Account
        </Title>
        <RegistrationForm />
      </Col>
    </Row>
  );
};

export default Register;
