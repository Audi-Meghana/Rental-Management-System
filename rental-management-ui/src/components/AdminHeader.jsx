import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../services/authService";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/tickets", label: "Support tickets" },
  { to: "/admin/news", label: "News" }
];

function AdminHeader() {
  const navigate = useNavigate();
  const admin = getUser();

  const signOut = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <header className="admin-reports-header admin-console-header">
      <Link to="/" className="user-brand">my<span>HOME</span></Link>
      <nav aria-label="Admin navigation">
        {links.map(({ to, label }) => <NavLink to={to} key={to}>{label}</NavLink>)}
      </nav>
      <div><span className="owner-eyebrow">ADMIN WORKSPACE</span><strong>{admin?.fullName || "Administrator"}</strong></div>
      <button type="button" className="owner-outline-button" onClick={signOut}>Logout</button>
    </header>
  );
}

export default AdminHeader;
