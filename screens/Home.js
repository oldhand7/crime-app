import React, { useEffect, useRef, useState, lazy } from "react";
import {
  StyleSheet,
  Dimensions,
  StatusBar,
  View,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";
import { Block, theme, Button, Text } from "galio-framework";
import MapView, { PROVIDER_GOOGLE, Marker, Heatmap } from "react-native-maps";
import { SwipeablePanel } from "rn-swipeable-panel";
import FontIcon from "react-native-vector-icons/FontAwesome5";
import { argonTheme } from "../constants";
import { useNavigation } from "@react-navigation/native";
import ReportBottomSheet from "../components/features/bottomSheet/ReportBottomSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Amplify } from "aws-amplify";
// import { GoogleSignIn} from 'expo-google-sign-in';
// import awsExports from "./aws-exports";
Amplify.configure({
  "aws_project_region": "us-east-1",
  "aws_appsync_graphqlEndpoint": "https://jwjld4m7hffildg2kef67yckw4.appsync-api.us-east-1.amazonaws.com/graphql",
  "aws_appsync_region": "us-east-1",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-sswkjjmryza33ifsi47dr5w2d4",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_sWM0Xg891",
  "aws_user_pools_web_client_id": "7me598necuptodkkeo2f8qml3",
  "oauth": {
    "domain": "crime-dev.auth.us-east-1.amazoncognito.com",
    "scope": [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin"
    ],
    "redirectSignIn": "myapp://",
    "redirectSignOut": "myapp://",
    "responseType": "code"
  },

});
import { API } from "aws-amplify";
import * as queries from "../graphql/queries";
import { onCreateCrime } from "../graphql/subscriptions";
import { graphqlOperation } from "aws-amplify";

import { useAtom } from "jotai";
import userDetail from "../store/index";
import { SHOW_LOCATION, SHOW_NOTIFICATION } from "../constant/constant";

import { getAddress } from "../util/address";



const { width, height } = Dimensions.get("screen");

const Home = () => {
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const [position, setPosition] = useState(null);
  const [isloading, setIsLoaing] = useState(true);
  const [message, setMessage] = useState("");
  const [initLoc, setInitLoc] = useState({
    latitude: 37.78839880893652,
    longitude: -122.43523646146058,
    latitudeDelta: 0.09,
    longitudeDelta: 0.0121,
  })
  const [selectedType, setSelectedType] = useState({
    id: 1,
    slug: "facebook",
  });

  const [user, setUser] = useAtom(userDetail);

  const [settings, setSettings] = useState({
    showNotification: true,
    showLocation: true,
  });

  const [crimes, setCrimes] = useState([]);
  const [ismarkerVisible, setisMarkerVisible] = useState(true);

  const [swipeablePanelActive, setSwipeablePanelActive] = useState(false);
  const [swipeableReportPanelActive, setSwipeableReportPanelActive] =
    useState(false);

  const onConfigureGoogleSignIn = async () => {

    // GoogleSignin.configure({ 
    //   webClientId: '314426285261-fbaai08c12die6nuslffsipogotnb9ri.apps.googleusercontent.com', 
    //   offlineAccess: true 
    //  }); 

  };


  useEffect(() => {
    if (settings.showLocation && user) {
      console.log('user locaiton show');
      setInitLoc({ ...initLoc, lat: user.lat, long: user.long })
    }
  }, [settings, user])
  // const onGoogleSignIn = async () => {
  //   try {
  //     // let res = await GoogleSignIn.askForPlayServicesAsync();
  //     // console.log("res ", res);
  //     // if (type === "success") {
  //     //   this._syncUserWithStateAsync();
  //     // }
  //   } catch ({ message }) {
  //     alert("login: Error:" + message);
  //   }
  //   try {
  //     const result = await GoogleSignIn.logInAsync({
  //       androidClientId: "YOUR_ANDROID_CLIENT_ID_FROM_GOOGLE",
  //       scopes: ["profile", "email"],
  //     });
  //     console.log(result);
  //     if (result.type === "success") {
  //       // User has successfully authenticated with Google
  //       const credential = firebase.auth.GoogleAuthProvider.credential(
  //         result.idToken,
  //         result.accessToken
  //       );
  //       firebase
  //         .auth()
  //         .signInWithCredential(credential)
  //         .then(() => console.log("User logged in with Firebase!"))
  //         .catch((error) => console.log(error));
  //     } else {
  //       console.log("Login request was cancelled.");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    (async () => {
      await onConfigureGoogleSignIn();
    })();

    const subscription = API.graphql(graphqlOperation(onCreateCrime)).subscribe(
      {
        next: async (event) => {
          try {
            console.log("notification", settings, event.value.data.onCreateCrime);
            if (settings.showNotification) {
              let createdData = event.value.data.onCreateCrime;
              const address = await getAddress(createdData);
              // if (createdData.reporter.id == user.id) {
              Alert.alert(
                createdData.title,
                " ( " + address + ")"
              );
              // }
            }
          } catch (error) {
            console.log(error);
          }

          // Implement logic to handle the new data (e.g., update your app state)
        },
        error: (error) => {
          console.error("Error subscribing to onCreateData:", error);
        },
      }
    );

    return () => {
      // Clean up the subscription when the component unmounts
      subscription.unsubscribe();
    };
  }, []);
  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    console.log("home did mount");
    const loadcrimes = async () => {
      try {
        const res = await API.graphql({ query: queries.listCrimes });
        console.log('crimes -> ', res);
        setCrimes(res.data.listCrimes.items);
        setIsLoaing(false);
      } catch (error) {
        console.error(error);
        ToastAndroid.show(`${error}`, ToastAndroid.LONG);
      }
    };
    loadcrimes();
  }, []);

  // get all setting data like show location, show Notificati

  useEffect(() => {
    // console.log("home did mount", position);

    position &&
      mapRef.current.animateToRegion(
        {
          ...position,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        3 * 1000
      );
  }, [position]);

  useEffect(() => {
    loadStoredData();
  }, []);
  const loadStoredData = async () => {
    try {
      let value = await AsyncStorage.getItem(SHOW_LOCATION);
      setSettings({ ...settings, showLocation: value });
      value = await AsyncStorage.getItem(SHOW_NOTIFICATION);
      setSettings({ ...settings, showNotification: value });

      if (value !== null) {
        // setStoredData(value);
        console.log("Data loaded successfully!");
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  openPanel = () => {
    setSwipeablePanelActive(true);
  };

  closePanel = () => {
    setSwipeablePanelActive(false);
  };

  openReportPanel = () => {
    setSwipeableReportPanelActive(true);
  };

  closeReportPanel = () => {
    setSwipeableReportPanelActive(false);
  };

  const sendMessage = () => {
    navigation.navigate("callSms");
  };

  const addCrime = (newCrime) => {
    setCrimes([...crimes, newCrime]);
  };

  //   var pinIcon = new google.maps.MarkerImage(
  //     "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FFFF00",
  //     null, /* size is determined at runtime */
  //     null, /* origin is 0,0 */
  //     null, /* anchor is bottom center of the scaled image */
  //     new google.maps.Size(42, 68)
  // );

  return (
    <Block flex center style={styles.home}>
      <StatusBar barStyle="light-content" />
      <View contentContainerStyle={styles.articles}>
        {isloading ? (
          <View style={[styles.container, styles.horizontal]}>
            {/* <ActivityIndicator size="largeest" color="#0000ff" /> */}
          </View>
        ) : (
          <Block flex>
            <View style={styles.button}>
              {/* <Button
                onPress={this.openPanel}
                style={{
                  width: "auto",
                  height: "auto",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: "#fff",
                }}
              >
                <FontIcon name="bars" size={18} />
              </Button> */}
            </View>

            {user !== null && (
              <View style={styles.reportBtn}>
                <Button
                  onPress={this.openReportPanel}
                  onlyIcon
                  icon="tags"
                  iconFamily="antdesign"
                  iconSize={30}
                  color="warning"
                  iconColor="#fff"
                  style={{ width: 40, height: 40 }}
                >
                  warning
                </Button>
              </View>
            )}
            {user && (
              <View style={styles.reportBtn2}>
                <Button
                  onPress={() => setisMarkerVisible(!ismarkerVisible)}
                  onlyIcon
                  icon="key"
                  iconFamily="antdesign"
                  iconSize={24}
                  color="warning"
                  iconColor="#fff"
                  style={{ width: 40, height: 40 }}
                >
                  Heatmap
                </Button>
              </View>
            )}

            <SwipeablePanel
              fullWidth
              noBar
              openLarge
              onlyLarge
              closeOnTouchOutside
              isActive={swipeableReportPanelActive}
              onClose={this.closeReportPanel}
              onPressCloseButton={this.closeReportPanel}
              style={{
                paddingVertical: 20,
                paddingHorizontal: 0,
                height: "auto",
              }}
            >
              <ReportBottomSheet
                selectedType={selectedType}
                mapRef={mapRef}
                message={message}
                setMessage={setMessage}
                setSelectedType={setSelectedType}
                setPosition={setPosition}
                onAddCrime={addCrime}
                setSwipeableReportPanelActive={setSwipeableReportPanelActive}
              />
            </SwipeablePanel>

            {!user ? (
              <SwipeablePanel
                fullWidth
                noBar
                closeOnTouchOutside
                isActive={swipeablePanelActive}
                onClose={this.closePanel}
                onPressCloseButton={this.closePanel}
                style={{ paddingVertical: 20, paddingHorizontal: 15 }}
              >
                <Block flex center>
                  <Text
                    style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}
                  >
                    Create your Waze account or log in
                  </Text>
                </Block>

                <Button
                  round
                  color={argonTheme.COLORS.GREY_COLOR}
                  style={{ width: width - 40 }}
                  onPress={() => {
                    navigation.navigate("Login");
                    closePanel();
                  }}
                >
                  <Block flex center row>
                    <FontIcon
                      name="google"
                      color={argonTheme.COLORS.PRIMARY}
                      size={16}
                    />
                    <Text
                      bold
                      style={{
                        color: argonTheme.COLORS.PRIMARY,
                        paddingLeft: 5,
                      }}
                    >
                      Sign up with Google
                    </Text>
                  </Block>
                </Button>
                {/* <GoogleSigninButton 
 style={{ width: 192, height: 48 }} 
 size={GoogleSigninButton.Size.Wide} 
 color={GoogleSigninButton.Color.Light} 
 onPress={signIn} 
/>  */}
                {/* <Button
                  round
                  color={argonTheme.COLORS.GREY_COLOR}
                  onPress={onGoogleSignIn}
                  style={{ width: width - 40 }}
                >
                  <Block flex center row>
                    <FontIcon
                      name="envelope"
                      color={argonTheme.COLORS.PRIMARY}
                      size={16}
                    />
                    <Text
                      bold
                      style={{
                        color: argonTheme.COLORS.PRIMARY,
                        paddingLeft: 5,
                      }}
                    >
                      Sign up with Email
                    </Text>
                  </Block>
                </Button> */}

                <Block
                  flex
                  center
                  row
                  style={{
                    marginVertical: 10,
                    height: 1,
                    width: width - 40,
                    backgroundColor: argonTheme.COLORS.BORDER,
                  }}
                >
                  <Text
                    style={{
                      position: "absolute",
                      left: "48%",
                      paddingHorizontal: 10,
                      backgroundColor: "#fff",
                    }}
                  >
                    OR
                  </Text>
                </Block>

                <Button
                  round
                  color={argonTheme.COLORS.GREY_COLOR}
                  style={{ width: width - 40 }}
                >
                  <Text bold style={{ color: argonTheme.COLORS.PRIMARY }}>
                    Continue as guest
                  </Text>
                </Button>
              </SwipeablePanel>
            ) : (
              <SwipeablePanel
                fullWidth
                noBar
                onlySmall
                closeOnTouchOutside
                smallPanelHeight={400}
                isActive={swipeablePanelActive}
                onClose={this.closePanel}
                onPressCloseButton={this.closePanel}
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 15,
                }}
              >
                <Block flex center>
                  <Text
                    style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}
                  >
                    Please confirm what you want
                  </Text>
                </Block>

                <Button
                  round
                  color={argonTheme.COLORS.GREY_COLOR}
                  style={{ width: width - 40 }}
                  onPress={() => {
                    navigation.navigate("Profile");
                    closePanel();
                  }}
                >
                  <Block flex center row>
                    <Text
                      bold
                      style={{
                        color: argonTheme.COLORS.PRIMARY,
                        paddingLeft: 5,
                      }}
                    >
                      Go to Profile
                    </Text>
                  </Block>
                </Button>

                <Button
                  round
                  color={argonTheme.COLORS.GREY_COLOR}
                  style={{ width: width - 40 }}
                  onPress={() => {
                    navigation.navigate("recentCrimes");
                    closePanel();
                  }}
                >
                  <Block flex center row>
                    <Text
                      bold
                      style={{
                        color: argonTheme.COLORS.PRIMARY,
                        paddingLeft: 5,
                      }}
                    >
                      CrimeList/Statistics
                    </Text>
                  </Block>
                </Button>

                <Button
                  round
                  color={argonTheme.COLORS.GREY_COLOR}
                  style={{ width: width - 40 }}
                  onPress={() => {
                    navigation.navigate("ContactList");
                    closePanel();
                  }}
                >
                  <Block flex center row>
                    <Text
                      bold
                      style={{
                        color: argonTheme.COLORS.PRIMARY,
                        paddingLeft: 5,
                      }}
                    >
                      Call/Message
                    </Text>
                  </Block>
                </Button>
              </SwipeablePanel>
            )}

            <MapView
              ref={mapRef}
              style={{ height: height, width: width }}
              provider={PROVIDER_GOOGLE}
              initialRegion={initLoc}
            >
              {ismarkerVisible &&
                crimes.map((crime, index) => (
                  <Marker
                    key={`marker-${index}`}
                    coordinate={{ latitude: crime.lat, longitude: crime.long }}
                    title={crime.title}
                    description={crime.content}
                  // icon={icon}
                  ></Marker>
                ))}
              {/* {user && <Marker
                key={`marker-me}`}
                coordinate={{ latitude: user.lat, longitude: user.long }}
                title={"mylocation"}
                description={"location"}
              // icon={icon}
              ></Marker>} */}
              {user && user.subscriptionID && (
                crimes.map((crime, index) => (

                  <Heatmap
                    key={index}
                    gradient={{
                      colors: [
                        "#0351b7",
                        "#0269ef",
                        "#2d88ff",
                        "#F29305",
                        "#E50000",
                      ],
                      startPoints: [0.2, 0.25, 0.5, 0.75, 1],
                    }}
                    points={[{
                      latitude: crime.lat,
                      longitude: crime.long,
                    }]}
                    opacity={1}
                    radius={50} // Adjust the radius here to control the size of the circle
                  />
                )))}
            </MapView>
          </Block>
        )}
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  button: {
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 1,
  },
  reportBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 1,
  },
  reportBtn2: {
    position: "absolute",
    bottom: 10,
    right: 55,
    zIndex: 1,
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default Home;
