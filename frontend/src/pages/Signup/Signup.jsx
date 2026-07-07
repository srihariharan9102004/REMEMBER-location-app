import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../services/api";
function Signup() {
const navigate = useNavigate();
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
    alert("Enter a valid email address");
    return;
}

    try {
        const response = await api.post("/auth/register", {
            fullName,
            email,
            password,
        });

        alert(response.data);

        navigate("/");

    } catch (error) {

    if (error.response?.data) {

        const messages = Object.values(error.response.data);

        alert(messages[0]);

    } else {

        alert("Registration Failed");

    }

}
};
    const [showPassword,setShowPassword]=useState(false);

    return(

        <div className="signup-container">

            {/* Brand */}

            <div className="brand-section">

                <img
    src="/rememberlogo.jpg"
    alt="Remember Logo"
    className="brand-logo"
/>

                <h1 className="brand-title">
                    Remember
                </h1>

                <p className="brand-tagline">
                    Never miss your destination again
                </p>

            </div>

            {/* Signup Card */}

            <div className="signup-card">

                <h2>Create Account</h2>

                <p className="subtitle">
                    Sign up to get started
                </p>

                <form onSubmit={handleSignup}>

                {/* Name */}

                <div className="input-group">

                    <label>Full Name</label>

<input
    type="text"
    placeholder="Enter your name"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    required
/>

                </div>

                {/* Email */}

                <div className="input-group">

                    <label>Email</label>

<input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
     required
/>

                </div>

                {/* Password */}

                <div className="input-group">

                    <label>Password</label>

                    <div className="password-box">

<input
    type={showPassword ? "text" : "password"}
    placeholder="Create password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
     required
/>

<button
    type="button"
    className="eye-btn"
    onClick={() => setShowPassword(!showPassword)}
>
                            {showPassword ? "🙈":"👁"}
                        </button>

                    </div>

                </div>

                {/* Confirm Password */}

                <div className="input-group">

                    <label>Confirm Password</label>

<input
    type="password"
    placeholder="Confirm password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
     required
/>

                </div>

                <button type="submit" className="signup-btn">

                    Create Account

                </button>

                <div className="login-link">

                    Already have an account?

                    <Link to="/">
                        Login
                    </Link>

                </div>
</form>
            </div>

        </div>

    );

}

export default Signup;