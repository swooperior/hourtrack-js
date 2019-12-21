let wage = 8.21; //per hour

var records = [];

var active = false;
var inT = null;
var outT = null;


var inMenu = document.getElementById('inMenu');
var outMenu = document.getElementById('outMenu');
var breakMenu = document.getElementById('breakMenu');
var txt_clock = document.getElementById('clock');
var txt_timer = document.getElementById('timer');



function goActive(){
    if(active == false){
        active = true;
        inMenu.style.display = "none";
        outMenu.style.display = "block";
    }
}
function goInactive(){
    if(active == true){
        active = false;
        inMenu.style.display = "block";
        outMenu.style.display = "none";
        breakMenu.style.display = "none";
    }
}

function punch(inout="in"){
    if(inout == "in"){
        inT = new Date();
        goActive();
        txt_timer.innerHTML = inT.toLocaleString();
        saveHours(inT,null);
    }else{
        outT = new Date();
        goInactive();
        if(inT != null){
           var hours = calcHours(inT,outT);
           //var wages = calcWage(hours);
            saveHours(inT,outT);
           txt_clock.innerHTML = "Hours: "+hours;
           txt_timer.innerHTML = "&pound;"+calcWage(hours);
        }
    }
}

function breakTime(startstop="start"){
    if (startstop == "start"){
        var bStart = new Date();
        breakMenu.style.display = "block";
    }else{
        var bEnd = new Date();
        breakMenu.style.display = "none";
    }
    
}

function calcWage(hours){
    var wages = (hours*wage).toFixed(2);
    return wages;
}

function calcHours(startDate,endDate){
    var startT = startDate.getTime();
    var endT = endDate.getTime();
    var duration = endT - startT;
    var hours = (duration / (1000 * 60 * 60));
    return hours.toFixed(2);
}

function saveHours(startDate,endDate){
    loadHours();
    //Add some checking to see if end date is null in previous record
    if(endDate != null){
        var hours = calcHours(startDate,endDate);
        var wages = calcWage(hours);
    }else{
        var hours = null;
        var wages = null;
    }
    var record = {"start":startDate,"end":endDate,"hours":hours,"wages":wages};
    //console.log(record);
    $.ajax({
        type: "POST",
        url: "updateHours.php",
        dataType: "JSON",
        data: {"record":record},
        error: function(e){
            console.log(e);
        }
});
}

function loadHours(){
    var hours = $.get("updateHours.php", function(response){
        if(response.length > 0){

       
        for(var i = 0; i < response.length; i++){
            var nRecords = Array();
            response[i].start = new Date(response[i].start);
            if(response[i].end != ""){
                response[i].end = new Date(response[i].end);
            }
            nRecords.push(response[i]);
        }
        records = nRecords; 
        //records = response;
        console.log(records);
        console.log(records.length);
        if(records.length >= 1){
            if(records[records.length-1].end == ""){
                goActive();
                inT = records[records.length-1].start;
                txt_clock.innerHTML = records[records.length - 1].start;
            }
        }
    }
    });
    
    
    
    
}
$( document ).ready(loadHours());
