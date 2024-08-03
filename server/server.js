/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const fs = require('fs');
const express = require("express");
const https = require("https");
const socketio = require("socket.io");
const peer = require("peer");
const { App } = require("./core/app");
const { ApiController } = require("./controllers/apiController");
const Enumerators = require("./core/enumerators");
const { DB } = require("./inc/db");
const logger = require("./inc/logger");

class AuthServer {

  constructor(){
    const privateKey = fs.readFileSync('./certificates/privkey.pem', 'utf8');
    const certificate = fs.readFileSync('./certificates/cert.pem', 'utf8');
    const ca = fs.readFileSync('./certificates/chain.pem', 'utf8');

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca: ca
    };

    this.app = express();
    this.server = https.Server(credentials, this.app);
    this.io = socketio(this.server, {
      cors: {
        origin: '*'
      }
    });
    this.peerServer = peer.ExpressPeerServer(this.server, {
      debug: false,
    });

    this.port = 443;

    this.apps = [];
    this.db = new DB();
    this.apiController = new ApiController(this, this.db);
  }

  start(){
    logger.log("starting server...");

    // this.peerServer.on('error', function(err) { console.log(err.message); });
    // this.peerServer.on('connection', (client) => { console.log("connected to peer: " + client.getId()); });
    // this.peerServer.on('disconnect', (client) => { console.log("disconnected from peer: " + client.getId()); });

    this.app.use("/peerjs", this.peerServer);
    this.app.use(express.static("public"));

    this.io.on(Enumerators.NetworkEvent.Connection, (socket) => {

      socket.on(Enumerators.NetworkEvent.ConnectToApp, (connectionData) => {

        let appKey = connectionData.appKey;

        this.apiController.isAppExistsWithAppKey(appKey, (exists) => {
          if(exists){
            let app = this.getAppByAppKey(appKey);

            if(app.canConnectToApp()){
              app.sendToTarget(socket, Enumerators.NetworkEvent.ConnectedToApp, {});

              socket.on(Enumerators.NetworkEvent.JoinChannel, (data) => {
                let channelInfo = data.channelInfo;
                let userInfo = data.userInfo;

                app.joinChannel(channelInfo, userInfo, socket);
              });
      
              socket.on(Enumerators.NetworkEvent.LeaveChannel, (data) => {
                let channelId = data.channelId;
                let userId = data.userId;

                app.leaveChannel(channelId, userId);
              });

              socket.on(Enumerators.NetworkEvent.Disconnect, function (r,t,y) {
                app.userDisconnected(socket);
              });
      
            } else{
              app.sendToTarget(socket, Enumerators.NetworkEvent.NoCCUAvailable, { message: "CCU limit exceed at this moment. Try to increase CCU limit in the dashboard" });
            }
          } else{
            this.sendToTarget(socket, Enumerators.NetworkEvent.FailedToConnectToApp, { message: "App not found. Check that the used an app key is exists in the dashboard" });
          }
        });
      });
    });

    this.server.listen(this.port);

    logger.log("started server. listening port: " + this.port);
  }

  getAppByAppKey(appKey){
    let app = this.apps.find(it => it.appKey == appKey);
    if(app == null){
      app = this.createApp(appKey);
    }
    return app;
  }

  createApp(appKey){
    let app = new App(this.getFreeAppId(), appKey, this);
    this.apps.push(app);
    return app;
  }

  sendToTarget(socket, event, data){
    socket.emit(event, data);
  }

  getFreeAppId(){
    let id = 0;
    let freeFound;

    while(true){
      freeFound = true;

      for(let i = 0; i < this.apps.length; i++){
          if(this.apps[i].id == id){
            freeFound = false;
          }
      }

      if(!freeFound){
          id++;
      } else break;
    }

    return id;
  }
}

const authServer = new AuthServer();
authServer.start();