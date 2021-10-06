import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let bgColor = this.props.route.params.bgColor;
    let username = this.props.route.params.username;
    this.props.navigation.setOptions({ title: username });

    return (
      <View
        style={[
          styles.bodyContent,
          bgColor ? { backgroundColor: bgColor } : null,
        ]}
      >
        <Text style={styles.mainText}>Let's start chatting!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyContent: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 18,
    color: 'black',
  },
});
