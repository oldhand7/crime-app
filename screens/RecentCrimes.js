import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  NativeModules,
  Platform,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
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
import PureChartBar from 'react-native-pure-chart-bar-kit';
import { useAtom } from "jotai";
import userDetail from "../store/index";
import * as queries from "../graphql/queries";

import { API, Auth, graphqlOperation } from "aws-amplify";
import { listCrimes, rangeSearchCrimes } from "../graphql/queries";
import { getAddress } from "../util/address";
import { formattedDate, isYesterdayOrToday } from "../util/dateUtil";
import { BarChart, LineChart } from "react-native-chart-kit";
import { RadioButton } from "react-native-paper";

const { } = NativeModules;

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function RecentCrimes() {
  const [user, setUser] = useAtom(userDetail);
  const [crimes, setCrimes] = useState([]);
  const [displayCrimes, setDisplayCrimes] = useState([]);
  const [checked, setChecked] = useState("second");
  const navigation = useNavigation();
  const [loading, setIsLoading] = useState(true)

  const [chartData, setChartData] = useState({
    labels: ["Robbery", "Murder", "Burglar", "Thief", "Attacker", "Killer"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // color of the line
        strokeWidth: 2, // width of the line
      },
    ],
  });

  const tmp = {
    labels: ["Robbery", "Murder", "Burglar", "Thief", "Attacker", "Killer"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // color of the line
        strokeWidth: 2, // width of the line
      },
    ],
  }

  const gLabels = [
    "Robbery",
    "Murder",
    "Burglar",
    "Thief",
    "Attacker",
    "Killer",
  ],
    getIndex = (str) => {
      let idx = gLabels.findIndex((item) => item == str);
      return idx;
    };

  useEffect(() => {
    if (user) {
      (async () => {
        const res = await API.graphql({ query: queries.listCrimes });
        let crimeList = res.data.listCrimes.items;
        let result = [];
        setCrimes(crimeList);
        setChecked("first");
        setIsLoading(false)

      })();
    }
  }, []);

  useEffect(() => {
    let tmp = Array(6).fill(0);
    crimes?.map((crime) => {
      try {
        tmp[getIndex(crime.title)]++;
      } catch (error) { }
    });
    setChartData({
      ...chartData,
      datasets: [
        {
          data: tmp,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // color of the line
          strokeWidth: 2,
        },
      ],
    });
  }, [crimes]);

  useEffect(() => {
    if (checked == "first") {
      let tmp = crimes.filter((crime) => isYesterdayOrToday(crime.updatedAt));
      setDisplayCrimes(tmp);
    } else if (checked == "second") {
      let tmp = crimes.filter((crime) => user.id == crime.reporterId);
      setDisplayCrimes(tmp);
    }
  }, [checked, crimes]);
  return (
    <Block flex style={styles.profile}>
      {loading ?
        <ActivityIndicator size="large" color="#0000ff" />
        : (<Block flex>
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
                <Block flex>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton
                      value="first"
                      status={checked === "first" ? "checked" : "unchecked"}
                      onPress={() => setChecked("first")}
                    />
                    <Text>Recent NearBy Crimes</Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton
                      value="second"
                      status={checked === "second" ? "checked" : "unchecked"}
                      onPress={() => setChecked("second")}
                    />
                    <Text>User Reports</Text>
                  </View>
                </Block>
                {displayCrimes && displayCrimes.length > 0 ? <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={32} color="#32325D">
                      Recent Crimes
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {/* {user_address_edit} */}
                    </Text>
                  </Block>
                  <Block row>
                    <Text
                      bold
                      size={16}
                      color="#525F7F"
                      style={{ marginTop: 12, width: 150 }}
                    >
                      Type
                    </Text>
                    <Text
                      bold
                      size={16}
                      color="#925F7F"
                      style={{ marginTop: 12, width: 150 }}
                    >
                      Location
                    </Text>
                    <Text
                      bold
                      size={16}
                      color="#925F7F"
                      style={{ marginTop: 12, width: 150 }}
                    >
                      Date
                    </Text>
                    <Text
                      bold
                      size={16}
                      color="#925F7F"
                      style={{ marginTop: 12 }}
                    >
                      Reporter
                    </Text>
                  </Block>
                  {displayCrimes?.map((crime, key) => {
                    return (
                      <Block row key={key}>
                        <Text
                          bold
                          size={16}
                          color="#525F7F"
                          style={{ marginTop: 12, width: 150 }}
                        >
                          {crime.title}
                        </Text>
                        <Text
                          bold
                          size={16}
                          color="#925F7F"
                          style={{ marginTop: 12, width: 150 }}
                        >
                          {crime.lat.toFixed(2) + " : " + crime.long.toFixed(2)}
                        </Text>
                        <Text
                          bold
                          size={16}
                          color="#925F7F"
                          style={{ marginTop: 12, width: 150 }}
                        >
                          {formattedDate(crime.updatedAt)}
                        </Text>
                        <Text
                          bold
                          size={16}
                          color="#925F7F"
                          style={{ marginTop: 12 }}
                        >
                          {crime.reporter?.name}
                        </Text>
                      </Block>
                    );
                  })}
                </Block> :
                  <Block><Text bold size={32} color="#32325D" style={{ textAlign: "center" }}>
                    No Crimes Reported
                  </Text></Block>}

              </Block>



              <BarChart
                data={chartData}
                height={400}
                yAxisSuffix=""
                width={Dimensions.get("window").width} // from react-native
                yAxisLabel=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#fb8c00",
                  backgroundGradientTo: "#ffa726",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
            </ScrollView>
          </ImageBackground>
        </Block>)
      }
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
