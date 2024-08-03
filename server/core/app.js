/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const { User } = require("./user");
const { Channel } = require("./channel");
const Enumerators = require("./enumerators");
const logger = require("./../inc/logger");

class App {

    constructor(id, appKey, server){
        this.id = id;
        this.appKey = appKey;
        this.server = server;
        this.io = server.io;
        this.channels = [];
        this.appInfo = null;
        this.stats = {
            currentCCU: 0,
            peakCCU: 0,
            usedTraffic: 0 // KB
        };

        this.refreshAppInfo();

        setInterval(() => { this.snapshot(this); }, 1000 * 60 * 5); // do snapshot each 5 minute
    }

    canConnectToApp(){
        return this.getCountOfJoinedUsers() < this.getMaxConnections();
    }

    getMaxConnections(){
        return this.appInfo == null ? 10 : this.appInfo.default_ccu + this.appInfo.subscription_ccu;
    }

    joinChannel(channelInfo, userInfo, socket){
        let channel = this.getChannelById(channelInfo.id);

        if(channel == null){
            channel = new Channel(this, channelInfo);
            this.channels.push(channel);
        }

        if(!channel.private || (channel.private && channel.info.password === channelInfo.password)){
            channel.join(new User(userInfo.id, userInfo.peerId, socket, userInfo.info));
        } else{
            this.sendToTarget(socket, Enumerators.NetworkEvent.FailedToJoinChannel, { message: "Failed to join private channel - invalid password" });
        }
    }

    leaveChannel(channelId, userId){
        let channel = this.getChannelById(channelId);

        if(channel != null){
            channel.leave(userId);

            if(channel.getCountOfJoinedUsers() === 0){
                this.channels.splice(this.channels.indexOf(channel), 1);
            }
        }
    }

    userDisconnected(socket){
        for(let i = 0; i < this.channels.length; i++){
            for(let j = 0; j < this.channels[i].users.length; j++){
                if(this.channels[i].users[j].socket === socket){
                    this.leaveChannel(this.channels[i].id, this.channels[i].users[j].id);
                    return;
                }
            }
        }
    }

    getChannelById(channelId){
        return this.channels.find(it => it.id === channelId);
    }

    refreshAppInfo(){
        this.server.apiController.getAppInfoByAppKey(this.appKey, (data) => {
            this.appInfo = data;
        });
    }

    getCountOfJoinedUsers(){
        let count = 0;
        for(let i = 0; i < this.channels.length; i++){
            count += this.channels[i].getCountOfJoinedUsers();
        }
        return count;
    }

    sendToTarget(socket, event, data){
        socket.emit(event, data);
    }

    snapshot(app){
        app.stats.currentCCU = app.getCountOfJoinedUsers();

        if(app.stats.currentCCU > app.stats.peakCCU){
            app.stats.peakCCU = app.stats.currentCCU;
        }

        app.server.apiController.refreshCurrentCCUAmountForApp(app.appKey, app.stats);

        app.stats.usedTraffic = 0;
    }
}

module.exports = {
    App: App
};