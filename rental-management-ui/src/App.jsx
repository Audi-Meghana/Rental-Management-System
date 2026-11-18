import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import OwnerLayout from "./components/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProfile from "./pages/owner/OwnerProfile";
import OwnerProperties from "./pages/owner/OwnerProperties";
import AddProperty from "./pages/owner/AddProperty";
import EditProperty from "./pages/owner/EditProperty";
import InterestedUsers from "./pages/owner/InterestedUsers";
import Notifications from "./pages/owner/Notifications";
import { getUser } from "./services/authService";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import UserLayout from "./components/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import UserProfile from "./pages/user/UserProfile";
import InterestedProperties from "./pages/user/InterestedProperties";
import UserNotifications from "./pages/user/UserNotifications";
import Favorites from "./pages/user/Favorites";
import CompareProperties from "./pages/CompareProperties";
import Tenancies from "./pages/Tenancies";
import AdminReports from "./pages/admin/AdminReports";
import AdminNews from "./pages/admin/AdminNews";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminDashboard from "./pages/admin/AdminDashboard";

function OwnerRoute() {
  return getUser()?.role === "Owner"
    ? <OwnerLayout />
    : <Navigate to="/" replace />;
}

function UserRoute() {
  return getUser()?.role === "User"
    ? <UserLayout />
    : <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  return getUser()?.role === "Admin"
    ? children
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/compare" element={<CompareProperties />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="/admin/news" element={<AdminRoute><AdminNews /></AdminRoute>} />
        <Route path="/admin/tickets" element={<AdminRoute><AdminTickets /></AdminRoute>} />
        <Route path="/user" element={<UserRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="interested-properties" element={<InterestedProperties />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="tenancies" element={<Tenancies />} />
          <Route path="notifications" element={<UserNotifications />} />
        </Route>
        <Route path="/owner" element={<OwnerRoute />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OwnerDashboard />} />
          <Route path="profile" element={<OwnerProfile />} />
          <Route path="properties" element={<OwnerProperties />} />
          <Route path="properties/add" element={<AddProperty />} />
          <Route path="properties/edit/:id" element={<EditProperty />} />
          <Route path="interested-users" element={<InterestedUsers />} />
          <Route path="tenancies" element={<Tenancies />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;