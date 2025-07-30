import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { supabase } from "../supabase/client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Polyline } from "react-leaflet";
import polyline from "@mapbox/polyline";
import { useMapEvents } from 'react-leaflet';
import React from "react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customSpotIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [32, 32],
});

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelect([lat, lng]); // You can pass it back to parent or use directly
    },
  });

  return null;
}

const MapView = ({ refreshTrigger, filterType, radius, form, setForm }) => {
  const [spots, setSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [routeCoords, setRouteCoords] = useState([]);
  const [visiblePins, setVisiblePins] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);

  const handleMapClick = ([lat, lng]) => {
    setClickedLocation([lat, lng]);
    setForm({ ...form, latitude: lat, longitude: lng });
  };

  const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const fetchSpots = async () => {
      let query = supabase.from("help_spots").select("*");
      if (filterType) {
        query = query.eq("type", filterType);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching spots:", error);
      } else {
        setSpots(data);
      }
    };
    fetchSpots();
  }, [refreshTrigger, filterType]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.warn("Error fetching location:", err);
        }
      );
    }
  }, []);

  useEffect(() => {
  if (!userLocation) return;

  const filtered = spots.filter((pin) => {
    const distance = getDistanceInKm(
      userLocation[0],
      userLocation[1],
      parseFloat(pin.latitude),
      parseFloat(pin.longitude)
    );
    return distance <= radius;
  });

  setVisiblePins(filtered);
}, [userLocation, spots, radius]);

  useEffect(() => {
    const fetchTravelDistances = async () => {
      if (!userLocation || spots.length === 0) return;
      const newDistances = {};
      for (const spot of spots) {
        try {
          const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car",
            {
              coordinates: [
                [userLocation[1], userLocation[0]],
                [parseFloat(spot.longitude), parseFloat(spot.latitude)],
              ],
            },
            {
              headers: {
                Authorization: import.meta.env.VITE_ORS_API_KEY,
                "Content-Type": "application/json",
              },
            }
          );
          const distanceInKm = response.data.routes[0].summary.distance / 1000;
          newDistances[spot.id] = distanceInKm.toFixed(2);
        } catch (error) {
          console.error("ORS error:", error);
        }
      }
      setDistances(newDistances);
    };
    fetchTravelDistances();
  }, [userLocation, spots]);

  const ClearRouteOnMapClick = ({ clearRoute }) => {
  useMapEvents({
    click: () => clearRoute(),
  });
  return null;
};

  const handleShowDirection = async (spot) => {
  if (!userLocation) return;

  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [
          [userLocation[1], userLocation[0]],
          [parseFloat(spot.longitude), parseFloat(spot.latitude)],
        ],
      },
      {
        headers: {
          Authorization: import.meta.env.VITE_ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const encodedPolyline = response.data.routes?.[0]?.geometry;

    if (!encodedPolyline) {
      console.error("Route not found or invalid response");
      return;
    }

    const decoded = polyline.decode(encodedPolyline); // Returns [ [lat, lng], ... ]
    const coords = decoded.map(([lat, lng]) => [lat, lng]);

    setRouteCoords(coords);
  } catch (error) {
    console.error("Error getting directions:", error);
  }
};

if (!userLocation) return <div>Loading map...</div>; 

  return(
    <div style={{ height: "97.5vh", margin: "1rem", position: "relative" }}>
      <MapContainer
        center={userLocation || [0,0]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-xl)" }}
      >
        <LocationSelector onSelect={handleMapClick} />

        {clickedLocation && (
          <Marker position={clickedLocation} icon={customSpotIcon}>
            <Popup>
              <div style={{ textAlign: "center", padding: "var(--space-sm)" }}>
                <strong style={{ color: "var(--primary-color)" }}>You selected this location!</strong>
              </div>
            </Popup>
          </Marker>
        )}

        <ClearRouteOnMapClick clearRoute={() => setRouteCoords([])} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <div style={{ textAlign: "center", padding: "var(--space-sm)" }}>
                <strong style={{ color: "var(--accent-color)" }}>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}
        

        {visiblePins.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
          >
            <Popup>
              <div style={{ 
                minWidth: "200px", 
                padding: "var(--space-md)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}>
                <strong style={{ 
                  color: "var(--text-primary)", 
                  fontSize: "1.1rem",
                  display: "block",
                  marginBottom: "var(--space-sm)"
                }}>{spot.name}</strong>
                <span style={{ 
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  display: "block",
                  marginBottom: "var(--space-sm)"
                }}>Type: {spot.type}</span>
                {spot.image && (
                  <span>
                    <img 
                      src={spot.image} 
                      alt={spot.name} 
                      style={{
                        maxWidth: '150px', 
                        maxHeight: '100px', 
                        margin: 'var(--space-sm) 0',
                        borderRadius: "var(--radius-sm)",
                        boxShadow: "var(--shadow-sm)"
                      }} 
                    /><br />
                  </span>
                )}
                {spot.description && (
                  <span style={{ 
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "var(--space-sm)"
                  }}>Info: {spot.description}<br /></span>
                )}
                {spot.contact && (
                  <span style={{ 
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "var(--space-sm)"
                  }}>Contact: {spot.contact}<br /></span>
                )}
                {distances[spot.id] && (
                  <span style={{ 
                    color: "var(--accent-color)",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "var(--space-sm)"
                  }}>Driving Distance: {distances[spot.id]} km</span>
                )}
                <button 
                  onClick={() => handleShowDirection(spot)}
                  style={{
                    background: "var(--accent-gradient)",
                    color: "white",
                    border: "none",
                    padding: "var(--space-sm) var(--space-md)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    transition: "all 0.3s ease",
                    marginTop: "var(--space-sm)",
                    width: "100%"
                  }}
                >
                  Show Direction
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} pathOptions={{ color: 'var(--accent-color)', weight: 4, opacity: 0.8 }} />
        )}
        {routeCoords.length > 0 && (
          <button 
            onClick={() => setRouteCoords([])}
            style={{
              position: "absolute",
              top: "var(--space-md)",
              right: "var(--space-md)",
              background: "var(--warning-gradient)",
              color: "white",
              border: "none",
              padding: "var(--space-sm) var(--space-md)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              boxShadow: "var(--shadow-md)",
              zIndex: 1000
            }}
          >
            Dismiss
          </button>
        )}
      </MapContainer>
      <footer style={{
        textAlign: "center",
        padding: "var(--space-lg)",
        marginTop: "5%",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        fontSize: "0.9rem",
        color: "var(--text-secondary)",
        borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.2)"
      }}>
        <p>&copy; {new Date().getFullYear()} HelpMap — Built with ❤️ by the "ENTER TEAM NAME"</p>
      </footer>
    </div>
  );
};

export default MapView;
