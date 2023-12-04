import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import StyledTextInput from "../components/base/StyledTextInput";

import {
  useStripe,
  CardField,
  useConfirmSetupIntent,
} from "@stripe/stripe-react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

import Modal from "react-native-modal";
import axios from "axios";

import { useAtom } from "jotai";
import userDetail from "../store/index";
import settingDetail from "../store/setting";

import { API, Auth, graphqlOperation } from "aws-amplify";
import * as mutations from "../graphql/mutations";

import { createSubscription } from "../graphql/mutations";
import { SHOW_LOCATION, SHOW_NOTIFICATION, SUBSCRIPTION_URL } from "../constant/constant";
import TransparentTextInput from "./components/OutlineRoundedTextInput";
import OutlineRoundedTextInput from "./components/OutlineRoundedTextInput";

// Call setOptions before any other Stripe methods

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function Profile() {
  const [user, setUser] = useAtom(userDetail);
  const [gSettings, setSettings] = useAtom(settingDetail);
  const [avatar, setAvatar] = useState("");
  const [refresh, setRefresh] = useState(false)
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [marker, setMarker] = useState(null);
  const [modalUser, setModalUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    lat: 37,
    long: -50,
    address: "unknown",
  });
  const [cardDetails, setCardDetails] = useState({});

  const [showNoti, setShowNoti] = useState(true);
  const [showLocation, setShowLocation] = useState(true);

  const [user_address_edit, setAddress] = useState("unknown");
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalEdit = () => {
    if (!isEditModalVisible) {
      if (user.lat != null) {
        setMarker({ latitude: user.lat, longitude: user.long });
      }
      if (user_address_edit) user.address = user_address_edit;
      setModalUser(user);
    }

    setEditModalVisible(!isEditModalVisible);
  };

  const onCardChange = (text) => {
    console.log("424242   -> ", text);
    setCardDetails(text);
  };


  useEffect(() => {
    loadStoredData();
  }, []);
  useEffect(() => {
    if (!user) return;
    getAddress(user);
  }, [user]);

  const onOkModal = async () => {
    console.log(modalUser);
    const newUserData = await API.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: modalUser.id,
          name: modalUser.firstName + " " + modalUser.lastName,
          firstName: modalUser.firstName,
          lastName: modalUser.lastName,
          lat: marker.latitude.toFixed(7),
          long: marker.longitude.toFixed(7),
        },
      },
    });
    getAddress(newUserData.data.updateUser);
    console.log('update user -----> ', newUserData.data.updateUser);
    setUser(newUserData.data.updateUser);
    toggleModalEdit();
  };

  //  subscription -----------------
  const handleOk = async () => {


    try {
      let response = (
        await axios.post(
          `${SUBSCRIPTION_URL}/create-subscription`,
          cardDetails
        )
      ).data;
      response = JSON.parse(response.body);
      const updateProfile = await API.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: user.id,
            subscriptionID: response.subscriptionID,
            dueDay: new Date(response.period.end * 1000),
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

    } catch (error) {
      console.log(error)
    }




  };



  const handleAvatarPress = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      alert('You need to allow camera roll permissions to change your avatar!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log(result);
      console.log('result ---> ', result.assets[0].uri);
      const newUserData = await API.graphql({
        query: mutations.updateUser,
        variables: {
          input: {
            id: user.id,
            name: user.firstName + " " + user.lastName,
            firstName: user.firstName,
            lastName: "lastname",
            lat: user.lat,
            long: user.long,
            image: result.assets[0].uri
          },
        },
      });

      console.log(newUserData.data.updateUser);
      setAvatar(result.assets[0].uri);





    } catch (err) {
      console.log('Error while picking an image', err);
    }
  };

  const handleCancel = async () => {
    console.log(user.id);
    const response = await API.graphql({
      query: mutations.updateUser,
      variables: {
        input: {
          id: user.id,
          subscriptionID: null,
        },
      },
    });
    console.log(response);
    setUser(response.data.updateUser);
  };

  const getAddress = async (user) => {
    try {
      if (user == null || user.lat == null || user.long == null) {
        setAddress("unknown");
        return;
      }
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${user.lat}&lon=${user.long}`
      );

      if (response.data.display_name) {
        setAddress(response.data.display_name);
      } else {
        setAddress(response.data.display_name);
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const getModalAddress = async (user) => {
    try {
      if (user.lat == null || user.long == null)
        setModalUser({ ...modalUser, address: "unknown" });
      console.log("user ----> ", user.lat);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${user.lat}&lon=${user.long}`
      );

      if (response.data.display_name) {
        setModalUser({
          ...modalUser,
          address: response.data.display_name,
          lat: user.lat,
          long: user.long,
        });
      } else {
        setModalUser({ ...modalUser, address: "unknown" });
      }
    } catch (error) {
      console.error("Error getting address:", error);
    }
  };

  const saveLocationData = async (flag) => {
    try {
      await AsyncStorage.setItem(SHOW_LOCATION, flag ? "show" : "hide");
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const saveNotificationData = async (flag) => {
    try {
      await AsyncStorage.setItem(SHOW_NOTIFICATION, flag ? "show" : "hide");
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  const loadStoredData = async () => {
    try {
      let value = await AsyncStorage.getItem(SHOW_LOCATION);
      setShowLocation(value == "show" ? true : false);
      setSettings(SHOW_LOCATION, value);
      console.log("value -----> ", value);
      value = await AsyncStorage.getItem(SHOW_NOTIFICATION);
      setShowNoti(value == "show" ? true : false);
      setSettings(SHOW_NOTIFICATION, value);

      if (value !== null) {
        // setStoredData(value);
      }
    } catch (error) {
    }
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
                <TouchableOpacity onPress={handleAvatarPress}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                  ) : (
                    <Image
                      source={{ uri: Images.ProfilePicture }}
                      style={[styles.avatar, styles.defaultAvatar]}
                    />
                  )}
                </TouchableOpacity>
                {/* 
                <Image
                  source={{ uri: Images.ProfilePicture }}
                  style={styles.avatar}
                /> */}
              </Block>
              <Block style={styles.info}>
                {/* <Block
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
                </Block> */}
                {/* <Block row space="between">
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
                </Block> */}
              </Block>
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color="#32325D">
                    {user && user.firstName + "  " + user.lastName}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    {user_address_edit}
                  </Text>
                </Block>


                <Button
                  small
                  style={{
                    backgroundColor: argonTheme.COLORS.PRIMARY,
                    marginLeft: "auto",
                  }}
                  onPress={toggleModalEdit}
                >
                  Edit
                </Button>

                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                  <Text bold size={28} color="#32325D">
                    Settings
                  </Text>
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
                      saveNotificationData(!showNoti);
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
                      saveLocationData(!showLocation);

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

          <Modal isVisible={isEditModalVisible}>
            <View style={styles.modalContainer}>
              <View style={styles.centeredContainer}>
                <OutlineRoundedTextInput
                  placeholder="Enter your name"
                  placeholderTextColor="#aaa"
                  label="FirstName"

                  onChangeText={e => setModalUser({ ...modalUser, firstName: e })}
                  value={modalUser.firstName}
                />
                <OutlineRoundedTextInput
                  placeholder="Enter your lastname"
                  placeholderTextColor="#aaa"
                  label="LastName"

                  onChangeText={e => setModalUser({ ...modalUser, lastName: e })}
                  value={modalUser.lastName}
                />

                <Block middle style={styles.nameInfo}>
                  <Text bold size={20} color="#32325D">
                    {modalUser.address}
                  </Text>
                </Block>
                <MapView
                  style={{ height: 300, width: width - 100, borerRadius: 20 }}
                  initialRegion={{
                    latitude: modalUser.lat | 37.78825,
                    longitude: modalUser.long | -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  onPress={(e) => {
                    getModalAddress({
                      lat: e.nativeEvent.coordinate.latitude,
                      long: e.nativeEvent.coordinate.longitude,
                    }),
                      setMarker(e.nativeEvent.coordinate);
                  }}
                >
                  {marker && <Marker coordinate={marker} />}
                </MapView>
                <Block row style={{ display: "flex" }}>
                  <Button
                    small
                    style={{
                      backgroundColor: argonTheme.COLORS.DEFAULT,
                      marginLeft: "auto",
                    }}
                    onPress={toggleModalEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    small
                    style={{ backgroundColor: argonTheme.COLORS.PRIMARY }}
                    onPress={onOkModal}
                  >
                    OK
                  </Button>
                </Block>
              </View>
            </View>
          </Modal>
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
    marginTop: 20,
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
