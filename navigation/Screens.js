import React from "react";

// screens
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Profile from "../screens/Profile";
import HeatMapPage from "../screens/HeatMap";
import { createStackNavigator } from "@react-navigation/stack";
import ConfirmEmail from "../screens/ConfirmEmail";
import RecentCrimes from "../screens/RecentCrimes";
import { View } from "../screens/components/Themed";
import WelcomeScreen from "../screens/Welcome";
import ChatRooms from "../screens/ChatRoomsScreen";
import MessageScreen from "../screens/MessageScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';

// import RecentCrimes from "../screens/RecentCrimes";
import DrawerContent from './DrawerContent';
import ChatMessage from "../screens/ChatMessageScreen";

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

export default function OnboardingStack(props) {
  return (

    <Drawer.Navigator initialRouteName="Welcome" drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Settings" component={Profile} />
      <Drawer.Screen
        name="ChatMessage"
        component={ChatMessage}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Drawer.Screen
        name="ChatRooms"
        component={ChatRooms}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="recentCrimes"
        component={RecentCrimes}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="messages"
        component={MessageScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* <Drawer.Screen
        name="statistics"
        component={Statistics}
        options={{
          headerShown: false,
        }}
      /> */}
      <Drawer.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="ConfirmEmail"
        component={ConfirmEmail}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="HeatMap"
        component={HeatMapPage}
        options={{
          headerShown: false,
        }}
      />


    </Drawer.Navigator>



  );
}
