/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

class NetworkChat {

  constructor(){
    
    this.serviceHost = "{server-host}";
    this.frameRate = 30;
    this.frameSize = {
      width: 1920,
      height: 1080
    };
    this.frameDemultiplier = 6;

    this.initialized = false;
    this.connectedToApp = false;
    this.connectedToChannel = false;
    this.joinedChannelId = null;
    this.usersInChannel = [];

    this.enabledAudio = false;
    this.enabledVideo = false;

    this.user = {
      id: this.getUniqueClientId(),
      peerId: null,
      socketId: null,
      video: null,
      stream: null,
      info: null,
      peerCall: null
    };

    this.events = {
      NoCCUAvailable: "NoCCUAvailable",
      ConnectToApp: "ConnectToApp",
      ConnectedToApp: "ConnectedToApp",
      FailedToConnectToApp: "FailedToConnectToApp",
  
      JoinChannel: "JoinChannel",
      LeaveChannel: "LeaveChannel",
      FailedToJoinChannel: "FailedToJoinChannel",
      UsersUpdatedInChannel: "UsersUpdatedInChannel",
      SendMessageInChannel: "SendMessageInChannel",
      GetStateOfChannel: "GetStateOfChannel",
      SetStatusOfChatFeaturesInChannel: "SetStatusOfChatFeaturesInChannel",

      Connect: "connect",
      Disconnect: "disconnect",
      ConnectError: "connect_error",

      Open: "open",
      Call: "call",
      Stream: "stream"
    };

    this.unityCallbackEvents = {
      MessageReceived: "MessageReceived",
      Connected: "Connected",
      ConnectFailed: "ConnectFailed",
      UserConnected: "UserConnected",
      UserDisconnected: "UserDisconnected",
      JoinedChannel: "JoinedChannel",
      LeftChannel: "LeftChannel",
      JoinChannelFailed: "JoinChannelFailed",
      ChannelStateReceived: "ChannelStateReceived",
      BeginMediaStreamSuccess: "BeginMediaStreamSuccess",
      BeginMediaStreamFailed: "BeginMediaStreamFailed",
      ConnectedToServer: "ConnectedToServer"
    };

    this.unityArrayCallbackEvents = {
      VideoFrameReceived: "VideoFrameReceived"
    };
    
    this.connectToServer();
  }

  // Perform connection to server
  connectToServer(){
    this.peer = new Peer(undefined, {
      path: "/peerjs",
      host: this.serviceHost,
      port: "443",
      debug: 0,
      // config: {
      //   iceServers: [
      //     { 
      //       urls: "stun:stun.{server-host}:5349" 
      //     },
      //     { 
      //       urls: "turn:turn.{server-host}:5349",
      //       username:"{name}", 
      //       credential: "{secret}" 
      //     }
      //   ]
      // }
    });

    

    this.socket = io("https://" + this.serviceHost);

    this.initialized = true;

    this.subscribeOnServerEvents();
  }

  // Set user data from main running context
  setUser(userInfo){
    this.user.info = UnityWebGLTools.jsonToObject(userInfo);
  }

  // Request media context to access camera and microphone
  beginMediaStream(video, audio){

    //var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    this.enabledAudio = audio;
    this.enabledVideo = video;

    navigator.mediaDevices
      .getUserMedia({
        audio: audio,
        video: video,
      })
      .then((stream) => {

        UnityWebGLTools.callUnityCallback({
          status: true,
          type: this.unityCallbackEvents.BeginMediaStreamSuccess,
          data: ""
        });

        this.user.stream = stream;
        this.processStream(this.user);
        
      }).catch((error) => {
        this.user.stream = null;

        UnityWebGLTools.callUnityCallback({
          status: true,
          type: this.unityCallbackEvents.BeginMediaStreamFailed,
          data: error.message
        });
      });
  }

