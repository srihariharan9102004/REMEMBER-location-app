import "./Profile.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Profile() {
        const navigate = useNavigate();
//     const fullName = localStorage.getItem("fullName");
// const email = localStorage.getItem("email");

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
const [showPasswordPopup, setShowPasswordPopup] = useState(false);
const user = JSON.parse(localStorage.getItem("user"));


    return (

        <div className="profile-container">

            <div className="profile-card">

                <h2>My Profile</h2>

                <div className="profile-info">

                    <h4>👤 Full Name</h4>
                    <p>{user?.fullName || "Not Available"}</p>

                </div>

                <div className="profile-info">

                    <h4>📧 Email</h4>
                    <p>{user?.email || "Not Available"}</p>

                </div>
                <div className="profile-info">

    <h4>🗺️ Map Style</h4>

    <select
        value={localStorage.getItem("mapStyle") || "standard"}
        onChange={(e) => {
            localStorage.setItem("mapStyle", e.target.value);
        }}
        className="map-style-select"
    >
        <option value="standard">🗺️ Standard</option>
        <option value="satellite">🛰️ Satellite</option>
        <option value="dark">🌙 Dark</option>
        <option value="terrain">🌄 Terrain</option>
        <option value="light">☀️ Light</option>
    </select>

</div>

                <button
    className="profile-btn"
    onClick={() => setShowPasswordPopup(true)}
>
    🔒 Change Password
</button>

                <button
    className="profile-btn logout-btn"
    onClick={() => setShowLogoutPopup(true)}
>
    🚪 Logout
</button>

                <button
    className="back-btn"
    onClick={() => navigate("/home")}
>
    ← Back to Map
</button>
{showPasswordPopup && (
    <div className="popup-overlay">
        <div className="popup-card">

            <h3>Confirm Password Change</h3>

            <p>
                Are you sure you want to change your password?
            </p>

            <div className="popup-buttons">

                <button
                    onClick={() => setShowPasswordPopup(false)}
                >
                    Cancel
                </button>

<button
    onClick={() => {
        setShowPasswordPopup(false);
        navigate("/forgot-password");
    }}
>
    Continue
</button>

            </div>

        </div>
    </div>
)}
{showLogoutPopup && (
    <div className="popup-overlay">
        <div className="popup-card">

            <h3>Confirm Logout</h3>

            <p>
                Are you sure you want to logout?
            </p>

            <div className="popup-buttons">

                <button
                    onClick={() => setShowLogoutPopup(false)}
                >
                    Cancel
                </button>

<button
    onClick={() => {

  localStorage.removeItem("user");

        setShowLogoutPopup(false);
        navigate("/");

    }}
>
    Logout
</button>

            </div>

        </div>
    </div>
)}

            </div>

        </div>

    );

}

export default Profile;