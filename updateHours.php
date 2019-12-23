<?php
error_reporting(0);

header('Content-Type: application/json');

$furi = "hours.json";
$file = file_get_contents($furi);
$records = json_decode($file);


if(!isset($_GET["action"])){
    
    if(isset($_POST["record"])){
        $record = $_POST["record"];
        save_record($records,$record);




    }else{
        echo(json_encode($records));
    }
}else{
    switch($_GET["action"]){
        case("in"):
            //Do in action
            
        case("out"):
            //Do out action              
    }
}

function save_record($records,$record){
    
    if(count($records) > 0){
        if($records[count($records)-1]->end == ""){
            //If the end date of the last record saved was not defined, 
            //pop this record from the array so it is not duplicated.
           array_pop($records);
        }
    }
    //Push this record to the records array
    array_push($records, $record);
    //Overwrite the entire contents of the json file with the updated records array.
    file_put_contents("hours.json", json_encode($records));
}