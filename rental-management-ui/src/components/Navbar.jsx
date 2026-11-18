import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "../pages/auth/Login";
import UserSignup from "../pages/auth/UserSignup";
import OwnerSignup from "../pages/auth/OwnerSignup";
import {
  getUser,
  logoutUser
} from "../services/authService";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserSignup, setShowUserSignup] = useState(false);
  const [showOwnerSignup, setShowOwnerSignup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [user, setUser] = useState(() => getUser());

  useEffect(() => {
    const popupIsOpen =
      showLogin ||
      showRegister ||
      showUserSignup ||
      showOwnerSignup;

    if (popupIsOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [
    showLogin,
    showRegister,
    showUserSignup,
    showOwnerSignup
  ]);

  // LOGIN
  const openLogin = (email = "") => {
    setLoginEmail(email);

    setShowRegister(false);
    setShowUserSignup(false);
    setShowOwnerSignup(false);

    setShowLogin(true);
  };

  // REGISTER CHOICE
  const openRegister = () => {
    setShowLogin(false);
    setShowUserSignup(false);
    setShowOwnerSignup(false);

    setShowRegister(true);
  };

  // USER SIGNUP
  const openUserSignup = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowOwnerSignup(false);

    setShowUserSignup(true);
  };

  // OWNER SIGNUP
  const openOwnerSignup = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowUserSignup(false);

    setShowOwnerSignup(true);
  };

  const handleAuthenticated = (authenticatedUser) => {
    setUser(authenticatedUser);
    setShowLogin(false);
    setShowRegister(false);
    setShowUserSignup(false);
    setShowOwnerSignup(false);
  };

  const handleSignOut = () => {
    logoutUser();
    setUser(null);
  };

  const firstName = user?.fullName?.split(" ")[0] || "Account";
  const isOwner = user?.role === "Owner";
  const isAdmin = user?.role === "Admin";

  return (
    <>
      {/* NAVBAR */}
      <nav className="main-navbar">
        <div className="container-fluid px-4 px-lg-5">
          <div className="navbar-content">

            {/* LOGO */}
            <Link to="/" className="brand-logo">
              my<span>HOME</span>
            </Link>

            {/* NAV LINKS */}
            <div
              id="site-navigation"
              className={`nav-links${isMobileMenuOpen ? " is-open" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-item-link${isActive ? " active" : ""}`}
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) => `nav-item-link${isActive ? " active" : ""}`}
              >
                About Us
              </NavLink>

              <NavLink
                to="/listings"
                className={({ isActive }) => `nav-item-link${isActive ? " active" : ""}`}
              >
                Listings
              </NavLink>

              <NavLink
                to="/news"
                className={({ isActive }) => `nav-item-link${isActive ? " active" : ""}`}
              >
                News
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) => `nav-item-link${isActive ? " active" : ""}`}
              >
                Contact
              </NavLink>
            </div>

            {/* ACTION BUTTONS */}
            <div className="navbar-actions">

              {user ? (
                <div className="profile-menu">
                  <button
                    type="button"
                    className="profile-trigger"
                    aria-label="Open account menu"
                  >
                    <span className="profile-avatar">
                      {firstName.charAt(0).toUpperCase()}
                    </span>
                    <span className="profile-trigger-copy">
                      <strong>{firstName}</strong>
                      <small>{isOwner ? "Owner" : "User"}</small>
                    </span>
                    <i className="bi bi-chevron-down"></i>
                  </button>

                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <strong>{user.fullName}</strong>
                      <span>{user.email}</span>
                    </div>

                    <Link to={isAdmin ? "/admin" : isOwner ? "/owner/dashboard" : "/user/dashboard"}>
                      <i className="bi bi-grid-1x2"></i>
                      Dashboard
                    </Link>

                    {!isAdmin && <Link to={isOwner ? "/owner/chats" : "/user/chats"}>
                      <i className="bi bi-chat-dots"></i>
                      Chats
                      {isOwner && <small>Owner chats</small>}
                    </Link>}

                    <button
                      type="button"
                      className="profile-signout"
                      onClick={handleSignOut}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="login-btn"
                    onClick={() => openLogin()}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="register-btn"
                    onClick={openRegister}
                  >
                    Register
                  </button>
                </>
              )}

            </div>

            <button
              type="button"
              className="mobile-nav-toggle"
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="site-navigation"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            >
              <i className={`bi ${isMobileMenuOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true"></i>
            </button>

          </div>
        </div>
      </nav>

      {/* LOGIN POPUP */}
      {showLogin && (
        <Login
          email={loginEmail}
          onClose={() => setShowLogin(false)}
          onRegister={openRegister}
          onAuthenticated={handleAuthenticated}
        />
      )}

      {/* REGISTER CHOICE POPUP */}
      {showRegister && (
        <div
          className="auth-modal-backdrop"
          onClick={() => setShowRegister(false)}
        >
          <div
            className="auth-modal signup-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}
            <button
              type="button"
              className="auth-modal-close"
              onClick={() =>
                setShowRegister(false)
              }
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* LOGO */}
            <div className="auth-modal-logo">
              my<span>HOME</span>
            </div>

            <h2>Create Your Account</h2>

            <p className="auth-modal-subtitle">
              Choose how you want to use myHOME.
            </p>

            {/* OPTIONS */}
            <div className="registration-choice">

              {/* USER */}
              <button
                type="button"
                className="registration-option"
                onClick={openUserSignup}
              >
                <i className="bi bi-person"></i>

                <span>
                  <strong>
                    I'm looking for a home
                  </strong>

                  <small>
                    Register as a User
                  </small>
                </span>

                <i className="bi bi-arrow-right"></i>
              </button>

              {/* OWNER */}
              <button
                type="button"
                className="registration-option"
                onClick={openOwnerSignup}
              >
                <i className="bi bi-building"></i>

                <span>
                  <strong>
                    I want to rent out a property
                  </strong>

                  <small>
                    Register as an Owner
                  </small>
                </span>

                <i className="bi bi-arrow-right"></i>
              </button>

            </div>

            {/* LOGIN LINK */}
            <p className="auth-switch">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => openLogin()}
              >
                Login
              </button>
            </p>

          </div>
        </div>
      )}

      {/* USER SIGNUP */}
      {showUserSignup && (
        <UserSignup
          onClose={() =>
            setShowUserSignup(false)
          }
          onAuthenticated={handleAuthenticated}
          onLogin={(email) =>
            openLogin(email)
          }
        />
      )}

      {/* OWNER SIGNUP */}
      {showOwnerSignup && (
        <OwnerSignup
          onClose={() =>
            setShowOwnerSignup(false)
          }
          onAuthenticated={handleAuthenticated}
          onLogin={(email) =>
            openLogin(email)
          }
        />
      )}
    </>
  );
}

export default Navbar;