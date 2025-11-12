import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext'; // Confirme o caminho

// <-- MUDANÇA 1: Importar o ImagePicker
import * as ImagePicker from 'expo-image-picker';

// Interface para os dados do formulário
interface ProfileFormData {
  name: string;
  course: string; // O backend precisa ter essa coluna
  bio: string;    // O backend precisa ter essa coluna
}

export default function ProfileScreen() {
  const { logout, user, updateUserContext, token, API_URL } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading para salvar TEXTO
  
  // <-- MUDANÇA 2: Novo estado de loading, só para a FOTO
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
    course: user?.course || '', 
    bio: user?.bio || '',       
  });

  // Função de Salvar (TEXTO) - Sem mudança
  const handleSave = async () => {
    if (!user) return; 
    setLoading(true);
    console.log("Enviando dados para a API:", formData);
    
    try {
      const response = await fetch(`${API_URL}/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        throw new Error(updatedUser.error || "Falha ao atualizar perfil.");
      }

      updateUserContext(updatedUser);
      
      setFormData({
        name: updatedUser.name,
        course: updatedUser.course,
        bio: updatedUser.bio,
      });

      setLoading(false);
      setIsEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado!");

    } catch (error: any) {
      setLoading(false);
      console.error("Erro no handleSave:", error);
      Alert.alert("Erro", error.message || "Não foi possível salvar.");
    }
  };

  // Função de Sair (Logout) - Sem mudança
  const handleSair = () => {
    Alert.alert(
      "Confirmar Saída",
      "Você tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  // Função de Cancelar (Edição de texto) - Sem mudança
  const handleCancel = () => {
    if (!user) return;
    setFormData({
      name: user.name || '',
      course: user.course || '',
      bio: user.bio || '',
    });
    setIsEditing(false);
  };


  // <-- MUDANÇA 3: Novas funções para Câmera e Galeria -->

  /**
   * Chamado quando o usuário clica no ícone da câmera (no modo de edição)
   */
  const handleAvatarPress = () => {
    // Não faz nada se não estiver editando
    if (!isEditing) return;

    Alert.alert(
      "Mudar foto do perfil",
      "Escolha como você quer enviar a foto:",
      [
        { text: "Tirar Foto", onPress: takePhoto },
        { text: "Escolher da Galeria", onPress: pickImage },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  /**
   * Abre a galeria de fotos do usuário
   */
  const pickImage = async () => {
    // 1. Pedir permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Desculpe, precisamos da permissão da galeria para isso!');
      return;
    }

    // 2. Abrir a galeria
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permite ao usuário cortar a foto
      aspect: [1, 1],      // Força um corte quadrado
      quality: 0.7,          // Comprime a imagem (0 a 1)
    });

    // 3. Se o usuário NÃO cancelou, fazer o upload
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  /**
   * Abre a câmera do usuário
   */
  const takePhoto = async () => {
    // 1. Pedir permissão
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Desculpe, precisamos da permissão da câmera para isso!');
      return;
    }

    // 2. Abrir a câmera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    // 3. Se o usuário NÃO cancelou, fazer o upload
    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  /**
   * Pega a URI da imagem (da câmera ou galeria) e envia para o backend
   */
  const uploadImage = async (uri: string) => {
    if (!user) return;
    setIsUploading(true); // LIGA o loading da foto

    // 1. Criar o 'FormData' (é como um formulário HTML para arquivos)
    const formData = new FormData();
    
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename!);
    const type = match ? `image/${match[1]}` : `image`;

    // 2. Adicionar a imagem ao formulário
    // O 'as any' é um truque para o TypeScript aceitar a URI
    formData.append('avatar', { uri: uri, name: filename, type } as any);

    // 3. Adicionar o ID do usuário (o backend precisa saber quem atualizar)
    formData.append('userId', user.id); 

    try {
      // 4. Enviar para a NOVA rota do backend
      const response = await fetch(`${API_URL}/profile/upload-avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          // NÃO defina 'Content-Type': 'application/json'
          // O 'fetch' define o 'multipart/form-data' sozinho
          'Authorization': `Bearer ${token}` 
        },
      });

      const updatedUser = await response.json();

      if (!response.ok) {
        throw new Error(updatedUser.error || "Falha no upload da foto.");
      }

      // 5. Sucesso! Atualizar o app
      updateUserContext(updatedUser); // A foto vai mudar NA HORA
      Alert.alert('Sucesso', 'Foto do perfil atualizada!');

    } catch (error: any) {
      console.error("Erro no uploadImage:", error);
      Alert.alert('Erro', error.message || 'Não foi possível enviar a foto.');
    } finally {
      setIsUploading(false); // DESLIGA o loading da foto
    }
  };


  // Checagem se o usuário não carregou
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
          <Text>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Lógica do placeholder (Correta)
  const avatarSource = user.avatar_url ? { uri: user.avatar_url } : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.profileHeader}>
          
          {/* Lógica da Imagem (Correta) */}
          {avatarSource ? (
            <Image 
              source={avatarSource}
              style={styles.avatar} 
            />
          ) : (
            <View style={styles.avatar} />
          )}

          {/* <-- MUDANÇA 4: Conectar o botão de upload -->
              - Adiciona 'onPress={handleAvatarPress}'
              - Adiciona 'disabled={isUploading}'
              - Mostra o ActivityIndicator se 'isUploading' for true
          */}
          {isEditing && (
            <TouchableOpacity 
              style={styles.avatarEditButton}
              onPress={handleAvatarPress}
              disabled={isUploading} 
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {isEditing ? (
          /* ============= MODO DE EDIÇÃO (Formulário de Texto) ============= */
          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(p => ({ ...p, name: text }))}
            />

            <Text style={styles.label}>Curso</Text>
            <TextInput
              style={styles.input}
              value={formData.course}
              onChangeText={(text) => setFormData(p => ({ ...p, course: text }))}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={formData.bio}
              onChangeText={(text) => setFormData(p => ({ ...p, bio: text }))}
              multiline
            />
            
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]} 
              onPress={handleSave}
              disabled={loading} // Note: 'loading' (para texto)
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Salvar Alterações</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleCancel}
              disabled={loading} // Desativa se o texto estiver salvando
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        ) : (
          /* ============= MODO DE VISUALIZAÇÃO ============= */
          <View style={styles.displayContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.course}>{user.course || 'Sem curso definido'}</Text>
            <Text style={styles.bio}>{user.bio || 'Sem bio definida'}</Text>
            
            <TouchableOpacity 
              style={[styles.button, styles.editButton]} 
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- AÇÕES (LOGOUT) --- */}
        {!isEditing && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.logoutButton]} 
              onPress={handleSair}
            >
              <Ionicons name="log-out-outline" size={20} color="#DC3545" />
              <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ... (seus estilos 'styles' continuam os mesmos)
