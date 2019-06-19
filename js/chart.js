// *** data for display ***
let LABELS = [];
let DATA_SETS = [
    {
        label: "score[character / minute]",
        backgroundColor: /*"#f2dae8"*/"rgba(242,218,232,0.6)",
        borderColor: /*"#dd9cb4"*/"rgba(221,156,180,0.6)",
        data: []
    },
];

$(function () {
    // *** set User ***
    $('#UserNameText').val(getCurrentUser());

    // *** get & set data ***
    LABELS = [];
    DATA_SETS[0].data = [];
    $.each(getAllUserData()[$('#UserNameText').val()].data, function (index, val) {
        LABELS.push(formatDate(new Date(val.start), "MM/DD hh:mm"));
        DATA_SETS[0].data.push(Math.floor(val.getLength * 1000.0 * 60 / val.time));
    });

    // *** display chart ***
    var ctx = $("#chart").get(0).getContext("2d");
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: LABELS,
            datasets: DATA_SETS,
        },
        options: {
            responsive: true
            // for straight line
            /* bezierCurve: false */
        }
    });
});
