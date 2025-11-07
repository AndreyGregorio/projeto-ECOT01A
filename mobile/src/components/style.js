const React = require("react-native");
const { StyleSheet } = React;

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: "center",
  },
  loginScreenContainer: {
    flex: 1,
  },

  logoContainer: {
    alignItems: "center",
    marginTop: 100,
    marginBottom: 30,
  },

  logoImage: {
    width: 100,
    height: 100,
  },

  appName: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  logoText: { 
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: "center",
  },
  loginFormView: {
    flex: 1,
    paddingHorizontal: 20, 
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: "#3897f1",
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    
    alignItems: "center",
  },
  fbLoginButton: { 
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    textAlign: "center",
    color: "#3897f1",
    fontSize: 16,
  },
});
export default styles;