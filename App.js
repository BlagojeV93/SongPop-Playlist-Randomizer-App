import React from 'react'
import { SafeAreaView, ImageBackground } from 'react-native'

import HomeScreen from './src/components/screens/HomeScreen'

import { styles } from './src/helpers'
import { imageAssets } from './src/images'

const App = () => {

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground style={{ flex: 1 }} resizeMode='contain' source={imageAssets.songPopImage}>
        <HomeScreen />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;
