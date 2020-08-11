import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, TouchableOpacity, Text, Share, ImageBackground, View, ActivityIndicator, Dimensions, Animated, FlatList, Image, Modal } from 'react-native';

import ClearCache from 'react-native-clear-cache';

const regularFileUri = 'https://songpophost.000webhostapp.com/allPlaylists.txt';
const specialUri = 'https://songpophost.000webhostapp.com/special.txt'
const options = [50, 60, 75, 90, 100, 150];
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
  const [allPlaylists, setAll] = useState([]);
  const [chosenListsOrdinal, setBool] = useState(0);
  const [modalVisible, openModal] = useState(false);
  const [randomizedPlaylists, choosePlaylists] = useState([]);
  const [indicator, loading] = useState(false);
  const [numberToRandomize, setNumber] = useState(options[0])
  const [translateXMain] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  // const [translateXSpecial] = useState(new Animated.Value(-dw));

  const listsToShow = allPlaylists.length > 0 ? allPlaylists[chosenListsOrdinal].lists : [];
  const flatlist = useRef(null);

  useEffect(() => {
    ClearCache.clearAppCache(data => console.log('cache cleared!'));
    loading(true);
    getAllLists();
  }, [])

  useEffect(() => {
    if (allPlaylists.length > 1) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true
      }).start()
    }
  }, [allPlaylists])

  const getAllLists = async () => {
    let content = await fetch(regularFileUri).then(res => res.text()).catch(e => {
      if (e.message) {
        alert(e.message)
      } else {
        alert('Something went wrong. Please restart the app and try again!');
      }
    });
    content = content.split('•');
    content.shift();
    setAll(prevContent => {
      let arr = [...prevContent];
      arr.push({ title: 'Regular Lists', lists: content })
      return arr;
    })
    await getSpecialLists(specialUri);
    loading(false);
  }

  const getSpecialLists = async (uri) => {
    let lists = await fetch(uri).then(res => res.status == 200 ? res.text() : null)
      .catch(e => {
        if (e.message) {
          alert(e.message)
        } else {
          alert('Something went wrong. Please restart the app and try again!');
        }
      });
    if (lists) {
      lists = lists.split('•');
      lists.shift();
      const uri = lists[1].trim();
      const title = lists[0].trim();
      lists.splice(0, 2);

      setAll(prevContent => {
        let arr = [...prevContent];
        arr.push({ title, lists })
        return arr;
      })

      if (uri != 'null') {
        getSpecialLists(uri)
      }
    }
  }

  const randomizePlaylists = () => {
    Animated.timing(translateXMain, { toValue: -dw, useNativeDriver: true }).start();

    let stateArr = [];
    do {
      let val = listsToShow[Math.floor(Math.random() * listsToShow.length)].trim();
      if (stateArr.indexOf(val) === -1) {
        stateArr.push(val);
      }
    } while (stateArr.length < numberToRandomize);
    stateArr = stateArr.map((val, i) => val = i + 1 + '. ' + val);
    choosePlaylists(stateArr);
  }

  const randomizeAgain = () => {
    Animated.timing(translateXMain, { toValue: 0, useNativeDriver: true }).start();
    flatlist.current.scrollToOffset({ animated: true, offset: 0 });
  }

  const renderOptions = () => options.map((opt, i) => {
    const backgroundColor = opt == numberToRandomize ? 'purple' : '#739fff';
    const borderLeftWidth = i == 0 ? 2 : 1;
    const borderRightWidth = i == options.length - 1 ? 2 : 1;
    return (
      <TouchableOpacity disabled={opt > listsToShow.length} activeOpacity={0.5} onPress={() => setNumber(opt)} key={i} style={[styles.optionBtn,
      { backgroundColor }, { borderLeftWidth }, { borderRightWidth }
      ]}>
        <Text style={styles.optionNumber}>{opt}</Text>
      </TouchableOpacity>
    )
  })

  const renderModalCont = () => {
    const titles = allPlaylists.map((e => e.title));
    return (
      <View style={styles.modalMainCont}>
        <Text style={styles.modalTitleText}>You can select one of the active monthly tournaments below and randomize playlists for that special event!</Text>
        <View style={{ width: '100%' }}>
          {titles.map((title, i) => {
            if (i > 0) {
              const last = i == titles.length - 1;
              return (
                <TouchableOpacity onPress={() => {
                  setBool(i);
                  openModal(false);
                  setNumber(options[0])
                }} key={i} style={[styles.tournamentOptionCont, { borderBottomWidth: last ? 2 : 0, }]}>
                  <Image style={[styles.buttonImage, { tintColor: 'black' }]} source={require('./cup.png')} />
                  <Text style={{ fontWeight: 'bold', fontSize: dw * 0.03 }}>{title}</Text>
                </TouchableOpacity>
              )
            }
          })}
        </View>
        <TouchableOpacity onPress={() => {
          openModal(false);
          setBool(0);
          setNumber(options[0])
        }} style={styles.backToRegularBtn}>
          <Image style={[styles.buttonImage, { tintColor: 'black' }]} source={require('./back.png')} />
          <Text style={{ fontWeight: 'bold', fontSize: dw * 0.03 }}>REGULAR LISTS</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const topListsTitle = chosenListsOrdinal == 0 ? 'Click here for monthly tournaments!' : 'Change playlists'

  return (
    <SafeAreaView style={styles.mainContainer}>
      {indicator &&
        <View style={styles.indicatorView}>
          <Text style={styles.loadingText}>Loading all playlists...Please wait...</Text>
          <ActivityIndicator size='large' color='white' style={{ marginTop: 20 }} />
        </View>
      }
      <ImageBackground style={{ flex: 1 }} resizeMode='contain' source={require('./sppic.png')}>
        <Animated.View style={[styles.animatedViewStyle, { transform: [{ translateX: translateXMain }] }]}>
          <View style={{ flex: 1 }}>
            {allPlaylists.length > 1 &&
              <Animated.View style={[styles.specialPartiesCont, { opacity }]}>
                <TouchableOpacity onPress={() => openModal(true)} style={styles.specialPartiesInnerBtn}>
                  <Image style={[styles.buttonImage, { marginRight: 0 }]} source={require('./cup.png')} />
                  <Text style={styles.specialOptionText}>{topListsTitle}</Text>
                  <Image style={[styles.buttonImage, { marginRight: 0 }]} source={require('./cup.png')} />
                </TouchableOpacity>
              </Animated.View>
            }
            {!indicator &&
              <View style={styles.firstScreen}>
                <View style={{ flex: 3, width: '100%' }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.numOfPlaylistText, styles.textShadow]}>Total of {listsToShow.length} playlists loaded!</Text>
                  </View>
                  <Text style={[styles.textShadow, styles.chooseNumberTitle]}>Select the number of playlists to randomize</Text>
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
          {modalVisible &&
            <Modal
              animationType='fade'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                openModal(false)
              }}

            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => openModal(false)} style={{ flex: 1, width: '100%' }} />
                {renderModalCont()}
                <TouchableOpacity onPress={() => openModal(false)} style={{ flex: 1, width: '100%' }} />
              </View>
            </Modal>
          }
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
  },
  specialPartiesCont: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  specialPartiesInnerBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: dh * 0.03
  },
  specialOptionText: {
    color: 'white',
    fontSize: dw * 0.035,
    marginHorizontal: dh * 0.03
  },
  modalTitleText: {
    fontSize: dw * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: dh * 0.035
  },
  modalMainCont: {
    width: '100%',
    backgroundColor: 'rgb(220,220,220)'
  },
  backToRegularBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: dh * 0.02,
    backgroundColor: 'rgb(200,200,200)'
  },
  tournamentOptionCont: {
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 2,
    padding: dh * 0.02,
    alignItems: 'center'
  },
}


export default App;
