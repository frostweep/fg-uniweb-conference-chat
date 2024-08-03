<?php

require_once (__DIR__."/../inc/network.php");
require_once (__DIR__."/../inc/config.php");

class ApiController
{
    public static function verifyReCaptchaV2Token($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["captchaToken"])){
            $requestData = [
                "secret"   => "{secret}",
                "response" => $data["captchaToken"],
                "remoteip" => $_SERVER['REMOTE_ADDR']
            ];

            $respNet = Network::postSimple("https://www.google.com/recaptcha/api/siteverify", $requestData);

            $respNetObject = json_decode($respNet);

            $response["status"] = $respNetObject->success;
            $response["data"] = $respNetObject;
        }

        return $response;
    }
}