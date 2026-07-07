// ==============================
//  IMPORTS
// ==============================
import {MapContainer,TileLayer,Marker,Circle,useMapEvents,Polyline,ZoomControl,} from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { getDistance } from "../../utils/distance";
import "./MapView.css";

// ==============================
//  FIX LEAFLET ICON ISSUE
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
//  MAIN COMPONENT
// ==============================
function MapView() {

  // ==============================
  //  STATE VARIABLES
  // ==============================
  const [currentPos, setCurrentPos] = useState(null);
  const [markedPos, setMarkedPos] = useState(null);
  const [radius, setRadius] = useState(200);
  const [alarmTriggered, setAlarmTriggered] = useState(false);
  const [alarmTone, setAlarmTone] = useState("/alarm.mp3");
  const [customToneName, setCustomToneName] = useState("/ringtone.mp3");
  const navigate = useNavigate();
const [mapStyle, setMapStyle] = useState(
    localStorage.getItem("mapStyle") || "standard"
);

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
  const [showRadiusControl, setShowRadiusControl] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  


  // ==============================
  //  LOAD ALARM SOUND
  // ==============================
  useEffect(() => {
  alarmRef.current = new Audio(alarmTone);
  alarmRef.current.loop = true;
}, [alarmTone]);


  // ==============================
  //  LIVE GPS TRACKING
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
      { enableHighAccuracy: true,
         timeout: 15000,
         maximumAge: 0
       }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);


  // ==============================
  //  REVERSE GEOCODING (SHORT LOCATION)
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
  //  ALARM + VIBRATION LOGIC
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
  //  AUTO ZOOM TO ROUTE
  // ==============================
  // useEffect(() => {
  //   if (routeCoords.length > 0 && mapRef.current) {
  //     const bounds = L.latLngBounds(routeCoords);

  //     mapRef.current.fitBounds(bounds, {
  //       padding: [60, 60],
  //       animate: true,
  //       duration: 1.5,
  //     });
  //   }
  // }, [routeCoords]);
  useEffect(() => {
  if (routeCoords.length > 0 && mapRef.current) {

    const bounds = L.latLngBounds(routeCoords);

    mapRef.current.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 16,      // Don't zoom in too much
      animate: true
    });

  }
}, [routeCoords]);


  // ==============================
  //  MAP CLICK HANDLER
  // ==============================
  function MapClickHandler() {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      if (!currentPos) return;

      setMarkedPos(newPos);
      //  Get clicked place name
fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
)
  .then((res) => res.json())
  .then((data) => {
    if (data.display_name) {

      const shortLocation = data.display_name
        .split(",")
        .slice(0, 2)
        .join(",");

      setDestinationSearch(shortLocation);
    }
  })
  .catch((err) => console.error(err));

      setRouteCoords([]);
      setRouteDistance(null);

      //  SHOW RADIUS CONTROL
      setShowRadiusControl(true);

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
  //  REMINDER SUBMIT
  // ==============================

  const handleReminderSubmit = () => {
    if (!inputMessage.trim()) return;

    setSavedMessage(inputMessage);
    setInputMessage("");

    setSuccessMessage("✅ Reminder saved successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  

  // ==============================
  //  FETCH ROUTE (OSRM)
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
  //  SEARCH HANDLER
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

      if (currentSearch && destinationSearch) {


    // Show radius control
    setShowRadiusControl(true);
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
  //  UI RENDER
  // ==============================
  return (
    <>
    
{/* Search Panel */}
<div className="search-panel container-fluid">

{/* <div className="app-logo">
  <img src="/rememberlogo.jpg" alt="Remember Logo" className="logo-img" />
  <h3 className="logo-title">Remember</h3>
</div> */}
<div className="top-bar">

    <div className="app-logo">
        <img
            src="/rememberlogo.jpg"
            alt="Remember Logo"
            className="logo-img"
        />

        <h3 className="logo-title">Remember</h3>
    </div>

    <button
        className="profile-btn"
        onClick={() => navigate("/profile")}
    >
        👤
    </button>

</div>


  {/* Current Location */}
  <div className="row g-2">
    <div className="col-12">
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
              setCurrentSearch("");
            }

            if (mode === "gps") {
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
    </div>
  </div>

  {/* Destination + Search */}
  <div className="row g-1 mt-1 align-items-center">

    <div className="col-8">
      <input
        type="text"
        placeholder="Destination Location"
        value={destinationSearch}
        onChange={(e) => setDestinationSearch(e.target.value)}
        className="form-control"
      />
    </div>

    <div className="col-4 d-grid">
      <button onClick={handleSearch}>
        Search
      </button>
    </div>

  </div>

</div>

      {/* Radius Control */}
      {showRadiusControl && (
  <div className="control-panel">

    <label>Alarm Radius: {radius} meters</label>

    <input
      type="range"
      min="50"
      max="1000"
      step="50"
      value={radius}
      onChange={(e) => setRadius(e.target.value)}
    />

  

    {routeDistance && (
      <div className="distance-box">
        Distance: {routeDistance} km
      </div>
    )}


  </div>
)}
      
{/* Message Input Box */}
{/* Reminder Box */}
<div className={`message-box ${showReminder ? "show" : ""}`}>

  <label>Reminder Message</label>

  <input
    type="text"
    placeholder="Type your message..."
    value={inputMessage}
    onChange={(e) => setInputMessage(e.target.value)}
  />
  <label className="tone-label">
  Alarm Tone
</label>

<select
  value={alarmTone}
  onChange={(e) => {
    setAlarmTone(e.target.value);
    setCustomToneName("");
  }}
  className="tone-select"
>
  <option value="/alarm.mp3">Default Alarm</option>
  <option value="/bell.mp3">Bell Sound</option>
  <option value="/ringtone.mp3">Ringtone</option>
</select>

<label className="upload-label">
  Upload Custom Tone
</label>

<input
  type="file"
  accept="audio/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (file) {
      const audioURL = URL.createObjectURL(file);

      setAlarmTone(audioURL);
      setCustomToneName(file.name);
    }
  }}
/>

{customToneName && (
  <p className="tone-name">
    🎵 {customToneName}
  </p>
)}

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
  zoomControl={false}
  className="map-container"
  whenCreated={(map) => (mapRef.current = map)}>

         
<TileLayer
    url={
        mapStyle === "standard"
            ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        : mapStyle === "satellite"
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : mapStyle === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : mapStyle === "terrain"
            ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    }
/>
        <ZoomControl position="bottomright" />

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

{/* Founder Credit */}
<div className="founder-credit">
  <span>Designed & Developed by <strong>Srihariharan R</strong></span>
  
</div>

      {/* Floating Message Button */}
<button
  className="floating-btn"
  onClick={() => setShowReminder(!showReminder)}
>
  📝
</button>
    </>
    
  );
}

export default MapView;