
$(function () {
    // *** initilize element ***
    // create data options
    $(WORD_DATA).each(function (index, element) {
        var optionDom;
        if (index == 0) {
            optionDom = $("<option value='0' selected>" + element.mode + "</option>");
        } else {
            optionDom = $("<option value='" + index + "'>" + element.mode + "</option>");
        }
        $("#ModeSelect").append(optionDom);
    });

    // set events
    setEvents()

    // *** set User ***
    $('#UserNameText').val(getCurrentUser());

    // *** set Initial state ***
    setElementEnable(true);
});

function setEvents() {
    $('#GameStartButton').click(function () {
        gameStart();
    });

    $('#InputText').keyup(function (e) {
        var val = $('#InputText').val();
        if (!val) {
            return false;
        }

        $(".wordcell").each(function (index, element) {
            if ($(element).text() == val) {
                // word cleared
                $(element).trigger("dltFnc");
                $('#InputText').val('');
            } else if ($(element).text().startsWith(val)) {
                if ($(element).text().length - val.length <= 2) {
                    // word editing (nearly cleared)
                    $(element).removeClass("wordnormal");
                    $(element).removeClass("wordwarning");
                    $(element).addClass("wordfatal");
                } else {
                    // word editing
                    $(element).removeClass("wordnormal");
                    $(element).removeClass("wordfatal");
                    $(element).addClass("wordwarning");
                }
            } else {
                // word not edting
                $(element).removeClass("wordwarning");
                $(element).removeClass("wordfatal");
                $(element).addClass("wordnormal");
            }
        });

        return false;
    });

    $('#UserNameText').keyup(function (e) {
        setCurrentUser($('#UserNameText').val());
        setElementEnable(true);
    });

    $('#ResultSaveClose').click(function (e) {
        appendUserData($('#UserNameText').val(), ResultData);
    });
}

let ResultData = {};
let SelectedWordData = {};
let SelectedWordSpeed = 20000;
function gameStart() {
    setElementEnable(false);
    $('#InputText').focus();

    SelectedWordData = WORD_DATA[$("#ModeSelect").val()].data;
    SelectedWordSpeed = WORD_DATA[$("#ModeSelect").val()].speed;
    SelectedWordData = SelectedWordData.sort(
        function () { return Math.random() - .5 }
    ).slice(0, WORD_DATA[$("#ModeSelect").val()].max);

    ResultData = {
        start: Date.now(),
        time: 0,
        get: 0,
        getLength: 0,
        lose: 0,
        loseLength: 0,
        mode: WORD_DATA[$("#ModeSelect").val()].mode,
    };

    for (var i = 0; i < SelectedWordData.length; i++) {
        var wordCircle = $('<div class="rounded-circle cirIndicator wordcircle"></div>');
        $("#words_to_clear").append(wordCircle);
    }

    createWord(SelectedWordData.shift());
}

function winlose(isWin, word) {
    if (isWin) {
        ResultData.get++;
        ResultData.getLength += word.length;
    } else {
        ResultData.lose++;
        ResultData.loseLength += word.length;
    }

    var words = $(".wordcircle");
    words.first().remove();

    if (SelectedWordData.length == 0) {
        gameEnd();
    } else {
        createWord(SelectedWordData.shift());
    }
}

function createWord(word) {
    if (!word) {
        return false;
    }

    var wordDom = $('<div class="rounded text-center p-2 wordcell wordnormal"></div>');
    wordDom.text(word);
    $("#gscreen").append(wordDom);

    var maxLeft = $("#gscreen").width() - wordDom.width();
    wordDom.css({
        left: Math.floor(Math.random() * maxLeft) + "px",
    });

    wordDom.animate(
        {
            top: "100%",
        },
        {
            duration: SelectedWordSpeed,
            easing: 'linear',
            // step: function (now) {
            //     if (WORD_DATA[$("#ModeSelect").val()].rotate == true) {
            //         $(this).css({
            //             transform: 'rotate(' + Math.floor(now / 100 * 90) + 'deg)',
            //         });
            //     }
            // },
            complete: function () {
                $(this).remove();
                winlose(false, $(this).text());
            },
        },
    );

    wordDom.bind("dltFnc", function () {
        // delete all animate queue(=true), and stop current pos(=false)
        $(this).stop(true, false);
        $(this).animate(
            {
                height: "0%",
                width: "0%",
            },
            {
                duration: 100,
                easing: 'linear',
                complete: function () {
                    $(this).remove();
                    winlose(true, $(this).text());
                },
            },
        );
    });
}

function gameEnd() {
    ResultData.time = Date.now() - ResultData.start;

    $('#res_user').text($('#UserNameText').val());
    $('#res_mode').text(ResultData.mode);
    $('#res_start').text(formatDate(new Date(ResultData.start)));
    $('#res_time').text((Math.floor(ResultData.time / 100) / 10) + "sec");
    $('#res_get').text(ResultData.get + "words (" + ResultData.getLength + ")");
    $('#res_lose').text(ResultData.lose + "words (" + ResultData.loseLength + ")");
    $('#res_score').text(Math.floor(ResultData.getLength * 1000.0 * 60 / ResultData.time));
    $('#ResultModal').modal('show');

    setElementEnable(true);
}

function setElementEnable(isGameStop) {
    var username = $('#UserNameText').val();

    // *** for Global Control ***
    // if isGameStop = true && have username, can control
    if (isGameStop && username) {
        $('.nav-link').removeClass('disabled');
    } else {
        $('.nav-link').addClass('disabled');
    }

    // *** for Normal Control ***
    // if isGameStop = true, can control
    $('#UserNameText').prop("disabled", !isGameStop);

    // *** for Game Control ***
    // setting changed, always reset
    $('#InputText').val('');

    // Game Setting (if isGameStop = true, can control)
    // * especialy if no username, can not start
    $('#GameStartButton').prop("disabled", !isGameStop || !username);
    $('#ModeSelect').prop("disabled", !isGameStop);

    // Game Control (if isGameStop = true, can not control)
    $('#InputText').prop("disabled", isGameStop);
}
