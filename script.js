
const API_KEY = '<your_api_key>';
const SHEET_ID = '<sheet_id>';

var uniqUsers=[];
var id=window.localStorage.getItem("id");
var name = window.localStorage.getItem("name");
console.log(name);

let sinbtn=document.getElementById("sign_in_out");
function setDoc() {
    if(id=="null" || name=="null"){
  sinbtn.innerHTML=`<span class="icon"><i class="fas fa-sign-in-alt"></i></span> <span class="text"> Sign In </span>`;
    }
  
  else{
    sinbtn.innerHTML=`<span class="icon"><i class="fas fa-sign-out-alt"></i></span> <span class="text"> Sign Out </span>`;
    
    getSheet();
  }
}

setDoc();


var hamburger = document.querySelector(".hamburger");
var wrapper = document.querySelector(".wrapper");

hamburger.addEventListener("click", () => {

	hamburger.closest(".wrapper").classList.toggle("hover_collapse");
})

function openForm(){
  let lform = document.getElementsByClassName("form-container");
  let mainlfrom = document.getElementById("mForm");
  mainlfrom.style.display = "flex";
  lform[0].style.display = "flex";
  lform[1].style.display = "flex";
}

function closeForm(){
   let lform=document.getElementsByClassName("form-container");
   let mainlfrom=document.getElementById("mForm");
   mainlfrom.style.display="none";
   lform[0].style.display="none";
   lform[1].style.display="none"
  }

sinbtn.addEventListener("click",(iot)=>{
id=window.localStorage.getItem("id");
name = window.localStorage.getItem("name");

  if(id=="null" || name=="null"){
    openForm();
  }
  else{
    window.localStorage.clear();
    location.reload();
  }
  
})

document.getElementById("login").addEventListener("submit",(e)=>{
  e.preventDefault();
  let lname=document.getElementById("lname").value;
  let lid=document.getElementById("lid").value;
  
  let inputdata=[lid,lname];
let valid=uniqUsers.findIndex(subArray =>
     subArray.length === inputdata.length &&
     subArray.every((value, index) => value === inputdata[index]));
     
   if(valid!=-1){
  window.localStorage.setItem("name",lname);
  window.localStorage.setItem("id",lid);

location.reload();
   }
   
   else{
     alert("Invalid Credential");
   }
  
})

document.getElementById("signup").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Sorry! Not allowing new use r in preparation Stage");
  location.reload();
})


//set user name

function setname(){
  if(name!="null"){
    let users = document.getElementsByClassName("user");
    for (let i = 0; i < users.length; i++) {
      users[i].innerText = name;
    }
    
  }
}

setname();

const url="https://api.quotable.io/random/";
var max=70;
var newurl=`${url}?maxLength=${max}`;
function getQuote(){
  let p=fetch(newurl);
  p.then((response)=>{
    return response.json();
  }).then((value)=>{
    console.log(value);
    var q=document.querySelector(".quote");
    q.innerHTML=`<q>${value.content}</q>`;
    
  })
}

getQuote();


let n=0;
function arrObj(arr,ind) {
  var output = [];
  for (var i = 1; i < arr.length; i++) {
    var row = {};
    
    if(arr[i][ind]===id){
      console.log("found");
    
    
    for (var j = 0; j < arr[0].length; j++) {
        row[arr[0][j]] = arr[i][j];
      }
      output.push(row);
      n++;
    }
  }
  return output;
}

//showing mark cards
function showcards(obj){
  document.getElementById("n_results").innerHTML=`Total ${n} test(s)`;
  let code=``;
  let mt=0;
  let pt=0;
  let ct=0;
  
  for(i in obj){
    
    console.log(obj[i]);
    var math=parseInt(obj[i].math);
    var phy=parseInt(obj[i].phy);
    var chem=parseInt(obj[i].chem);
    
    mt=mt+math;
    pt=pt+phy;
    ct=ct+chem;
    
    var total=math+phy+chem;
    code=code+`<div class="card">
                <h1 class="card-title">${obj[i].test}</h1>
                <div class="date">${obj[i].date}</div>
                <div class="card-section">
                    <h2>Total</h2>
                    <p class="marks"  value="${total}">${total}</p>
                </div>
                <div class="card-section">
                    <h2>Math</h2>
                    <p class="marks">${math}</p>
                </div>
                <div class="card-section">
                    <h2>Physics</h2>
                    <p class="marks">${phy}</p>
                </div>
                <div class="card-section">
                    <h2>Chemistry</h2>
                    <p class="marks">${chem}</p>
                </div>
            </div>`;
  }
  document.getElementById("cards").innerHTML=code;
  
  var xValues = ["Math","Physics","Chemistry"];
var yValues = [mt/n,pt/n,ct/n];
var barColors = ["red","blue","green"];

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Average Marks"
      
    }
  }
});

}


//geting data from google sheet

function getSheet() {
let RANGE = 'Sheet1!A1:M1000';
let urls= `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  let p = fetch(urls);

  p.then((response) => {
    let data = response.json();
    return data;
  }).then((data) => {
    let dataobj = arrObj(data.values,0);
    if(dataobj.length!=0){
    showcards(dataobj);}
  }).catch(error => console.error('Error:', error));

}

function getUsers(){
  let RANGE = 'Sheet1!A1:B1000';
let urls= `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
let p = fetch(urls);

  p.then((response) => {
    let data = response.json();
    return data;
  }).then((data) => {
    let arrs=data.values;
    uniqUsers= Array.from(
      new Set(arrs.map(arr => JSON.stringify(arr)))
    ).map(str => JSON.parse(str));
    
  }).catch(error => console.error('Error:', error));
  
}
getUsers();
//getSheet();
