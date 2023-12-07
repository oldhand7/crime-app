import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useAtom } from "jotai";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import userDetail from "../store/index";
import { API } from "aws-amplify";
import { graphqlOperation } from "aws-amplify";
import { Linking } from 'react-native';



function MessageItem({ message, isSent }) {
  return (
    <View style={[styles.messageContainer, isSent && styles.sentContainer]}>
      <Image style={styles.avatar} source={{ uri: message.avatar }} />
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.username}>{message.sender.name}</Text>
          <Text style={styles.time}>{message.timestamp}</Text>
        </View>
        <View style={styles.messageBody}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      </View>
    </View>
  );
}

export default function MessageScreen({ route }) {

  const { receiverId } = route.params;
  const [user, setUser] = useAtom(userDetail);


  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([

  ]);

  const handleSend = async () => {
    if (newMessage === '') return;

    const newSentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessageObject = {
      sender_id: user.id,
      text: newMessage,
      receiver_id: receiverId,
      timestamp: newSentTime
    };
    try {
      const newMessage = await API.graphql({
        query: mutations.createMessage,
        variables: {
          input: newMessageObject
        },
      });

      console.log('----------------', newMessage.data.createMessage);

      setNewMessage('');
      setMessages([...messages, newMessage.data.createMessage]);
    } catch (error) {
      console.log('ee -> ', error);
    }

  };


  const handleCall = (phoneNumber) => {
    phoneNumber = "+1 318 599 9990"
    // Use Linking module to initiate the phone call 
    const callLink = `tel:${phoneNumber}`;
    Linking.canOpenURL(callLink)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle url: ${callLink}`);
        } else {
          return Linking.openURL(callLink);
        }
      })
      .catch((err) => console.error(`An error occurred: ${err}`));
  };
  const fetchMessages = async (senderId, receiverId) => {

    const filter = {
      and: [{ sender_id: senderId }, { receiver_id: receiverId }]
    };
    try {
      const messageList = await API.graphql(graphqlOperation(queries.listMessages, filter));
      // const tmp  =  messageList.data.listMessages.items
      // const result = tmp.filter(item => item.sender_id == user.id && item.receiver_id == receiverId)
      setMessages(messageList.data.listMessages.items)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log('*********', user.id,);
    fetchMessages(user.id, receiverId);

  }
    , [])
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          {messages.map((message, index) => (
            <MessageItem key={index} message={message} isSent={message.sender_id == user.id} />
          ))}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  call_btn: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  contentContainer: {
    flex: 1,
    backgroundColor: '#eaeaea',
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5
  },
  sentContainer: {
    flexDirection: 'row-reverse'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  messageContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16
  },
  time: {
    fontSize: 12,
    color: '#666'
  },
  messageBody: {},
  messageText: {
    fontSize: 16
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10
  },
  sendButton: {
    backgroundColor: '#2f95dc',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});