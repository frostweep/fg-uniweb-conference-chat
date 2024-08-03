/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

class Message {
    constructor(userId, message){
        this.userId = userId;
        this.message = message;
        this.createdAt = Date.now();
    }
}

module.exports = {
    Message: Message
};