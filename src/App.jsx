import React, { useEffect, useRef, useState } from "react";
import './App.css';
import LiveMap from './Components/LiveMap';
import Navbar from './Components/Navbar';
import Select from 'react-select';
import useWebSocket from 'react-use-websocket';
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});




const busIcon = (label) =>
  L.divIcon({
    className: "bus-marker",
    html: `<div style="
      background:#1976d2;
      color:#fff;
      padding:4px 8px;
      border-radius:6px;
      font-size:12px;
      font-weight:bold;
    ">${label}</div>`
  });

// import { colourOptions } from '../data';

const STOP_MASTER = [
  // ---------- Route 1 ----------
  { route: 1, name: "Main gate", lat: 13.0061, lon: 80.2419 },
  { route: 1, name: "MOH quarters", lat: 13.0026, lon: 80.2419 },
  { route: 1, name: "Vana vani", lat: 12.9992, lon: 80.2394 },
  { route: 1, name: "Children's park", lat: 12.9958, lon: 80.2358 },
  { route: 1, name: "Post office", lat: 12.9937, lon: 80.2344 },
  { route: 1, name: "Gajendra circle", lat: 12.9919, lon: 80.2337 },
  { route: 1, name: "ICSR", lat: 12.9909, lon: 80.2317 },
  { route: 1, name: "CRC", lat: 12.9908, lon: 80.2301 },
  { route: 1, name: "JEE office", lat: 12.99, lon: 80.2268 },
  { route: 1, name: "Velachery gate", lat: 12.9884, lon: 80.2234 },
  { route: 1, name: "BT", lat: 12.9903, lon: 80.2277 },
  { route: 1, name: "CRC", lat: 12.9909, lon: 80.2302 },
  { route: 1, name: "ICSR", lat: 12.9911, lon: 80.2321 },
  { route: 1, name: "GC", lat: 12.9912, lon: 80.2337 },
  { route: 1, name: "OAT ground", lat: 12.9896, lon: 80.2331 },
  { route: 1, name: "Gymkhana", lat: 12.9869, lon: 80.2334 },
  { route: 1, name: "Narmada hostel", lat: 12.9864, lon: 80.235 },
  { route: 1, name: "Jamuna Hostel", lat: 12.9867, lon: 80.2389 },

  // ---------- Route 2 ----------
  { route: 2, name: "Jamuna hostel", lat: 12.9867, lon: 80.2389 },
  { route: 2, name: "Narmada hostel", lat: 12.9863, lon: 80.235 },
  { route: 2, name: "Gymkhana", lat: 12.9868, lon: 80.2333 },
  { route: 2, name: "OAT ground", lat: 12.9897, lon: 80.233 },
  { route: 2, name: "Gajendra circle", lat: 12.9911, lon: 80.2336 },
  { route: 2, name: "ICSR", lat: 12.9909, lon: 80.2317 },
  { route: 2, name: "CRC", lat: 12.9908, lon: 80.2301 },
  { route: 2, name: "JEE office", lat: 12.99, lon: 80.2268 },
  { route: 2, name: "Velachery gate", lat: 12.9884, lon: 80.2234 },
  { route: 2, name: "BT", lat: 12.9903, lon: 80.2277 },
  { route: 2, name: "CRC", lat: 12.9909, lon: 80.2302 },
  { route: 2, name: "ICSR", lat: 12.9911, lon: 80.2321 },
  { route: 2, name: "Gajendra circle", lat: 12.9919, lon: 80.2337 },
  { route: 2, name: "Post office", lat: 12.9938, lon: 80.2342 },
  { route: 2, name: "Children's park", lat: 12.9959, lon: 80.2357 },
  { route: 2, name: "Vana vani", lat: 12.9992, lon: 80.2393 },
  { route: 2, name: "MOH quarters", lat: 13.0026, lon: 80.2401 },
  { route: 2, name: "Main gate", lat: 13.0061, lon: 80.2419 }
];

/**
 * Unique key for mapping WS data
 */
