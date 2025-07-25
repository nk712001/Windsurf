import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useAuth } from './context/AuthContext';
import 'antd/dist/reset.css';
import TaskList from './components/tasks/TaskList';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';
import Logo from './components/icons/Logo';

const { Header, Content, Footer } = Layout;

const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo"><Logo /></div>
        <Menu theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item key="1"><Link to="/">Task Tracker</Link></Menu.Item>
          {isAuthenticated ? (
            <Menu.Item key="4" onClick={logout}>Logout</Menu.Item>
          ) : (
            <>
              <Menu.Item key="2"><Link to="/login">Login</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/register">Register</Link></Menu.Item>
            </>
          )}
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: '24px', overflow: 'auto' }}>
        <div className="site-layout-content">
          <Routes>
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<TaskList />} />
            </Route>

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Task Tracker 2024 Created by You</Footer>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
