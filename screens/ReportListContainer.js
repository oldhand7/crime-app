import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";

import RecentCrimes from "./RecentCrimes";
const { width, height } = Dimensions.get("screen");
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

import { useAtom } from "jotai";
import userDetail from "../store/index";
import settingDetail from "../store/setting";
import * as queries from "../graphql/queries";

import { API, Auth, graphqlOperation } from "aws-amplify";
import { listCrimes, rangeSearchCrimes } from "../graphql/queries";
import { getAddress } from "../util/address";
import { formattedDate } from "../util/dateUtil";
import { BarChart } from "react-native-chart-kit";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
const thumbMeasure = (width - 48 - 32) / 3;

export default function ReportListContainer() {
  const [user, setUser] = useAtom(userDetail);
  const [crimes, setCrimes] = useState([]);
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
  const navigation = useNavigation();
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
  useEffect(() => {
    if (user) {
      (async () => {
        const res = await API.graphql({ query: queries.listCrimes });
        let crimeList = res.data.listCrimes.items;

        setCrimes(crimeList);
      })();
    }
  }, [user]);

  useEffect(() => {
    let tmp = Array(6).fill(0);
    crimes?.map((crime) => {
      try {
        tmp[getIndex(crime.title)]++;
      } catch (error) {}
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
              <Tab.Navigator>
                <Tab.Screen name="RecentCrimes" component={RecentCrimes} />
                <Tab.Screen name="UserReports" component={RecentCrimes} />
              </Tab.Navigator>
            </Block>
            <BarChart
              data={chartData}
              width={width}
              height={400}
              yAxisSuffix="k"
              chartConfig={{
                backgroundGradientFrom: "#fff",

                backgroundGradientTo: "#fff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              bezier
            />
          </ScrollView>
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
