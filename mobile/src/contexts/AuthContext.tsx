import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/services/api';
import { Alert } from 'react-native';

// 1. --- MUDANÇA AQUI ---
// A interface da função 'login' foi atualizada
interface AuthContextData {
  token: string | null;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<boolean>; // <- De 'name, pass' para 'email, password'
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar o token (Está perfeito, sem mudanças)
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

  // --- 6. FUNÇÃO DE LOGIN (MODIFICADA) ---
  // --- 2. MUDANÇA AQUI ---
  // A função agora recebe 'email' e 'password'
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- 3. MUDANÇA AQUI ---
        // Enviamos 'email' e 'password' no body
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

  // --- 7. FUNÇÃO DE REGISTRO (Está correta, sem mudanças) ---
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

  // --- 8. FUNÇÃO DE LOGOUT (Está correta, sem mudanças) ---
  const logout = async () => {
    setIsLoading(true);
    setToken(null); 
    await AsyncStorage.removeItem('token'); 
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 10. Hook (Está correto, sem mudanças) ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}