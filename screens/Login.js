import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Amplify, Auth, Hub } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { API } from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import { useAtom } from "jotai";
import userDetail from "../store/index";

import {
  Alert,
  Dimensions,
  ImageBackground,
} from "react-native";

const Login = () => {

  const navigation = useNavigation();
  const [user, setUser] = useAtom(userDetail);

  const [userForm, setUserForm] = useState({ username: "", password: "" })

  const onSignUp = () => {
    navigation.navigate("Register")
  }

  const onSignIn = async () => {

    try {
      console.log(userForm);
      const res = await Auth.signIn(userForm.username, userForm.password);
      try {
        const signinUserData = await API.graphql({
          query: queries.getUser,
          variables: { id: res.attributes.sub },
        });
        if (!signinUserData || !signinUserData.data?.getUser) {
          const newUserData = await API.graphql({
            query: mutations.createUser,
            variables: {
              input: {
                id: res.attributes.sub,
              },
            },
          });
          setUser(newUserData.data.createUser);
          console.log('newUserData -> ', newUserData);

        } else {
          setUser(signinUserData.data.getUser);
        }
        navigation.navigate("Home");
      } catch (error) {
        console.log('error -> ', error);
      }

    } catch (error) {
      Alert.alert("Oops", error.message);
    }

    // setLoading(false);
  };

  const onGoogleSignin = useCallback(() => {
    // Auth.federatedSignIn({ provider: "google" });
  }, []);


  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/icon.png')} resizeMode="contain" style={styles.logo} />
      </View>

      {/* Login form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Login to Your Account</Text>

        <View style={styles.inputContainer}>
          <TextInput placeholder="Email" style={styles.input} value={userForm.username} onChangeText={name => setUserForm({ ...userForm, username: name })} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput placeholder="Password" secureTextEntry value={userForm.password} style={styles.input} onChangeText={pass => setUserForm({ ...userForm, password: pass })} />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={onSignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordButtonText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.orLine}></View>
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine}></View>
        </View>

        <TouchableOpacity style={styles.socialButton}>
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={onGoogleSignin}>
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity style={styles.footerButton} onPress={onSignUp}>
          <Text style={styles.footerButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    height: 150,

  },
  formContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  forgotPasswordButtonText: {
    color: '#007AFF',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    textAlign: 'center',
    width: 50,
    color: '#ccc',
    fontWeight: 'bold',
  },
  socialButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  footerButton: {
    marginLeft: 5,
  },
  footerText: {
    color: '#ccc',
    fontSize: 16,
  },
  footerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;