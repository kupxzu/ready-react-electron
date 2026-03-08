import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import axios from 'axios';

export type UserRole = 'admin' | 'client' | null;

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  username: string; // Add this if backend returns username
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          setIsLoading(false);
          return;
      }
      try {
          const response = await api.get('/user');
          setUser(response.data);
      } catch (err) {
          console.error("Auth check failed", err);
          logout();
      } finally {
          setIsLoading(false);
      }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    let role: UserRole = null;
    let response;

    try {
        // Strategy: We can't know the role without trying.
        // We can try client login first (most common?), then admin.
        // Or admin then client.
        // ISSUE: If admin logs in with wrong password on client endpoint, it says "Invalid credentials".
        // If client logs in on admin, it says "Invalid credentials".
        // So we might get "Invalid credentials" twice and not know which one was right "user" but wrong "pass".
        // BUT, for the user experience, if they fail both, it's just "Invalid credentials".
        
        try {
            response = await api.post('/client/login', { email, password });
            role = 'client';
        } catch (clientError) {
             // If client login fails, try admin
            try {
                response = await api.post('/admin/login', { email, password });
                role = 'admin';
            } catch (adminError) {
                // Both failed. Throw the error from the client attempt (or generic)
                // Actually, if client failed with 422 (validation), admin might also fail with 422.
                throw clientError;
            }
        }
        
        if (!response || !role) throw new Error("Login failed unexpectedly");

        const { user, token } = response.data;
        
        const userWithUsername = { ...user, username: user.name, role: role };

        setUser(userWithUsername);
        localStorage.setItem('token', token);
        
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/client');
        }
    } catch (err: any) {
        let message = 'Login failed';
        if (axios.isAxiosError(err) && err.response) {
            message = err.response.data.message || Object.values(err.response.data.errors || {}).flat().join(', ');
        }
        setError(message);
        throw new Error(message);
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
        await api.post('/logout');
    } catch (error) {
        console.error("Logout failed", error);
    }
    setUser(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

