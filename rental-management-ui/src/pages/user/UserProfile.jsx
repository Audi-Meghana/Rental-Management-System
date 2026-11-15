import { getUser } from "../../services/authService";

function UserProfile() {
  const user = getUser();
  return <div className="user-inner-page"><div className="owner-section-heading"><div><span className="section-label">YOUR ACCOUNT</span><h1>My profile</h1><p>Your personal details for a smoother rental search.</p></div></div><section className="user-profile-card"><div className="user-profile-intro"><span>{user?.fullName?.charAt(0)?.toUpperCase() || "U"}</span><div><h2>{user?.fullName || "User"}</h2><p>{user?.email}</p></div></div><div className="user-profile-grid"><div><small>Full name</small><strong>{user?.fullName || "-"}</strong></div><div><small>Email</small><strong>{user?.email || "-"}</strong></div><div><small>Phone</small><strong>{user?.phoneNumber || "-"}</strong></div><div><small>Location</small><strong>{user?.location || "-"}</strong></div><div className="wide"><small>Address</small><strong>{user?.address || "-"}</strong></div><div><small>Role</small><strong>User</strong></div></div></section></div>;
}

export default UserProfile;
