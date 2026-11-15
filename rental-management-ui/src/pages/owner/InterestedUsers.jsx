import { useEffect, useState } from "react";
import { getOwnerInterests } from "../../services/propertyService";

function InterestedUsers() {
  const [items, setItems] = useState([]);
  useEffect(() => { getOwnerInterests().then(setItems).catch(() => {}); }, []);
  return <div className="owner-inner-page"><div className="owner-section-heading"><div><span className="owner-eyebrow">PEOPLE</span><h1>Interested users</h1><p>See who is looking closely at your properties.</p></div></div>{items.length ? <div className="owner-interest-table">{items.map((item) => <article key={item.id}><div className="owner-interest-person"><span>{item.user.fullName.charAt(0)}</span><div><strong>{item.user.fullName}</strong><small>{item.user.email} · {item.user.phoneNumber || "Phone not provided"}</small></div></div><div><small>Interested in</small><strong>{item.property.title}</strong></div><div><small>Date</small><strong>{new Date(item.createdAt).toLocaleDateString("en-IN")}</strong></div><em>{item.status}</em></article>)}</div> : <div className="owner-empty-state owner-page-empty"><i className="bi bi-people"></i><h3>No interested users yet</h3><p>When someone clicks “I’m interested” on one of your listings, their contact details and property interest will appear here.</p></div>}</div>;
}

export default InterestedUsers;
