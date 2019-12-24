// Replace the wage variable with your wage per hour.
let wage = 8.21; //per hour

var records = [];
var active = false;
var punchInTime = null;
var punchOutTime = null;
var timer;

var inMenu = $("#inMenu");;
var outMenu = $('#outMenu');
var breakMenu = $('#breakMenu');
var txt_clock = $('#clock');
var txt_timer = $('#timer');
var txt_report = $('#report');

function goActive(){
    if(active == false){
        active = true;
        inMenu.hide();
        outMenu.show();
        txt_report.hide();
        timer = checkTime();
    }
}
function goInactive(){
    if(active == true){
        active = false;
        inMenu.show()
        outMenu.hide()
        breakMenu.hide()
        txt_report.show();
        clearTimeout(timer);
        punchInTime = null;
        punchOutTime = null;
    }
}

function punchIn(){
    punchInTime = new Date();
    goActive();
    txt_clock.html(punchInTime.toLocaleString());
    saveHours(punchInTime,null);
}
       
function punchOut(){
    punchOutTime = new Date();
    if(punchInTime != null){
        var hours = calculateHours(punchInTime,punchOutTime);
        //var wages = calculateWage(hours);
        saveHours(punchInTime,punchOutTime);
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
        txt_timer.html(calculateHours(punchInTime,new Date(),"string")+" | &pound;"+calculateWage(calculateHours(punchInTime,new Date())));
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
        dataType: "json",
        data: {"record":record},
        success: (s)=>{console.log(s+" Success!")},
        error: function(e,x){
            console.log(x+" Error!");
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
    var nRecords = [];
    var hours = $.get("updateHours.php", function(response){
        console.log(response);
        if(response != null){
            console.log('Loading from Ajax');
            if(response.length > 0){
                console.log("Res length: "+response.length);
                for(var i = 0; i < response.length; i++){      
                    response[i].start = new Date(response[i].start);
                    if(response[i].end != ""){
                        response[i].end = new Date(response[i].end);
                    }
                    nRecords.push(response[i]);
                }
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
        }
    }).fail((response) =>{
        console.log('Loading from LocalStorage');
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
    });
}

function reportTotalEarnings(){
    var tWages = 0.0;
    var tHours = 0.0;
    console.log(records.length);
    if(records.length > 0){
        for(i=0;i < records.length; i++){
            if(records[i].end != ""){
                console.log(records[i].end);
                tWages += parseFloat(records[i].wages);
                tHours += parseFloat(records[i].hours);
            }
        }
    }
    return {"wages":tWages.toFixed(2),"hours":tHours.toFixed(2)};
}

function reportWeeklyEarnings(){
    
    var tWages = 0.0;
    var tHours = 0.0;
    var recordCopy = records.reverse();
    var today = new Date();
    var from = getLastSunday(today);
    console.log(from);
    var thisWeek = [];

    for(i=0;i < recordCopy.length;i++){

        if(recordCopy[i].start > from && recordCopy[i].start < today){
            if(records[i].end != ""){
                tWages += parseFloat(records[i].wages);
                tHours += parseFloat(records[i].hours);
            }
        }
    }
    from.setDate(from.getDate() + 1);
    return {"wages":tWages.toFixed(2),"hours":tHours.toFixed(2),"from":from};    
}

function getLastSunday(d) {
    var t = new Date(d);
    t.setDate(t.getDate() - t.getDay());
    //set time of t to 11:59:59pm
    t.setHours(23,59,59,0);
    return t;
  }

var oldHtml;

function generateWeeklyReport(){
    loadHours();
    var report_data = reportWeeklyEarnings();
    oldHtml = txt_report.html();
    txt_report.html('Week start:<br>'+report_data.from.toLocaleDateString()+'<br>Hours worked this week: '+report_data.hours+'<br>Wages earned: &pound;'+report_data.wages+'<br><button onClick="closeReport()">Close Report</button>');
}

function closeReport(){
    txt_report.html(oldHtml);
}


$( document ).ready(()=>{
loadHours();


});
