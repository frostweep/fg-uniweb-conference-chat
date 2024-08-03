/*
    UNI WEB CONFERENCE PRO
    CURRENT VERSION 1.0.0
    POWERED BY FROSTWEEP GAMES
    PROGRAMMER ARTEM SHYRIAIEV
    LAST UPDATE AUGUST 06 2022
*/

const network = require("./../inc/network");

class ApiController {

    constructor(server, db){
        this.server = server;
        this.db = db;
        this.apiEndPoint = "{server-endpoint}";
    }

    testAPI(callback){
        let data = {
            api: "test",
            data: {}
        };

        network.post(ApiController.ApiEndPoint, [ "Content-Type: application/json" ], JSON.stringify(data), 
                     (response) => {
                        if(callback != null)
                            callback(response.data.status);
                     },
                     (error) => {
                        if(callback != null)
                            callback(false);
                     });
    }

    getAppInfoByAppKey(appKey, callback){
        this.db.query("SELECT app_id, default_ccu, subscription_ccu FROM apps WHERE app_id=" + this.db.escape(appKey), (result) => {
            if(callback != null)
                callback(result[0]);
        });
    }

    isAppExistsWithAppKey(appKey, callback){
        if(this.server.apps.filter(it => it.appKey == appKey).length > 0){
            if(callback != null)
                callback(true);
            return;
        }

        this.db.query("SELECT id FROM apps WHERE active='true' AND app_id=" + this.db.escape(appKey), (result) => {
            if(callback != null)
                callback(result.length > 0);
        });
    }

    refreshCurrentCCUAmountForApp(appKey, stats){

        let ccu = stats.currentCCU;
        let used_traffic_by_app = stats.usedTraffic;
        let peak_ccu_by_app = stats.peakCCU;

        this.db.query("SELECT * FROM stats WHERE app_id='" + appKey + "'", (result) => {

            let statInfo = result[0];

            let peak_ccu = statInfo.peak_ccu;
            let history = JSON.parse(statInfo.history);
            let used_traffic = statInfo.used_traffic + used_traffic_by_app;

            history.push({
                current_ccu: statInfo.current_ccu,
                created_at: statInfo.updated_at
            })

            if(peak_ccu_by_app > peak_ccu)
                peak_ccu = peak_ccu_by_app;

            this.db.update("stats", {
                current_ccu: ccu,
                peak_ccu: peak_ccu,
                used_traffic: used_traffic,
                history: JSON.stringify(history).replace(/"/g, '\\"'),
                updated_at: parseInt((new Date().getTime() / 1000).toFixed(0))
            }, {
                app_id: appKey
            });
        });
    }
}

module.exports = {
    ApiController : ApiController
};