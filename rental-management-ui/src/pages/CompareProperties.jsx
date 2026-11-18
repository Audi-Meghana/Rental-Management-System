import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { getImageUrl, getProperty } from "../services/propertyService";

const rows = [
  ["propertyType", "Property type", (property) => property.propertyType || "Not provided"],
  ["location", "Location", (property) => [property.area, property.city, property.state].filter(Boolean).join(", ") || property.location],
  ["rent", "Monthly rent", (property) => `₹${Number(property.rent).toLocaleString("en-IN")}`],
  ["securityDeposit", "Security deposit", (property) => property.securityDeposit == null ? "Not provided" : `₹${Number(property.securityDeposit).toLocaleString("en-IN")}`],
  ["bedrooms", "Bedrooms", (property) => property.bedrooms ?? "Not provided"],
  ["bathrooms", "Bathrooms", (property) => property.bathrooms ?? "Not provided"],
  ["builtUpArea", "Built-up area", (property) => property.builtUpArea == null ? "Not provided" : `${property.builtUpArea} sq. ft.`],
  ["furnishing", "Furnishing", (property) => property.furnishing || "Not provided"],
  ["amenities", "Amenities", (property) => property.amenities?.split(/[|,]/).filter(Boolean).join(", ") || "Not provided"],
  ["maintenanceCharges", "Maintenance", (property) => property.maintenanceCharges == null ? "Not provided" : `₹${Number(property.maintenanceCharges).toLocaleString("en-IN")}`],
  ["parking", "Parking", (property) => property.parking || "Not provided"],
  ["availableFrom", "Available from", (property) => property.availableFrom ? new Date(property.availableFrom).toLocaleDateString("en-IN") : "Not provided"]
];

function CompareProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => {
      const ids = JSON.parse(localStorage.getItem("comparePropertyIds") || "[]");
      if (!Array.isArray(ids)) throw new Error("Saved comparison data is invalid.");
      return Promise.all(ids.slice(0, 3).map((id) => getProperty(id)));
      })
      .then((items) => { if (active) setProperties(items); })
      .catch((loadError) => { if (active) setError(loadError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const remove = (propertyId) => {
    const next = properties.filter((property) => property.id !== propertyId);
    setProperties(next);
    localStorage.setItem("comparePropertyIds", JSON.stringify(next.map((property) => String(property.id))));
  };

  return (
    <>
      <SiteHeader />
      <section className="public-page-intro"><span className="section-label">MAKE A CLEAR CHOICE</span><h1>Compare homes.</h1><p>Review the details side by side before you decide.</p></section>
      <main className="container compare-page">
        {error && <div className="detail-alert" role="alert">{error}</div>}
        {loading ? <div className="owner-loading"><span></span>Loading comparison...</div> : properties.length ? <>
          <div className="compare-header"><h2>{properties.length} of 3 homes</h2><Link to="/listings" className="owner-outline-button">Add another home</Link></div>
          <div className="compare-table-wrap"><table className="compare-table">
            <thead><tr><th>Property details</th>{properties.map((property) => <th key={property.id}>
              <button type="button" className="compare-remove" onClick={() => remove(property.id)} aria-label={`Remove ${property.title}`}><i className="bi bi-x-lg"></i></button>
              <img src={getImageUrl(property.imageUrl)} alt={property.title} /><Link to={`/property/${property.id}`}>{property.title}</Link>
            </th>)}</tr></thead>
            <tbody>{rows.map(([key, label, value]) => <tr key={key}><th>{label}</th>{properties.map((property) => <td key={property.id}>{value(property)}</td>)}</tr>)}</tbody>
          </table></div>
        </> : <div className="owner-empty-state"><i className="bi bi-columns-gap"></i><h3>Nothing to compare yet</h3><p>Add up to three properties from their details pages to compare important features.</p><Link to="/listings" className="owner-primary-button">Browse properties</Link></div>}
      </main>
    </>
  );
}

export default CompareProperties;
