import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OwnerPropertyCard from "../../components/OwnerPropertyCard";
import { deleteProperty, getOwnerProperties } from "../../services/propertyService";

function OwnerProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOwnerProperties().then(setProperties).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false));
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

  return (
    <div className="owner-inner-page">
      <div className="owner-section-heading"><div><span className="owner-eyebrow">YOUR PORTFOLIO</span><h1>My properties</h1><p>Every home you list, in one calm place.</p></div><Link to="/owner/properties/add" className="owner-primary-button"><i className="bi bi-plus-lg"></i>Add property</Link></div>
      {error && <div className="owner-alert"><i className="bi bi-exclamation-circle"></i>{error}</div>}
      {loading ? <div className="owner-loading"><span></span>Loading your properties...</div> : properties.length ? <div className="owner-property-grid">{properties.map((property) => <OwnerPropertyCard key={property.id} property={property} onDelete={handleDelete} />)}</div> : <div className="owner-empty-state"><i className="bi bi-house-add"></i><h3>No properties yet</h3><p>Add your first listing to begin building your portfolio.</p><Link to="/owner/properties/add" className="owner-primary-button">Add property <i className="bi bi-arrow-right"></i></Link></div>}
    </div>
  );
}

export default OwnerProperties;
