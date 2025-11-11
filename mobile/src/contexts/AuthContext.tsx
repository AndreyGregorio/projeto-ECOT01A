import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Seu IP da API
const API_URL = 'http://200.235.87.169:3000'; 

// --- Tipos para o TSX ---

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null; // <-- MUDANÇA: Adicionada a URL do avatar (opcional)
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserContext: (updatedUser: User) => void; // <-- MUDANÇA: Função para atualizar o user
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Carregar token ao iniciar o app
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          // Agora o 'jwtDecode' entende o 'avatar_url' graças à interface User
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

  // 2. Função de Login
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao logar');
      }

      // <-- MUDANÇA: O backend agora retorna { token, user }
      // Não precisamos mais decodificar, o backend já envia o objeto 'user'
      const { token, user } = data; 

      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUser(user); // <-- MUDANÇA: Seta o usuário vindo da resposta da API

    } catch (error) {
      console.error('Erro no login:', error);
      throw error; 
    }
  };

  // 3. Função de Cadastro
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar');
      }
      
      // Tenta logar automaticamente (a função 'login' já foi corrigida)
      await login(email, password);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error; 
    }
  };

  // 4. Função de Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Falha ao fazer logout', e);
    }
  };

  // <-- MUDANÇA: Função para atualizar o usuário de outros componentes
  const updateUserContext = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isLoading, 
        login, 
        register, 
        logout, 
        updateUserContext // <-- MUDANÇA: Fornece a nova função
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado
export const useAuth = () => {
  return useContext(AuthContext);
};