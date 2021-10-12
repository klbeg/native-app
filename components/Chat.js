import React, { Component } from 'react';
import { database } from 'firebase';

const firebase = require('firebase');
require('firebase/firestore');

import {
  View,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Bubble, GiftedChat, SystemMessage } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
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
  componentDidMount() {
    let username = this.props.route.params.username;
    this.props.navigation.setOptions({ title: username });

    this.referenceMessaages = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceMessaages.onSnapshot(
      this.onCollectionUpdate
    );

    //  sets temporary message state for development
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello captain developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //     {
    //       _id: 2,
    //       text: `${username} has entered the chat!`,
    //       createdAt: new Date(),
    //       system: true,
    //     },
    //   ],
    // });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

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

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    let bgColor = this.props.route.params.bgColor;
    return (
      <View style={[styles.bodyContent]}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderSystemMessage={this.renderSystemMessage.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
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
