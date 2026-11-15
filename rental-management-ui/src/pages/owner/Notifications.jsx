import { useEffect, useState } from "react";
import { getNotifications } from "../../services/propertyService";

function Notifications() {
  const [items, setItems] = useState([]);
  useEffect(() => { getNotifications().then(setItems).catch(() => {}); }, []);
  return <div className="owner-inner-page"><div className="owner-section-heading"><div><span className="owner-eyebrow">UPDATES</span><h1>Notifications</h1><p>Important activity from your property portfolio.</p></div></div>{items.length ? <div className="owner-notification-list">{items.map((item) => <article key={item.id}><i className="bi bi-bell"></i><div><strong>{item.message}</strong><small>{new Date(item.createdAt).toLocaleString("en-IN")}</small></div></article>)}</div> : <div className="owner-empty-state owner-page-empty"><i className="bi bi-bell"></i><h3>You’re all caught up</h3><p>New interest, property updates, and account activity will appear here.</p></div>}</div>;
}

export default Notifications;
