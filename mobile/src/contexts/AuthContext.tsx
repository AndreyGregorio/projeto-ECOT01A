import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/services/api';
import { Alert } from 'react-native';

// 1. ADICIONE 'forgotPassword' À INTERFACE
interface AuthContextData {
  token: string | null;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<boolean>; 
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>; // <<< ADICIONADO AQUI
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // <<< CORRIGIDO (era appIsLoading no seu código colado)

  // Efeito para carregar o token
  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Falha ao carregar token', e);
      } finally {
        setIsLoading(false); 
      }
    }
    loadToken();
  }, []);

  // --- FUNÇÃO DE LOGIN ---
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erro no Login', data.error || 'Credenciais inválidas.');
        return false;
      }

      setToken(data.token); 
      await AsyncStorage.setItem('token', data.token); 
      return true;

    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro de Conexão', `Não foi possível conectar ao servidor: ${e.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNÇÃO DE REGISTRO ---
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Email already exists') {
          Alert.alert('Erro', 'Este email já está em uso.');
        } else {
          Alert.alert('Erro no Cadastro', data.error || 'Não foi possível cadastrar.');
        }
        return false;
      }

      Alert.alert('Cadastro Realizado!', 'Usuário criado com sucesso. Faça o login agora.');
      return true;

    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro de Conexão', `Não foi possível conectar ao servidor: ${e.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNÇÃO DE LOGOUT ---
  const logout = async () => {
    setIsLoading(true);
    setToken(null); 
    await AsyncStorage.removeItem('token'); 
    setIsLoading(false);
  };
  
  // 2. MOVA A FUNÇÃO 'forgotPassword' PARA DENTRO DO 'AuthProvider'
  const forgotPassword = async (email: string) => {
    try {
      // Você precisará criar esta rota no seu backend
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erro', data.error || 'Não foi possível processar a solicitação.');
        return false;
      }
      
      return true;

    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro de Conexão', `Não foi possível conectar ao servidor: ${e.message}`);
      return false;
    }
  };

  // 3. ADICIONE 'forgotPassword' AO 'value' DO PROVIDER (E USE APENAS UM RETURN)
  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        isLoading, 
        login, 
        register, 
        logout, 
        forgotPassword // <<< ADICIONADO AQUI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; // <<< ESTE É O FIM CORRETO DO AuthProvider

// --- 10. Hook (Está correto, sem mudanças) ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}