  // Handle requried network events from socket and peer
  subscribeOnServerEvents(){
    this.peer.on(this.events.Open, (id) => {
      this.user.peerId = id;
    });

    this.socket.on(this.events.ConnectError, (error) => {
      console.log("ConnectError: " + error);
    });
    
    this.socket.on(this.events.Connect, () => {
      this.user.socketId = this.socket.id;

      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.ConnectedToServer,
        data: ""
      });

      this.socket.on(this.events.Disconnect, (data) => {
        this.user.peerId = null;
        this.user.socketId = null;
        this.user.stream = null;
        this.connectedToApp = false;
        this.connectedToChannel = false;
        this.joinedChannelId = null;
        this.usersInChannel = [];
      });
    });

    this.socket.on(this.events.ConnectedToApp, (data) => {
      this.connectedToApp = true;

      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.Connected,
        data: ""
      });
    });

    this.socket.on(this.events.FailedToConnectToApp, (data) => {
      this.connectedToApp = false;

      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.ConnectFailed,
        data: data.message
      });
    });

    this.socket.on(this.events.NoCCUAvailable, (data) => {
      this.connectedToApp = false;

      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.ConnectFailed,
        data: data.message
      });
    });

    this.socket.on(this.events.JoinChannel, (data) => {
      let channelId = data.id;

      this.joinedChannelId = channelId;
      this.connectedToChannel = true;

      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.JoinedChannel,
        data: ""
      });

      this.socket.emit(this.events.SetStatusOfChatFeaturesInChannel, { enabledAudio: this.enabledAudio, enabledVideo: this.enabledVideo });
    });

    this.socket.on(this.events.LeaveChannel, (data) => {
      let channelId = data.id;

      if(channelId == this.joinedChannelId){
        this.joinedChannelId = null;
        this.connectedToChannel = false;  
      }

      for(let i = 0; i < this.usersInChannel.length; i++){
        this.endStream(this.usersInChannel[i]);

        UnityWebGLTools.callUnityCallback({
          status: true,
          type: this.unityCallbackEvents.UserDisconnected,
          data: UnityWebGLTools.objectToJSON({
            id: this.usersInChannel[i].id
          })
        });

        this.usersInChannel.splice(i--, 1);
      }

      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.LeftChannel,
        data: ""
      });
    });

    this.socket.on(this.events.FailedToJoinChannel, (data) => {
      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.JoinChannelFailed,
        data: data.message
      });
    });

    this.socket.on(this.events.UsersUpdatedInChannel, (data) => {
      let users = data.users;

      for(let i = 0; i < users.length; i++){
        let user = this.getUserById(users[i].id);

        if(user == null){

          user = {
            id: users[i].id,
            peerId: users[i].peerId,
            stream: null,
            peerCall: null
          };

          if(user.id != this.user.id){
            const call = this.peer.call(user.peerId, this.user.stream);
            this.user.peerCall = call;
            call.on(this.events.Stream, (incomeStream) => {
              if(user.stream == null){
                user.stream = incomeStream;
                this.processStream(user);
              }
            });
          } else {
            this.peer.on(this.events.Call, (call) => {
              call.answer(this.user.stream);
              call.on(this.events.Stream, (incomeStream) => {
                let user = this.getUserByPeerId(call.peer);
                if(user != null){
                  user.peerCall = call;
                  if(user.stream == null){
                    user.stream = incomeStream;
                    this.processStream(user);
                  }
                }
              });
            });
          }

          this.usersInChannel.push(user);

          UnityWebGLTools.callUnityCallback({
            status: true,
            type: this.unityCallbackEvents.UserConnected,
            data: UnityWebGLTools.objectToJSON({
              id: users[i].id,
              main: users[i].id === this.user.id,
              user:  users[i].info
            })
          });
        }
      }

      let found = false;
      for(let i = 0; i < this.usersInChannel.length; i++){
        found = false;
        for(let j = 0; j < users.length; j++){
          if(this.usersInChannel[i].id === users[j].id){
            found = true;
            break;
          }
        }
        if(!found){
          this.endStream(this.usersInChannel[i]);

          UnityWebGLTools.callUnityCallback({
            status: true,
            type: this.unityCallbackEvents.UserDisconnected,
            data: UnityWebGLTools.objectToJSON({
              id: this.usersInChannel[i].id
            })
          });

          this.usersInChannel.splice(i--, 1);
        }
      }
    });

    this.socket.on(this.events.GetStateOfChannel, (data) => {
      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.ChannelStateReceived,
        data: UnityWebGLTools.objectToJSON({
          messages: data.messages
        })
      });
    });

    this.socket.on(this.events.SendMessageInChannel, (message) => {
      UnityWebGLTools.callUnityCallback({
        status: true,
        type: this.unityCallbackEvents.MessageReceived,
        data: UnityWebGLTools.objectToJSON(message)
      });
    });
  }

  // Connect to App with app key
  connect(appKey){
    if(!this.initialized)
      return;

    this.socket.emit(this.events.ConnectToApp, {
      appKey: appKey
    });
  }

  // Send message into joined channel
  sendMessageInChannel(message){
    if(!this.connectedToApp || !this.connectedToChannel)
      return;

    this.socket.emit(this.events.SendMessageInChannel, {
      message: message
    });
  }

  // Mute video
  setMuteStatusVideo(status){
    if(!this.connectedToApp || !this.connectedToChannel)
      return;

    if(this.user.stream != null){

      this.enabledVideo = status;

      let tracks = this.user.stream.getVideoTracks();

      for (let i = 0; i < tracks.length; i++) {
        tracks[i].enabled = status;
      }

      this.socket.emit(this.events.SetStatusOfChatFeaturesInChannel, { enabledAudio: this.enabledAudio, enabledVideo: this.enabledVideo });   
    }
  }

  // Mute audio
  setMuteStatusAudio(status){
    if(!this.connectedToApp || !this.connectedToChannel)
      return;

    if(this.user.stream != null){

      this.enabledAudio = status;

      let tracks = this.user.stream.getAudioTracks();

      for (let i = 0; i < tracks.length; i++) {
        tracks[i].enabled = status;
      }

      this.socket.emit(this.events.SetStatusOfChatFeaturesInChannel, { enabledAudio: this.enabledAudio, enabledVideo: this.enabledVideo });   
    }
  }

  // Set volume of an audio of specific user
  setAudioVolume(userId, volume){
    if(!this.connectedToApp || !this.connectedToChannel)
      return;

    let user = this.getUserById(userId);

    if(user != null && user.video != null){
      user.video.volume = volume;
    }
  }

  // Join channel by id with access parameters
  joinChannel(channelId, isPrivate, password){
    if(!this.connectedToApp)
      return;

    this.socket.emit(this.events.JoinChannel, {
      channelInfo: {
        id: channelId,
        private: isPrivate,
        password: password
      },
      userInfo: {
        id: this.user.id,
        peerId: this.user.peerId,
        info: this.user.info
      }
    });
  }

  // Leave joined channel
  leaveChannel(){
    if(!this.connectedToApp || !this.connectedToChannel)
      return;

    this.socket.emit(this.events.LeaveChannel, {
      channelId: this.joinedChannelId,
      userId: this.user.id
    });
  }

  // Create stream element based on <video> for specific user
  processStream(user){
    var width = this.frameSize.width / this.frameDemultiplier;
    var height = this.frameSize.height / this.frameDemultiplier;

    user.video = document.createElement("video");
    user.video.id = this.user.id;
    user.video.srcObject = user.stream;
    user.video.width = width;
    user.video.height = height;
    user.video.muted = this.user.id === user.id;

    //document.body.append(user.video);

    user.video.addEventListener("loadedmetadata", () => {
      if(user.video != null){
        user.video.play();
        user.video.addEventListener('play', () => {
          this.computeTimer(user);
        }, false);
      }
    });
  }

  // Finishes stream of a user
  endStream(user){
    if(user.video != null){
      user.peerCall.close();
      user.stream.getTracks().forEach(function(track) { track.stop(); });
      user.stream = null;
      user.video.remove();
      user.video = null;
    }
  }

  // Get frae from <video> and push to main running context
  computeFrame(user){
    var width = this.frameSize.width / this.frameDemultiplier;
    var height = this.frameSize.height / this.frameDemultiplier;

    var canvas = document.createElement("canvas");
    canvas.style.width = width;
    canvas.style.height = height;
    var context2D = canvas.getContext("2d");

    context2D.drawImage(user.video, 0, 0, width, height);

    var frame = context2D.getImageData(0, 0, width, height);
    var length = frame.data.length;
    var data = frame.data;

    UnityWebGLTools.callUnityArrayCallback(data, {
      type: this.unityArrayCallbackEvents.VideoFrameReceived,
      length: length,
      width: width,
      height: height,
      userId: user.id
    });

    frame = null;
    length = null;
    data = null;
    canvas.remove();
  }

  // Running timer for handling frame pushing based on state of <video> and frameRate
  computeTimer(user){
    if(user.video == null)
      return;

    if (user.video.paused || user.video.ended) {
      user.video.remove();
      user.video = null;
      return;
    }

    this.computeFrame(user);

    setTimeout(() => {
        this.computeTimer(user);
    }, 1000 / this.frameRate);
  }

  // Return user by id be performing find function on array
  getUserById(id){
    return this.usersInChannel.find(it => it.id === id);
  }

  // Return user by peer id be performing find function on array
  getUserByPeerId(id){
    return this.usersInChannel.find(it => it.peerId === id);
  }

  // Generates random client id for this session
  getUniqueClientId(){
    return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36);
  }
}
