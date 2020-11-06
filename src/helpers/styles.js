import { StyleSheet, Dimensions } from 'react-native'

export const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    flexCenteredCont: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
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
        fontSize: width * 0.045,
        color: 'white'
    },
    numOfPlaylistText: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
    chooseNumberTitle: {
        fontSize: width * 0.04,
        marginVertical: 10,
        fontWeight: 'bold',
        color: 'white',
        width: '100%',
        textAlign: 'center'
    },
    animatedViewStyle: {
        height: '100%',
        width: width * 2,
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
        fontSize: width * 0.035
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
        fontSize: width * 0.035
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
        fontSize: width * 0.04,
        marginBottom: 10,
        textAlign: 'center',
        marginHorizontal: 10,
        fontWeight: 'bold'
    },
    secondScreenBtn: {
        width: '80%',
        flexDirection: 'row',
        backgroundColor: 'blue',
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonImage: {
        width: height * 0.03,
        height: height * 0.03,
        resizeMode: 'contain',
        tintColor: 'white',
        marginRight: width * 0.03
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
        padding: height * 0.03
    },
    specialOptionText: {
        color: 'white',
        fontSize: width * 0.035,
        marginHorizontal: height * 0.03
    },
    modalTitleText: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: height * 0.035
    },
    modalCont: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalMainCont: {
        width: '100%',
        backgroundColor: 'rgb(200,200,200)'
    },
    backToRegularBtn: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: height * 0.02
    },
    tournamentOptionCont: {
        width: '100%',
        flexDirection: 'row',
        borderTopWidth: 2,
        padding: height * 0.02,
        alignItems: 'center'
    }
})