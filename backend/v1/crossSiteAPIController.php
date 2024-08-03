<?php

require_once (__DIR__."/../inc/network.php");
require_once (__DIR__."/../inc/config.php");
require_once (__DIR__."/../inc/jwt-tool.php");

class CrossSiteAPIController
{
    public static function signIn($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["email"]) && isset($data["password"])){
            $requestData = [
                "api" => "signIn",
                "data" => [
                    "email" => $data["email"],
                    "password" => $data["password"],
                ]
            ];
            $json = json_encode($requestData);

            $respNet = Network::post(Config::$authAPIRootURL, [ "Content-Type" => "application/json" ], $json);

            $respNetObject = json_decode($respNet);

            $response["status"] = $respNetObject->status;
            $response["data"] = $respNetObject->data;
        }

        return $response;
    }

    public static function signUp($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["email"]) && isset($data["password"])){
            $requestData = [
                "api" => "signUp",
                "data" => [
                    "email" => $data["email"],
                    "password" => $data["password"],
                ]
            ];
            $json = json_encode($requestData);

            $respNet = Network::post(Config::$authAPIRootURL, [ "Content-Type" => "application/json" ], $json);

            $respNetObject = json_decode($respNet);

            $response["status"] = $respNetObject->status;
            $response["data"] = $respNetObject->data;
        }

        return $response;
    }

    public static function resetPassword($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["email"])){
            $requestData = [
                "api" => "resetPassword",
                "data" => [
                    "email" => $data["email"]
                ]
            ];
            $json = json_encode($requestData);

            $respNet = Network::post(Config::$authAPIRootURL, [ "Content-Type" => "application/json" ], $json);

            $respNetObject = json_decode($respNet);

            $response["status"] = $respNetObject->status;
            $response["data"] = $respNetObject->data;
        }

        return $response;
    }

    public static function checkTokenAccess($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["token"])){
            $requestData = [
                "api" => "checkAccess",
                "data" => [
                    "token" => $data["token"]
                ]
            ];
            $json = json_encode($requestData);

            $respNet = Network::post(Config::$authAPIRootURL, [ "Content-Type" => "application/json" ], $json);

            $respNetObject = json_decode($respNet);

            $response["status"] = $respNetObject->status;
            $response["data"] = $respNetObject->data;
        }

        return $response;
    }

    public static function getUserInfoAPI($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["token"])){
            $responseData = self::getUserInfo($data["token"]);

            $response["status"] = $responseData != null;
            $response["data"] = $responseData != null ? $responseData : "error";
        }

        return $response;
    }

    public static function getUserInfo($token){
        $requestData = [
            "api" => "getUserInfo",
            "data" => [
                "token" => $token
            ]
        ];
        $json = json_encode($requestData);

        $respNet = Network::post(Config::$authAPIRootURL, [ "Content-Type" => "application/json" ], $json);

        $respNetObject = json_decode($respNet);

        if($respNetObject->status === true);
            return $respNetObject->data;

        return null;
    }

    public static function getUserInfoById($userId){
        $requestData = [
            "api" => "getUserInfoById",
            "data" => [
                "user_id" => $userId,
                "service_code" => Config::$authServerServiceCode
            ]
        ];
        $json = json_encode($requestData);

        $respNet = Network::post(Config::$authAPIRootURL, [ "Content-Type" => "application/json" ], $json);

        $respNetObject = json_decode($respNet);

        if($respNetObject->status === true);
            return $respNetObject->data;

        return null;
    }
}