import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Seu IP da API
const API_URL = 'http://192.168.15.17:3000'; 

// --- Tipos para o TSX ---

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null; 
  // <-- MUDANÇA: Adicionei os campos que faltavam para o perfil
  course?: string | null; 
  bio?: string | null;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserContext: (updatedUser: User) => void;
  // <-- MUDANÇA: Expor a URL da API para que as telas a utilizem
  API_URL: string; 
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
          // Agora o 'jwtDecode' entende os campos novos (se existirem no token)
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

  // 2. Função de Login (Seu código está correto e já espera { token, user })
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
      
      // Se o backend enviar { token, user }, isto funciona
      const { token, user } = data; 

      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUser(user); 

    } catch (error) {
      console.error('Erro no login:', error);
      throw error; 
    }
  };

  // 3. Função de Cadastro (Correta)
  const register = async (name: string, email: string, password: string) => {
    // ... (seu código de registro aqui, sem mudanças) ...
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
      
      await login(email, password);

    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error; 
    }
  };

  // 4. Função de Logout (Correta)
  const logout = async () => {
    // ... (seu código de logout aqui, sem mudanças) ...
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Falha ao fazer logout', e);
    }
  };

  // 5. Função de Atualização (Correta)
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
        updateUserContext,
        API_URL // <-- MUDANÇA: Fornece a URL da API
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado (Correto)
export const useAuth = () => {
  return useContext(AuthContext);
};