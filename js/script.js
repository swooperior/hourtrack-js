// Replace the wage variable with your wage per hour.
let wage = 8.21; //per hour

var records = [];
var active = false;
var punchInTime = null;
var outT = null;
var timer;

var inMenu = $("#inMenu");;
var outMenu = $('#outMenu');
var breakMenu = $('#breakMenu');
var txt_clock = $('#clock');
var txt_timer = $('#timer');

function goActive(){
    if(active == false){
        active = true;
        inMenu.hide();
        outMenu.show();
        timer = checkTime();
    }
}
function goInactive(){
    if(active == true){
        active = false;
        inMenu.show()
        outMenu.hide()
        breakMenu.hide()
        clearTimeout(timer);
        punchInTime = null;
        outT = null;
    }
}

function punchIn(){
    punchInTime = new Date();
    goActive();
    txt_clock.html(punchInTime.toLocaleString());
    saveHours(punchInTime,null);
}
       
function punchOut(){
    outT = new Date();
    if(punchInTime != null){
        var hours = calculateHours(punchInTime,outT);
        //var wages = calculateWage(hours);
        saveHours(punchInTime,outT);
        goInactive();
        txt_clock.html("Hours: "+hours);
        txt_timer.html("&pound;"+calculateWage(hours));
    }
}


//Later.
function breakTime(startstop="start"){
    if (startstop == "start"){
        var bStart = new Date();
        breakMenu.style.display = "block";
    }else{
        var bEnd = new Date();
        breakMenu.style.display = "none";
    }
    
}
//Later.--------


function calculateWage(hours){
    return (hours*wage).toFixed(2);
}

function calculateHours(startDate,endDate, format="default"){
    var startT = startDate.getTime();
    var endT = endDate.getTime();
    var duration = endT - startT;
    var hours = (duration / (1000 * 60 * 60));
    if(format == "default"){
        return hours.toFixed(4);
    }else if(format="string"){
        var hs = Math.floor(hours);
        var ms = hours % 1;
        ms = (ms * 60).toFixed(2);
        var ss = ms % 1;
        ms = Math.floor(ms);
        ss = Math.round(ss * 60);
        return(hs+"h "+ms+"m "+ss+"s");
    } 
}

function checkTime(){
    if(punchInTime != null && active == true){
        txt_timer.html(calculateHours(punchInTime,new Date(),"string")+" | Earned: &pound;"+calculateWage(calculateHours(punchInTime,new Date())));
        timer = setTimeout(checkTime, 500);
    }
    
}

function saveHours(startDate,endDate){
    
    //Add some checking to see if end date is null in previous record
    if(endDate != null){
        var hours = calculateHours(startDate,endDate);
        var wages = calculateWage(hours);
    }else{
        var hours = null;
        var wages = null;
    }
    var record = {"start":startDate,"end":endDate,"hours":hours,"wages":wages};
    records.push(record);
    //console.log(record);
    $.ajax({
        type: "POST",
        url: "updateHours.php",
        dataType: "JSON",
        data: {"record":record},
        success: (s)=>{console.log(s)},
        error: function(e){
            console.log(e);
            //Save to local storage fallback
            if(records[records.length - 1].end == null){
                records.pop();
                records.push(record);
            }
            localStorage.setItem("records",JSON.stringify(records));
        }
});
//loadHours();
}

function loadHours(){
    var nRecords = Array();
    var hours = $.get("updateHours.php", function(response){
        if(response != null && response.length > 0){
            console.log("Res length: "+response.length);
            for(var i = 0; i < response.length; i++){      
                response[i].start = new Date(response[i].start);
                if(response[i].end != ""){
                    response[i].end = new Date(response[i].end);
                }
                nRecords.push(response[i]);
            }
            records = nRecords; 
            //records = response;
            console.log(records);
            console.log(nRecords.length);    
            if(records.length >= 1){
                if(records[records.length-1].end == ""){
                    goActive();
                    punchInTime = records[records.length-1].start;
                    txt_clock.html("Started: " +punchInTime.toLocaleString());
                    checkTime();
                }
            }
        }else{
            alert('Could not retrieve data from db, attempting to load local data.');
            var jsonData = JSON.parse(localStorage.getItem("records"));
            for(i=0;i < jsonData.length; i++){
                jsonData[i].start = new Date(jsonData[i].start);
                if(jsonData[i].end != null){
                    jsonData[i].end = new Date(jsonData[i].end);
                }
                records.push(jsonData[i]);
            }
            if(records == null){
                records = [];
            }else{
                if(records.length >= 1){
                    if(records[records.length-1].end == null){
                        goActive();
                        punchInTime = records[records.length-1].start;
                        txt_clock.html("Started: " +punchInTime.toLocaleString());
                        checkTime();
                    }
                }
            }
        }
    });
}

function report_total_earnings(){
    loadHours();
    var tWages = 0.0;
    var tHours = 0.0;
    console.log(records.length);
    if(records.length > 0){
        for(i=0;i < records.length; i++){
            if(records[i].end != null){
                tWages += parseFloat(records[i].wages);
                tHours += parseFloat(records[i].hours);
            }
        }
    }
    return {"wages":tWages,"hours":tHours};
}

function report_weekly_earnings(){
    var tWages;
    var tHours;
    var today = new Date();
    for(i = 0;i < records.length; i++){
        //find the most recent monday and start counting from there
    }
}



$( document ).ready(loadHours());