const stopKey = (route, device, stop) =>
  `${device}-${route}-${stop.name}-${stop.lat}-${stop.lon}`;


function App() {
  const [liveData, setLiveData] = useState({});
  const [busPositions, setBusPositions] = useState({});

  const DeviceMap = ({ device }) => {
    const bus = busPositions[device];
    if (!bus) return null;

    return (
      <MapContainer
        center={[bus.lat, bus.lon]}
        zoom={16}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[bus.lat, bus.lon]} />
      </MapContainer>
    );
  };


  const lastMessageAt = useRef(null);
  const RouteMap = ({ route }) => {
    const buses = Object.entries(busPositions)
      .filter(([, b]) => b.route === route);

    if (buses.length === 0) return null;

    const center = [buses[0][1].lat, buses[0][1].lon];

    return (
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {buses.map(([device, b]) => (
          <Marker
            key={device}
            position={[b.lat, b.lon]}
          />
        ))}
      </MapContainer>
    );
  };

  const groupLiveDataByDevice = () => {
    const grouped = {};

    Object.values(liveData).forEach((item) => {
      if (!item.bus) return;

      if (!grouped[item.bus]) {
        grouped[item.bus] = {
          device: item.bus,
          route: item.route,
          stops: []
        };
      }

      grouped[item.bus].stops.push(item);
    });

    return Object.values(grouped);
  };


  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/client");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (!msg?.data) return;

      lastMessageAt.current = Date.now();

      const { route, device, stops, pos } = msg.data;

      // update stop live data
      setLiveData((prev) => {
        const updated = { ...prev };

        stops.forEach((stop) => {
          const key = stopKey(route, device, stop);
          updated[key] = {
            ...stop,
            bus: device,
            route
          };
        });

        return updated;
      });

      // update live bus position
      if (pos?.length === 2) {
        setBusPositions((prev) => ({
          ...prev,
          [device]: {
            lat: pos[0],
            lon: pos[1],
            route
          }
        }));
      }
    };

    return () => ws.close();
  }, []);

  // 5-second inactivity watchdog
  useEffect(() => {
    const timer = setInterval(() => {
      if (
        lastMessageAt.current &&
        Date.now() - lastMessageAt.current > 5000
      ) {
        setLiveData({});
        lastMessageAt.current = null;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderDeviceTable = ({ device, route, stops }) => {
    const routeStops = STOP_MASTER.filter(s => s.route === route);

    return (
      <div key={device} style={{ marginBottom: 40 }}>
        <h2>
          Bus: {device} | Route: {route}
        </h2>

        <div style={{ display: "flex", gap: "16px" }}>
          {/* TABLE */}
          <div style={{ flex: 2 }}>
            <table border="1" cellPadding="6" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Stop Id</th>
                  <th>Stop</th>
                  <th>ETA</th>
                  <th>ETD</th>
                  <th>ATA</th>
                  <th>ATD</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {routeStops.map((stop, idx) => {
                  const live = stops.find(
                    s =>
                      s.name === stop.name &&
                      s.lat === stop.lat &&
                      s.lon === stop.lon
                  );

                  return (
                    <tr key={`${device}-${idx}`}>
                      <td>{device}</td>
                      <td>{live?.id || "-"}</td>
                      <td>{stop.name}</td>
                      <td>{live?.eta ? new Date(live.eta).toLocaleTimeString() : "-"}</td>
                      <td>{live?.etd ? new Date(live.etd).toLocaleTimeString() : "-"}</td>
                      <td>{live?.ata ? new Date(live.ata).toLocaleTimeString() : "-"}</td>
                      <td>{live?.atd ? new Date(live.atd).toLocaleTimeString() : "-"}</td>
                      <td>{live?.status || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MAP */}
          <div style={{ flex: 1 }}>
            <DeviceMap device={device} />
          </div>
        </div>
      </div>
    );
  };


  return (
    <div style={{ padding: 20 }}>
      <h1>Live Bus Stop Status</h1>
      {groupLiveDataByDevice().map(renderDeviceTable)}
    </div>
  );
}

export default App;


