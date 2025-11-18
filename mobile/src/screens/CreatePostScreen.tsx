import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function CreatePostScreen() {
  const { user, token, API_URL } = useAuth();
  const navigation = useNavigation();

  const [content, setContent] = useState(''); 
  const [imageUri, setImageUri] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);

  const handleAttachImage = () => {
    Alert.alert(
      "Adicionar Imagem",
      "Escolha uma fonte:",
      [
        { text: "Tirar Foto", onPress: takePhoto },
        { text: "Escolher da Galeria", onPress: pickImage },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Desculpe, precisamos da permissão da galeria.');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, 
      quality: 0.8, // qualidade
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Desculpe, precisamos da permissão da câmera.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // --- Função Postar ---
  const handlePost = async () => {
    if (!user) return;
    if (!content && !imageUri) {
      Alert.alert('Post vazio', 'Escreva algo ou adicione uma imagem.');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Adicionar o texto e o usuário
    formData.append('content', content);
    formData.append('userId', user.id.toString());

    // Adicionar a imagem (se existir)
    if (imageUri) {
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename!);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('postImage', { uri: imageUri, name: filename, type } as any);
    }

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Falha ao criar o post.");
      }

      Alert.alert('Sucesso!', 'Seu post foi publicado.');
      setContent('');
      setImageUri(null);
      navigation.goBack();

    } catch (error: any) {
      console.error("Erro no handlePost:", error);
      Alert.alert('Erro', error.message || 'Não foi possível publicar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header (com botão de Postar) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Post</Text>
          <TouchableOpacity 
            style={styles.postButton} 
            onPress={handlePost} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.postButtonText}>Postar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Corpo (Editor) */}
        <ScrollView style={styles.editor}>
          <TextInput
            style={styles.textInput}
            placeholder="O que você está pensando?"
            multiline
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#828282"
          />

          {/* Imagem selecionada */}
          {imageUri && (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={{ uri: imageUri }} 
                style={styles.imagePreview} 
                resizeMode="contain" 
              />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => setImageUri(null)} 
              >
                <Ionicons name="close-circle" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Barra de Ferramentas (para anexar imagem) */}
        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton} onPress={handleAttachImage}>
            <Ionicons name="image-outline" size={24} color="#828282" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  postButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80, 
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Editor
  editor: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    fontSize: 18,
    lineHeight: 24,
    minHeight: 100, 
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 40, // Espaço extra no final
  },
  imagePreview: {
    width: '100%',
    height: 300, // Altura fixa para a preview não ocupar a tela toda
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
  },
  // Toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  toolbarButton: {
    padding: 8,
  }
});