const styles = StyleSheet.create({
  // ... (todos os seus estilos)
  safeArea: {
   flex: 1,
   backgroundColor: '#FFFFFF',
  },
  container: {
   flexGrow: 1,
   padding: 20,
   alignItems: 'center',
  },
  profileHeader: {
   position: 'relative',
   alignItems: 'center',
   marginBottom: 24,
  },
  avatar: {
   width: 120,
   height: 120,
   borderRadius: 60,
   borderWidth: 3,
   borderColor: '#000000',
   backgroundColor: '#EEE', // Fundo enquanto a imagem carrega
  },
  avatarEditButton: {
   position: 'absolute',
   bottom: 0,
   right: 0,
   backgroundColor: '#000000',
   padding: 8,
   borderRadius: 20,
   // Adiciona um tamanho mínimo para o ActivityIndicator caber
   width: 36, 
   height: 36,
   alignItems: 'center',
   justifyContent: 'center',
  },
  displayContainer: {
   width: '100%',
   alignItems: 'center',
  },
  name: {
   fontSize: 24,
   fontWeight: 'bold',
   color: '#333',
   marginBottom: 4,
  },
  course: {
   fontSize: 16,
   color: '#555',
   marginBottom: 12,
  },
  bio: {
   fontSize: 14,
   color: '#666',
   textAlign: 'center',
   lineHeight: 20,
   marginBottom: 24,
   paddingHorizontal: 16,
  },
  formContainer: {
   width: '100%',
  },
  label: {
   fontSize: 14,
   fontWeight: '600',
   color: '#555',
   marginBottom: 6,
   marginTop: 16,
  },
  input: {
   backgroundColor: '#F0F2F5',
   borderWidth: 1,
   borderColor: '#DDD',
   borderRadius: 8,
   paddingHorizontal: 14,
   paddingVertical: 12,
   fontSize: 16,
   width: '100%',
  },
  bioInput: {
   minHeight: 100,
   textAlignVertical: 'top',
   paddingTop: 12,
  },
  button: {
   width: '100%',
   paddingVertical: 14,
   borderRadius: 8,
   alignItems: 'center',
   justifyContent: 'center',
   flexDirection: 'row',
   marginTop: 12,
  },
  buttonText: {
   color: '#FFFFFF',
   fontSize: 16,
   fontWeight: 'bold',
  },
  editButton: {
   backgroundColor: '#000000',
  },
  saveButton: {
   backgroundColor: '#28A745',
   marginTop: 24,
  },
  cancelButton: {
   backgroundColor: 'transparent',
   borderWidth: 1,
   borderColor: '#AAA',
  },
  cancelButtonText: {
   color: '#555',
   fontSize: 16,
   fontWeight: 'bold',
  },
  actionsContainer: {
   width: '100%',
   marginTop: 32,
   borderTopWidth: 1,
   borderTopColor: '#EEE',
   paddingTop: 20,
  },
  logoutButton: {
   backgroundColor: 'transparent',
   borderColor: '#DC3545',
   borderWidth: 1,
  },
  logoutButtonText: {
   color: '#DC3545',
   fontSize: 16,
   fontWeight: 'bold',
   marginLeft: 8,
  },
});
