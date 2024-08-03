<?php

require_once (__DIR__."/../inc/db.php");
require_once (__DIR__."/../inc/config.php");
require_once (__DIR__."/../v1/GameSettingsController.php");

service();

function service() {
    $db = new DB();

    $db->query("SELECT id, update_date FROM service ORDER BY id DESC LIMIT 1;");

    if(mysqli_num_rows($db->result()) > 0){
        $result = $db->view();

        if(getTodayMidnight() > $result["update_date"]){
            doService();
        } else {
            echo "service already done";
        }
    } else {
        doService();
    }
}

function doService(){
    echo "start service";
    echo cleanupSessions();

    $db = new DB();
    $db->insert("service", [ "update_date" => getTodayMidnight() ]);

    echo "<br />service ended";
}

function getTodayMidnight(){
    return date_create( date('Y-m-d'), timezone_open( 'UTC' ) )->getTimestamp();
}

function cleanupSessions(){
    return "<br />sessions refreshed successfully";
}