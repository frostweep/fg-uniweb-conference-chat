<?php

require_once (__DIR__."/../inc/config.php");
require_once (__DIR__."/../inc/db.php");
require_once (__DIR__."/crossSiteAPIController.php");

class ProductsController
{
    public static function getProducts($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["token"])){

            $userInfo = CrossSiteAPIController::getUserInfo($data["token"]);

            if($userInfo != null){
                $db = new DB();

                $db->get("products");
                $result = $db->result();

                $products = [];

                while ($product = mysqli_fetch_object($result)) {
    
                    array_push($products, [
                        "product_id" => $product->product_id,
                        "name" => $product->name,
                        "description" => $product->description,
                        "currency" => $product->currency,
                        "price" => $product->price,
                        "amount" => $product->amount,
                        "available" => $product->available,
                        "created_at" => $product->created_at
                    ]);
                }

                $response["status"] = true;
                $response["data"] = $products;
            } else {
                $response["data"] = "user not found";
            }
        }

        return $response;
    }

    public static function buyProduct($data){
        $response = [ "status" => false, "data" => "error" ];

        if(isset($data["token"])){


            $response["status"] = true;
            $response["data"] = "ok";
        }

        return $response;
    }
}