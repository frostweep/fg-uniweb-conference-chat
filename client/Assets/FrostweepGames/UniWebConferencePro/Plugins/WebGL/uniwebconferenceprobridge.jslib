/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

var UniWebConferenceProBridge = {

    $CallbacksMap:{},

    setUser: function(userInfo){
        document.NetworkChat.setUser(document.getStringFromPtr(userInfo));
    },

    beginMediaStream: function (video, audio) {
        document.NetworkChat.beginMediaStream(video === 1, audio === 1);
    },

    connectToApp: function(appKey){
        document.NetworkChat.connect(document.getStringFromPtr(appKey));
    },

    sendMessageInChannel: function(message){
        document.NetworkChat.sendMessageInChannel(document.getStringFromPtr(message));
    },

    setMuteStatusVideo: function(status){
        document.NetworkChat.setMuteStatusVideo(status === 1);
    },

    setMuteStatusAudio: function(status){
        document.NetworkChat.setMuteStatusAudio(status === 1);
    },

    setAudioVolume: function(userId, volume){
        document.NetworkChat.setAudioVolume(document.getStringFromPtr(userId), volume / 100);
    },

    joinChannel: function(channelId, isPrivate, password){
        document.NetworkChat.joinChannel(document.getStringFromPtr(channelId), isPrivate === 1, document.getStringFromPtr(password));
    },

    leaveChannel: function(){
        document.NetworkChat.leaveChannel();
    },

    initializeCallback: function(callback, dataCallback){
        CallbacksMap['HandleEvents'] = callback;
        CallbacksMap['HandleData'] = dataCallback;
    },

    init: function() {
        if(document.NetworkChat != undefined)
            return;

        function getStringFromPtr(ptr) {
            return UTF8ToString(ptr);
        }

        function getPtrFromString(str){
            var bufferSize = lengthBytesUTF8(str) + 1;
            var buffer = _malloc(bufferSize);
            stringToUTF8(str, buffer, bufferSize);
            return buffer;
        }

        function callUnityCallback(object){
            var ptrFunc = CallbacksMap["HandleEvents"];

            var json = UnityWebGLTools.objectToJSON(object);
            var buffer = getPtrFromString(json);

            Module['dynCall_vi'](ptrFunc, buffer);

            _free(buffer);
        }

        function callUnityArrayCallback(data, info){
            var ptrFunc = CallbacksMap["HandleData"];

            var buffer = _malloc(data.length * data.BYTES_PER_ELEMENT)
            HEAPU8.set(data, buffer)

            var json = UnityWebGLTools.objectToJSON(info);
            var bufferInfo = getPtrFromString(json);

            Module['dynCall_vii'](ptrFunc, buffer, bufferInfo);

            _free(buffer);
            _free(bufferInfo);
        }

        document.getPtrFromString = getPtrFromString;
        document.getStringFromPtr = getStringFromPtr;
        document.callUnityCallback = callUnityCallback;
        document.callUnityArrayCallback = callUnityArrayCallback;

        document.NetworkChat = new NetworkChat();
    }
};

autoAddDeps(UniWebConferenceProBridge, '$CallbacksMap');
mergeInto(LibraryManager.library, UniWebConferenceProBridge);