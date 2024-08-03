<?php

require_once (__DIR__."/../inc/network.php");
require_once (__DIR__."/crossSiteAPIController.php");
require_once (__DIR__."/appsController.php");
require_once (__DIR__."/../inc/jwt-tool.php");
require_once (__DIR__."/../inc/config.php");

class UASPController
{
    public static function verifyInvoice($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["invoice"]) && isset($data["token"])){
            $respNet = Network::get("https://api.assetstore.unity3d.com/publisher/v1/invoice/verify.json?key=dkBEZ5tNPXcntGLApV9ILXapeFI&invoice=".$data["invoice"], [ "Content-Type" => "application/json" ]);
            $response["status"] = true;
            $response["data"] = json_decode($respNet);
        }    

        return $response;
    }

    public static function isInvoiceUsed($invoice){
        $db = new DB();

        $db->query("SELECT * FROM registered_uinvoices WHERE invoice='".$invoice."';");
        $view = $db->view();

        return count($view) > 0;
    }

    public static function verifyAndRegisterInvoice($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["invoice"]) && isset($data["token"]) && isset($data["app_id"])){

            $used = self::isInvoiceUsed($data["invoice"]);

            if(!$used){
                $tokenAccessResponse = CrossSiteAPIController::checkTokenAccess($data);

                if($tokenAccessResponse["status"] === true){

                    $verifyInvoiceResponse = self::verifyInvoice([ "invoice" => $data["invoice"], "token" => $data["token"] ]);

                    if($verifyInvoiceResponse["status"] === true){

                        $invoices = $verifyInvoiceResponse["data"]->invoices;

                        if(count($invoices) > 0){
                            for($i = 0; $i < count($invoices); $i++){
                                if($invoices[$i]->refunded == "No" && $invoices[$i]->package == "{product-name}"){
                                    AppsController::addSubscriptionCCU($data["app_id"], 90, strtotime(' + 5 years'));
                                }
                            }

                            $response["status"] = true;
                            $response["data"] = "ok";
                        } else {
                            $response["data"] = "invoice number not found";
                        }
                    } else {
                        $response["data"] = "invoice number not found";
                    }
                }
            } else {
                $response["data"] = "invoice already used";
            }
        }

        return $response;
    }
}