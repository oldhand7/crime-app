import React from "react";
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";
import styles from "./style";
import { useNavigation } from "@react-navigation/native";

import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChannel, createChannelMember } from "../../../graphql/mutations";
import { useAtom } from "jotai";
import userDetail from "../../../store/index";

const ContactListItem = (props) => {
  const { user } = props;
  const [me, setMe] = useAtom(userDetail);

  const navigation = useNavigation();

  const onClick = async () => {
    try {
      //  1. Create a new Chat Room
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChannel, { input: {} })
      );
      // console.log(newChatRoomData.data.createChannel);
      // if (!newChatRoomData.data) {
      //   console.log(" Failed to create a chat room");
      //   return;
      // }

      const newChatRoom = newChatRoomData.data.createChannel;

      console.log(me.id, newChatRoom.id);
      // // 2. Add `user` to the Chat Room
      await API.graphql(
        graphqlOperation(createChannelMember, {
          input: {
            userId: me.id,
            channelId: newChatRoom.id,
          },
        })
      );
      console.log("--- ");
      await API.graphql(
        graphqlOperation(createChannelMember, {
          input: {
            userId: user.id,
            channelId: newChatRoom.id,
          },
        })
      );
      console.log("----- ");

      // //  3. Add authenticated user to the Chat Room
      // const userInfo = await Auth.currentAuthenticatedUser();
      // await API.graphql(
      //   graphqlOperation(createChannelMember, {
      //     input: {
      //       userID: userInfo.attributes.sub,
      //       chatRoomID: newChatRoom.id,
      //     },
      //   })
      // );
      console.log('-----------------------');
      navigation.navigate("ChatMessage", {
        id: newChatRoom.id,
        name: "Hardcoded name",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={styles.lefContainer}>
          <Image source={{ uri: user.imageUri }} style={styles.avatar} />

          <View style={styles.midContainer}>
            <Text style={styles.username}>{user.name}</Text>
            <Text style={styles.status}>{user.status}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ContactListItem;
