import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl, getMyInterests } from "../../services/propertyService";

function InterestedProperties() {
  const [items, setItems] = useState([]);
  useEffect(() => { getMyInterests().then(setItems).catch(() => {}); }, []);
  return <div className="user-inner-page"><div className="owner-section-heading"><div><span className="section-label">YOUR SHORTLIST</span><h1>Interested properties</h1><p>Homes you’re keeping close.</p></div></div>{items.length ? <div className="user-interests-grid">{items.map((item) => <Link className="user-interest-card" to={`/property/${item.property.id}`} key={item.id}><img src={getImageUrl(item.property.imageUrl)} alt={item.property.title} /><div><h2>{item.property.title}</h2><p><i className="bi bi-geo-alt"></i>{item.property.location}</p><strong>₹{Number(item.property.rent).toLocaleString("en-IN")}<small>/ month</small></strong><span>Interested on {new Date(item.createdAt).toLocaleDateString("en-IN")}</span></div></Link>)}</div> : <div className="owner-empty-state owner-page-empty"><i className="bi bi-heart"></i><h3>Your shortlist is empty</h3><p>Browse homes and tap “I’m interested” when one feels right.</p><Link to="/listings" className="owner-primary-button">Browse homes <i className="bi bi-arrow-right"></i></Link></div>}</div>;
}

export default InterestedProperties;
