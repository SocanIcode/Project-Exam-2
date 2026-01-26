import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Venue from "../pages/Venue";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import MyBookings from "../pages/MyBookings";
import Manager from "../pages/Manager";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/venue/:id" element={<Venue />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/bookings" element={<MyBookings />} />
      <Route path="/manager" element={<Manager />} />
    </Routes>
  );
}
