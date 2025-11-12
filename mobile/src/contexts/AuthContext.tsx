import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Seu IP da API
const API_URL = 'https://projeto-ecot01a.onrender.com'; 

export interface User {
  id: number; 
  name: string;
  username: string; 
  email: string;
  avatar_url?: string | null; 
  course?: string | null; 
  bio?: string | null;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  // --- MUDANÇA 1: Assinatura do 'login' atualizada ---
  login: (identifier: string, password: string) => Promise<void>; // <-- Era 'email'
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserContext: (updatedUser: User) => void;
  API_URL: string; 
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const decodedUser = jwtDecode<User>(storedToken); 
          setUser(decodedUser);
        }
      } catch (e) {
        console.error('Falha ao carregar token', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  // --- Função 'login' ---
  const login = async (identifier: string, password: string) => { // <-- Era 'email'
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }), // <-- Envia 'identifier'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao logar');
      }
      
      const { token, user } = data; 

      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUser(user); 

    } catch (error) {
      console.error('Erro no login:', error);
      throw error; 
    }
  };

  //Função de Cadastro
  const register = async (name: string, username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }
      
      // Se o cadastro deu certo, faz o login automaticamente
      await login(email, password); // <-- 'email' é um 'identifier' válido

    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error; 
    }
  };

  // Função de Logout 
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Falha ao fazer logout', e);
    }
  };

  // 5. Função de Atualização (Sem mudança)
  const updateUserContext = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, // <-- A função 'login' atualizada
        register, 
        logout, 
        updateUserContext,
        API_URL 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado (Sem mudança)
export const useAuth = () => {
  return useContext(AuthContext);
};