import React from 'react';
import './App.css';
import { useEffect, useState } from "react";
import useAsyncFetch from './useAsyncFetch'; // a custom hook
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import MonthYearPicker from 'react-month-year-picker';

function ButtonComponent(props) {
  console.log("this is the bool that we got", props.bool);
  if (props.bool) {
    return <button onClick={() => props.setButton(false)}>See less</button>
  }
  return <button onClick={() => props.setButton(true)}>See more</button>
};

function WaterChart(props){
  const nicknames = new Map();
  nicknames.set(0, 'Shasta');
  nicknames.set(1, 'Oroville');
  nicknames.set(2, 'Trinity Lake');
  nicknames.set(3, 'New Melones');
  nicknames.set(4, 'San Luis');
  nicknames.set(5, 'Don Pedro');
  nicknames.set(6, 'Berryessa');

  if (props.reservoirData) {
    let n = props.reservoirData.length;
    console.log(props.reservoirData);

    // objects containing row values
    let currentObj = {label: "current",data: [], backgroundColor: ["rgb(66,145,152)"]}
    let totalObj = {label: "total", data: [4552000, 3537577, 2447650, 2400000, 2041000, 2030000, 1602000], backgroundColor: ["#78c7e3"]}
    let labels = [];
    for (let i=0; i<n; i++) {
      currentObj.data.push(props.reservoirData[i][0].value);
      //totalObj.data.push(props.reservoirData[i][0].value);
      labels.push(nicknames.get(i));
    }

  let userData = {};
  userData.labels = labels;
  userData.datasets = [currentObj, totalObj];


console.log("userData: ", userData);
let options = {
  plugins: {
    title: {
      display: true,
      text: '',
    },
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      
      stacked: true,
      grid: {
        display: false,
      }
    },
    y: {
      grid: {
        display: false,

      }
    }
  }
};
      return (
        <div id="chart" style={{height: 450}}>
          <Bar options={options} data={userData} />
        </div>
      )
  }
}

function InfoComponent(props) {
  const [reservoirData, setReservoirData] = useState([]);
  // Going to initialize with random values
  const [year, setYear] = useState(2022);
  const [month, setMonth] = useState(4);
  
  function setData (data) {setReservoirData(data);};
  function catchError(error) {console.log(error);};
  useEffect(() => {
     useAsyncFetch("query/getCAReservoir", {"year": year, "month": month}, setData, catchError);
  },[year, month]);
  
  // useAsyncFetch("query/getCAReservoir", {"year": year, "month": month}, setData, catchError);


//   // Make sure before we open up the Info componenet that we have toggled the
//   // button AND have reservoir data to show
  if(props.see && reservoirData) {
    console.log("This is the reservoir data", reservoirData);
    return (
      <div className = "moreData">
        <div className = "chart">
          <WaterChart reservoirData={reservoirData}> </WaterChart>
         </div>   
       <div className = "chart"> 
        <p>
Here's a quick look at some of the data on reservoirs from the <a     href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
        </p>
        <div className = "changeMonth">
          Change Month:
          <div className="monthYearPicker">
            <MonthYearPicker
              selectedMonth={month}
              selectedYear={year}
              minYear={2000}
              maxYear={2022}
              onChangeYear={(newYear) => setYear(newYear)}
              onChangeMonth={(newMonth) => setMonth(newMonth)}
              >
            </MonthYearPicker>
          </div>
        </div>  
       </div>
      </div>
      
    );}
  // Else return nothing
  return <></>


  
}

function App() {
  const [seeButton, setSeeButton] = useState(false)

  return (
    <main>
      <div className="title">Water storage in California reservoirs</div>
        <div className = "body">
          <div className = "text_container">   
            <p>
              California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
            </p>
            <p>
              California's managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
            </p>
            <div className = "see_more_button">
              <ButtonComponent bool={seeButton} setButton = {setSeeButton}> </ButtonComponent>
            </div>
          </div>
          <div className = "img_container">
            <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg"/>
          <div className = "imgcaption"> Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought. </div>
          </div>
      </div>
      
      <InfoComponent see = {seeButton}></InfoComponent>
      
    </main>
  );

};


export default App;