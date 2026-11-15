import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../services/authService";

function UserLayout() {
  const navigate = useNavigate();
  const user = getUser();
  const signOut = () => { logoutUser(); navigate("/"); };
  return (
    <div className="user-app-shell">
      <aside className="user-sidebar">
        <Link to="/" className="user-brand">my<span>HOME</span></Link>
        <small className="user-panel-label">USER PANEL</small>
        <nav className="user-menu">
          <NavLink to="/user/dashboard"><i className="bi bi-grid-1x2"></i>Dashboard</NavLink>
          <NavLink to="/user/profile"><i className="bi bi-person"></i>My Profile</NavLink>
          <NavLink to="/user/interested-properties"><i className="bi bi-heart"></i>Interested Properties</NavLink>
          <NavLink to="/user/notifications"><i className="bi bi-bell"></i>Notifications</NavLink>
          <NavLink to="/listings"><i className="bi bi-search"></i>Browse Properties</NavLink>
        </nav>
        <button type="button" className="user-logout" onClick={signOut}><i className="bi bi-box-arrow-left"></i>Logout</button>
      </aside>
      <main className="user-main">
        <header className="user-topbar"><div><small>MYHOME DISCOVERY</small><strong>Welcome, {user?.fullName?.split(" ")[0] || "User"}</strong></div><div className="user-top-actions"><Link to="/user/notifications"><i className="bi bi-bell"></i></Link><button type="button" onClick={() => navigate("/user/profile")}><span>{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</span>{user?.fullName?.split(" ")[0] || "User"}</button></div></header>
        <div className="user-content"><Outlet /></div>
      </main>
    </div>
  );
}

export default UserLayout;
