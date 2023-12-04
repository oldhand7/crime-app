import React, { useState } from "react";

import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from "react-native";

import StyledTextInput from "../components/base/StyledTextInput";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { Button } from "galio-framework";
import { argonTheme } from "../constants";

const { width, height } = Dimensions.get("screen");

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const ConfirmEmail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: { username: route?.params?.username },
  });

  const username = watch("username");

  const [loading, setLoading] = useState(false);
  const onConfirm = async (data) => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      await Auth.confirmSignUp(data.username, data.code);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Oops", error.message);
    }

    setLoading(false);
  };

  const onBackToSignin = () => {
    navigation.navigate("Login");
  };

  const onResendCode = async () => {
    try {
      await Auth.resendSignUp(username);
      Alert.alert("Success", "Code was sent to your email successfully");
    } catch (error) {
      Alert.alert("Oops", error.message);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.home}>
        <Text bold style={{ fontSize: 20 }}>
          Confirm your email
        </Text>

        <StyledTextInput
          name="username"
          control={control}
          placeholder="Username"
          rules={{
            required: "Username is required",
            pattern: { value: EMAIL_REGEX, message: "Username is invalid" },
            // maxLength: {
            //   value: 16,
            //   message: "Username should be max 10 characters long",
            // },
          }}
        />
        <StyledTextInput
          name="code"
          control={control}
          placeholder="Enter your confirmation code"
        />

        <Button
          round
          color={argonTheme.COLORS.PRIMARY}
          style={{ width: width - 40 }}
          onPress={handleSubmit(onConfirm)}
        >
          <Text bold style={{ color: argonTheme.COLORS.WHITE }}>
            {loading ? "Loading" : "Confirm"}
          </Text>
        </Button>

        <Button
          round
          color={argonTheme.COLORS.PRIMARY}
          style={{ width: width - 40 }}
          onPress={onResendCode}
        >
          <Text bold style={{ color: argonTheme.COLORS.WHITE }}>
            Resend code
          </Text>
        </Button>

        <Button
          round
          color={argonTheme.COLORS.PRIMARY}
          style={{ width: width - 40 }}
          onPress={onBackToSignin}
        >
          <Text bold style={{ color: argonTheme.COLORS.WHITE }}>
            Back to sign in
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  home: {
    paddingHorizontal: 15,
    width: width,
    backgroundColor: argonTheme.COLORS.WHITE,
    paddingVertical: 10,
  },
});

export default ConfirmEmail;
