import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getImageUrl, getProperties } from "../services/propertyService";

function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ location: searchParams.get("location") || "", bedrooms: searchParams.get("bedrooms") || "", minRent: "", maxRent: "", isAvailable: "true" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProperties(Object.fromEntries(searchParams.entries()))
      .then(setProperties).catch((loadError) => setError(loadError.message)).finally(() => setLoading(false));
  }, [searchParams]);

  const applyFilters = (event) => { event.preventDefault(); setSearchParams(Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ""))); };

  return (
    <><section className="public-page-intro"><span className="section-label">FIND YOUR NEXT ADDRESS</span><h1>Homes made for living.</h1><p>Browse real properties listed by myHOME owners.</p></section><main className="listings-page container">
      <form className="listing-filter-bar" onSubmit={applyFilters}><input placeholder="Search location" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} /><input type="number" placeholder="Min rent" value={filters.minRent} onChange={(event) => setFilters({ ...filters, minRent: event.target.value })} /><input type="number" placeholder="Max rent" value={filters.maxRent} onChange={(event) => setFilters({ ...filters, maxRent: event.target.value })} /><select value={filters.bedrooms} onChange={(event) => setFilters({ ...filters, bedrooms: event.target.value })}><option value="">Any bedrooms</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3 bedrooms</option><option value="4">4 bedrooms</option></select><label><input type="checkbox" checked={filters.isAvailable === "true"} onChange={(event) => setFilters({ ...filters, isAvailable: event.target.checked ? "true" : "" })} /> Available</label><button type="submit" className="owner-primary-button">Apply filters <i className="bi bi-search"></i></button></form>
      {error && <div className="owner-alert">{error}</div>}{loading ? <div className="owner-loading"><span></span>Finding homes...</div> : properties.length ? <div className="public-property-grid">{properties.map((property) => <Link className="public-property-card" to={`/property/${property.id}`} key={property.id}><div><img src={getImageUrl(property.imageUrl)} alt={property.title} /><span>{property.isAvailable ? "AVAILABLE" : "RENTED"}</span></div><section><h2>{property.title}</h2><p><i className="bi bi-geo-alt"></i>{property.location}</p><footer><strong>₹{Number(property.rent).toLocaleString("en-IN")}<small>/ month</small></strong><span><i className="bi bi-door-open"></i>{property.bedrooms} bedrooms</span></footer></section></Link>)}</div> : <div className="owner-empty-state"><i className="bi bi-house"></i><h3>No homes match those filters</h3><p>Try another location or widen your rent range.</p></div>}
    </main></>
  );
}

export default Listings;
