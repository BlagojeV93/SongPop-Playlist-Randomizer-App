import { Share } from 'react-native'

export const options = [50, 60, 75, 90, 100, 150];

export const onShare = async (message) => {
    message.forEach(element => {
        element = element + `\n`
    });
    try {
        await Share.share({ message: message.join(`\n`) });
    } catch (error) {
        alert(error.message);
    }
}
