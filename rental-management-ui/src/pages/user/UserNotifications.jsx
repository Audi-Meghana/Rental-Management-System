import { useEffect, useState } from "react";
import { getNotifications } from "../../services/propertyService";

function UserNotifications() {
  const [items, setItems] = useState([]);
  useEffect(() => { getNotifications().then(setItems).catch(() => {}); }, []);
  return <div className="user-inner-page"><div className="owner-section-heading"><div><span className="section-label">UPDATES</span><h1>Notifications</h1><p>Stay close to the homes and conversations that matter.</p></div></div><div className="user-notifications-page">{items.length ? items.map((item) => <article key={item.id}><i className="bi bi-bell"></i><div><strong>{item.message}</strong><small>{new Date(item.createdAt).toLocaleString("en-IN")}</small></div></article>) : <div className="owner-empty-state owner-page-empty"><i className="bi bi-check2-circle"></i><h3>You’re all caught up</h3><p>New activity will appear here.</p></div>}</div></div>;
}

export default UserNotifications;
