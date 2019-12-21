<?php
header('Content-Type: application/json');
//Takes the current time and adds it to the json file.
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
        if($records[count($records)-1]->end == null){
           array_pop($records);
        }
    }
    array_push($records, $record);
    file_put_contents("hours.json", json_encode($records));
}

function update_record($record){
    

}