import React from 'react'
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'

import { styles, width, options } from '../helpers'
import { imageAssets } from '../images'

const ModalComponent = ({ allPlaylists, setBool, setNumber, closeModal }) => {

  const titles = allPlaylists.map((e => e.title));

  const renderOptions = () => titles.map((title, i) => {

    const last = i === titles.length - 1;
    const image = i === 0 ? imageAssets.backImg : imageAssets.trophyImg;
    const borderBottomWidth = last ? 2 : 0;
    const backgroundColor = i === 0 ? 'rgb(220,220,220)' : 'rgb(200,200,200)'
    return (
      <TouchableOpacity onPress={() => {
        setBool(i);
        closeModal();
        setNumber(options[0])
      }} key={i} style={[styles.tournamentOptionCont, { borderBottomWidth, backgroundColor }]}>
        <Image style={[styles.buttonImage, { tintColor: 'black' }]} source={image} />
        <Text style={{ fontWeight: 'bold', fontSize: width * 0.03 }}>{title}</Text>
      </TouchableOpacity>
    )
  })

  const renderModalCont = () => {
    return (
      <View style={styles.modalMainCont}>
        <Text style={styles.modalTitleText}>You can select one of the active monthly tournaments below and randomize playlists for that special event!</Text>
        <View style={{ width: '100%' }}>
          {renderOptions()}
        </View>
      </View>
    )
  }

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={true}
      onRequestClose={() => {
        closeModal()
      }}
    >
      <View style={styles.modalCont}>
        <TouchableOpacity onPress={() => closeModal()} style={{ flex: 1, width: '100%' }} />
        {renderModalCont()}
        <TouchableOpacity onPress={() => closeModal()} style={{ flex: 1, width: '100%' }} />
      </View>
    </Modal>
  );
};

export default ModalComponent;
