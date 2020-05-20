
let globalVar = {
    form:                           //form object refers to converter form
    {
        url: 'https://api.exchangeratesapi.io/latest?base=USD', //base value in api refers to currency selected in "from" list
        selectElements: document.getElementsByTagName("select"), //represent two drop-down lists "from" and "to"
        valueElement: document.getElementById("inputValueId"), //input field we enter number toconvert
        buttonElement: document.getElementById("buttonConvert") // "convert" button
    },
    listsArray: 
    [
    {
        url: 'https://api.exchangeratesapi.io/latest', //api for latest exchange rates
        divList: document.getElementById("todayDataId")   //list is shown in this div
    },
    {
        sevenDaysms: new Date(new Date().getTime()-604800000), //represents date week ago from current day, 604800000ms represents 7days in ms
        get url() { return 'https://api.exchangeratesapi.io/'+`${this.sevenDaysms.getFullYear()}`+'-'+`${this.sevenDaysms.getMonth()+1}`+'-'+`${this.sevenDaysms.getDate()}`}, //api for exchange rates for 7 days ago
        //log() { console.log(this.url)},
        divList: document.getElementById("weekAgoDataId") //list is shown in this div
    }
    ]
    
}

//globalVar.listsArray[1].log();

//when "from" list is change, api from "form" object is changed accordingly
// so I can loop through that data and use some later as "constant" param in "convert" function
globalVar.form.selectElements[0].addEventListener('change', function(e){
    console.log("event");
    let selectedTxt = globalVar.form.selectElements[0].value;
    globalVar.form.url = 'https://api.exchangeratesapi.io/latest?base='+selectedTxt;
    //console.log(globalVar.form.url);
});

function convert(value, constant){ //value refers to value someone is actually converting
    document.getElementById("resultId").innerText = value * constant;
    console.log("result from conversion:",document.getElementById("resultId").value )
};

//when data is fetched with getData function I am looping through [k,v] where k is currency name
//and v is number / k I am searhing for is the one selcted in "to" drop-down list and it's v 
// is used as constant in convert function
globalVar.form.buttonElement.addEventListener('click', (e) => {
    getData(globalVar.form.url)
    .then( (data) => {
        let selectedTxtTo = globalVar.form.selectElements[1].value;
        for(let [k, v] of Object.entries(data.rates)) {
            if( k == selectedTxtTo){
                convert( globalVar.form.valueElement.value, v);
                //console.log(globalVar.form.valueElement.value, "v:",v);
            }
        }
    })
})


//geting data as xhttp.response (if resolve is trrigered)
function getData(url){
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', url, true);
        xhttp.onload = function(){
            if(xhttp.status == 200){
                resolve(JSON.parse(xhttp.response));
                //console.log(xhttp);
                //console.log(xhttp.response);
            }
            else{
                reject(xhttp.statusText);
            }
        }
        xhttp.send();
    })
}

//making <select> values for both "from" and "to" drop-down lists
getData(globalVar.form.url)
.then( (data) => {
    //console.log("list:",data);
    for(let i=0; i<globalVar.form.selectElements.length ;i++){
        for(let k of Object.keys(data.rates)) {
            globalVar.form.selectElements[i].innerHTML += '<option value="'+k+'"'+'>'+k+'</option>';
            //console.log("k:",k);
        }
    }
})
.catch( (err) => {
    console.log("error occured" + err);
});

// this is used for making 2 Exchange rates lists
function makeLists(url, listElement){
getData(url)
.then( (data) => {
    console.log(data);
    
    for(let [k, v] of Object.entries(data.rates)) {
        listElement.innerText += k + " " + v + "\n";
    }
})
.catch( (err) => {
    console.log("error occured" + err);
});
}

globalVar.listsArray.forEach( (element) => makeLists(element.url, element.divList) );



