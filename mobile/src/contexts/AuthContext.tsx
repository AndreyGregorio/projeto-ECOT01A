import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/services/api';
import { Alert } from 'react-native';

// 2. Definir a "forma" dos dados do nosso contexto
interface AuthContextData {
  token: string | null;
  isLoading: boolean; // Para sabermos se está carregando o token do storage
  login: (name: string, pass: string) => Promise<boolean>;
  // --- 1. MUDANÇA AQUI ---
  // Adicionamos 'email' e mudamos 'pass' para 'password' para ficar claro
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 3. Criar o Contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 4. Criar o "Provedor" do Contexto
// Este componente vai "abraçar" nosso app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 5. Efeito que roda QUANDO O APP ABRE
  // Ele vai verificar se já existe um token salvo no celular
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
        setIsLoading(false); // Termina o carregamento
      }
    }
    loadToken();
  }, []);

  // --- 6. FUNÇÃO DE LOGIN ---
  const login = async (name: string, pass: string) => {
    setIsLoading(true);
    try {
      // Bater no seu backend (exatamente como você definiu)
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password: pass }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erro no Login', data.error || 'Credenciais inválidas.');
        return false;
      }

      // Sucesso!
      setToken(data.token); // Salva o token no estado
      await AsyncStorage.setItem('token', data.token); // Salva o token no celular
      return true;

    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro de Conexão', `Não foi possível conectar ao servidor: ${e.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- 7. FUNÇÃO DE REGISTRO (MODIFICADA) ---
  // --- 2. MUDANÇA AQUI ---
  // Agora a função aceita 'name', 'email' e 'password'
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Bater no seu backend
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // --- 3. MUDANÇA AQUI ---
        // Enviamos 'name', 'email' e 'password' no body
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // --- 4. MUDANÇA (BÔNUS) ---
        // Trata o erro de email duplicado que vem do backend
        if (data.error === 'Email already exists') {
          Alert.alert('Erro', 'Este email já está em uso.');
        } else {
          Alert.alert('Erro no Cadastro', data.error || 'Não foi possível cadastrar.');
        }
        return false;
      }

      // Sucesso!
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

  // --- 8. FUNÇÃO DE LOGOUT ---
  const logout = async () => {
    setIsLoading(true);
    setToken(null); // Limpa o token do estado
    await AsyncStorage.removeItem('token'); // Limpa o token do celular
    setIsLoading(false);
  };

  // 9. Disponibiliza os valores para o app
  return (
    <AuthContext.Provider value={{ token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 10. Hook customizado (para facilitar nossa vida)
// Em vez de importar useContext e AuthContext em toda tela,
// vamos apenas importar useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}