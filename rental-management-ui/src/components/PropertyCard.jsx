import { getImageUrl } from "../services/propertyService";

function PropertyCard({ property }) {
  return (
    <div className="property-card">

      {/* Property Image */}
      <div className="property-image">

        <img
          src={
            getImageUrl(property.imageUrl)
          }
          alt={property.title}
        />

        {/* Availability */}
        <span
          className={
            property.isAvailable
              ? "property-status available"
              : "property-status rented"
          }
        >
          {property.isAvailable ? "AVAILABLE" : "RENTED"}
        </span>

      </div>


      {/* Property Details */}
      <div className="property-content">

        <h3>
          {property.title}
        </h3>

        <p className="property-location">
          <i className="bi bi-geo-alt-fill"></i>
          {property.location}
        </p>


        <div className="property-info">

          <span>
            <i className="bi bi-door-open"></i>
            {property.bedrooms} Rooms
          </span>

          <strong>
            ₹{Number(property.rent).toLocaleString("en-IN")}
            <small> / month</small>
          </strong>

        </div>

      </div>

    </div>
  );
}

export default PropertyCard;