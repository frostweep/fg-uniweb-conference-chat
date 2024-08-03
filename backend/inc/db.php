<?php

require_once (__DIR__."/config.php");

class DB {
    private  $selectDb;
    private  $query;
    private  $result;
    private  $row;
    private  $object;
    private  $jumlah;
    private  $_connection;

    private static $_instance; //The single instance

    public static function getInstance() {
        if ( ! self::$_instance ) { // If no instance then make one
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function getConnection() {
        return $this->_connection;
    }

    function __construct() {
        $this->_connection = mysqli_connect( Config::$server, Config::$user, Config::$pass, Config::$db ) or die ( "Could not Connect" );;
    }

    function result() {
        return $this->result;
    }

    function query( $query ) {
        $this->result = mysqli_query( $this->_connection, $query );
    }

    function view() {
        $this->row = mysqli_fetch_assoc( $this->result );

        return $this->row;
    }

    function object() {
        $this->object = mysqli_fetch_object( $this->result );

        return $this->object;
    }

    function getJumlah() {
        $this->jumlah = mysqli_num_rows( $this->result );

        return $this->jumlah;
    }

    function get( $table ) {
        $this->result = mysqli_query( $this->_connection, "SELECT * FROM " . $table );
    }

    function getJumlahFromTable( $table ) {
        $this->get( $table );

        return $this->getJumlah();
    }

    function insert( $table, $data ) {
        $row   = array();
        $nilai = array();

        foreach ( $data as $kolom => $value ) {
            $row[]   = $kolom;
            $nilai[] = "'" . $value . "'";
        }

        $sql  = "INSERT INTO " . $table . "(" . implode( ',', $row ) . ") VALUES (" . implode( ',', $nilai ) . ")";

        $this->query( $sql );
    }

    function update( $table, $data, $where ) {

        foreach ( $data as $kolom => $row ) {
            $set[] = $kolom . "='" . $row . "'";
        }
        if (is_array($where)) {
            $where = implode(" AND ", $where);
        }
        $set   = implode( ',', $set );
        $query = "UPDATE " . $table . " SET " . $set . " WHERE " . $where;

        $this->query( $query );
    }

    function delete( $table, $where ) {
        $this->query( "DELETE FROM " . $table . " WHERE " . $where );
    }

    function escape_string($str) {
        return mysqli_real_escape_string($this->_connection, $str);
    }

    function getLastInsertedId(){
        return mysqli_insert_id($this->_connection);
    }
}