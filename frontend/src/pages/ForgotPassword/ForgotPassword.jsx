import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ForgotPassword.css";


function ForgotPassword() {


    const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await api.post("/auth/forgot-password", {
                email,
                newPassword
            });

            alert(response.data);

            navigate("/");

        } catch (error) {

            alert(error.response?.data || "Failed to update password");

        }

    };

    return (

        <div className="forgot-container">
                       

            <div className="forgot-card">

                <h2>Forgot Password</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                    />

                   <div className="password-box">

    <input
        type={showNewPassword ? "text" : "password"}
        placeholder="New Password"
        value={newPassword}
        onChange={(e)=>setNewPassword(e.target.value)}
        required
    />

    <button
        type="button"
        className="eye-btn"
        onClick={() => setShowNewPassword(!showNewPassword)}
    >
        {showNewPassword ? "🙈" : "👁"}
    </button>

</div>

                    <div className="password-box">

    <input
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e)=>setConfirmPassword(e.target.value)}
        required
    />

    <button
        type="button"
        className="eye-btn"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
        {showConfirmPassword ? "🙈" : "👁"}
    </button>

</div>

                    <button type="submit">
                        Update Password
                    </button>

<button
    type="button"
    className="back-login-btn"
    onClick={() => navigate("/")}
>
    ← Back to Login
</button>

                </form>

            </div>

        </div>

    );

}

export default ForgotPassword;