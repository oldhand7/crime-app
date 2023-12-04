import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useAtom } from "jotai";
import userDetail from "../store/index";
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";
import { API } from "aws-amplify";
import { useNavigation } from "@react-navigation/native";
import { Block, Text, theme } from "galio-framework";

const ChatRooms = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useAtom(userDetail);
  const navigate = useNavigation()
  const [selectedId, handleSelectContact] = useState(null)


  const fetchAll = async () => {
    try {
      const conversationList = await API.graphql({
        query: queries.listUsers
      });
      let all = conversationList.data.listUsers.items
      let result = all.filter(item => item.id != user.id)
      setUsers(result)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      (async () => (await fetchAll()))();
    } catch (error) {

    }
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Contacts</Text>
      </View>
      <View style={styles.container}>

        {users && users.length > 0 ? users.map(({ id, name, image }) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.item,
              id === selectedId ? styles.selectedItem : null,
            ]}
            onPress={() => { handleSelectContact(id); navigate.navigate("ChatMessage", { receiverId: id }) }}
          >
            <Image style={styles.avatar} source={{ uri: image ? image : '../assets/icon.png' }} />
            <Text style={styles.name}>{name}</Text>
          </TouchableOpacity>
        )) : <Block><Text>No contact </Text></Block>}

      </View>


    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    marginTop: 50,

  },
  headerText: {
    fontSize: 32
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    padding: 5
  },
  selectedItem: {
    backgroundColor: "#CCCCCC",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
});



export default ChatRooms