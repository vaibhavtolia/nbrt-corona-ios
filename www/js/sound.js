/*global LocalFileSystem, $, console, Media, DebugConsole */

/*
 * Jeremiah Bargar
 * jeremy
 */

// name of the file to be recorded
var RECORD_FILENAME = 'blank.wav';

// full path up to and including the file name
var RECORD_FILEPATH = "";

// jquery elements that serve as user controls
var PLAY_BUTTON;
var RECORD_BUTTON;
var CD_BUTTON;
var timer;



// internal functions - in a more robust app, these would be hidden
// see bottom for 'external api'.

function deleteBlank() {

    'use strict';

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsForDelete, logError);
}

function deleteRecording() {

    'use strict';

    if(navigator.audio) {
        console.log("resetting audio - removing blank...");
        deleteBlank();
    } else {
        //alert("Touch the record button to record a voice memo.");
    }
}

function startRecord() {

    'use strict';

    console.log("start record...");
    if(navigator.audio && confirm("Delete existing recording?")) {
        deleteRecording();
        return;
    }

    app.hideActionbar();

    RECORD_FILENAME = app.generatefilename();


    // first, we need to recreate the wav file
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsForCreate, logError);
}

function startTimer(){
    var time = 0;
    timer = setInterval(function(){
        time = time + 1;
        var min = parseInt(time / 60);
        var sec = time % 60;
        var timing = min+":"+sec;
        $("#rec").html(timing);
    },1000);
}

function stopTimer(){
    clearInterval(timer);
}

function clearTimer(){
    $("#rec").html("00:00");
}

function stopRecord() {

    'use strict';

    console.log("Stopping recording...");
    RECORD_BUTTON.html('RECORD');
    CD_BUTTON.html('DELETE');
    navigator.audio.stopRecord();

    app.showActionbar();

    stopTimer();
}

function playRecord() {

    'use strict';

    console.log("Playing recording...");
    if(navigator.audio) {
        PLAY_BUTTON.html('STOP');
        navigator.audio.play();
    } else {
        helper.makeToast("No audio. Touch the record button to record some.");
    }

    clearTimer();
}

function stopPlayback() {

    'use strict';

    console.log("Stopping playback...");
    PLAY_BUTTON.html('PLAY');
    navigator.audio.stop();
}

function recording_success() {

    'use strict';

    console.log("Recording success callback");
    RECORD_BUTTON.html('RECORD');
    PLAY_BUTTON.html('PLAY');
    CD_BUTTON.html('DELETE');
}

function recording_failure(error) {

    'use strict';

    alert("Recording failed: " + error);
    console.log("Recording failed: " + error);
}

function gotFsForCreate(fileSystem) {

    'use strict';

    if (!RECORD_FILEPATH) {

        var folder = "nbrt/audio/";
        var fullPath = "";

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
                var entry = fileSystem.root;
                entry.getDirectory(folder, {create: true, exclusive: false}, function(dir){

                    //console.log('found/created dir : '+dir.fullPath);
                    fullPath = "file://localhost"+dir.fullPath;
                });
        },null);

        RECORD_FILEPATH = fullPath + '/' + RECORD_FILENAME;
        console.log('noting record file path as: ' + RECORD_FILEPATH);
    }

    fileSystem.root.getFile(RECORD_FILEPATH, {create: true}, function() {
        console.log('created wav file');
        console.log("Initializing audio...");
        navigator.audio = new Media(RECORD_FILEPATH,recording_success,recording_failure);
        console.log("Initializing audio...OK");
        CD_BUTTON.html('SAVED');
        RECORD_BUTTON.html('STOP');
        console.log("Starting recording...");
        navigator.audio.startRecord();
        console.log("Starting recording...OK");

        startTimer();

    }, logError);
}

function gotFsForDelete(fileSystem) {

    'use strict';

    fileSystem.root.getFile(RECORD_FILEPATH, {create: false}, deleteFileEntry, logError);
}

function deleteFileEntry(fileEntry) {

    'use strict';

    fileEntry.remove(function() {

        console.log("Removal succeeded");
        navigator.audio = null;
        CD_BUTTON.html('HELP');
    }, function(error) {

        console.log('Error removing file: ' + error.code);
    });
}

function logError(error) {

    'use strict';

    console.log('something failed: ' + JSON.stringify(error));
}

// 'external api' functions called by controls

function recordButtonClicked() {

    'use strict';

    if(RECORD_BUTTON.html() === 'STOP') {
        stopRecord();
    } else {
        startRecord();
    }
}

function playButtonClicked() {

    'use strict';

    if (PLAY_BUTTON.html() === 'PLAY') {
        playRecord();
    } else {
        stopPlayback();
    }
}

function cdButtonClicked() {

    'use strict';

    if(CD_BUTTON.html() === 'HELP') {

        alert("Touch the record button to record a voice memo.");
    } else {

        if(confirm("Really delete audio recording?")) {
            deleteRecording();
        }
    }
}

/**
 * Play back the indicated resource, independent of the other record/play functions.
 *
 * @param resource static resource relative to www directory
 */
function playWav(resource) {

    'use strict';

    console.log('playWav(' + resource + ')...');
    new Media(resource).play();
    console.log('playWav(' + resource + ')...OK');
}