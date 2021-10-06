import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ChatScreen extends Component {
  render() {
    let username = this.props.route.params.username;

    return (
      <View>
        <View style={style.bodyContent}>
          <Text>Let's get chatting!</Text>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create({
  bodyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
});
