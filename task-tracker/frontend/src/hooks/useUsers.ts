import { useState, useCallback } from 'react';
import { userService } from '../services/user.service';
import type { ResetPasswordData } from '../services/user.service';
import type { NewUserData } from '../types/user.types';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = useCallback(async (userData: NewUserData) => {
    setLoading(true);
    setError(null);
    try {
      const user = await userService.register(userData);
      setLoading(false);
      return user;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const loginUser = useCallback(async (credentials: Omit<NewUserData, 'name'>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.login(credentials);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.forgotPassword(email);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
      throw err;
    }
  };

  const resetPassword = async (token: string, passwordData: ResetPasswordData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.resetPassword(token, passwordData);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
      throw err;
    }
  };

  return { registerUser, loginUser, forgotPassword, resetPassword, loading, error };
};
