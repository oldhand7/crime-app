import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAtom } from "jotai";
import FontIcon from "react-native-vector-icons/FontAwesome5";
import userDetail from "../store/index";
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { useNavigation, useRoute } from "@react-navigation/native";

const DrawerContent = () => {

    const [user, setUser] = useAtom(userDetail);
    const navigation = useNavigation();


    return (
        <View style={styles.container}>
            {/* Top Section */}
            <View style={styles.topSection}>

                <Image source={require('../assets/icon.png')} style={styles.avatar} />
                <Text style={styles.name}>Crime APP</Text>

            </View>

            {/* Bottom Section */}
            {user ?
                <View style={styles.bottomSection}>
                    <DrawerItem
                        icon={({ size, color }) => (
                            <FontIcon name="home" size={size} />
                        )}
                        label="Home"
                        onPress={() => {
                            navigation.navigate('Home');
                        }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    />

                    <DrawerItem
                        icon={({ size, color }) => (
                            <FontIcon name="user" size={size} />
                        )}
                        label="Profile"
                        onPress={() => {
                            navigation.navigate('Profile');
                        }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    />
                    <DrawerItem
                        icon={({ size, color }) => (
                            <FontIcon name="chart-bar" size={size} />
                        )}
                        label="RecentCrimes/Statistics"
                        onPress={() => {
                            navigation.navigate('recentCrimes');
                        }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    />
                    <DrawerItem
                        icon={({ size, color }) => (
                            <FontIcon name="book" size={size} />
                        )}
                        label="Message"
                        onPress={() => {
                            navigation.navigate('ChatRooms');
                        }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    />
                    {/* <DrawerItem
                        icon={({ size, color }) => (
                            <FontIcon name="user" size={size} />
                        )}
                        label="HeatMap"
                        onPress={() => {
                            navigation.navigate('HeatMap');
                        }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    /> */}
                    {/* <Text style={styles.menuItem}>Profile</Text>
                    <Text style={styles.menuItem}>Recent Crimes/Statistis</Text>
                    <Text style={styles.menuItem}>Message</Text> */}
                </View> :
                <View style={styles.bottomSection}>
                    <DrawerItem
                        icon={({ size, color }) => (
                            <FontIcon name="lock" size={size} />
                        )}
                        label="Login"
                        onPress={() => {
                            navigation.navigate('Login');
                        }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    />
                    <DrawerItem
                        icon={({ size, color }) => (
                            <FontIcon name="lock" size={size} />
                        )}
                        label="Register"
                        onPress={() => {
                            navigation.navigate('Register');
                        }}
                        rippleColor="rgba(0, 0, 0, .32)"
                    />

                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topSection: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
        position: 'relative'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        marginTop: 10,
        fontSize: 20,
        color: 'white',
    },
    bottomSection: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50,
        paddingLeft: 20,
        position: 'relative',
        zIndex: -1,
    },
    menuItem: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default DrawerContent;