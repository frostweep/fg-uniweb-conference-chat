<?php

class Config {
    public static $server = "{server}";
    public static $db = "{database}";
    public static $user = "{user}";
    public static $pass = "{password}";

    public static $secured = false;

    public static $server_secret_key = "{secret}";
    public static $server_aud = "{aud}";
    public static $sessionValidTime = 28800;

    public static $authAPIRootURL = "{server-endpoint}";

    public static $authServerServiceCode = "{secret}";

    public static $passwordSoltHash = "{solt}";
}