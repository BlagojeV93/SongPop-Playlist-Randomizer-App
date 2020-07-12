import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, TouchableOpacity, Text, Share, ImageBackground, View, ActivityIndicator, Dimensions, Animated, FlatList, Image } from 'react-native';

import RNFS from "react-native-fs";

const fileUri = 'https://songpophost.000webhostapp.com/allPlaylists.txt'
const filePath = `${RNFS.DocumentDirectoryPath}/playlists.txt`;
const options = [60, 75, 90, 100, 150];
const dw = Dimensions.get('window').width
const dh = Dimensions.get('window').height

onShare = async (message) => {
  message.forEach(element => {
    element = element + `\n`
  });
  try {
    await Share.share({ message: message.join(`\n`) });
  } catch (error) {
    alert(error.message);
  }
}

const App = () => {
  const [allPlaylists, setAll] = useState([0])
  const [randomizedPlaylists, choosePlaylists] = useState([]);
  const [indicator, loading] = useState(false);
  const [numberToRandomize, setNumber] = useState(options[0])
  const [translateX] = useState(new Animated.Value(0));

  const flatlist = useRef(null);

  useEffect(() => {
    loading(true);
    getFile();
  }, [])

  const getFile = async () => {
    try {
      RNFS.downloadFile({
        fromUrl: fileUri,
        toFile: filePath,
      }).promise.then(async () => {
        await readFile(filePath);
      })
    } catch (e) {
      alert('Something went wrong. Please restart the app and try again!');
      console.log(e, "DOWNLOAD")
    }
  }

  const readFile = async (uri) => {
    try {
      const content = await RNFS.readFile(uri, "utf8");
      setAll(content.split('•'))
      loading(false)
    } catch (e) {
      alert('Something went wrong. Please restart the app and try again!');
      console.log(e, "READ")
    }
  }

  const randomizePlaylists = () => {
    Animated.timing(translateX, { toValue: -dw, useNativeDriver: true }).start();

    let stateArr = [];
    do {
      let val = allPlaylists[Math.floor(Math.random() * allPlaylists.length)].trim();
      if (stateArr.indexOf(val) === -1 && val.length > 0) {
        stateArr.push(val);
      }
    } while (stateArr.length < numberToRandomize);
    stateArr = stateArr.map((val, i) => val = i + 1 + '. ' + val);
    choosePlaylists(stateArr);
  }

  const randomizeAgain = () => {
    Animated.timing(translateX, { toValue: 0, useNativeDriver: true }).start();
    flatlist.current.scrollToOffset({ animated: true, offset: 0 });
  }

  const renderOptions = () => options.map((opt, i) => {
    const backgroundColor = opt == numberToRandomize ? 'purple' : '#739fff';
    const borderLeftWidth = i == 0 ? 2 : 1;
    const borderRightWidth = i == options.length - 1 ? 2 : 1;
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => setNumber(opt)} key={i} style={[styles.optionBtn,
      { backgroundColor }, { borderLeftWidth }, { borderRightWidth }
      ]}>
        <Text style={styles.optionNumber}>{opt}</Text>
      </TouchableOpacity>
    )
  })

  return (
    <SafeAreaView style={styles.mainContainer}>
      {indicator &&
        <View style={styles.indicatorView}>
          <Text style={styles.loadingText}>Loading all playlists...Please wait...</Text>
          <ActivityIndicator size='large' color='white' style={{ marginTop: 20 }} />
        </View>
      }
      <ImageBackground style={{ flex: 1 }} resizeMode='contain' source={require('./sppic.png')}>
        <Animated.View style={[styles.animatedViewStyle, { transform: [{ translateX }] }]}>
          <View style={{ flex: 1 }}>
            {!indicator &&
              <View style={styles.firstScreen}>
                <View style={{ flex: 3, width: '100%' }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.numOfPlaylistText, styles.textShadow]}>Total of {allPlaylists.length - 1} playlists loaded!</Text>
                  </View>
                  <Text style={[styles.textShadow, styles.chooseNumberTitle]}>Choose the number of playlists to randomize</Text>
                  <View style={{ flex: 1.5 }}>
                    <View style={styles.optionsMainCont}>
                      <View style={styles.optionsInnerCont}>
                        {renderOptions()}
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 1, width: '100%' }}>
                  <TouchableOpacity onPress={() => randomizePlaylists()} style={styles.randomizeBtn}>
                    <Text style={styles.buttonText}>RANDOMIZE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          </View>
          <View style={styles.secondScreen}>
            <View style={styles.allPlaylistsCont}>
              <FlatList
                ref={flatlist}
                style={{ width: '100%', marginTop: 10 }}
                data={randomizedPlaylists}
                keyExtractor={(item, index) => `${index.toString()}`}
                showsVerticalScrollIndicator={false}
                renderItem={(info) => (
                  <Text style={styles.singlePlaylistText}>
                    {info.item}
                  </Text>
                )
                }
              />
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onShare(randomizedPlaylists)} style={styles.secondScreenBtn}>
              <Image style={styles.buttonImage} source={require('./share.png')} />
              <Text style={styles.buttonText}>SHARE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => randomizeAgain()} style={[styles.secondScreenBtn, { backgroundColor: 'purple' }]}>
              <Image style={styles.buttonImage} source={require('./back.png')} />
              <Text style={styles.buttonText}>RANDOMIZE AGAIN</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = {
  mainContainer: {
    flex: 1,
    backgroundColor: '#9bb4eb'
  },
  indicatorView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1
  },
  loadingText: {
    fontSize: dw * 0.045,
    color: 'white'
  },
  numOfPlaylistText: {
    fontSize: dw * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  chooseNumberTitle: {
    fontSize: dw * 0.04,
    marginVertical: 10,
    fontWeight: 'bold',
    color: 'white',
    width: '100%',
    textAlign: 'center'
  },
  animatedViewStyle: {
    height: '100%',
    width: dw * 2,
    flexDirection: 'row'
  },
  firstScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionsMainCont: {
    width: '100%',
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  optionsInnerCont: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0050ff'
  },
  optionBtn: {
    flex: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  optionNumber: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: dw * 0.035
  },
  randomizeBtn: {
    width: '100%',
    height: '35%',
    backgroundColor: 'purple',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: dw * 0.035
  },
  textShadow: {
    textShadowOffset: { width: 1.5, height: 1.5 },
    textShadowRadius: 1,
    textShadowColor: 'black',
  },
  secondScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  allPlaylistsCont: {
    width: '80%',
    height: '75%',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  singlePlaylistText: {
    color: 'white',
    fontSize: dw * 0.04,
    marginBottom: 10,
    textAlign: 'center',
    marginHorizontal: 10,
    fontWeight: 'bold'
  },
  secondScreenBtn: {
    width: '80%',
    flexDirection: 'row',
    backgroundColor: 'blue',
    height: dh * 0.07,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonImage: {
    width: dh * 0.03,
    height: dh * 0.03,
    resizeMode: 'contain',
    tintColor: 'white',
    marginRight: dw * 0.03
  }
}


export default App;
