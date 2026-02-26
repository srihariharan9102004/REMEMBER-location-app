// ==============================
// 📦 IMPORTS
// ==============================
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { getDistance } from "../../utils/distance";
import "./MapView.css";


// ==============================
// 🧭 FIX LEAFLET ICON ISSUE
// ==============================
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// ==============================
// 🚀 MAIN COMPONENT
// ==============================
function MapView() {

  // ==============================
  // 📌 STATE VARIABLES
  // ==============================
  const [currentPos, setCurrentPos] = useState(null);
  const [markedPos, setMarkedPos] = useState(null);
  const [radius, setRadius] = useState(200);
  const [alarmTriggered, setAlarmTriggered] = useState(false);

  const [destinationSearch, setDestinationSearch] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");
  const [locationMode, setLocationMode] = useState("gps");

  const [routeCoords, setRouteCoords] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);

  const [inputMessage, setInputMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const alarmRef = useRef(null);
  const vibrationRef = useRef(null);
  const mapRef = useRef(null);


  // ==============================
  // 🔔 LOAD ALARM SOUND
  // ==============================
  useEffect(() => {
    alarmRef.current = new Audio("/alarm.mp3");
    alarmRef.current.loop = true;
  }, []);


  // ==============================
  // 📍 LIVE GPS TRACKING
  // ==============================
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentPos([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);


  // ==============================
  // 🌍 REVERSE GEOCODING (SHORT LOCATION)
  // ==============================
  useEffect(() => {
    if (!currentPos) return;

    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${currentPos[0]}&lon=${currentPos[1]}`
        );

        const data = await response.json();

        if (data.display_name) {
          const parts = data.display_name.split(",");
          const shortLocation =
            parts.length >= 2
              ? `${parts[0].trim()}, ${parts[1].trim()}`
              : parts[0].trim();

          setCurrentSearch(shortLocation);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLocationName();
  }, [currentPos]);


  // ==============================
  // 🚨 ALARM + VIBRATION LOGIC
  // ==============================
  useEffect(() => {
    if (!currentPos || !markedPos) return;

    const distance = getDistance(currentPos, markedPos);

    if (distance <= radius) {
      if (!alarmTriggered) {
        alarmRef.current.play();

        if (navigator.vibrate) {
          vibrationRef.current = setInterval(() => {
            navigator.vibrate([500, 300, 500]);
          }, 1500);
        }

        if (!popupShown && savedMessage) {
          setShowPopup(true);
          setPopupShown(true);
        }

        setAlarmTriggered(true);
      }
    } else {
      if (alarmTriggered) {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;

        if (vibrationRef.current) {
          clearInterval(vibrationRef.current);
          vibrationRef.current = null;
        }

        setAlarmTriggered(false);
      }
    }
  }, [currentPos, markedPos, radius, alarmTriggered]);


  // ==============================
  // 🗺 AUTO ZOOM TO ROUTE
  // ==============================
  useEffect(() => {
    if (routeCoords.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(routeCoords);

      mapRef.current.fitBounds(bounds, {
        padding: [60, 60],
        animate: true,
        duration: 1.5,
      });
    }
  }, [routeCoords]);


  // ==============================
  // 🖱 MAP CLICK HANDLER
  // ==============================
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const newPos = [e.latlng.lat, e.latlng.lng];
        if (!currentPos) return;

        setMarkedPos(newPos);
        setRouteCoords([]);
        setRouteDistance(null);

        fetchRoute(currentPos, newPos);

        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;

        if (vibrationRef.current) {
          clearInterval(vibrationRef.current);
          vibrationRef.current = null;
        }

        setAlarmTriggered(false);
        setPopupShown(false);
        setShowPopup(false);
      },
    });

    return null;
  }


  // ==============================
  // 📝 REMINDER SUBMIT
  // ==============================
  const handleReminderSubmit = () => {
    if (!inputMessage.trim()) return;

    setSavedMessage(inputMessage);
    setInputMessage("");

    setSuccessMessage("✅ Reminder saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };


  // ==============================
  // 🛣 FETCH ROUTE (OSRM)
  // ==============================
  const fetchRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );

      const data = await response.json();

      if (data.routes.length > 0) {
        const route = data.routes[0];

        const formatted = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        setRouteCoords(formatted);
        setRouteDistance((route.distance / 1000).toFixed(2));
      }
    } catch (error) {
      console.error("Route error:", error);
    }
  };


  // ==============================
  // 🔎 SEARCH HANDLER
  // ==============================
  const handleSearch = async () => {
    if (!destinationSearch) return;

    try {
      let start;

      if (locationMode === "gps") {
        if (!currentPos) {
          alert("Waiting for GPS location...");
          return;
        }
        start = currentPos;
      } else {
        const currentResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${currentSearch}`
        );
        const currentData = await currentResponse.json();

        if (currentData.length === 0) {
          alert("Current location not found");
          return;
        }

        start = [
          parseFloat(currentData[0].lat),
          parseFloat(currentData[0].lon),
        ];
      }

      const destResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${destinationSearch}`
      );
      const destData = await destResponse.json();

      if (destData.length === 0) {
        alert("Destination not found");
        return;
      }

      const end = [
        parseFloat(destData[0].lat),
        parseFloat(destData[0].lon),
      ];

      setCurrentPos(start);
      setMarkedPos(end);
      setRouteCoords([]);

      fetchRoute(start, end);

    } catch (error) {
      console.error(error);
    }
  };


  // ==============================
  // 🎨 UI RENDER
  // ==============================
  return (
    <>
      {/* Search Panel */}
      <div className="search-panel">

       <div className="current-location-box">

  <div className="location-label">
    📍 Current Location
  </div>

  {locationMode === "gps" ? (
    <div className="location-display">
      {currentSearch || "Detecting location..."}
    </div>
  ) : (
    <input
      type="text"
      value={currentSearch}
      onChange={(e) => setCurrentSearch(e.target.value)}
      placeholder="Search your location"
      className="location-input"
    />
  )}

  <select
  value={locationMode}
  onChange={(e) => {
    const mode = e.target.value;
    setLocationMode(mode);

    if (mode === "manual") {
      // ✅ Clear box when switching to manual
      setCurrentSearch("");
    }

    if (mode === "gps") {
      // ✅ Show short simple location
      if (currentSearch) {
        const shortLocation = currentSearch.split(",")[0];
        setCurrentSearch(shortLocation);
      }
    }
  }}
  className="location-dropdown"
>

    <option value="gps">Use my live location</option>
    <option value="manual">Search manually</option>
  </select>

</div>


        <input
          type="text"
          placeholder="Destination Location"
          value={destinationSearch}
          onChange={(e) => setDestinationSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Radius Control */}
      <div className="control-panel">
        <label>Alarm Radius: {radius} meters</label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        />
        <small>Click on map to mark location</small>
      </div>

      {routeDistance && (
  <div className="distance-box">
    🚗 Distance: {routeDistance} km
  </div>
)}

{/* Message Input Box */}
<div className="message-box">
  <label>Reminder Message</label>

  <input
    type="text"
    placeholder="Type your message..."
   value={inputMessage}
onChange={(e) => setInputMessage(e.target.value)}
  />

  <button onClick={handleReminderSubmit}>
    Submit
  </button>

  {successMessage && (
    <div className="success-text">
      {successMessage}
    </div>
  )}
</div>

{/* Popup */}
{showPopup && (
  <div className="custom-popup">
    <div className="popup-content">
      <h3>📍 Destination Reached</h3>
       <p>{savedMessage}</p>
      <button onClick={() => setShowPopup(false)}>OK</button>
    </div>
  </div>
)}




      {/* Map */}
      <MapContainer
        center={currentPos || [20.5937, 78.9629]}
        zoom={currentPos ? 15 : 5}
        className="map-container"
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {currentPos && <Marker position={currentPos} />}
        {markedPos && <Marker position={markedPos} />}

        {markedPos && (
          <Circle
            center={markedPos}
            radius={radius}
            pathOptions={{ color: "red" }}
          />
        )}

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "blue", weight: 5 }}
          />
        )}

        <MapClickHandler />
      </MapContainer>
    </>
  );
}

export default MapView;