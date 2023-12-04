import React, { useCallback, useEffect, useState } from "react";
import { Image, SafeAreaView } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";

import Screens from "./navigation/Screens";
import { Images, argonTheme } from "./constants";
// import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
enableScreens();

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
];

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  // async function registerForPushNotificationsAsync() {
  //   let token;

  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Notifications.getPermissionsAsync();

  //     let finalStatus = existingStatus;

  //     if (existingStatus !== 'granted') {
  //       const { status } = await Notifications.requestPermissionsAsync();
  //       finalStatus = status;
  //     }

  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }

  //     token = (await Notifications.getExpoPushTokenAsync()).data;
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }

  //   return token;
  // }

  useEffect(() => {
    // registerForPushNotificationsAsync();

    console.log("did mount");
    async function prepare() {
      try {
        //Load Resources
        await _loadResourcesAsync();
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          ArgonExtra: require("./assets/font/argon.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();

  }, []);

  const _loadResourcesAsync = async () => {
    // return Promise.all([...cacheImages(assetImages)]);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_51O2Nz1Bk4o9NggAuwAMXzY1YtZILlPPqpK8Xb7GJtZvlvwBeyJGBhfxsEjcpweBEIp4Cx5j2IeGnSakzFWFzstKI008HVgsJjq">
      <NavigationContainer onReady={onLayoutRootView}>
        <GalioProvider theme={argonTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    </StripeProvider>
  );
}
