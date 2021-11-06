import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';

//import App from '../App.js';

export class CustomActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      location: null,
    };
  }

  componentDidMount() {}

  async pickImage() {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'granted') {
      this.setState({ permissions: true });
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch((error) => console.log(error));
      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.setState({
          image: imageUrl,
        });
        this.props.onSend({ image: imageUrl });
      }
    }
  }

  async takePhoto() {
    const { status } = await Camera.requestPermissionsAsync();

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch((error) => console.log(error));
      console.log('getting here');
      if (!result.cancelled) {
        const imageUrl = await this.uploadImageFetch(result.uri);
        this.props.onSend({ image: imageUrl });
        this.setState({
          image: imageUrl,
        });
      }
    }
  }

  async getLocation() {
    console.log('getLocation called');
    const { status } = await Location.requestForegroundPermissionsAsync();
    console.log('status in getLocation: ', status);
    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});

      if (result) {
        console.log('result: ', result);
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          },
        });
        this.setState({
          location: result,
        });
      }
    }
  }

  onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take a Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return this.pickImage();

          case 1:
            console.log('user wants to take a photo');
            return this.takePhoto();
          case 2:
            console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      }
    );
  };

  uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Networkd request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    const ref = firebase.storage().ref().child(imageName);
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress.bind(this)}
      >
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
