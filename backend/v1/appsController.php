<?php

require_once (__DIR__."/../inc/config.php");
require_once (__DIR__."/../inc/db.php");
require_once (__DIR__."/crossSiteAPIController.php");

class AppsController
{
    public static function createApp($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["name"]) && isset($data["description"]) && isset($data["token"])){

            $userInfo = CrossSiteAPIController::getUserInfo($data["token"]);

            if($userInfo != null){
                $db = new DB();

                $app_id = self::guidv4();
                
                $db->insert("apps", [
                    "name" => $data["name"],
                    "description" => $data["description"],
                    "user_id" => $userInfo->id,
                    "app_id" => $app_id,
                    "default_ccu" => 10,
                    "subscription_ccu" => 0,
                    "created_at" => time()                    
                ]);

                $db->insert("stats", [
                    "app_id" => $app_id,
                    "history" => "[]",
                    "updated_at" => time()                    
                ]);

                $response["status"] = true;
                $response["data"] = [
                    "app_id" => $app_id
                ];
            } else {
                $response["data"] = "user not found";
            }
        }

        return $response;
    }

    public static function deleteApp($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["app_id"]) && isset($data["token"])){

            $userInfo = CrossSiteAPIController::getUserInfo($data["token"]);

            if($userInfo != null){
                $db = new DB();

                $db->delete("apps", "app_id='".$data["app_id"]."' AND user_id=".$userInfo->id.";");
                $db->delete("stats", "app_id='".$data["app_id"]."';");

                $response["status"] = true;
                $response["data"] = "ok";
            } else {
                $response["data"] = "user not found";
            }
        }

        return $response;
    }

    public static function getApps($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["token"])){

            $userInfo = CrossSiteAPIController::getUserInfo($data["token"]);

            if($userInfo != null){
                $db = new DB();

                $db->query("SELECT * FROM apps WHERE user_id=".$userInfo->id.";");
                $result = $db->result();

                $apps = [];

                while ($app = mysqli_fetch_object($result)) {

                    $db->query("SELECT current_ccu, peak_ccu, used_traffic, updated_at FROM stats WHERE app_id='".$app->app_id."';");
                    $statusResult = mysqli_fetch_object($db->result());
    
                    array_push($apps, [
                        "app_id" => $app->app_id,
                        "name" => $app->name,
                        "description" => $app->description,
                        "default_ccu" => (double)$app->default_ccu,
                        "subscription_ccu" => (double)$app->subscription_ccu,
                        "created_at" => (double)$app->created_at,
                        "stats" => [
                            "current_ccu" => (double)$statusResult->current_ccu,
                            "peak_ccu" => (double)$statusResult->peak_ccu,
                            "used_traffic" => (double)$statusResult->used_traffic,
                            //"history" => $statusResult->history,
                            "updated_at" => (double)$statusResult->updated_at
                        ]
                    ]);
                }

                $response["status"] = true;
                $response["data"] = $apps;
            } else {
                $response["data"] = "user not found";
            }
        }

        return $response;
    }

    public static function getAppById($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["token"]) && isset($data["app_id"])){

            $userInfo = CrossSiteAPIController::getUserInfo($data["token"]);

            if($userInfo != null){
                $db = new DB();

                $db->query("SELECT * FROM apps WHERE user_id=".$userInfo->id." AND app_id='".$data["app_id"]."';");
                $result = $db->result();

                $app = mysqli_fetch_object($result);

                $response["status"] = true;
                $response["data"] = [
                    "app_id" => $app->app_id,
                    "name" => $app->name,
                    "description" => $app->description,
                    "default_ccu" => (double)$app->default_ccu,
                    "subscription_ccu" => (double)$app->subscription_ccu,
                    "created_at" => (double)$app->created_at
                ];
            } else {
                $response["data"] = "user not found";
            }
        }

        return $response;
    }

    public static function addSubscriptionCCU($app_id, $amount, $endDate){
        $db = new DB();

        $db->update("apps", [ 
            "subscriptiion_ccu" => $amount,
            "subscription_end_date" => $endDate
        ],
        [
            "app_id" => $app_id
        ]);

        return true;
    }

    private static function guidv4(){
        if (function_exists('com_create_guid') === true)
            return trim(com_create_guid(), '{}');

        $data = openssl_random_pseudo_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}