import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      bgColor: 'gray',
    };
  }

  render() {
    let bgColorOptions = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];
    return (
      <ImageBackground
        style={styles.background}
        source={require('../assets/backgroundImage.png')}
        resizeMode="cover"
      >
        <View style={styles.mainContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Chat-Box</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.usernameInputContainer}>
              <Image
                style={styles.textInputIcon}
                source={require('../assets/icon1.png')}
              />
              <TextInput
                style={styles.usernameInput}
                placeholder="Your Name"
                placeholderTextColor="#50757083"
                onChangeText={(text) => this.setState({ username: text })}
                value={this.state.username}
              />
            </View>
            <View style={styles.chooseColorContainer}>
              <Text style={styles.chooseColorText}>
                Choose a background color:
              </Text>
              <View style={styles.chooseColorButtonContainer}>
                {bgColorOptions.map((color, i) => {
                  return (
                    <Pressable
                      key={i}
                      style={[
                        styles.chooseColorButton,
                        { backgroundColor: color },
                        color === this.state.bgColor
                          ? styles.selectedColorBorder
                          : null,
                      ]}
                      onPress={() => this.setState({ bgColor: color })}
                    />
                  );
                })}
              </View>
            </View>
            <Pressable
              style={styles.startChattingButton}
              title="Start Chatting"
              onPress={() =>
                this.props.navigation.navigate('Chat', {
                  username: this.state.username,
                  bgColor: this.state.bgColor,
                })
              }
            >
              <Text style={styles.startChattingText}>Start Chatting</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  titleContainer: {
    height: '44%',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
  },
  contentContainer: {
    display: 'flex',
    height: '44%',
    width: '88%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  usernameInputContainer: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: '#ffffff',
    width: '88%',
  },
  usernameInput: {
    fontSize: 16,
    fontWeight: '300',
    height: '100%',
    width: '80%',
  },
  textInputIcon: {
    margin: 10,
  },
  startChattingButton: {
    display: 'flex',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
    width: '88%',
  },
  startChattingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    margin: 10,
  },
  chooseColorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 70,
    width: '88%',
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 15,
  },
  chooseColorButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '88%',
    justifyContent: 'flex-start',
  },
  chooseColorButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 30,
  },
  selectedColorBorder: {
    borderColor: 'orange',
    borderWidth: 3,
  },
});
