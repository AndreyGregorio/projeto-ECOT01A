import React from "react";
import styles from "../components/style";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image, 
} from "react-native";
import { Button } from "react-native-elements";
// <<< CORREÇÃO: Importar o tipo de navegação
import { StackNavigationProp } from "@react-navigation/stack";

// <<< CORREÇÃO: Definir o tipo das props
type RegisterScreenProps = {
  navigation: StackNavigationProp<any>;
};

// <<< CORREÇÃO: Aplicar o tipo às props
export default function RegisterScreen({ navigation }: RegisterScreenProps) {

  const onRegisterPress = () => {
    Alert.alert("Sucesso!", "Conta criada.");
    navigation.navigate("Home"); 
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            
            <View style={styles.logoContainer}>
              <Image 
                style={styles.logoImage} 
                source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
              />
              <Text style={styles.appName}>Nome do Seu App</Text>
            </View>

            <TextInput
              placeholder="Nome Completo"
              placeholderTextColor="#c4c3cb" // <<< CORREÇÃO
              style={styles.loginFormTextInput}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#c4c3cb" // <<< CORREÇÃO
              style={styles.loginFormTextInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Senha"
              placeholderTextColor="#c4c3cb" // <<< CORREÇÃO
              style={styles.loginFormTextInput}
              secureTextEntry={true}
            />
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => onRegisterPress()}
              title="Registrar"
            />

            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.navButtonText}>
                Já tem conta? Faça login
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}