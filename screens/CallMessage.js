import React, { useCallback, useState } from "react";
import { Block, Button, Text, theme } from "galio-framework";
import FontIcon from "react-native-vector-icons/FontAwesome5";
import {
  StyleSheet,
  Alert,
  Dimensions,
  ImageBackground,
  TextInput,
  Linking,
  Image,
} from "react-native";
import { Amplify, Auth, Hub } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Communications from "react-native-communications";
// Import Theme
import { argonTheme, Images } from "../constants";
import StyledTextInput from "../components/base/StyledTextInput";

import { useAtom } from "jotai";
// import { View } from "@aws-amplify/ui-react";

const { width, height } = Dimensions.get("screen");

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

const CallMessage = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({ phoneNumber: "", sms: "" });
  const onCall = () => {
    Communications.phonecall("3185999990", true);
  };

  const onMessage = () => {
    Linking.openURL("sms:" + state.phoneNumber);
  };

  return (
    <Block flex left style={styles.home}>
      {/* <Image
        borderRadius={100}
        source={{ uri: Images.ProfilePicture }}
        style={styles.profileContainer}
        imageStyle={styles.ProfilePicture}
      /> */}
      <Text bold style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>
        Call
      </Text>
      <Block style={{ display: "flex" }}>
        <TextInput
          placeholder={"Enter phone number"}
          value={state.phoneNumber}
          onChangeText={(e) => setState({ ...state, phoneNumber: e })}
          style={{ width: 90 }}
        />

        <Button
          onPress={() => onCall()}
          color="white"
          style={{
            width: "auto",
            height: "auto",
            paddingHorizontal: 0,
          }}
        >
          <FontIcon name="phone" size={16} />
        </Button>
      </Block>

      <Text bold style={{ fontSize: 20, marginTop: 30 }}>
        Message
      </Text>
      <TextInput
        placeholder={"Enter message"}
        value={state.message}
        style={{ height: 50 }}
        multiline
        numberOfLines={10}
        onChangeText={(e) => {
          console.log(e);
          setState({ ...state, message: e });
        }}
      />

      <Button
        onPress={onMessage}
        round
        color={argonTheme.COLORS.GREY_COLOR}
        style={{ width: width - 40 }}
      >
        <Text bold style={{ color: argonTheme.COLORS.PRIMARY }}>
          Send Message
        </Text>
      </Button>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    paddingHorizontal: 15,
    width: width,
    backgroundColor: argonTheme.COLORS.WHITE,
    paddingVertical: 10,
  },
  profileContainer: {
    marginBottom: 10,
    width: 100,
    height: 100,
  },
});

export default CallMessage;
