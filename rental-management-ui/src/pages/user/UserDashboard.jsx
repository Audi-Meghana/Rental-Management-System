import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getImageUrl, getMyInterests, getNotifications } from "../../services/propertyService";
import { getUser } from "../../services/authService";

function UserDashboard() {
  const user = getUser();
  const [interests, setInterests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { getMyInterests().then(setInterests).catch(() => {}); getNotifications().then(setNotifications).catch(() => {}); }, []);
  return <div className="user-dashboard-page"><section className="user-welcome-panel"><div><span className="section-label">YOUR HOME SEARCH</span><h1>Welcome back, {user?.fullName?.split(" ")[0] || "User"}.</h1><p>Find a place that fits the life you’re building.</p></div><Link to="/listings" className="owner-primary-button"><i className="bi bi-search"></i>Browse homes</Link></section><div className="user-stat-grid"><div><i className="bi bi-heart"></i><small>INTERESTED HOMES</small><strong>{interests.length}</strong></div><div><i className="bi bi-bell"></i><small>NOTIFICATIONS</small><strong>{notifications.length}</strong></div><div><i className="bi bi-search"></i><small>DISCOVER</small><strong>∞</strong></div></div><section className="user-dashboard-lower"><div className="user-dashboard-panel"><header><div><span className="section-label">YOUR SHORTLIST</span><h2>Interested properties</h2></div><Link to="/user/interested-properties">View all</Link></header>{interests.length ? interests.slice(0, 3).map((item) => <Link className="user-interest-row" to={`/property/${item.property.id}`} key={item.id}><img src={getImageUrl(item.property.imageUrl)} alt="" /><div><strong>{item.property.title}</strong><span>{item.property.location}</span></div><i className="bi bi-arrow-up-right"></i></Link>) : <div className="user-empty-inline"><i className="bi bi-heart"></i><span>Your interested homes will appear here.</span></div>}</div><div className="user-dashboard-panel"><header><div><span className="section-label">UPDATES</span><h2>Notifications</h2></div><Link to="/user/notifications">View all</Link></header>{notifications.length ? notifications.slice(0, 4).map((item) => <div className="user-notification-row" key={item.id}><i className="bi bi-bell"></i><span>{item.message}</span></div>) : <div className="user-empty-inline"><i className="bi bi-check2-circle"></i><span>You’re all caught up.</span></div>}</div></section></div>;
}

export default UserDashboard;
