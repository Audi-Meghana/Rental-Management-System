import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser, logoutUser } from "../services/authService";

function UserLayout() {
  const navigate = useNavigate();
  const user = getUser();
  const [mobileMenu, setMobileMenu] = useState(false);
  const closeMobileMenu = () => setMobileMenu(false);
  const signOut = () => { logoutUser(); navigate("/"); };
  return (
    <div className="user-app-shell">
      <aside className={`user-sidebar${mobileMenu ? " is-open" : ""}`}>
        <div className="user-sidebar-heading">
          <Link to="/" className="user-brand" onClick={closeMobileMenu}>my<span>HOME</span></Link>
          <button type="button" className="user-sidebar-close" aria-label="Close user menu" onClick={closeMobileMenu}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <small className="user-panel-label">USER PANEL</small>
        <nav className="user-menu" id="user-navigation" aria-label="User navigation">
          <NavLink to="/user/dashboard" onClick={closeMobileMenu}><i className="bi bi-grid-1x2"></i>Dashboard</NavLink>
          <NavLink to="/user/profile" onClick={closeMobileMenu}><i className="bi bi-person"></i>My Profile</NavLink>
          <NavLink to="/user/interested-properties" onClick={closeMobileMenu}><i className="bi bi-heart"></i>Interested Properties</NavLink>
          <NavLink to="/user/favorites" onClick={closeMobileMenu}><i className="bi bi-bookmark-heart"></i>Saved Properties</NavLink>
          <NavLink to="/user/tenancies" onClick={closeMobileMenu}><i className="bi bi-file-earmark-text"></i>My Tenancies</NavLink>
          <NavLink to="/user/notifications" onClick={closeMobileMenu}><i className="bi bi-bell"></i>Notifications</NavLink>
          <NavLink to="/listings" onClick={closeMobileMenu}><i className="bi bi-search"></i>Browse Properties</NavLink>
        </nav>
        <button type="button" className="user-logout" onClick={signOut}><i className="bi bi-box-arrow-left"></i>Logout</button>
      </aside>
      {mobileMenu && <button type="button" className="user-sidebar-backdrop" aria-label="Close user menu" onClick={closeMobileMenu} />}
      <main className="user-main">
        <header className="user-topbar">
          <button
            type="button"
            className="user-mobile-toggle"
            aria-label="Open user menu"
            aria-expanded={mobileMenu}
            aria-controls="user-navigation"
            onClick={() => setMobileMenu(true)}
          >
            <i className="bi bi-list"></i>
          </button>
          <div><small>MYHOME DISCOVERY</small><strong>Welcome, {user?.fullName?.split(" ")[0] || "User"}</strong></div>
          <div className="user-top-actions">
            <Link to="/user/notifications" aria-label="Notifications"><i className="bi bi-bell"></i></Link>
            <button type="button" onClick={() => navigate("/user/profile")}><span>{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</span><span className="user-account-name">{user?.fullName?.split(" ")[0] || "User"}</span></button>
          </div>
        </header>
        <div className="user-content"><Outlet /></div>
      </main>
    </div>
  );
}

export default UserLayout;
