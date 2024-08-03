/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

class User {

    constructor(id, peerId, socket, info){
        this.id = id;
        this.peerId = peerId;
        this.socket = socket;
        this.info = info;

        this.enabledAudio = false;
        this.enabledVideo = false;
    }
}

module.exports = {
    User: User
};