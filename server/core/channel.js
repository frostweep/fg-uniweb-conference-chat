/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const { Message } = require("./message");
const Enumerators = require("./enumerators");

class Channel {

    constructor(app, channelInfo){
        this.app = app;

        this.id = channelInfo.id;
        this.info = channelInfo;
        this.users = [];
        this.messages = [];

        this.intervald = setInterval(() => { this.snapshot(this); }, 1000);
    }

    dispose(){
        clearInterval(this.intervald);

        this.users = [];
        this.messages = [];
    }

    join(user){
        user.socket.join(this.getRoomId());

        this.userSubscribeOnEvents(user);

        this.users.push(user);

        this.sendToTarget(user.socket, Enumerators.NetworkEvent.JoinChannel, {
            id: this.id
        });

        this.updateUsers();

        this.getState(user.id);
    }

    leave(id){
        let user = this.getUserById(id);

        this.sendToTarget(user.socket, Enumerators.NetworkEvent.LeaveChannel, {
            id: this.id
        });

        this.users.splice(this.users.indexOf(user), 1);

        this.updateUsers();
    }

    getState(userId){
        let user = this.getUserById(userId);
        this.sendToTarget(user.socket, Enumerators.NetworkEvent.GetStateOfChannel, {
            messages: this.messages
        });
    }

    updateUsers(){
        this.sendToAll(Enumerators.NetworkEvent.UsersUpdatedInChannel, {
            users: this.users.map(it => {
                return {
                    id: it.id,
                    peerId: it.peerId,
                    info: it.info
                };
            })
        });
    }

    sendMessage(userId, content){
        let message = new Message(userId, content);
        this.messages.push(message);

        this.sendToAll(Enumerators.NetworkEvent.SendMessageInChannel, message);
    }

    getUserById(id){
        return this.users.find(it => it.id === id);
    }

    getCountOfJoinedUsers(){
        return this.users.length;
    }

    sendToTarget(socket, event, data){
        socket.emit(event, data);
    }

    sendToAll(event, data){
        this.app.io.sockets.in(this.getRoomId()).emit(event, data);
    }

    getRoomId(){
        return this.app.id + "_" + this.id;
    }

    userSubscribeOnEvents(user){
        user.socket.on(Enumerators.NetworkEvent.SendMessageInChannel, (data) => {
            let message = data.message;
            this.sendMessage(user.id, message);
        });

        user.socket.on(Enumerators.NetworkEvent.SetStatusOfChatFeaturesInChannel, (data) => {
            user.enabledAudio = data.enabledAudio;
            user.enabledVideo = data.enabledVideo;            
        });
    }

    snapshot(channel){

        let audioSeconds = 0;
        let videoSeconds = 0;

        for(let i = 0; i < channel.users.length; i++){
            if(channel.users[i].enabledAudio){
                audioSeconds++;
            }
            if(channel.users[i].enabledVideo){
                videoSeconds++;
            }
        }

        let usedTraffic = (audioSeconds * 62.5) +  (videoSeconds * 187.5);

        channel.app.stats.usedTraffic += usedTraffic;
    }
}

module.exports = {
    Channel: Channel
};