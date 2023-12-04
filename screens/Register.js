import { StyleSheet, Dimensions, View, Alert } from "react-native";
import { useEffect } from "react";
import { argonTheme } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import StyledTextInput from "../components/base/StyledTextInput";
import { useState, useCallback } from "react";
import { Button, Text } from "galio-framework";
import { API, Auth } from "aws-amplify";
import * as mutations from "../graphql/mutations";
// import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

const { width, height } = Dimensions.get("screen");

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const Register = () => {
  const navigation = useNavigation();
  const { control, handleSubmit, watch } = useForm();
  const pwd = watch("password");

  const [loading, setLoading] = useState(false);

  const onSignUp = async (data) => {
    const { firstname, lastname, password, email } = data;

    const name = firstname + " " + lastname;
    const username = email;
    if (loading) {
      return;
    }
    //set Loading
    setLoading(true);
    try {
      //signup new users into aws,,, dynamo db
      const res = await Auth.signUp({
        username,
        password,
        attributes: { email, name, preferred_username: username },
      });
      // res.userSub
      const newUserData = await API.graphql({
        query: mutations.createUser,
        variables: {
          input: {
            id: res.userSub,
            name: name,
            firstName: firstname,
            lastName: lastname,
          },
        },
      });
      //Navigate to confirm email page if successful...
      navigation.navigate("ConfirmEmail", { username });
    } catch (error) {
      console.log("error -> ", error);
      Alert.alert("Oops", error.message);
    }

    setLoading(false);
    //send new user to the DB
  };
  async function signInWithGoogle() {
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   console.log(userInfo);
    //   // Use the user info in your app
    // } catch (error) {
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     console.log('User cancelled the login flow.');
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     console.log('Login flow already in progress.');
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     console.log('Play services not available');
    //   } else {
    //     console.log('Something went wrong:', error.message);
    //   }
    // }
  }

  useEffect(() => {
    (async () => {

      await GoogleSignin.configure({
        webClientId: '314426285261-fbaai08c12die6nuslffsipogotnb9ri.apps.googleusercontent.com',
        offlineAccess: true,
        hostedDomain: '',
        forceConsentPrompt: true,
        accountName: '',
      });
    })()

  }

    , []);

  const onSignIn = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.home}>
      <Text
        bold
        style={{
          fontSize: 40,
          marginBottom: 50,
          textAlign: "center",
          marginTop: 50,
        }}
      >
        Sign Up
      </Text>

      <StyledTextInput
        name="firstname"
        control={control}
        placeholder="First Name"
        rules={{
          required: "First Name is required",
          maxLength: {
            value: 16,
            message: "FirstName should be max 10 characters long",
          },
        }}
      />

      <StyledTextInput
        name="lastname"
        control={control}
        placeholder="Last Name"
        rules={{
          required: "Last Name is required",
          maxLength: {
            value: 16,
            message: "LastName should be max 10 characters long",
          },
        }}
      />

      <StyledTextInput
        name="email"
        control={control}
        placeholder="Email"
        rules={{
          required: "Email is required",
          pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
        }}
      />
      <StyledTextInput
        name="password"
        placeholder="Password"
        control={control}
        secureTextEntry={true}
        rules={{
          required: "Password is required",
          pattern: {
            value: PASSWORD_REGEX,
            message:
              "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
          },
          maxLength: {
            value: 16,
            message: "Password should be max 16 characters",
          },
        }}
      />
      <StyledTextInput
        name="repeatpassword"
        control={control}
        placeholder="Repeat password"
        secureTextEntry={true}
        rules={{
          validate: (value) => value === pwd || "Passwords do not match",
        }}
      />

      <Button
        round
        color={argonTheme.COLORS.PRIMARY}
        style={{ width: width - 40 }}
        onPress={handleSubmit(onSignUp)}
      >
        <Text bold style={{ color: argonTheme.COLORS.WHITE }}>
          {loading ? "Loading" : "Sign Up"}
        </Text>
      </Button>

      {/* 

      <Button
        round
        color={argonTheme.COLORS.PRIMARY}
        style={{ width: width - 40, marginTop: 50 }}
        onPress={signUpWithGoogle}
      >
        <Text bold style={{ color: argonTheme.COLORS.WHITE }}>
          {loading ? "Loading" : "Sign Up With Google"}
        </Text>
      </Button> */}
      {/* <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      /> */}
      <Button
        onPress={onSignIn}
        round
        color={argonTheme.COLORS.GREY_COLOR}
        style={{ width: width - 40 }}
      >
        <Text bold style={{ color: argonTheme.COLORS.PRIMARY }}>
          Already have an account? Sign in
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    paddingHorizontal: 15,
    width: width,
    height: height,
    backgroundColor: argonTheme.COLORS.WHITE,
    paddingVertical: 10,
  },
});

export default Register;
