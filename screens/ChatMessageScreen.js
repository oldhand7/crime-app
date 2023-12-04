import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import {
    FontAwesome5,
} from "@expo/vector-icons";
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
import { useAtom } from "jotai";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import userDetail from "../store/index";
import { API } from "aws-amplify";
import { graphqlOperation } from "aws-amplify";
import { Images, argonTheme } from "../constants";
import { BackgroundImage } from 'react-native-elements/dist/config';

const formatDateLabel = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const yesterday = new Date(Date.now() - 86400000);

    if (date.toDateString() === currentDate.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString();
    }
};

const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const ChatMessage = ({ route }) => {



    // const [messages, setMessages] = useState([{
    //     id: 1,
    //     text: 'Hello, how are you?',
    //     time: '11:45 PM',
    //     timestamp: 1638691200000,
    //     sent: false,
    // }, {
    //     id: 2,
    //     text: 'Hello, how are you?',
    //     time: '11:45 PM',
    //     timestamp: 1638777600000,
    //     sent: false,
    // }, {
    //     id: 3,
    //     text: 'Hello, how are you? you are welcome',
    //     time: '11:45 PM',
    //     timestamp: 1638778800000,
    //     sent: false,
    // },
    // {
    //     id: 4,
    //     text: 'Hello, how are you? you are welcome',
    //     time: '11:45 PM',
    //     timestamp: 1638864000000,
    //     sent: false,
    // },
    // {
    //     id: 5,
    //     text: 'Hello, how are you? you are welcome',
    //     time: '11:45 PM',
    //     timestamp: 1638867600000,
    //     sent: false,
    // },
    // {
    //     id: 6,
    //     text: 'Hello, how are you? you are welcome',
    //     time: '11:45 PM',
    //     timestamp: 1639867600000,
    //     sent: false,
    // }


    // ]);
    const [newMessage, setNewMessage] = useState('');


    const { receiverId } = route.params;
    const [user, setUser] = useAtom(userDetail);


    const [messages, setMessages] = useState([

    ]);

    const formatChatMessages = (messages) => {
        let data = [];
        let currentDate = '';

        for (let index = messages.length - 1; index > 0; index--) {
            const element = messages[index];
            const previousMessage = messages[index - 1]
            const isNewDay = !previousMessage || new Date(previousMessage.updatedAt).toDateString() !== new Date(element.updatedAt).toDateString();
            let sent = user.id == element.sender_id;
            // Add the element with the isNewDay flag
            data.push({
                ...element,
                sent,
                isNewDay: isNewDay,
            });
        }
        // messages.forEach((message, index) => {
        //     const previousMessage = messages[index - 1];

        //     // Check if the message is a new day compared to the previous message
        //     const isNewDay = !previousMessage || new Date(previousMessage.updatedAt).toDateString() !== new Date(message.updatedAt).toDateString();
        //     let sent = user.id == message.sender_id;
        //     // Add the message with the isNewDay flag
        //     data.push({
        //         ...message,
        //         sent,
        //         isNewDay: isNewDay,
        //     });
        // });

        return data;
    };

    const fetchMessages = async (senderId, receiverId) => {

        const filter = {
            and: [{ sender_id: senderId }, { receiver_id: receiverId }]
        };
        try {
            const messageList = await API.graphql(graphqlOperation(queries.listMessages, filter));
            // const tmp  =  messageList.data.listMessages.items
            // const result = tmp.filter(item => item.sender_id == user.id && item.receiver_id == receiverId)
            let list = messageList.data.listMessages.items
            let result = list.sort((prev, next) => new Date(prev.updatedAt) < new Date(next.updatedAt) ? -1 : 1)
            console.log('-----------result --------', result);
            setMessages(result)
        } catch (error) {
            console.log(error);
        }
    }
    const sendMessage = async () => {
        if (newMessage.trim().length > 0) {

            const newMessageObject = {
                sender_id: user.id,
                text: newMessage,
                receiver_id: receiverId,
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
                fetchMessages(user.id, receiverId)
                setMessages([...messages, newMessage.data.createMessage,]);
            } catch (error) {
                console.log('ee -> ', error);
            }


            // const newMessage = {
            //     id: messages.length + 1,
            //     text: newMessage,
            //     time: new Date().toLocaleTimeString(),
            //     sent: true,
            // };
            // setMessages([...messages, newMessage]);
            // setNewMessage('');
        }
    };

    // useEffect(() => {
    //     const newMessage = {
    //         id: 1,
    //         text: 'Hello, how are you?',
    //         time: '11:45 PM',
    //         sent: false,
    //     };
    //     setMessages([newMessage]);
    // }, []);

    const renderMessage = ({ item }) => (
        <View>
            {
                // Render the date label if it is a new date since the last message
                item.isNewDay &&
                <View style={styles.dataLabelWrapper}>

                    <View style={styles.dateLabelContainer}>
                        <View style={styles.dateLabelLine} />
                        <Text style={styles.dateLabelText}>{formatDateLabel(item.updatedAt)}</Text>
                        <View style={styles.dateLabelLine} />
                    </View>
                </View>

            }
            <View
                style={[
                    styles.messageContainer,
                    { alignSelf: item.sent ? 'flex-end' : 'flex-start' },
                ]}
            >


                {item.sent ? (
                    <View style={styles.sentMessage}>
                        <Text style={styles.sentMessageText}>{item.text}</Text>
                        <Text style={styles.messageTime}>{formatTime(item.updatedAt)}</Text>
                        <View style={styles.arrow}></View>
                    </View>
                ) : (
                    <View style={styles.receivedMessage}>
                        <Image style={styles.avatar} source={require('../assets/icon.png')} />
                        <View style={styles.receivedMessagetext}>
                            <Text style={styles.receivedMessageText}>{item.text}</Text>
                            <Text style={styles.messageTime}>{formatTime(item.updatedAt)}</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>

    );

    useEffect(() => {
        console.log('*********', user.id,);
        fetchMessages(user.id, receiverId);

    }
        , [])


    return (

        <View style={styles.container}>
            <FlatList
                data={formatChatMessages(messages)}
                renderItem={renderMessage}
                style={{ width: width }}
                keyExtractor={(item) => item.id.toString()}
                inverted
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type here..."
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <FontAwesome5 name="paper-plane" size={24} color="#0084FF" />
                    {/* <Text style={styles.sendButtonText}>Send</Text> */}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 20,
        marginLeft: 30
    },
    back: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    textInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: "white",
        elevation: 5,
        paddingHorizontal: 15,
        borderColor: '#D0D0D0',
        marginRight: 10,
    },
    sendButton: {
        height: 40,
        paddingHorizontal: 15,
        justifytext: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    messageContainer: {
        marginVertical: 5,
        marginHorizontal: 10,
        maxWidth: '80%',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0084FF',
        borderRadius: 20,
        marginBottom: 5,
        paddingHorizontal: 15,
        elevation: 5,

        paddingVertical: 10,
    },
    dataLabelWrapper: {
        position: "relative",
        height: 50,
    },
    dateLabelContainer: {
        position: "absolute",
        left: 0, top: 0,
        width: width,
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifytext: 'center',
        marginVertical: 5,
    },
    dateLabelLine: {
        margin: 'auto',
        flex: 1,
        height: 1,
        backgroundColor: 'lightgray',
        opacity: 0.5,
        borderStyle: 'dashed',
        marginHorizontal: 10,
    },
    dateLabelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'grey',
    },


    receivedMessage: {
        flexDirection: 'row',
        display: "flex",
        marginBottom: 5,
        alignItems: "center"
    },
    sentMessageText: {
        color: 'white',
        fontSize: 16,
    },
    receivedMessageText: {
        color: 'black',
        fontSize: 16,
    },
    messageTime: {
        fontSize: 12,
        color: '#A6A6A6',
        textAlign: 'right',
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderRightColor: 'transparent',
        borderTopColor: '#0084FF',
        transform: [{ rotate: '60deg' }],
        position: 'absolute',
        right: -1,
        bottom: -1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#D0D0D0',
        marginRight: 10,
    },
    receivedMessagetext: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 5,
    },
});

export default ChatMessage;