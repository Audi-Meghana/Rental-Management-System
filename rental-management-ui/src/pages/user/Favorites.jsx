import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFavorites, getImageUrl, removeFavorite } from "../../services/propertyService";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (propertyId) => {
    setError("");
    try {
      await removeFavorite(propertyId);
      setFavorites((current) => current.filter((item) => item.property.id !== propertyId));
    } catch (removeError) {
      setError(removeError.message);
    }
  };

  return (
    <div className="user-inner-page">
      <div className="owner-section-heading"><div><span className="owner-eyebrow">YOUR SHORTLIST</span><h1>Saved properties</h1><p>Keep the homes you like together while you decide.</p></div><Link to="/listings" className="owner-outline-button">Browse homes</Link></div>
      {error && <div className="owner-alert" role="alert">{error}</div>}
      {loading ? <div className="owner-loading"><span></span>Loading saved properties...</div> : favorites.length ? <div className="public-property-grid">
        {favorites.map(({ property }) => <article className="public-property-card saved-property-card" key={property.id}>
          <Link to={`/property/${property.id}`}>
            <div><img src={getImageUrl(property.imageUrl)} alt={property.title} /><span>{property.isAvailable ? "AVAILABLE" : "RENTED"}</span></div>
            <section><h2>{property.title}</h2><p><i className="bi bi-geo-alt"></i>{property.location}</p><footer><strong>₹{Number(property.rent).toLocaleString("en-IN")}<small>/ month</small></strong><span><i className="bi bi-door-open"></i>{property.bedrooms} bedrooms</span></footer></section>
          </Link>
          <button type="button" className="detail-icon-action is-saved" onClick={() => remove(property.id)}><i className="bi bi-heart-fill"></i>Remove</button>
        </article>)}
      </div> : <div className="owner-empty-state"><i className="bi bi-heart"></i><h3>No saved homes yet</h3><p>Tap the save button on a property to add it to your shortlist.</p><Link to="/listings" className="owner-primary-button">Explore listings</Link></div>}
    </div>
  );
}

export default Favorites;
