import { getUser } from "../../services/authService";

function OwnerProfile() {
	const user = getUser();

	return (
		<div className="owner-inner-page">
			<div className="owner-section-heading"><div><span className="owner-eyebrow">YOUR ACCOUNT</span><h1>My profile</h1><p>Your owner details and account information.</p></div></div>
			<section className="owner-profile-card">
				<div className="owner-profile-intro"><div className="owner-profile-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || "O"}</div><div><span className="owner-eyebrow">PROPERTY OWNER</span><h2>{user?.fullName || "Owner"}</h2><p>{user?.email}</p></div></div>
				<div className="owner-profile-grid">
					<div><small>Full name</small><strong>{user?.fullName || "-"}</strong></div>
					<div><small>Email address</small><strong>{user?.email || "-"}</strong></div>
					<div><small>Phone number</small><strong>{user?.phoneNumber || "-"}</strong></div>
					<div><small>Location</small><strong>{user?.location || "-"}</strong></div>
					  <div><small>ZIP code</small><strong>{user?.zipCode || "-"}</strong></div>
					<div className="wide"><small>Address</small><strong>{user?.address || "-"}</strong></div>
					<div><small>Role</small><strong>Owner</strong></div>
				</div>
			</section>
		</div>
	);
}

export default OwnerProfile;
