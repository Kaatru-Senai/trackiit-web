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
import busIcon from "../assets/icons8-bus-50.png";
import PassedIcon from "../assets/marker-svgrepo-com.svg";
import UpcomingIcon from "../assets/marker-svgrepo-com (1).svg";
import data from "../mockapi";
import * as geolib from "geolib";

function LiveMap() {
  const mapRef = useRef();
  const polylineCoords = [
    [13.006163, 80.241801],
    [13.005486, 80.241787],
    [13.005342, 80.241761],
    [13.005251, 80.241814],
    [13.00432, 80.241821],
    [13.004079, 80.24168],
    [13.00356, 80.240393],
    [13.001343, 80.239647],
    [12.998981, 80.239236],
    [12.998009, 80.238938],
    [12.998978, 80.239252],
    [12.997986, 80.238938],
    [12.997291, 80.238057],
    [12.995998, 80.235828],
    [12.994893, 80.235004],
    [12.993483, 80.234078],
    [12.991771, 80.233708],
    [12.991612, 80.23383],
    [12.991488, 80.233871],
    [12.991372, 80.233711],
    [12.991445, 80.23357],
    [12.991003, 80.23199],
    [12.990757, 80.229566],
    [12.99029, 80.227921],
    [12.990011, 80.22656],
    [12.990076, 80.225839],
    [12.989641, 80.224978],
    [12.989537, 80.224634],
    [12.989465, 80.223747],
    [12.989158, 80.223379],
    [12.98866, 80.223317],
  ];

  const [stops,setStops] = useState([
    {
      latlong: [13.00613, 80.241819],
      isPassed: false,
    },
    {
      latlong: [13.003049, 80.240222],
      isPassed: false,
    },
    {
      latlong: [12.999035, 80.239268],
      isPassed: false,
    },
  ]);
  const [mapZoom, setMapZoom] = useState(15);
  const [mapCenter, setMapCenter] = useState([12.994958, 80.236598]);
  const [completedRoute, setCompletedRoute] = useState([]);
  const [bus1, setBus1] = useState([]);
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

  let i = 0;

  const getData = async () => {
    const currentPoint = await data(i);
    i = i + 1;
    const currentZoom = mapRef.current.getZoom();

    // Only use flyTo if the current zoom level is greater than the desired zoom level (10 in this case)
    if (currentZoom > 10) {
      mapRef.current.flyTo(currentPoint, currentZoom);
    } else {
      mapRef.current.flyTo(currentPoint, 10);
    }
    // const updatedStops = stops.map((item) => {
    //   if (
    //     geolib.isPointWithinRadius(
    //       { latitude: currentPoint[0], longitude: currentPoint[1] },
    //       { latitude: item.latlong[0], longitude: item.latlong[1] },
    //       50
    //     )
    //   ) {
    //     item.isPassed=true; // Update isPassed property for matched stop
    //   }
    // });
  
    // setStops(updatedStops); 
    // console.log(stops)
    setMapZoom(currentZoom);
    setBus1(currentPoint);
    setMapCenter(currentPoint);
    setCompletedRoute((prevCompletedRoute) => [
      ...prevCompletedRoute,
      currentPoint,
    ]);
    console.log(completedRoute);
    console.log(currentPoint);
  };

  useEffect(() => {
    const intervalId = setInterval(getData, 6000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(()=>{
    if(bus1.length !==0){
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
    
  },[bus1])
  console.log(bus1[0]);
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
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={polylineCoords} color="blue" />
          <Polyline positions={completedRoute} color="red" />
          {bus1.length !== 0 && (
            <Marker position={bus1} icon={BusIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
          {bus1.length !== 0 &&
            stops.map((item) => {
              return (
                <Marker
                key={item.latlong}
                  position={item.latlong}
                  icon={item.isPassed?PassedStop:UpcomingStop}
                >
                  <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </>
  );
}

export default LiveMap;
