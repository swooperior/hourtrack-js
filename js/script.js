let wage = 8.21; //per hour

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
    }else{
        outT = new Date();
        goInactive();
        if(inT != null){
           var hours = calcHours(inT,outT);
           //var wages = calcWage(hours);

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
    var //milliseconds = parseInt((duration % 1000) / 100),
    //seconds = Math.floor((duration / 1000) % 60),
    // minutes = Math.floor((duration / (1000 * 60)) % 60),
    //minutes = (duration / (1000 * 60)),
    hours = (duration / (1000 * 60 * 60));
    
    //hours = (hours < 10) ? "0" + hours : hours;
    //minutes = (minutes < 10) ? "0" + minutes : minutes;
    //seconds = (seconds < 10) ? "0" + seconds : seconds;

    //return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    return hours.toFixed(2);
}

function saveHours(startDate,endDate){
    //Add some checking to see if end date is null in previous record
    var hours = calcHours(startDate,endDate);
    var wages = calcWage(hours);
    var record = {"start":startDate,"end":endDate,"hours":hours,"wages":wages};
    return record;
}

function loadHours(){
    var request = new XMLHttpRequest;
    
}
