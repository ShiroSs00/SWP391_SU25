import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngTuple } from "leaflet";

const center: LatLngTuple = [10.762622, 106.660172]; // Hồ Chí Minh

const MapPage: React.FC = () => (
  <div style={{ width: "100%", height: "500px" }}>
    <MapContainer center={center} zoom={13} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center}>
        <Popup>Đây là Hồ Chí Minh!</Popup>
      </Marker>
    </MapContainer>
  </div>
);

export default MapPage;