import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '' };
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Please select a username:</Text>
        <TextInput
          style={styles.usernameInput}
          onChangeText={(text) => this.setState({ username: text })}
          value={this.state.username}
        />

        <Button
          title="Go to Screen 2"
          onPress={() =>
            this.props.navigation.navigate('Chat', {
              username: this.state.username,
            })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  usernameInput: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    width: 100,
  },
});
