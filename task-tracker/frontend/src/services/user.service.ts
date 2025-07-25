import type { NewUserData } from '../types/user.types';

const API_URL = 'http://localhost:5000/api/users';

export interface ResetPasswordData {
  password: string;
}

const register = async (userData: NewUserData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to register');
  }

  return response.json();
};

const login = async (credentials: Omit<NewUserData, 'name'>) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to login');
  }

  const data = await response.json();
  // In a real app, you'd store the token securely (e.g., in localStorage or an HttpOnly cookie)
  if (data.token) {
    localStorage.setItem('user_token', data.token);
  }

  return data;
};

const forgotPassword = async (email: string) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send password reset email.');
  }

  return response.json();
};

const resetPassword = async (token: string, passwordData: ResetPasswordData) => {
  const response = await fetch(`${API_URL}/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to reset password.');
  }

  return response.json();
};

export const userService = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
