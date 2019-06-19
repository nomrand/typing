function getAllUserData() {
    var storedData = store.get('typing_game');
    if (!storedData) {
        storedData = {};
        store.set('typing_game', storedData);
    }

    return storedData;
}
function clearAllUserData() {
    store.set('typing_game', {});
}

function getCurrentUser() {
    return store.get('typing_game_cur_user');
}
function setCurrentUser(curUser) {
    return store.set('typing_game_cur_user', curUser);
}

function getUserData(username) {
    var storedData = getAllUserData();
    if (!storedData[username]) {
        storedData[username] = {
            data: [],
        };
        store.set('typing_game', storedData);
    }

    return storedData[username]["data"];
}

function appendUserData(username, appendData) {
    var userdata = getUserData(username);
    userdata.push(appendData);

    var storedData = store.get('typing_game');
    storedData[username]["data"] = userdata;

    store.set('typing_game', storedData);
}

var formatDate = function (date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
};