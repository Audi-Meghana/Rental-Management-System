import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUser, logoutUser } from "../services/authService";

function OwnerLayout() {
  const navigate = useNavigate();
  const user = getUser();
  const [mobileMenu, setMobileMenu] = useState(false);

  const signOut = () => {
    logoutUser();
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenu(false);

  return (
    <div className="owner-app-shell">
      <aside className={`owner-sidebar ${mobileMenu ? "is-open" : ""}`}>
        <div className="owner-sidebar-brand">
          <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
            my<span>HOME</span>
          </Link>
          <span className="owner-panel-label">OWNER PANEL</span>
        </div>

        <nav className="owner-menu" id="owner-navigation" aria-label="Owner navigation">
          <NavLink to="/owner/dashboard" onClick={closeMobileMenu}>
            <i className="bi bi-grid-1x2"></i> Dashboard
          </NavLink>
          <NavLink to="/owner/profile" onClick={closeMobileMenu}>
            <i className="bi bi-person"></i> My Profile
          </NavLink>
          <NavLink to="/owner/properties/add" onClick={closeMobileMenu}>
            <i className="bi bi-plus-square"></i> Add Property
          </NavLink>
          <NavLink to="/owner/properties" onClick={closeMobileMenu}>
            <i className="bi bi-buildings"></i> My Properties
          </NavLink>
          <NavLink to="/owner/interested-users" onClick={closeMobileMenu}>
            <i className="bi bi-people"></i> Interested Users
          </NavLink>
          <NavLink to="/owner/tenancies" onClick={closeMobileMenu}>
            <i className="bi bi-file-earmark-text"></i> Tenancies
          </NavLink>
          <NavLink to="/owner/notifications" onClick={closeMobileMenu}>
            <i className="bi bi-bell"></i> Notifications
          </NavLink>
        </nav>

        <button type="button" className="owner-sidebar-logout" onClick={signOut}>
          <i className="bi bi-box-arrow-left"></i> Logout
        </button>
      </aside>

      {mobileMenu && (
        <button
          type="button"
          className="owner-sidebar-backdrop"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        />
      )}

      <main className="owner-main-content">
        <header className="owner-topbar">
          <button
            type="button"
            className="owner-mobile-toggle"
            aria-label="Open owner menu"
            aria-expanded={mobileMenu}
            aria-controls="owner-navigation"
            onClick={() => setMobileMenu(true)}
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="owner-topbar-welcome">
            <span>OWNER WORKSPACE</span>
            <strong>Welcome, {user?.fullName?.split(" ")[0] || "Owner"}</strong>
          </div>

          <div className="owner-topbar-actions">
            <Link to="/owner/notifications" className="owner-icon-button" aria-label="Notifications">
              <i className="bi bi-bell"></i>
              <span className="owner-notification-dot"></span>
            </Link>
            <button type="button" className="owner-account-chip" onClick={() => navigate("/owner/profile")}>
              <span>{user?.fullName?.charAt(0)?.toUpperCase() || "O"}</span>
              <strong>{user?.fullName?.split(" ")[0] || "Owner"}</strong>
            </button>
            <button type="button" className="owner-logout-top" onClick={signOut}>
              Logout
            </button>
          </div>
        </header>

        <div className="owner-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default OwnerLayout;
