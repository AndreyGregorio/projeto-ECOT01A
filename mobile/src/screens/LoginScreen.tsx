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
} from "react-native";
import { Button, SocialIcon } from "react-native-elements";
// <<< CORREÇÃO: Importar o tipo de navegação
import { StackNavigationProp } from "@react-navigation/stack";


type LoginScreenProps = {
  navigation: StackNavigationProp<any>; 
};


export default function LoginScreen({ navigation }: LoginScreenProps) {
  
  const onLoginPress = () => {
    navigation.navigate("Home");
  };

  const onGoogleLoginPress = async () => {
    Alert.alert(
      "Login com Google",
      "A lógica de login com Google seria implementada aqui."
    );
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <Text style={styles.logoText}>SeuApp</Text> 
            <TextInput
              placeholder="Email" 
              placeholderTextColor="#c4c3cb" // <<< CORREÇÃO
              style={styles.loginFormTextInput}
              keyboardType="email-address" 
              autoCapitalize="none" 
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#c4c3cb" // <<< CORREÇÃO
              style={styles.loginFormTextInput}
              secureTextEntry={true}
            />
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => onLoginPress()}
              title="Login"
            />
            
            <SocialIcon
              title="Login com Google"
              button
              type="google"
              style={{marginTop: 10}}
              onPress={onGoogleLoginPress}
            />

            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.navButtonText}>
                Não tem conta? Crie uma
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}