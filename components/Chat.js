import React, { Component } from 'react';
import { database } from 'firebase';

import NetInfo from '@react-native-community/netinfo';

const firebase = require('firebase');
require('firebase/firestore');

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  SystemMessage,
} from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: null,
      onlineStatus: false,
      messagesToDelete: false,
    };
    // initialization and config for firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: 'AIzaSyDLCfqvmWV2W3W92YTsTf02BlrIrDKGHu0',
        authDomain: 'chat-box-90d84.firebaseapp.com',
        projectId: 'chat-box-90d84',
        storageBucket: 'chat-box-90d84.appspot.com',
        messagingSenderId: '628008627184',
      });
    }
  }

  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    //  sets username to display on screen
    let username = this.props.route.params.username;
    this.props.navigation.setOptions({ title: username });

    //  Checks user's internet connection.
    //  state.onlineStatus set accordingly
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log('online');
        this.setState({
          onlineStatus: true,
        });
      } else {
        this.setState({
          onlineStatus: false,
        });
        console.log('offline');
      }
    });

    //  if onlineStatus == true
    // anonymous user login to firebase
    if (this.state.onlineStatus == true) {
      this.authUnsubscribe = firebase
        .auth()
        .onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          this.setState({
            uid: user.uid,
          });
          await AsyncStorage.setItem('uid', JSON.stringify(this.state.uid));
        });

      //  creates listener to 'messages' collection
      this.referenceMessaages = firebase.firestore().collection('messages');
      this.unsubscribe = this.referenceMessaages.onSnapshot(
        this.onCollectionUpdate
      );
    } else if (this.state.onlineStatus == false) {
      //  if onlineStatus == false
      //  get messages from asyncStorage

      this.setUidOffline();

      this.getMessages();
    }
  }

  componentWillUnmount() {
    this.saveMessages();

    //  used for deleting asyncStorage
    // if ((this.state.messagesToDelete = true)) {
    //   this.deleteMessages();
    // }
    if (this.state.onlineStatus == true) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  async setUidOffline() {
    let uid;
    try {
      uid = await AsyncStorage.getItem('uid');
      this.setState({
        uid: JSON.parse(uid),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //  called when onSnapshot listener is triggered
  //  puts all messages into an array, sorts by date,
  //    then sets 'message' state to output
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    messages.sort((a, b) => b.createdAt - a.createdAt);
    this.setState({
      messages,
    });
  };

  // color for chat bubbles
  renderBubble(props) {
    let bgColor = this.props.route.params.bgColor;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: bgColor,
          },
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{ color: '#000' }}
        timeTextStyle={{ color: '#000' }}
      />
    );
  }

  //  only renders input toolbar if user is online
  renderInputToolbar(props) {
    if (this.state.onlineStatus == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  // pushes message to firestore, triggering onSnaphot listener
  addMessage(messages) {
    if (this.state.onlineStatus == true) {
      this.referenceMessaages.add(messages[0]);
    }
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
      }
    );
  }

  //  used to delete asyndStorage
  // async deleteMessages() {
  //   try {
  //     await AsyncStorage.removeItem('messages');
  //     this.setState({
  //       mesages: [],
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  render() {
    let bgColor = this.props.route.params.bgColor;
    return (
      <View style={[styles.bodyContent]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.addMessage(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyContent: {
    flex: 1,
  },
});
