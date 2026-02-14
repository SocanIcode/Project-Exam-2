import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Venue from "../pages/Venue";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import MyBookings from "../pages/MyBookings";
import Manager from "../pages/Manager";
import CreateVenue from "../pages/CreateVenue";
import EditVenue from "../pages/EditVenue";
import ManagerVenueBookings from "../pages/ManagerVenueBookings";
import BookingConfirmed from "../pages/BookingConfirmation";

import ManagerRoute from "../routes/ManagerRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/venue/:id" element={<Venue />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Logged-in */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/bookings" element={<MyBookings />} />

      {/* Manager only */}
      <Route
        path="/manager"
        element={
          <ManagerRoute>
            <Manager />
          </ManagerRoute>
        }
      />
      <Route
        path="/manager/create"
        element={
          <ManagerRoute>
            <CreateVenue />
          </ManagerRoute>
        }
      />
      <Route
        path="/manager/venues/:id/edit"
        element={
          <ManagerRoute>
            <EditVenue />
          </ManagerRoute>
        }
      />
      <Route
        path="/manager/venues/:id/bookings"
        element={
          <ManagerRoute>
            <ManagerVenueBookings />
          </ManagerRoute>
        }
      />
      <Route path="/booking-confirmed" element={<BookingConfirmed />} />
    </Routes>
  );
}
