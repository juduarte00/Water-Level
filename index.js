// index.js
// This is our main server file

// include express
const express = require("express");
// create object to interface with express
const app = express();
const fetch = require("cross-fetch");
// Code in this section sets up an express pipeline

// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
// https://bobbyhadz.com/blog/javascript-get-number-of-days-in-month
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());
// No static server or /public because this server
// is only for AJAX requests

app.post("/query/getCAReservoir", async function(request, response, next) {
  let reservoirs = ["SHA", "ORO","CLE", "NML", "SNL", "DNP", "BER"];
  let reservoirData = [];
  let yearMonth = request.body
  console.log("Getting the California Resevoir Data!");
  // console.log("This is the request!", request);
  console.log("this is the body,", request.body);
  // Allowed to hardcode because not getting different data
  // STILL NEED TO MAKE THE DATES DYNAMIC
  // Researched and every reservoir is on sensor 15
  let daysInMonth = getDaysInMonth(yearMonth.year, yearMonth.month);
  
  for(let i = 0; i < reservoirs.length; i++) {
    // https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA&SensorNums=15&dur_code=D&Start=2022-05-01&End=2022-05-31
   let api_url = `https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=${reservoirs[i]}&SensorNums=15&dur_code=M&Start=${yearMonth.year}-${yearMonth.month}-01&End=${yearMonth.year}-${yearMonth.month}-${daysInMonth}`;
    //let api_url = "https://cdec.water.ca.gov/dynamicapp/req/JSONDataServlet?Stations=SHA&SensorNums=15&dur_code=D&Start=2022-05-01&End=2022-05-31"
    console.log("this is the api_url", api_url);
    let fetch_response = await fetch(api_url);
    let json = await fetch_response.json();
    //console.log("these are the results of json", json);
    await reservoirData.push(json);
  
    // console.log("this is the api_url", api_url);
    // let data = await fetch(api_url);
    // console.log("this is the data", data);
    // await reservoirData.push(data);
  }
  // console.log("these are the results??", reservoirData);
  response.json(reservoirData);


});

// respond to all AJAX querires with this message
app.use(function(req, res, next) {
  res.json({msg: "No such AJAX request"})
});


// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});
