import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  Alert,
  Switch,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import {
  useStripe,
  CardField,
  useConfirmSetupIntent,
} from "@stripe/stripe-react-native";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useNavigation } from "@react-navigation/native";

import Modal from "react-native-modal";
import axios from "axios";

import { useAtom } from "jotai";
import userDetail from "../store/index";

import { API, Auth, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";

import { createSubscription } from "../graphql/mutations";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function Statistics() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState({});

  const [showNoti, setShowNoti] = useState(true);
  const [showLocation, setShowLocation] = useState(true);

  const { confirmSetupIntent } = useConfirmSetupIntent();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [user, setUser] = useAtom(userDetail);

  const onCardChange = (text) => {
    console.log("424242   -> ", text);
    setCardDetails(text);
  };

  const handleOk = async () => {
    // -----------------------
    // const response = await API.graphql({
    //   query: mutations.subscribeToPremium,
    // });
    // console.log("resopnse ---> ", response);
    // if (response.errors) {
    //   return Alert.alert("Donation Error", response.statusText);
    // }
    // -------------------

    try {
      console.log("details ------> ", cardDetails);
      const response = (
        await axios.post(
          "http://172.20.105.107:5000/create-subscription",
          cardDetails
        )
      ).data;
      console.log("payment Intent -----> ", response);
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await API.graphql(
        graphqlOperation(createSubscription, { setupIntentId: setupIntent.id })
      );

      console.log("Subscription response:", response);

      // Handle the response as needed, e.g., update UI
    } catch (graphqlError) {
      console.error("GraphQL Error:", graphqlError);
    }

    const data = response.data.subscribeToPremium;

    const updateProfile = await API.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: user.id,
          subscriptionID: data.subscriptionID,
          dueDay: new Date(data.end * 1000),
        },
      },
    });

    console.log("updateProfile -> ", updateProfile);
    console.log("updateuser: ", updateProfile.data.updateUser);
    setUser(updateProfile.data.updateUser);
    toggleModal();
    Alert.alert(
      "Success!",
      "Donated successfully! Thank you for the donation."
    );
    navigation.navigate("Home");
  };

  const handleCancel = async () => {
    const response = await API.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: user.id,
          subscriptionID: null,
        },
      },
    });
    setUser(response.data.updateUser);
  };
  const thumbColor =
    Platform.OS === "ios"
      ? null
      : Platform.OS === "android" && showNoti
      ? argonTheme.COLORS.SWITCH_ON
      : argonTheme.COLORS.SWITCH_OFF;

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: "25%" }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <Image
                  source={{ uri: Images.ProfilePicture }}
                  style={styles.avatar}
                />
              </Block>
              <Block style={styles.info}>
                <Block
                  middle
                  row
                  space="evenly"
                  style={{ marginTop: 20, paddingBottom: 24 }}
                >
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.INFO }}
                  >
                    CONNECT
                  </Button>
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                  >
                    MESSAGE
                  </Button>
                </Block>
                <Block row space="between">
                  <Block middle>
                    <Text
                      bold
                      size={18}
                      color="#525F7F"
                      style={{ marginBottom: 4 }}
                    >
                      2K
                    </Text>
                    <Text size={12} color={argonTheme.COLORS.TEXT}>
                      Orders
                    </Text>
                  </Block>
                  <Block middle>
                    <Text
                      bold
                      color="#525F7F"
                      size={18}
                      style={{ marginBottom: 4 }}
                    >
                      10
                    </Text>
                    <Text size={12} color={argonTheme.COLORS.TEXT}>
                      Photos
                    </Text>
                  </Block>
                  <Block middle>
                    <Text
                      bold
                      color="#525F7F"
                      size={18}
                      style={{ marginBottom: 4 }}
                    >
                      89
                    </Text>
                    <Text size={12} color={argonTheme.COLORS.TEXT}>
                      Comments
                    </Text>
                  </Block>
                </Block>
              </Block>
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color="#32325D">
                    Jessica Jones, 27
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    San Francisco, USA
                  </Text>
                </Block>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                {/* <Block middle>
                  <Text
                    size={16}
                    color="#525F7F"
                    style={{ textAlign: "center" }}
                  >
                    An artist of considerable range, Jessica name taken by
                    Melbourne …
                  </Text>
                  <Button
                    color="transparent"
                    textStyle={{
                      color: "#233DD2",
                      fontWeight: "500",
                      fontSize: 16,
                    }}
                  >
                    Show more
                  </Button>
                </Block> */}
                <Block row space="between">
                  <Text
                    bold
                    size={16}
                    color="#525F7F"
                    style={{ marginTop: 12 }}
                  >
                    Notification
                  </Text>
                  <Switch
                    onChange={(e) => {
                      console.log("------------");
                      console.log(e.value, e.target);
                      setShowNoti(!showNoti);
                    }}
                    value={showNoti}
                    thumbColor={thumbColor}
                    ios_backgroundColor={argonTheme.COLORS.SWITCH_OFF}
                    trackColor={{
                      false: argonTheme.COLORS.SWITCH_OFF,
                      true: argonTheme.COLORS.SWITCH_ON,
                    }}
                  />
                </Block>
                <Block row space="between">
                  <Text
                    bold
                    size={16}
                    color="#525F7F"
                    style={{ marginTop: 12 }}
                  >
                    Show Location
                  </Text>
                  <Switch
                    onChange={(e) => {
                      console.log("------------");
                      console.log(e.value, e.target);
                      setShowLocation(!showLocation);
                    }}
                    value={showLocation}
                    thumbColor={thumbColor}
                    ios_backgroundColor={argonTheme.COLORS.SWITCH_OFF}
                    trackColor={{
                      false: argonTheme.COLORS.SWITCH_OFF,
                      true: argonTheme.COLORS.SWITCH_ON,
                    }}
                  />
                </Block>
                {/* <Block row space="between">
                  <Text
                    bold
                    size={16}
                    color="#525F7F"
                    style={{ marginTop: 12 }}
                  >
                    Album
                  </Text>
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.INFO }}
                  >
                    CONNECT
                  </Button>
                </Block> */}
                {/* <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                  <Block row space="between" style={{ flexWrap: "wrap" }}>
                    {Images.Viewed.map((img, imgIndex) => (
                      <Image
                        source={{ uri: img }}
                        key={`viewed-${img}`}
                        resizeMode="cover"
                        style={styles.thumb}
                      />
                    ))}
                  </Block>
                </Block> */}

                {/* <Block row space="between">
                  <Text
                    bold
                    size={16}
                    color="#525F7F"
                    style={{ marginTop: 12 }}
                  >
                    Album
                  </Text>
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.INFO }}
                  >
                    CONNECT
                  </Button>
                </Block> */}
                {/* <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                  <Block row space="between" style={{ flexWrap: "wrap" }}>
                    {Images.Viewed.map((img, imgIndex) => (
                      <Image
                        source={{ uri: img }}
                        key={`viewed-${img}`}
                        resizeMode="cover"
                        style={styles.thumb}
                      />
                    ))}
                  </Block>
                </Block> */}
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color="#32325D">
                    Subscription
                  </Text>
                  {!user.subscriptionID ? (
                    <Block row>
                      {/* <Text
                        bold
                        size={16}
                        color="#525F7F"
                        style={{ marginTop: 12 }}
                      >
                        Basic
                      </Text> */}
                      <Button
                        large
                        style={{ backgroundColor: argonTheme.COLORS.INFO }}
                        onPress={toggleModal}
                      >
                        Subscribe
                      </Button>
                    </Block>
                  ) : (
                    <Block row>
                      <Text
                        bold
                        size={16}
                        color="#525F7F"
                        style={{ marginTop: 12 }}
                      >
                        Premium
                      </Text>
                      <Button
                        small
                        style={{ backgroundColor: argonTheme.COLORS.INFO }}
                      >
                        <Text>
                          ~{new Date(user.dueDay).getMonth() + 1}/
                          {new Date(user.dueDay).getDate()}
                        </Text>
                      </Button>
                      <Button
                        small
                        style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                        onPress={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Block>
                  )}
                </Block>
              </Block>
            </Block>
          </ScrollView>

          <Modal isVisible={isModalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.centeredContainer}>
                <Block row center>
                  <Text style={{ fontSize: 24 }}>Are you sure?</Text>
                </Block>
                <CardField
                  postalCodeEnabled={true}
                  placeholders={{
                    number: "4242 4242 4242 4242",
                  }}
                  cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#000000",
                  }}
                  style={{
                    width: "100%",
                    height: 50,
                    marginVertical: 30,
                  }}
                  onCardChange={(detail) => onCardChange(detail)}
                  onFocus={(focusedField) => {
                    console.log("focusField", focusedField);
                  }}
                />

                <Block row center>
                  <Button
                    small
                    style={{
                      backgroundColor: argonTheme.COLORS.INFO,
                      marginRight: 10,
                    }}
                    onPress={handleOk}
                  >
                    Ok
                  </Button>
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                    onPress={() => {
                      // Handle "Cancel" button action here
                      toggleModal(); // Close the modal
                    }}
                  >
                    Cancel
                  </Button>
                </Block>
              </View>
            </View>
          </Modal>
        </ImageBackground>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 6,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
  },
});
