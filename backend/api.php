<?php

require_once (__DIR__."/inc/config.php");
require_once (__DIR__."/v1/crossSiteAPIController.php");
require_once (__DIR__."/v1/appsController.php");
require_once (__DIR__."/v1/productsController.php");
require_once (__DIR__."/v1/apiController.php");
require_once (__DIR__."/v1/uaspController.php");

$json = file_get_contents('php://input');

if(Config::$secured){
    $json = parseData($json);
}

$decoded_json = json_decode($json, true);

echo handleAPI($decoded_json);

exit();

function handleAPI($params){
    $response = [ "status" => false, "data" => "error" ];

    if(isset($params["api"])){
        $api = $params["api"];
        $data = false;
        if(isset($params["data"])){
            $data = $params["data"];
        }

        switch($api){
            case "signIn":
                $response = CrossSiteAPIController::signIn($data);
                break;
            case "signUp":
                $response = CrossSiteAPIController::signUp($data);
                break;
            case "getUserInfo":
                $response = CrossSiteAPIController::getUserInfoAPI($data);
                break;       
            case "checkAccess":
                $response = CrossSiteAPIController::checkTokenAccess($data);
                break;
            case "resetPassword":
                $response = CrossSiteAPIController::resetPassword($data);
                break;
            case "createApp":
                $response = AppsController::createApp($data);
                break;
            case "deleteApp":
                $response = AppsController::deleteApp($data);
                break;
            case "getApps":
                $response = AppsController::getApps($data);
                break;
            case "getAppById":
                $response = AppsController::getAppById($data);
                break;
            case "getProducts":
                $response = ProductsController::getProducts($data);
                break;
            case "buyProduct":
                $response = ProductsController::buyProduct($data);
                break;
            case "validateCaptcha":
                $response = ApiController::verifyReCaptchaV2Token($data);
                break;
            case "registerVoucher":
                $response = UASPController::verifyAndRegisterInvoice($data);
                break;
        }
    }
    return json_encode($response);
}

function parseData($data) {

    if(strlen($data) > 0) {
        $firstCount = 6;
        $lastCount = 12;

        $lastString = substr($data, strlen($data) - $lastCount);
        $firstString = substr($data, 0, $firstCount);

        $data = ($lastString.substr($data, $firstCount, strlen($data) - ($firstCount + $lastCount)).$firstString);

        $data = base64_decode($data);

        return $data;
    }

    return "error";
}