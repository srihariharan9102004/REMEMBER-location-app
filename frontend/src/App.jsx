// import MapView from './components/MapView/MapView';
// function App() {
//   return (
//     <div>
      
//       <MapView />
//     </div>
//   );
// }

// export default App;
import Profile from "./pages/Profile/Profile";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/profile" element={<Profile />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
