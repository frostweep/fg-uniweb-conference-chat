/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const fs = require('fs');

const PRODUCTION = false;

function log(message, type = "verbose"){
    if(PRODUCTION)
        writeToFile(type + ": " + message);
    else
        console.log(type + ": " + message);
}

function writeToFile(message){
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const todayStringified = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
    const dirPath = __dirname + "/../logs";

    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath);
    }

    let pathToFile = dirPath + "/log_" + todayStringified + ".txt";
    let time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    fs.appendFile(pathToFile, ('[' + time + '] ' + message) + "\n", function (err) {
        if (err){
            console.exception(err);
        }
    });
}

module.exports = {
    log: log
}