const regularFileUri = 'https://songpophost.000webhostapp.com/allPlaylists.txt';
const specialUri = 'https://songpophost.000webhostapp.com/special.txt'

export const fetchLists = async () => {
    let content = await fetch(regularFileUri).then(res => res.text()).catch(e => {
        if (e.message) {
            alert(e.message)
        } else {
            alert('Something went wrong. Please restart the app and try again!');
        }
    });
    
    content = content.split('•');
    content.shift();

    return content;
}

export const fetchSpecialLists = async () => {
    let lists = await fetch(specialUri).then(res => res.status == 200 ? res.text() : null)
        .catch(e => {
            if (e.message) {
                alert(e.message)
            } else {
                alert('Something went wrong. Please restart the app and try again!');
            }
        });

    let uri, title;
    if (lists) {
        lists = lists.split('•');
        lists.shift();
        uri = lists[1].trim();
        title = lists[0].trim();
        lists.splice(0, 2);
    }

    return { lists, uri, title }
}