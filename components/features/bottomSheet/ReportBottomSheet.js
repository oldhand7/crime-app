import { Block, Button, Text } from "galio-framework";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Images, argonTheme } from "../../../constants";
import { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { API, Auth } from "aws-amplify";
import * as mutations from "../../../graphql/mutations";

import { useAtom } from "jotai";
import userDetail from "../../../store/index";

const { width, height } = Dimensions.get("screen");

const ReportBottomSheet = ({
  message,
  setMessage,
  selectedType,
  setSelectedType,
  setPosition,
  setSwipeableReportPanelActive,
  onAddCrime,
}) => {
  const [marker, setMarker] = useState(null);
  const [user, setUser] = useAtom(userDetail);
  const [type, setType] = useState("Robbery");
  const crimeTypes = [
    "Robbery",
    "Murder",
    "Burglar",
    "Thief",
    "Attacker",
    "Killer",
  ];

  const submitEvent = async (type, lat, long, message) => {
    try {
      const crimeData = await API.graphql({
        query: mutations.createCrime,
        variables: {
          input: {
            title: type,
            lat: lat,
            long: long,
            content: message,
            reporterId: user.id,
          },
        },
      });
      onAddCrime(crimeData.data.createCrime);
    } catch (error) {
      console.error(error);
      ToastAndroid.show(`${error}`, ToastAndroid.LONG);
    }
  };

  return (
    <Block flex center style={styles.home}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 10,
          paddingHorizontal: 15,
        }}
      >
        1. Crime Type
      </Text>
      <FlatList
        data={crimeTypes}
        horizontal
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setType(item);
              setSelectedType({
                ...selectedType,
                id: index + 1,
                slug: item.toLowerCase(),
              });
            }}
            style={styles.crime}
          >
            <Block
              center
              style={{
                opacity: item.toLowerCase() == selectedType.slug ? 1 : 0.5,
              }}
            >
              <Image
                source={Images.CrimeImages[index]}
                style={{ width: 70, height: 70 }}
              />

              <Text
                color={
                  item.toLowerCase() == selectedType.slug
                    ? argonTheme.COLORS.PRIMARY
                    : argonTheme.COLORS.BLACK
                }
                style={{ marginTop: 5 }}
              >
                {item}
              </Text>
            </Block>
          </TouchableOpacity>
        )}
        style={{
          marginLeft: 10,
        }}
      />

      <Block
        flex
        center
        style={{ paddingHorizontal: 15, paddingTop: 0, borerRadius: 20 }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 10,
            paddingHorizontal: 15,
            marginTop: 20,
          }}
        >
          2. Point The Crime Position
        </Text>
        <Block>
          <MapView
            style={{ height: 270, width: width - 30, borerRadius: 20 }}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={(e) => setMarker(e.nativeEvent.coordinate)}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>

          {marker && (
            <Block style={{ position: "absolute", top: 10, left: 10 }}>
              <Text bold color={argonTheme.COLORS.LABEL} style={styles.text}>
                Latitude: {marker.latitude.toFixed(7)}
              </Text>
              <Text bold color={argonTheme.COLORS.LABEL} style={styles.text}>
                Longitude: {marker.longitude.toFixed(7)}
              </Text>
            </Block>
          )}
        </Block>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            paddingHorizontal: 15,
            marginTop: 20,
          }}
        >
          3. Report The Crime
        </Text>

        <Block row top style={[styles.message, { borderColor: "#e8e8e8" }]}>
          <TextInput
            textAlignVertical="top"
            placeholder="Report the crime.."
            editable
            multiline
            numberOfLines={4}
            onChangeText={(text) => setMessage(text)}
            value={message}
          />
        </Block>

        <Button
          onPress={() => {
            console.log(type, message);
            setSwipeableReportPanelActive(false);
            setPosition(marker);
            submitEvent(
              type,
              marker.latitude.toFixed(7),
              marker.longitude.toFixed(7),
              message
            );
          }}
          round
          color={argonTheme.COLORS.PRIMARY}
          style={{ width: width - 40 }}
        >
          <Text bold color="white">
            Report
          </Text>
        </Button>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  crime: {
    marginRight: 10,
  },
  message: {
    backgroundColor: "white",
    width: width - 30,
    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
  },
});

export default ReportBottomSheet;
