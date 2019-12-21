<?php
//Takes the current time and adds it to the json file.
$file = file_get_contents("hours.json");
$hours = json_decode($file);

if(!isset($_GET["action"])){
    print_r(json_encode($file));
}else{
    switch($_GET["action"]){
        case("in"):
            //Do in action
        case("out"):
            //Do out action              
    }
}