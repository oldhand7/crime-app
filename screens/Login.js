// import React, { useCallback, useState } from "react";
// import { Block, Button, Text, theme } from "galio-framework";
// import FontIcon from "react-native-vector-icons/FontAwesome5";
// import {
//   StyleSheet,
//   Alert,
//   Dimensions,
//   ImageBackground,
//   Image,
// } from "react-native";
// import { Amplify, Auth, Hub } from "aws-amplify";
// import { useNavigation } from "@react-navigation/native";
// import { useForm } from "react-hook-form";

// // Import Theme
// import { argonTheme, Images } from "../constants";
// import StyledTextInput from "../components/base/StyledTextInput";

// import { API } from "aws-amplify";
// import * as queries from "../graphql/queries";
// import * as mutations from "../graphql/mutations";
// import userDetail from "../store/index";

// import { useAtom } from "jotai";

// const { width, height } = Dimensions.get("screen");

// const EMAIL_REGEX =
//   /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// const Login = () => {
//   const { control, handleSubmit } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useAtom(userDetail);
//   const navigation = useNavigation();

//   const onSignIn = async (data) => {
//     // data = {
//     //   username: "curtiswilmoth.business@gmail.com",
//     //   password: "Passion123",
//     // };
//     if (loading) {
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await Auth.signIn(data.username, data.password);
//       try {
//         const signinUserData = await API.graphql({
//           query: queries.getUser,
//           variables: { id: res.attributes.sub },
//         });
//         if (!signinUserData || !signinUserData.data?.getUser) {
//           const newUserData = await API.graphql({
//             query: mutations.createUser,
//             variables: {
//               input: {
//                 id: res.attributes.sub,
//               },
//             },
//           });
//           setUser(newUserData.data.createUser);
//         console.log('newUserData -> ', newUserData);

//         } else {
//           setUser(signinUserData.data.getUser);
//         }
//         navigation.navigate("Home");
//       } catch (error) {
//         console.log('error -> ', error);
//       }

//       // console.log('data: ', res)
//       // console.log('signinUserData -> ', signinUserData);


//     } catch (error) {
//       Alert.alert("Oops", error.message);
//     }

//     setLoading(false);
//   };

//   const onGoogleSignin = useCallback(() => {
//     Auth.federatedSignIn({ provider: "google" });
//   }, []);

//   const onSignup = () => {
//     //navigate to Sign Up Screen component
//     navigation.navigate("Register");
//   };

//   return (
//     <Block flex left style={styles.home}>
//       <Button
//         onPress={() => navigation.navigate("Home")}
//         color="white"
//         style={{
//           width: "auto",
//           height: "auto",
//           paddingHorizontal: 0,
//         }}
//       >
//         <FontIcon name="arrow-left" size={16} />
//       </Button>

//       <Image
//         borderRadius={100}
//         source={{ uri: Images.ProfilePicture }}
//         style={styles.profileContainer}
//         imageStyle={styles.ProfilePicture}
//       />
//       <Text bold style={{ fontSize: 20 }}>
//         Welcome back, Wazer!
//       </Text>

//       <StyledTextInput
//         name="username"
//         control={control}
//         placeholder="Email"
//         initialValue="curtiswilmoth.business@gmail.com"
//         rules={{
//           required: "Email is required",
//           // pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
//           //   maxLength: {
//           //     value: 16,
//           //     message: "Username should be max 10 characters long",
//           //   },
//         }}
//       />

//       <StyledTextInput
//         name="password"
//         placeholder="Password"
//         control={control}
//         secureTextEntry={true}
//         value="Passion123"
//         rules={{
//           required: "Password is required",
//           pattern: {
//             // value: PASSWORD_REGEX,
//             message:
//               "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
//           },
//           maxLength: {
//             value: 16,
//             message: "Password should be max 16 characters",
//           },
//         }}
//       />

//       <Button
//         round
//         color={argonTheme.COLORS.PRIMARY}
//         style={{ width: width - 40 }}
//         onPress={handleSubmit(onSignIn)}
//       >
//         <Text bold style={{ color: argonTheme.COLORS.WHITE }}>
//           {loading ? "Loading" : "Next"}
//         </Text>
//       </Button>

//       <Block
//         style={{
//           marginVertical: 10,
//           height: 1,
//           width: width - 40,
//           backgroundColor: argonTheme.COLORS.BORDER,
//         }}
//       >
//         <Text
//           style={{
//             position: "absolute",
//             top: -10,
//             left: "48%",
//             paddingHorizontal: 10,
//             backgroundColor: "#fff",
//           }}
//         >
//           OR
//         </Text>
//       </Block>

//       <Button
//         round
//         color={argonTheme.COLORS.GREY_COLOR}
//         style={{ width: width - 40 }}
//         onPress={onGoogleSignin}
//       >
//         <Block flex center row>
//           <FontIcon name="google" color={argonTheme.COLORS.PRIMARY} size={16} />
//           <Text
//             bold
//             style={{ color: argonTheme.COLORS.PRIMARY, paddingLeft: 5 }}
//           >
//             Log in with Google
//           </Text>
//         </Block>
//       </Button>

//       <Button
//         onPress={onSignup}
//         round
//         color={argonTheme.COLORS.GREY_COLOR}
//         style={{ width: width - 40 }}
//       >
//         <Text bold style={{ color: argonTheme.COLORS.PRIMARY }}>
//           Don't have an account? Create One
//         </Text>
//       </Button>
//     </Block>
//   );
// };

// const styles = StyleSheet.create({
//   home: {
//     paddingHorizontal: 15,
//     width: width,
//     backgroundColor: argonTheme.COLORS.WHITE,
//     paddingVertical: 10,
//   },
//   profileContainer: {
//     marginBottom: 10,
//     width: 100,
//     height: 100,
//   },
// });

// export default Login;



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
    // data = {
    //   username: "curtiswilmoth.business@gmail.com",
    //   password: "Passion123",
    // };
    // if (loading) {
    //   return;
    // }
    // setLoading(true);
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

      // console.log('data: ', res)
      // console.log('signinUserData -> ', signinUserData);


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