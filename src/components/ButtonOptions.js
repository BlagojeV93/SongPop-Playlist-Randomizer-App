import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

import { styles, options } from '../helpers'

const ButtonOptions = ({ number, lists, setNumber }) => {

    const renderOptions = () => options.map((opt, i) => {
        const backgroundColor = opt == number ? 'purple' : '#739fff';
        const borderLeftWidth = i == 0 ? 2 : 1;
        const borderRightWidth = i == options.length - 1 ? 2 : 1;
        return (
            <TouchableOpacity disabled={opt > lists.length} activeOpacity={0.5} onPress={() => setNumber(opt)} key={i} style={[styles.optionBtn,
            { backgroundColor }, { borderLeftWidth }, { borderRightWidth }
            ]}>
                <Text style={styles.optionNumber}>{opt}</Text>
            </TouchableOpacity>
        )
    })

    return (
        <View style={{ flex: 1.5 }}>
            <Text style={[styles.textShadow, styles.chooseNumberTitle]}>Select the number of playlists to randomize</Text>
            <View style={styles.optionsMainCont}>
                <View style={styles.optionsInnerCont}>
                    {renderOptions()}
                </View>
            </View>
        </View>
    );
};

export default ButtonOptions;
