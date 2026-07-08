import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

// const handleLogin = async (e) => {

//     e.preventDefault();
//         // Email validation
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailPattern.test(email)) {
//         alert("Enter a valid email address");
//         return;
//     }

//     try {

//         const response = await api.post("/auth/login", {
//             email,
//             password,
//         });
// if (response.data.message === "Login Successful!") {

//     localStorage.setItem("fullName", response.data.fullName);
//     localStorage.setItem("email", response.data.email);

//     navigate("/home");

// } else {

//     alert(response.data.message);

// }
// navigate("/home");

//         if (response.data === "Login Successful!") {

//             alert(response.data);
//             navigate("/home");

//         } else {

//             alert(response.data);

//         }

//     } catch (error) {

//         alert(error.response?.data || "Something went wrong");

//     }

// };

const handleLogin = async (e) => {

    e.preventDefault();

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Enter a valid email address");
        return;
    }

    try {

       const response = await api.post("/auth/login", {
    email,
    password,
});

console.log("Response:", response.data);

        if (response.data.message === "Login Successful!") {

            localStorage.setItem("user", JSON.stringify({
                fullName: response.data.fullName,
                email: response.data.email
            }));

            navigate("/home");

        } else {

            alert(response.data.message);

        }

    } catch (error) {

        alert(error.response?.data || "Invalid Email or Password");

    }

};

    return (

        <div className="login-container">

            {/* Logo Outside Card */}
            <div className="brand-section">

                <img
                    src="/rememberlogo.png"
                    alt="Remember Logo"
                    className="brand-logo"
                />

                <h1 className="brand-title">Remember</h1>

                <p className="brand-tagline">
                    Never miss your destination again
                </p>

            </div>

            {/* Login Card */}
            <div className="login-card">

                <h2>Welcome Back 👋</h2>

                <p className="subtitle">
                    Login to continue
                </p>

                <form onSubmit={handleLogin}>

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

                    <div className="input-group">

                        <label>Password</label>

                        <div className="password-box">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>

                        </div>

                    </div>

                    <div className="login-options">

                        <label>
                            <input type="checkbox" />
                            Remember Me
                        </label>

                        <Link to="/forgot-password">
    Forgot Password?
</Link>

                    </div>

                    <button type="submit" className="login-btn">
                        Login
                    </button>

                </form>

                <p className="signup-link">

                    Don't have an account?

                    <Link to="/signup">
                        Sign Up
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;