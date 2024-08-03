/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const axios = require('axios');

class Network {

    static get(url, headers, responseCallback, errorCallback, timeout = 300000){
        const instance = axios.create({
            baseURL: "",
            timeout: timeout,
            headers: headers
        });

        instance.get(url).then(responseCallback).catch(errorCallback);  
    }

    static post(url, headers, data, responseCallback, errorCallback, timeout = 300000){
        const instance = axios.create({
            baseURL: "",
            timeout: timeout,
            headers: headers
        });
 
        instance.post(url, data).then(responseCallback).catch(errorCallback);  
    }
}

module.exports = {
    post: function (url, headers, data, responseCallback, errorCallback, timeout = 300000){  
        Network.post(url, headers, data, responseCallback, errorCallback, timeout);
    },
    get: function(url, headers, responseCallback, errorCallback, timeout = 300000){
        Network.get(url, headers, responseCallback, errorCallback, timeout);
    }
};