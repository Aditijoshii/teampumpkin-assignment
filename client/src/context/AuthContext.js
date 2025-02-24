import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login as loginApi, register as registerApi, getProfile } from '@/services/api';
import { initSocket, disconnectSocket } from '@/services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          initSocket(token);
          
          const { data } = await getProfile();
          setUser(data);
        } catch (err) {
          console.error('Authentication error:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();

    return () => {
      disconnectSocket();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await loginApi(email, password);
      
      localStorage.setItem('token', data.token);
      setUser(data);
      
      initSocket(data.token);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, mobile, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await registerApi(name, email, mobile, password);
      
      localStorage.setItem('token', data.token);
      setUser(data);
      
      initSocket(data.token);
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    disconnectSocket();
    
    localStorage.removeItem('token');
    setUser(null);
    
    router.push('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;