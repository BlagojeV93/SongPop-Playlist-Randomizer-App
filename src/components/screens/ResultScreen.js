import React from 'react'
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'

import { styles, onShare } from '../../helpers'
import { imageAssets } from '../../images'

const ResultScreen = React.forwardRef((props, ref) => {

    const { randomizeAgain, randomizedPlaylists } = props;

    return (
        <View style={styles.secondScreen}>
            <View style={styles.allPlaylistsCont}>
                <FlatList
                    ref={ref}
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
                <Image style={styles.buttonImage} source={imageAssets.shareImg} />
                <Text style={styles.buttonText}>SHARE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => randomizeAgain()} style={[styles.secondScreenBtn, { backgroundColor: 'purple' }]}>
                <Image style={styles.buttonImage} source={imageAssets.backImg} />
                <Text style={styles.buttonText}>RANDOMIZE AGAIN</Text>
            </TouchableOpacity>
        </View>
    );
})

export default ResultScreen;
