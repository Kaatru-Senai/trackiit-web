import React, { useEffect, useRef, useState } from "react";
import {
  TileLayer,
  Marker,
  Popup,
  MapContainer,
  Tooltip,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import busIcon from "../assets/icons8-bus-48.png";
import PassedIcon from "../assets/marker-svgrepo-com.svg";
import UpcomingIcon from "../assets/marker-svgrepo-com (1).svg";
import data, { bus2Data } from "../mockapi";
import * as geolib from "geolib";

function LiveMap({route}) {
  const mapRef = useRef();
  const taramaniRoute = [
    [12.98826, 80.22327],
    [12.98857, 80.2233],
    [12.98867, 80.22331],
    [12.98888, 80.22334],
    [12.98907, 80.22336],
    [12.98909, 80.22336],
    [12.98912, 80.22337],
    [12.98914, 80.22337],
    [12.98915, 80.22338],
    [12.98921, 80.22345],
    [12.98927, 80.2235],
    [12.9893, 80.22353],
    [12.98933, 80.22357],
    [12.98937, 80.22361],
    [12.98941, 80.22366],
    [12.98943, 80.2237],
    [12.98945, 80.22374],
    [12.98946, 80.22377],
    [12.98947, 80.2238],
    [12.98948, 80.22384],
    [12.98949, 80.2239],
    [12.9895, 80.22413],
    [12.98951, 80.22425],
    [12.98953, 80.22455],
    [12.98954, 80.22464],
    [12.98957, 80.22475],
    [12.98963, 80.22493],
    [12.98964, 80.22498],
    [12.98969, 80.22508],
    [12.98981, 80.2253],
    [12.98984, 80.22535],
    [12.98986, 80.22538],
    [12.99006, 80.22577],
    [12.99007, 80.22582],
    [12.99008, 80.22588],
    [12.99008, 80.22594],
    [12.99007, 80.226],
    [12.99001, 80.22623],
    [12.99, 80.22628],
    [12.99, 80.22642],
    [12.99, 80.22653],
    [12.99006, 80.22685],
    [12.99018, 80.22732],
    [12.99021, 80.22754],
    [12.99023, 80.22762],
    [12.99028, 80.22791],
    [12.99032, 80.22811],
    [12.99037, 80.22828],
    [12.99039, 80.22835],
    [12.99047, 80.22863],
    [12.99058, 80.22899],
    [12.99076, 80.22958],
    [12.99082, 80.2299],
    [12.99085, 80.23017],
    [12.99091, 80.23115],
    [12.99091, 80.23123],
    [12.99097, 80.23184],
    [12.99098, 80.23193],
    [12.99101, 80.23202],
    [12.99108, 80.23234],
    [12.99123, 80.23287],
    [12.99145, 80.23358],
    [12.99146, 80.23357],
    [12.99147, 80.23357],
    [12.99148, 80.23357],
    [12.99149, 80.23356],
    [12.9915, 80.23356],
    [12.99151, 80.23356],
    [12.99152, 80.23356],
    [12.99153, 80.23356],
    [12.99154, 80.23357],
    [12.99155, 80.23357],
    [12.99156, 80.23357],
    [12.99157, 80.23357],
    [12.99158, 80.23358],
    [12.99159, 80.23358],
    [12.9916, 80.23359],
    [12.99161, 80.2336],
    [12.99162, 80.23361],
    [12.99163, 80.23362],
    [12.99164, 80.23363],
    [12.99164, 80.23364],
    [12.99165, 80.23365],
    [12.99165, 80.23366],
    [12.99166, 80.23367],
    [12.99166, 80.23368],
    [12.99166, 80.23369],
    [12.99166, 80.2337],
    [12.99166, 80.23372],
    [12.99166, 80.23375],
    [12.99165, 80.23378],
    [12.99163, 80.23381],
    [12.99161, 80.23384],
    [12.99159, 80.23384],
    [12.99159, 80.23385],
    [12.99158, 80.23385],
    [12.99157, 80.23386],
    [12.99156, 80.23386],
    [12.99155, 80.23386],
    [12.99154, 80.23387],
    [12.99153, 80.23387],
    [12.99152, 80.23387],
    [12.99151, 80.23387],
    [12.9915, 80.23387],
    [12.99149, 80.23387],
    [12.99148, 80.23387],
    [12.99147, 80.23386],
    [12.99146, 80.23386],
    [12.99145, 80.23386],
    [12.99144, 80.23385],
    [12.99143, 80.23384],
    [12.99142, 80.23383],
    [12.99141, 80.23383],
    [12.9914, 80.23382],
    [12.9914, 80.23381],
    [12.99139, 80.2338],
    [12.99138, 80.23379],
    [12.99138, 80.23378],
    [12.99137, 80.23377],
    [12.99137, 80.23376],
    [12.99137, 80.23375],
    [12.99137, 80.23374],
    [12.99137, 80.23373],
    [12.99136, 80.23372],
    [12.99136, 80.23371],
    [12.99137, 80.2337],
    [12.99137, 80.23369],
    [12.99137, 80.23368],
    [12.99137, 80.23367],
    [12.99138, 80.23366],
    [12.99138, 80.23365],
    [12.99119, 80.23362],
    [12.9911, 80.23359],
    [12.99095, 80.23355],
    [12.9909, 80.23354],
    [12.99073, 80.23348],
    [12.99064, 80.23344],
    [12.99048, 80.23338],
    [12.99041, 80.23335],
    [12.99041, 80.23336],
    [12.99042, 80.23341],
    [12.99041, 80.23336],
    [12.99041, 80.23335],
    [12.99006, 80.23319],
    [12.98979, 80.23311],
    [12.98954, 80.23303],
    [12.9895, 80.23301],
    [12.98929, 80.23296],
    [12.98919, 80.23295],
    [12.98906, 80.23292],
    [12.98884, 80.23289],
    [12.9886, 80.23287],
    [12.98854, 80.23289],
    [12.98849, 80.23291],
    [12.98844, 80.23292],
    [12.98838, 80.23293],
    [12.98828, 80.23296],
    [12.98819, 80.23298],
    [12.98817, 80.23298],
    [12.98792, 80.23305],
    [12.98745, 80.2332],
    [12.98739, 80.23325],
    [12.98735, 80.23326],
    [12.9873, 80.23328],
    [12.98724, 80.23328],
    [12.98722, 80.23328],
    [12.98718, 80.23328],
    [12.98696, 80.23328],
    [12.98678, 80.23328],
    [12.98669, 80.23328],
    [12.98642, 80.23331],
    [12.98626, 80.23333],
    [12.98614, 80.23337],
    [12.9861, 80.23375],
    [12.9861, 80.23382],
    [12.98609, 80.23396],
    [12.9861, 80.23402],
    [12.98613, 80.23438],
    [12.98614, 80.23448],
    [12.98616, 80.23452],
    [12.98624, 80.23472],
    [12.98629, 80.23482],
    [12.98634, 80.23491],
    [12.98641, 80.23504],
    [12.98647, 80.2352],
    [12.98649, 80.23525],
    [12.9865, 80.23528],
    [12.98652, 80.23535],
    [12.98659, 80.23559],
    [12.98661, 80.23592],
    [12.98661, 80.23612],
    [12.98662, 80.23634],
    [12.98663, 80.23646],
    [12.98664, 80.23689],
    [12.98665, 80.23717],
    [12.98666, 80.23732],
    [12.98666, 80.23735],
    [12.98666, 80.23745],
    [12.98666, 80.23757],
    [12.98667, 80.23789],
    [12.98667, 80.23795],
    [12.98668, 80.23815],
    [12.9867, 80.23873],
    [12.9867, 80.23877],
    [12.98671, 80.23893],
    [12.98672, 80.23917],
    [12.98673, 80.23931],
    [12.98674, 80.23933],
    [12.98674, 80.23934],
    [12.98676, 80.23936],
    [12.98677, 80.23937],
    [12.98678, 80.23938],
    [12.9868, 80.23938],
    [12.98716, 80.23942],
    [12.98717, 80.23969],
    [12.98718, 80.23995],
    [12.98718, 80.24008],
    [12.98716, 80.24026],
    [12.98712, 80.24047],
    [12.9871, 80.24063],
    [12.9871, 80.24069],
    [12.98711, 80.24071],
    [12.98697, 80.2407],
    [12.98682, 80.24071],
    [12.98674, 80.24071],
    [12.98669, 80.2407],
    [12.98663, 80.24068],
    [12.98658, 80.24064],
    [12.98653, 80.24058],
    [12.9865, 80.24052],
    [12.98647, 80.2404],
    [12.98646, 80.24033],
    [12.98642, 80.23968],
  ];
  const polylineCoords = [
    [12.98826, 80.22327],
    [12.98857, 80.2233],
    [12.98867, 80.22331],
    [12.98888, 80.22334],
    [12.98907, 80.22336],
    [12.98909, 80.22336],
    [12.98912, 80.22337],
    [12.98914, 80.22337],
    [12.98915, 80.22338],
    [12.98921, 80.22345],
    [12.98927, 80.2235],
    [12.9893, 80.22353],
    [12.98933, 80.22357],
    [12.98937, 80.22361],
    [12.98941, 80.22366],
    [12.98943, 80.2237],
    [12.98945, 80.22374],
    [12.98946, 80.22377],
    [12.98947, 80.2238],
    [12.98948, 80.22384],
    [12.98949, 80.2239],
    [12.9895, 80.22413],
    [12.98951, 80.22425],
    [12.98953, 80.22455],
    [12.98954, 80.22464],
    [12.98957, 80.22475],
    [12.98963, 80.22493],
    [12.98964, 80.22498],
    [12.98969, 80.22508],
    [12.98981, 80.2253],
    [12.98984, 80.22535],
    [12.98986, 80.22538],
    [12.99006, 80.22577],
    [12.99007, 80.22582],
    [12.99008, 80.22588],
    [12.99008, 80.22594],
    [12.99007, 80.226],
    [12.99001, 80.22623],
    [12.99, 80.22628],
    [12.99, 80.22642],
    [12.99, 80.22653],
    [12.99006, 80.22685],
    [12.99018, 80.22732],
    [12.99021, 80.22754],
    [12.99023, 80.22762],
    [12.99028, 80.22791],
    [12.99032, 80.22811],
    [12.99037, 80.22828],
    [12.99039, 80.22835],
    [12.99047, 80.22863],
    [12.99058, 80.22899],
    [12.99076, 80.22958],
    [12.99082, 80.2299],
    [12.99085, 80.23017],
    [12.99091, 80.23115],
    [12.99091, 80.23123],
    [12.99097, 80.23184],
    [12.99098, 80.23193],
    [12.99101, 80.23202],
    [12.99108, 80.23234],
    [12.99123, 80.23287],
    [12.99145, 80.23358],
    [12.99146, 80.23357],
    [12.99147, 80.23357],
    [12.99148, 80.23357],
    [12.99149, 80.23356],
    [12.9915, 80.23356],
    [12.99151, 80.23356],
    [12.99152, 80.23356],
    [12.99153, 80.23356],
    [12.99154, 80.23357],
    [12.99155, 80.23357],
    [12.99156, 80.23357],
    [12.99157, 80.23357],
    [12.99158, 80.23358],
    [12.99159, 80.23358],
    [12.9916, 80.23359],
    [12.99161, 80.2336],
    [12.99162, 80.23361],
    [12.99163, 80.23362],
    [12.99164, 80.23363],
    [12.99164, 80.23364],
    [12.99165, 80.23365],
    [12.99165, 80.23366],
    [12.99166, 80.23367],
    [12.99166, 80.23368],
    [12.99166, 80.23369],
    [12.99166, 80.2337],
    [12.99181, 80.23371],
    [12.99199, 80.23372],
    [12.99221, 80.23373],
    [12.99238, 80.23375],
    [12.99254, 80.23377],
    [12.99269, 80.23379],
    [12.99274, 80.2338],
    [12.99296, 80.23386],
    [12.99308, 80.23389],
    [12.99331, 80.23399],
    [12.99345, 80.23405],
    [12.99364, 80.2342],
    [12.99374, 80.23429],
    [12.99385, 80.23438],
    [12.99396, 80.23448],
    [12.99399, 80.23452],
    [12.994, 80.23453],
    [12.99412, 80.23462],
    [12.99429, 80.23473],
    [12.99441, 80.23481],
    [12.99453, 80.23487],
    [12.99473, 80.23495],
    [12.99479, 80.23497],
    [12.99484, 80.235],
    [12.99491, 80.23503],
    [12.99507, 80.23512],
    [12.99532, 80.23528],
    [12.99535, 80.2353],
    [12.9955, 80.2354],
    [12.99574, 80.2356],
    [12.99586, 80.23571],
    [12.99599, 80.23586],
    [12.99611, 80.23603],
    [12.99622, 80.23618],
    [12.99629, 80.2363],
    [12.99641, 80.23653],
    [12.99645, 80.23661],
    [12.99653, 80.2368],
    [12.99671, 80.23717],
    [12.99688, 80.23744],
    [12.99731, 80.23809],
    [12.99734, 80.23814],
    [12.99771, 80.23867],
    [12.99778, 80.23876],
    [12.99784, 80.23882],
    [12.99799, 80.23893],
    [12.99804, 80.23896],
    [12.99817, 80.23901],
    [12.99832, 80.23906],
    [12.99848, 80.23911],
    [12.99881, 80.23921],
    [12.9989, 80.23924],
    [12.99899, 80.23926],
    [12.99915, 80.2393],
    [12.99926, 80.23933],
    [12.99939, 80.23935],
    [13.00023, 80.23949],
    [13.00103, 80.23962],
    [13.0013, 80.23967],
    [13.00168, 80.23976],
    [13.00188, 80.23982],
    [13.0022, 80.23993],
    [13.0025, 80.24003],
    [13.00263, 80.24008],
    [13.00304, 80.24022],
    [13.00328, 80.24029],
    [13.00338, 80.24032],
    [13.00343, 80.24035],
    [13.00345, 80.24036],
    [13.00348, 80.24038],
    [13.00353, 80.24042],
    [13.00357, 80.24046],
    [13.00371, 80.24084],
    [13.00406, 80.24167],
    [13.00414, 80.24174],
    [13.00417, 80.24176],
    [13.0042, 80.24178],
    [13.00425, 80.2418],
    [13.0043, 80.24182],
    [13.00435, 80.24183],
    [13.0044, 80.24184],
    [13.00446, 80.24184],
    [13.00451, 80.24184],
    [13.00517, 80.24182],
    [13.00519, 80.24181],
    [13.00522, 80.2418],
    [13.00526, 80.24179],
    [13.0053, 80.24179],
    [13.00531, 80.24179],
    [13.00531, 80.24178],
    [13.00532, 80.24178],
    [13.00532, 80.24177],
    [13.00533, 80.24177],
    [13.00533, 80.24176],
    [13.00534, 80.24176],
    [13.00535, 80.24176],
    [13.00535, 80.24175],
    [13.00536, 80.24175],
    [13.00537, 80.24175],
    [13.00538, 80.24175],
    [13.00539, 80.24175],
    [13.0054, 80.24175],
    [13.0054, 80.24176],
    [13.00541, 80.24176],
    [13.00542, 80.24176],
    [13.00542, 80.24177],
    [13.00543, 80.24177],
    [13.00543, 80.24178],
    [13.00544, 80.24178],
    [13.00544, 80.24179],
    [13.00612, 80.24182],
  ];

  const [stops, setStops] = useState([
    {
      latlong: [13.00613, 80.241819],
      isPassed: false,
      stopName: "Main Gate",
    },
    {
      latlong: [13.003049, 80.240222],
      isPassed: false,
      stopName: "DS1",
    },
    {
      latlong: [12.999035, 80.239268],
      isPassed: false,
      stopName: "Vana Vani",
    },
    {
      latlong: [12.997295, 80.238088],
      isPassed: false,
      stopName: "Ground",
    },
    {
      latlong: [12.993492, 80.234106],
      isPassed: false,
      stopName: "SBI",
    },
    {
      latlong: [12.991358, 80.233674],
      isPassed: false,
      stopName: "GC",
    },
    {
      latlong: [12.990988, 80.231981],
      isPassed: false,
      stopName: "ICSR",
    },
    {
      latlong: [12.990801, 80.229854],
      isPassed: false,
      stopName: "MSB",
    },
    {
      latlong: [12.990181, 80.227405],
      isPassed: false,
      stopName: "BT STOP",
    },
    {
      latlong: [12.988622, 80.223322],
      isPassed: false,
      stopName: "Velachery Gate",
    },
  ]);
  console.log(route)
  const [stops2, setStops2] = useState([
    {
      latlong: [12.986434, 80.239792],
      isPassed: false,
      stopName: "Mandakani Hostel",
    },
    {
      latlong: [12.986680, 80.237957],
      isPassed: false,
      stopName: "Taramani Bus stop",
    },
    {
      latlong: [12.986126, 80.234351],
      isPassed: false,
      stopName: "Narmada Hostel",
    },
    {
      latlong: [12.986794, 80.233264],
      isPassed: false,
      stopName: "IIT GYMKHANA",
    },
    {
      latlong: [12.989283, 80.232952],
      isPassed: false,
      stopName: "OAT",
    },
    {
      latlong: [12.991358, 80.233674],
      isPassed: false,
      stopName: "GC",
    },
    {
      latlong: [12.990988, 80.231981],
      isPassed: false,
      stopName: "ICSR",
    },
    {
      latlong: [12.990801, 80.229854],
      isPassed: false,
      stopName: "MSB",
    },
    {
      latlong: [12.990181, 80.227405],
      isPassed: false,
      stopName: "BT STOP",
    },
    {
      latlong: [12.988622, 80.223322],
      isPassed: false,
      stopName: "Velachery Gate",
    },
  ]);
  const [mapZoom, setMapZoom] = useState(15);
  const [mapCenter, setMapCenter] = useState([12.994958, 80.236598]);
  const [completedRoute, setCompletedRoute] = useState([]);
  const [bus1, setBus1] = useState([]);
  const [bus2, setBus2] = useState([]);
  let BusIcon = L.icon({
    iconUrl: busIcon,
    iconRetinaUrl: busIcon,
    iconSize: [25, 25],
  });
  let UpcomingStop = L.icon({
    iconUrl: UpcomingIcon,
    iconRetinaUrl: UpcomingIcon,
    iconSize: [25, 25],
  });
  let PassedStop = L.icon({
    iconUrl: PassedIcon,
    iconRetinaUrl: PassedIcon,
    iconSize: [25, 25],
  });

  let i = 0,
    counter = 0;

  const getBus1Data = async () => {
    const currentPoint = await data(i);
    i = i + 1;
    const currentZoom = mapRef.current.getZoom();
    setMapZoom(currentZoom);
    setBus1(currentPoint);
    setMapCenter(currentPoint);
    setCompletedRoute((prevCompletedRoute) => [
      ...prevCompletedRoute,
      currentPoint,
    ]);
  }; 

  const getBus2Data = async () => {
    const currentPoint = await bus2Data(i);
    i = i + 1;
    // if(counter===0){
    //   const polylineCoords = [
    //     [13.00613, 80.241819],
    //     [13.003049, 80.240222],
    //     [12.999035, 80.239268],
    //     [12.997295, 80.238088],
    //     [12.993492, 80.234106],
    //     [12.991358, 80.233674],
    //     [12.990988, 80.231981],
    //     [12.990801, 80.229854],
    //     [12.990181, 80.227405],
    //     [12.988622, 80.223322],
    //   ];

    // function getCoordinatesPassed(targetCoord, polylineCoords) {
    //   const passedCoords = [];
    //   for (let i = 1; i < polylineCoords.length; i++) {
    //     const prevCoord = polylineCoords[i - 1];
    //     const currentCoord = polylineCoords[i];
    //     // Check if targetCoord is between prevCoord and currentCoord using longitude values
    //     if (
    //       (targetCoord[1] >= prevCoord[1] && targetCoord[1] <= currentCoord[1]) ||
    //       (targetCoord[1] >= currentCoord[1] && targetCoord[1] <= prevCoord[1])
    //     ) {
    //       // Check if targetCoord is also between latitudinal values
    //       if (
    //         (targetCoord[0] >= prevCoord[0] && targetCoord[0] <= currentCoord[0]) ||
    //         (targetCoord[0] >= currentCoord[0] && targetCoord[0] <= prevCoord[0])
    //       ) {
    //         // Push coordinates till the targetCoord has been passed
    //         for (let j = 0; j <= i - 1; j++) {
    //           passedCoords.push(polylineCoords[j]);
    //         }
    //         return passedCoords;
    //       }
    //     }
    //   }

    //   return passedCoords; // If the targetCoord never passed any previous coordinate
    // }
    // console.log(currentPoint);
    // // Example usage:
    // const targetCoord = currentPoint; // Replace with the coordinate you want to check
    // const coordsPassed = getCoordinatesPassed(targetCoord, polylineCoords);
    // console.log("Coordinates passed:", coordsPassed);
    // const updatedStops = stops.map((item) => {
    //   coordsPassed.map((items)=>{
    //     console.log(items.toString()===item.latlong.toString())
    //     if (items.toString()===item.latlong.toString()) {
    //       return { ...item, isPassed: true }; // Update isPassed property for matched stop
    //     } else {
    //       return item; // Keep other stops unchanged
    //     }
    //   })
    // });
    // console.log(updatedStops)
    // setStops(updatedStops);
    // }
    // counter=counter+1;
    const currentZoom = mapRef.current.getZoom();
    // if (currentZoom > 10) {
    //   mapRef.current.flyTo(currentPoint, currentZoom);
    // } else {
    //   mapRef.current.flyTo(currentPoint, 15);
    // }
    setMapZoom(currentZoom);
    setBus2(currentPoint);
    setMapCenter(currentPoint);
    setCompletedRoute((prevCompletedRoute) => [
      ...prevCompletedRoute,
      currentPoint,
    ]);
  };

  useEffect(() => {
    const intervalId = setInterval(()=>{
      getBus1Data();
      getBus2Data();
    },5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (bus1.length !== 0) {
      const updatedStops = stops.map((item) => {
        if (
          geolib.isPointWithinRadius(
            { latitude: bus1[0], longitude: bus1[1] },
            { latitude: item.latlong[0], longitude: item.latlong[1] },
            50
          )
        ) {
          return { ...item, isPassed: true }; // Update isPassed property for matched stop
        } else {
          return item; // Keep other stops unchanged
        }
      });
      setStops(updatedStops);
    }
  }, [bus1]);
  useEffect(() => {
    if (bus2.length !== 0) {
      const updatedStops = stops2.map((item) => {
        if (
          geolib.isPointWithinRadius(
            { latitude: bus2[0], longitude: bus2[1] },
            { latitude: item.latlong[0], longitude: item.latlong[1] },
            50
          )
        ) {
          return { ...item, isPassed: true }; // Update isPassed property for matched stop
        } else {
          return item; // Keep other stops unchanged
        }
      });
      setStops2(updatedStops);
    }
  }, [bus2]);

  // console.log(bus1[0]);
  return (
    <>
      <div className="map" id="map">
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={false}
          className="map"
          markerZoomAnimation
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
            {/* <Polyline positions={polylineCoords} color="blue" />
            <Polyline positions={taramaniRoute} color="blue" /> */}

          {bus1.length !== 0 && (
            <Marker position={bus1} icon={BusIcon} className="marker-top">
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
          {bus2.length !== 0 && (
            <Marker position={bus2} icon={BusIcon} className="marker-top">
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
          {(bus1.length !== 0 && route===1)  &&
            stops.map((item) => {
              return (
                <Marker
                  key={item.latlong}
                  position={item.latlong}
                  icon={item.isPassed ? PassedStop : UpcomingStop}
                >
                  <Tooltip permanent>
                    <p
                      className={
                        item.isPassed ? "passed_stop" : "upcoming-stop"
                      }
                    >
                      {item.stopName}
                    </p>
                  </Tooltip>
                </Marker>
              );
            })}
            {(bus2.length !== 0 && route===2)  &&
            stops2.map((item) => {
              return (
                <Marker
                  key={item.latlong}
                  position={item.latlong}
                  icon={item.isPassed ? PassedStop : UpcomingStop}
                >
                  <Tooltip permanent>
                    <p
                      className={
                        item.isPassed ? "passed_stop" : "upcoming-stop"
                      }
                    >
                      {item.stopName}
                    </p>
                  </Tooltip>
                </Marker>
              );
            })}
          {/* <Polyline positions={completedRoute} color="red" weight={5}/> */}
        </MapContainer>
      </div>
    </>
  );
}

export default LiveMap;
