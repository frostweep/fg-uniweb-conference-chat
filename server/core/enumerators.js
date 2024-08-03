/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const NetworkEvent = {
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

    Connection: "connection",
    Disconnect: "disconnect"
}

module.exports = {
    NetworkEvent: NetworkEvent,
};