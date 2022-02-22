import React, { useState, useEffect } from 'react';
import {
  Text,
  Pressable,
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const App = () => {

  const [imageUri, setImageUri] = useState('');
  const [imgList, setImgList] = useState([]);
  const [width, setWidth] = useState({});

  useEffect(() => {
    const temp = Dimensions.get('window');
    setWidth(temp.width);
  }, [])

  const styles = StyleSheet.create({
    view: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1
    },
    image: {
      width: width - 25,
      height: 600,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'black'
    },
    button: {
      width: 150,
      height: 75,
      flex: 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
      margin: 10,
    },
    text: {
      fontSize: 24,
      color: 'white',
      fontWeight: '700',
    },
    cluster: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });

  const options = {
    storageOptions: {
      path: 'images',
      mediaType: 'photo',
    },
    includeBase64: true,
    selectionLimit: 0
  }

  const openCamera = () => {
    launchCamera(options, response => {
      console.log('Response received');
      if (response.didCancel) {
        console.log('User cancelled image pick');
      } else if (response.error) {
        console.log('ImagePickerError: ', response.error);
      } else if (response.customButton) {
        console.log('User pressed custom button: ', response.customButton);
      } else {
        const src = {uri: 'data:image/jpeg;base64,' + response.assets[0].base64};
        setImageUri(src);
      }
    })
  }

  const openLibrary = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled operation')
      } else if (response.error) {
        console.log('ImagePickerError: ', response.error);
      } else if (response.customButton) {
        console.log('User pressed custom button: ', response.customButton);
      } else {
        let images = [];
        response.assets.forEach(image => {
          images.push(image.base64)
        });
        setImgList(images);
        console.log(imgList);

        // This POST will likely result in PayloadTooLargeError
        /* axios.post('https://damp-beach-36121.herokuapp.com/send', imgList)
          .then (response => response.json())
          .then (json => console.log(json))
          .catch (err => console.log(err)); */

      }
    })
  }

  const selectImage = () => {
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled operation')
      } else if (response.error) {
        console.log('ImagePickerError: ', response.error);
      } else if (response.customButton) {
        console.log('User pressed custom button: ', response.customButton)
      } else {
        const src = {uri: 'data:image/jpeg;base64,' + response.assets[0].base64};
        setImageUri(src);
        console.log(response.assets[0].base64)
        multiPartPost(response.assets[0].base64);
      }
    })
  }

  const multiPartPost = (base64) => {
    const data = new FormData();
    data.append("image_data", base64);

    axios.post('https://damp-beach-36121.herokuapp.com/receiveBase64', data)
    .then (response => console.log(response.data))
    .catch (err => console.log(err));
    
  }

  // Testing connection to server, and also provides URL template for axios functions
  const endpointTest = () => {
    axios.get('https://damp-beach-36121.herokuapp.com/')
    .then (response => console.log(response.data))
    .catch (err => console.log(err));
  }

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style = {styles.view}>
          <View style = {styles.cluster}>
            <Pressable
              style = {({ pressed }) => [
                { backgroundColor:
                  pressed ? 'rgb(210, 230, 255)' : 'orange'},
                styles.button
              ]}
              title = 'Open Camera'
              onPress = {() => openCamera()} >
                <Text style = {styles.text}>Open Camera</Text>
            </Pressable>
            <Pressable
              style = {({ pressed }) => [
                { backgroundColor:
                  pressed ? 'rgb(210, 230, 255)' : 'orange'},
                  styles.button
              ]}
              onPress = {() => selectImage() } >
                <Text style = {styles.text}>Open Library</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                { backgroundColor: 
                    pressed ? 'rgb(210, 230, 255)' : 'orange' },
                styles.button
              ]}
              onPress = {() => endpointTest() } >
                <Text style = {styles.text}>Test Connection</Text>
            </Pressable>
          </View>
          <Image
            source = { imageUri } 
            style = { styles.image }
          />
        </View>
      </SafeAreaView>
    );
  }

export default App;
