import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Seu IP da API
const API_URL = 'http://200.235.82.88:3000'; 

// --- Tipos para o TSX ---

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null; 
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  // <--- MUDANÇA 1: A FUNÇÃO AGORA PROMETE UM BOOLEAN
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserContext: (updatedUser: User) => void; 
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

  // 2. Função de Login (Sem mudanças, mas é chamada pelo register)
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

      const { token, user } = data; 

      await AsyncStorage.setItem('token', token);
      setToken(token);
      setUser(user);

    } catch (error) {
      console.error('Erro no login:', error);
      throw error; 
    }
  };

  // 3. Função de Cadastro (CORRIGIDA)
  // <--- MUDANÇA 2: Definindo o tipo de retorno explicitamente
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        // Se a API falhar (ex: email já existe), retorna false
        console.error(data.error || 'Erro ao cadastrar');
        return false; // <--- MUDANÇA 3: RETORNA FALSE EM VEZ DE LANÇAR ERRO
      }
      
      // Tenta logar automaticamente
      await login(email, password);
      
      return true; // <--- MUDANÇA 4: RETORNA TRUE SE TUDO DEU CERTO

    } catch (error) {
      console.error('Erro no cadastro:', error);
      return false; // Retorna false se houver erro de rede ou no login
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

  // 5. Função de atualização
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
        register, // Agora esta função está correta
        logout, 
        updateUserContext 
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