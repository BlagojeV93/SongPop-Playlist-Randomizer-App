import React, { useState, useEffect, createRef } from 'react';
import { SafeAreaView, TouchableOpacity, Text, ImageBackground, View, ActivityIndicator, Animated, Image } from 'react-native';

import ButtonOptions from '../ButtonOptions'
import Modal from '../Modal'
import ResultScreen from './ResultScreen'

import ClearCache from 'react-native-clear-cache';

import { options, fetchLists, fetchSpecialLists, styles, width } from '../../helpers'
import { imageAssets } from '../../images'

const HomeScreen = () => {
    const [allPlaylists, setAll] = useState([]);
    const [chosenListsOrdinal, setBool] = useState(0);
    const [modalVisible, openModal] = useState(false);
    const [randomizedPlaylists, choosePlaylists] = useState([]);
    const [indicator, loading] = useState(false);
    const [numberToRandomize, setNumber] = useState(options[0])
    const [translateXMain] = useState(new Animated.Value(0));
    const [opacity] = useState(new Animated.Value(0));

    const flatlist = createRef();

    const listsToShow = allPlaylists.length > 0 ? allPlaylists[chosenListsOrdinal].lists : [];
    const topListsTitle = chosenListsOrdinal == 0 ? 'Click here for monthly tournaments!' : 'Change playlists'

    useEffect(() => {
        ClearCache.clearAppCache(() => console.log('cache cleared!'));
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
        const content = await fetchLists();
        setAll(prevContent => {
            let arr = [...prevContent];
            arr.push({ title: 'Regular Lists', lists: content })
            return arr;
        })
        await getSpecialLists();
        loading(false);
    }

    const getSpecialLists = async () => {
        const { lists, title, uri } = await fetchSpecialLists();
        if (lists) {
            setAll(prevContent => {
                let arr = [...prevContent];
                arr.push({ title, lists })
                return arr;
            })
        }
        if (uri != 'null') {
            getSpecialLists(uri)
        }
    }

    const randomizePlaylists = () => {
        Animated.timing(translateXMain, { toValue: -width, useNativeDriver: true }).start();

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

    const renderContent = () => {
        if (indicator) {
            return (
                <View style={styles.indicatorView}>
                    <Text style={styles.loadingText}>Loading all playlists...Please wait...</Text>
                    <ActivityIndicator size='large' color='white' style={{ marginTop: 20 }} />
                </View>
            )
        } else {
            return (
                <View style={styles.firstScreen}>
                    <View style={{ flex: 3, width: '100%' }}>
                        <View style={styles.flexCenteredCont}>
                            <Text style={[styles.numOfPlaylistText, styles.textShadow]}>Total of {listsToShow.length} playlists loaded!</Text>
                        </View>
                        <ButtonOptions
                            number={numberToRandomize}
                            lists={listsToShow}
                            setNumber={(opt) => setNumber(opt)}
                        />
                    </View>
                    <View style={{ flex: 1, width: '100%' }}>
                        <TouchableOpacity onPress={() => randomizePlaylists()} style={styles.randomizeBtn}>
                            <Text style={styles.buttonText}>RANDOMIZE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    const renderModal = () => {
        if (modalVisible) {
            return (
                <Modal
                    allPlaylists={allPlaylists}
                    setBool={(val) => setBool(val)}
                    setNumber={(val) => setNumber(val)}
                    closeModal={() => openModal(false)}
                />
            )
        }
    }

    renderSpecialBtn = () => {
        if (allPlaylists.length > 1) {
            return (
                <Animated.View style={[styles.specialPartiesCont, { opacity }]}>
                    <TouchableOpacity onPress={() => openModal(true)} style={styles.specialPartiesInnerBtn}>
                        <Image style={[styles.buttonImage, { marginRight: 0 }]} source={imageAssets.trophyImg} />
                        <Text style={styles.specialOptionText}>{topListsTitle}</Text>
                        <Image style={[styles.buttonImage, { marginRight: 0 }]} source={imageAssets.trophyImg} />
                    </TouchableOpacity>
                </Animated.View>
            )
        }
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ImageBackground style={{ flex: 1 }} resizeMode='contain' source={imageAssets.songPopImage}>
                <Animated.View style={[styles.animatedViewStyle, { transform: [{ translateX: translateXMain }] }]}>
                    <View style={{ flex: 1 }}>
                        {renderSpecialBtn()}
                        {renderContent()}
                    </View>
                    <ResultScreen
                        randomizedPlaylists={randomizedPlaylists}
                        randomizeAgain={() => randomizeAgain()}
                        ref={flatlist}
                    />
                    {renderModal()}
                </Animated.View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default HomeScreen;
