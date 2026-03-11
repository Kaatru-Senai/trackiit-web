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

      const { route, device, stops, pos, cog, sog } = msg.data;

      // update stop live data
      setLiveData((prev) => {
        // Check if route changed for this device
        // We look for ANY entry for this device with a DIFFERENT route
        const isRouteChanged = Object.values(prev).some(
          (item) => item.bus === device && item.route !== route
        );

        let updated = { ...prev };

        if (isRouteChanged) {
          console.log(`[Frontend] Route switch detected for ${device}: Clearing old data.`);
          // Remove all entries for this device to prevent mixing old/new route data
          updated = Object.fromEntries(
            Object.entries(updated).filter(([, item]) => item.bus !== device)
          );
        }

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

      // update live bus position (store cog/sog too for position-only cards)
      if (pos?.length === 2) {
        setBusPositions((prev) => ({
          ...prev,
          [device]: {
            lat: pos[0],
            lon: pos[1],
            route,
            cog: cog ?? 0,
            sog: sog ?? 0
          }
        }));
      }
    };

    return () => ws.close();
  }, []);

  // 5-second inactivity watchdog — clears both liveData AND busPositions
  useEffect(() => {
    const timer = setInterval(() => {
      if (
        lastMessageAt.current &&
        Date.now() - lastMessageAt.current > 5000
      ) {
        setLiveData({});
        setBusPositions({});
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


  // Render a minimal card for position-only buses (route === 0, no active trip)
  const renderPositionOnlyCard = (device, bus) => {
    return (
      <div key={device} style={{
        marginBottom: 32,
        border: '2px solid #f5a623',
        borderRadius: 10,
        padding: '12px 20px',
        background: '#fffbf2'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{
            background: '#f5a623',
            color: '#fff',
            borderRadius: 6,
            padding: '3px 10px',
            fontWeight: 'bold',
            fontSize: 13
          }}>GPS ONLY</span>
          <h2 style={{ margin: 0 }}>Bus: {device}</h2>
          <span style={{ color: '#888', fontSize: 13 }}>No active trip — engine restarted or restricted zone</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, fontSize: 14, color: '#555' }}>
            <div><b>Latitude:</b> {bus.lat.toFixed(5)}</div>
            <div><b>Longitude:</b> {bus.lon.toFixed(5)}</div>
            {bus.cog !== undefined && <div><b>COG:</b> {bus.cog.toFixed(1)}°</div>}
            {bus.sog !== undefined && <div><b>SOG:</b> {bus.sog.toFixed(1)} km/h</div>}
          </div>
          <div style={{ flex: 3 }}>
            <MapContainer
              key={`pos-${device}-${bus.lat}-${bus.lon}`}
              center={[bus.lat, bus.lon]}
              zoom={17}
              style={{ height: '260px', width: '100%', borderRadius: 8 }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[bus.lat, bus.lon]} icon={busIcon(device)} />
            </MapContainer>
          </div>
        </div>
      </div>
    );
  };

  // Buses in position-only mode (route === 0, present in busPositions but no stop data)
  const positionOnlyBuses = Object.entries(busPositions).filter(
    ([, b]) => b.route === 0
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Live Bus Stop Status</h1>

      {/* Position-only buses (no active trip) */}
      {positionOnlyBuses.map(([device, bus]) => renderPositionOnlyCard(device, bus))}

      {/* Buses with active trips and stop data */}
      {groupLiveDataByDevice().map(renderDeviceTable)}
    </div>
  );
}

export default App;


