/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

class UnityWebGLTools {
    static callUnityCallback(object){ document.callUnityCallback(object); }

    static callUnityArrayCallback(data, info){ document.callUnityArrayCallback(data, info); }

    static objectToJSON(object){ return JSON.stringify(object); }

    static jsonToObject(json){ return JSON.parse(json); }

    static getPtrFromString(str) { return document.getPtrFromString(str);  }

    static getStringFromPtr(ptr) { return document.getStringFromPtr(ptr); }

    static isMobileDevice() { return !!(/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent || '')); }

    static isEdge() { return navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob); }

    static isOpera() { return !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; }

    static isFirefox() { return navigator.userAgent.toLowerCase().indexOf('firefox') > -1 && ('netscape' in window) && / rv:/.test(navigator.userAgent); }

    static isSafari() { return /^((?!chrome|android).)*safari/i.test(navigator.userAgent); }

    static isChrome() { return !!window.chrome && !isOpera; }
    
    static isIE() { return typeof document !== 'undefined' && !!document.documentMode && !isEdge; }
}