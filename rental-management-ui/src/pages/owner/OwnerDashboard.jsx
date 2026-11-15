import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwnerProperties, deleteProperty } from "../../services/propertyService";
import OwnerPropertyCard from "../../components/OwnerPropertyCard";
import { getUser } from "../../services/authService";

function OwnerDashboard() {
	const user = getUser();
	const [properties, setProperties] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;

		getOwnerProperties()
			.then((data) => {
				if (active) setProperties(data);
			})
			.catch((loadError) => {
				if (active) setError(loadError.message);
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	const handleDelete = async (property) => {
		if (!window.confirm(`Delete ${property.title}?`)) return;

		try {
			await deleteProperty(property.id);
			setProperties((current) => current.filter((item) => item.id !== property.id));
		} catch (deleteError) {
			setError(deleteError.message);
		}
	};

	const available = properties.filter((property) => property.isAvailable).length;
	const firstName = user?.fullName?.split(" ")[0] || "Owner";

	return (
		<div className="owner-dashboard-page">
			<section className="owner-hero-panel">
				<div>
					<span className="owner-eyebrow">YOUR PROPERTY DESK</span>
					<h1>Welcome back, {firstName}.</h1>
					<p>Keep your listings polished, visible, and ready for the right tenant.</p>
				</div>
				<Link to="/owner/properties/add" className="owner-primary-button"><i className="bi bi-plus-lg"></i>Add property</Link>
			</section>

			{error && <div className="owner-alert"><i className="bi bi-exclamation-circle"></i>{error}</div>}

			<section className="owner-stat-grid">
				<div className="owner-stat-card green"><span><i className="bi bi-buildings"></i></span><small>MY PROPERTIES</small><strong>{properties.length}</strong><em>Total listings</em></div>
				<div className="owner-stat-card lime"><span><i className="bi bi-check2-circle"></i></span><small>AVAILABLE</small><strong>{available}</strong><em>Open for applications</em></div>
				<div className="owner-stat-card plum"><span><i className="bi bi-people"></i></span><small>INTERESTED USERS</small><strong>0</strong><em>Awaiting connection</em></div>
				<div className="owner-stat-card gold"><span><i className="bi bi-bell"></i></span><small>NOTIFICATIONS</small><strong>0</strong><em>Nothing new today</em></div>
			</section>

			<section className="owner-section-heading">
				<div><span className="owner-eyebrow">YOUR PORTFOLIO</span><h2>My properties</h2><p>Manage the homes currently connected to your account.</p></div>
				<Link to="/owner/properties" className="owner-outline-button">View all <i className="bi bi-arrow-up-right"></i></Link>
			</section>

			{loading ? <div className="owner-loading"><span></span>Loading your properties...</div> : properties.length ? <div className="owner-property-grid">{properties.slice(0, 4).map((property) => <OwnerPropertyCard key={property.id} property={property} onDelete={handleDelete} />)}</div> : <div className="owner-empty-state"><i className="bi bi-house-add"></i><h3>Your portfolio starts here</h3><p>Add your first property and it will appear on the public listings page.</p><Link to="/owner/properties/add" className="owner-primary-button">Add first property <i className="bi bi-arrow-right"></i></Link></div>}

			<section className="owner-lower-grid">
				<div className="owner-feed-panel"><div className="owner-panel-heading"><div><span className="owner-eyebrow">PEOPLE</span><h2>Recent interested users</h2></div><Link to="/owner/interested-users">View all</Link></div><div className="owner-feed-empty"><i className="bi bi-people"></i><span>Interest activity will appear here when a user responds to a listing.</span></div></div>
				<div className="owner-feed-panel"><div className="owner-panel-heading"><div><span className="owner-eyebrow">UPDATES</span><h2>Recent notifications</h2></div><Link to="/owner/notifications">View all</Link></div><div className="owner-feed-empty"><i className="bi bi-bell"></i><span>You’re all caught up. New property activity will land here.</span></div></div>
			</section>
		</div>
	);
}

export default OwnerDashboard;
