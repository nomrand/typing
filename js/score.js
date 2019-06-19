// show how many lines
const DISP_RANK_MAX = 20;

$(function () {
    // *** set User ***
    $('#UserNameText').val(getCurrentUser());

    // *** get user data & arrange ***
    // convert each-user-data to flat array 
    let allFlatArray = [];
    let user = getCurrentUser();
    $.each(getUserData(user), function (index, data) {
        let byUser = userFlatData(user, data);
        allFlatArray = allFlatArray.concat(byUser);
    });
    // sort by score
    allFlatArray.sort(function (a, b) {
        return b.chara_per_sec - a.chara_per_sec;
    });
    // cut over data
    let len = allFlatArray.length;
    if (len > DISP_RANK_MAX) {
        len = DISP_RANK_MAX;
    }
    allFlatArray = allFlatArray.slice(0, len);

    // *** show socre table ***
    $.each(allFlatArray, function (index, val) {
        var line =
            '<tr>' +
            '<th scope="row">' + (index + 1) + '</th>' +
            '<td>' + val.user + '</td>' +   // user
            '<td>' + val.mode + '</td>' +   // mode
            '<td>' + Math.floor(val.chara_per_sec) + '</td>' +
            '<td>' + Math.floor(val.time / 100) / 10 + 'sec</td>' +
            '<td>' + val.getLength + ' characters (' + val.get + ' words)' + '</td>' +   //chara count(word count)
            '<td>' + val.date + '</td>' +   // date
            '</tr>';

        $("#score_body").append($(line));
        index++;
    });

});

function userFlatData(user, x) {
    return {
        user: user,
        mode: x.mode,
        chara_per_sec: (x.getLength * 1000.0 * 60 / x.time),
        time: x.time,
        get: x.get,
        getLength: x.getLength,
        date: formatDate(new Date(x.start)),
    };
}
