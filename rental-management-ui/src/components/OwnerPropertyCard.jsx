import { Link } from "react-router-dom";
import { getImageUrl } from "../services/propertyService";

function OwnerPropertyCard({ property, onDelete }) {
  return (
    <article className="owner-property-card">
      <div className="owner-property-image">
        <img src={getImageUrl(property.imageUrl)} alt={property.title} />
        <span className={`owner-status ${property.isAvailable ? "available" : "rented"}`}>
          <i className="bi bi-circle-fill"></i>
          {property.isAvailable ? "Available" : "Rented"}
        </span>
      </div>
      <div className="owner-property-copy">
        <div className="owner-property-heading">
          <div>
            <h3>{property.title}</h3>
            <p><i className="bi bi-geo-alt"></i>{property.location}</p>
          </div>
          <strong>₹{Number(property.rent).toLocaleString("en-IN")}<small>/month</small></strong>
        </div>
        <div className="owner-property-meta">
          <span><i className="bi bi-door-open"></i>{property.bedrooms} bedrooms</span>
          <span><i className="bi bi-check2-circle"></i>{property.isAvailable ? "Ready to rent" : "Currently rented"}</span>
        </div>
        <div className="owner-property-actions">
          <Link to={`/listings/${property.id}`} className="owner-text-button">View details <i className="bi bi-arrow-up-right"></i></Link>
          <Link to={`/owner/properties/edit/${property.id}`} className="owner-light-button"><i className="bi bi-pencil"></i>Edit</Link>
          <button type="button" className="owner-delete-button" onClick={() => onDelete(property)} aria-label={`Delete ${property.title}`}><i className="bi bi-trash3"></i></button>
        </div>
      </div>
    </article>
  );
}

export default OwnerPropertyCard;
