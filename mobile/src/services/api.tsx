import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // Então o baseURL deve ser APENAS o IP e a porta.
  baseURL: `http://192.168.15.5:3000` 
});

// Interceptor de Requisição: Roda ANTES de CADA chamada
api.interceptors.request.use(
  async (config) => {
    // Busca o token no armazenamento
    // (Confira no seu AuthContext se a chave é mesmo '@token')
    const token = await AsyncStorage.getItem('@token'); 
    
    // Se o token existir, anexa ele no Header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Deixa a requisição continuar
    return config;
  },
  (error) => {
    // Em caso de erro ao preparar a requisição
    return Promise.reject(error);
  }
);

export default api;