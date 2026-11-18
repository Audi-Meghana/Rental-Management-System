import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { getImageUrl, getProperties } from "../services/propertyService";

const bedroomOptions = ["", "1", "2", "3", "4", "5"];
const propertyTypes = ["Apartment", "Independent house", "Villa", "PG", "Studio", "Other"];

function filtersFromParams(params) {
  return {
    location: params.get("location") || "",
    propertyType: params.get("propertyType") || "",
    bedrooms: params.get("bedrooms") || "",
    minRent: params.get("minRent") || "",
    maxRent: params.get("maxRent") || "",
    isAvailable: params.get("isAvailable") ?? "true"
  };
}

function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const requestFilters = filtersFromParams(searchParams);

    void Promise.resolve().then(async () => {
      if (!active) return;
      setFilters(requestFilters);
      setLoading(true);
      setError("");
      try {
        const items = await getProperties(requestFilters);
        if (active) setProperties(items);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    });

    return () => { active = false; };
  }, [searchParams]);

  const sortedProperties = useMemo(() => {
    const results = [...properties];
    if (sortBy === "rent-low") results.sort((first, second) => first.rent - second.rent);
    if (sortBy === "rent-high") results.sort((first, second) => second.rent - first.rent);
    return results;
  }, [properties, sortBy]);

  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));

  const submitFilters = (event) => {
    event.preventDefault();
    setSearchParams(Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    ));
    setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilters(filtersFromParams(new URLSearchParams()));
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  const featuredProperty = properties[0];

  return (
    <>
      <SiteHeader />
      <div className="listing-explorer">
      <aside className={`listing-filter-sidebar${mobileFiltersOpen ? " is-open" : ""}`}>
        <form className="listing-filter-form" onSubmit={submitFilters}>
          <div className="listing-filter-heading">
            <div><span className="listing-overline">REFINE YOUR SEARCH</span><h2>Filters</h2></div>
            <button type="button" onClick={clearFilters}>Clear</button>
          </div>

          <label className="listing-filter-field">
            <span>Location</span>
            <span className="listing-search-input"><i className="bi bi-search"></i><input aria-label="Search location" placeholder="City or neighbourhood" value={filters.location} onChange={(event) => updateFilter("location", event.target.value)} /></span>
          </label>

          <fieldset className="listing-filter-group">
            <legend>Property type</legend>
            <select aria-label="Property type" value={filters.propertyType} onChange={(event) => updateFilter("propertyType", event.target.value)}>
              <option value="">All property types</option>
              {propertyTypes.map((type) => <option value={type} key={type}>{type}</option>)}
            </select>
          </fieldset>

          <fieldset className="listing-filter-group">
            <legend>Bedrooms</legend>
            <div className="listing-bedroom-options">
              {bedroomOptions.map((bedrooms) => (
                <button type="button" key={bedrooms || "any"} className={filters.bedrooms === bedrooms ? "selected" : ""} aria-label={bedrooms ? `${bedrooms} ${bedrooms === "1" ? "bedroom" : "bedrooms"}` : "Any number of bedrooms"} aria-pressed={filters.bedrooms === bedrooms} onClick={() => updateFilter("bedrooms", bedrooms)}>
                  {bedrooms || "Any"}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="listing-filter-group">
            <legend>Monthly rent</legend>
            <div className="listing-rent-fields">
              <label><span>Minimum</span><input type="number" min="0" aria-label="Minimum monthly rent" placeholder="₹ 0" value={filters.minRent} onChange={(event) => updateFilter("minRent", event.target.value)} /></label>
              <label><span>Maximum</span><input type="number" min="0" aria-label="Maximum monthly rent" placeholder="No limit" value={filters.maxRent} onChange={(event) => updateFilter("maxRent", event.target.value)} /></label>
            </div>
          </fieldset>

          <label className="listing-filter-field">
            <span>Availability</span>
            <select aria-label="Availability" value={filters.isAvailable} onChange={(event) => updateFilter("isAvailable", event.target.value)}>
              <option value="true">Available now</option>
              <option value="">Any availability</option>
              <option value="false">Currently rented</option>
            </select>
          </label>

          <div className="listing-filter-actions">
            <button type="submit" className="listing-primary-button">Apply filters <i className="bi bi-arrow-right"></i></button>
            <button type="button" className="listing-clear-button" onClick={clearFilters}>Reset all</button>
          </div>
        </form>
      </aside>

      <main className="listing-main">
        <header className="listing-hero">
          <div className="listing-hero-copy">
            <span className="listing-overline"><i></i> MYHOME / LISTINGS</span>
            <h1>Find your next <span>address.</span></h1>
            <p>Browse real homes listed by myHOME owners.</p>
          </div>
          {featuredProperty && <Link className="listing-hero-photo" to={`/property/${featuredProperty.id}`} aria-label={`View ${featuredProperty.title}`}>
            <img src={getImageUrl(featuredProperty.imageUrl)} alt="" />
            <span><i className="bi bi-geo-alt"></i>{featuredProperty.area || featuredProperty.city || featuredProperty.location}</span>
          </Link>}
        </header>

        {error && <div className="owner-alert listing-error" role="alert"><i className="bi bi-exclamation-circle"></i>{error}</div>}
        <div className="listing-results-toolbar">
          <div className="listing-results-count" aria-live="polite">
            <strong>{loading ? "—" : properties.length}</strong>
            <span>{loading ? "Finding homes..." : `${properties.length === 1 ? "property" : "properties"} found`}</span>
          </div>
          <button type="button" className="listing-mobile-filter-button" aria-expanded={mobileFiltersOpen} onClick={() => setMobileFiltersOpen((open) => !open)}>
            <i className="bi bi-sliders"></i> Filters
          </button>
          <label className="listing-sort-control">Sort by
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort properties">
              <option value="recommended">Recommended</option>
              <option value="rent-low">Rent: low to high</option>
              <option value="rent-high">Rent: high to low</option>
            </select>
          </label>
          <div className="listing-view-toggle" role="group" aria-label="Listing layout">
            <button type="button" className={viewMode === "grid" ? "active" : ""} aria-label="Grid view" aria-pressed={viewMode === "grid"} onClick={() => setViewMode("grid")}><i className="bi bi-grid-3x3-gap"></i></button>
            <button type="button" className={viewMode === "list" ? "active" : ""} aria-label="List view" aria-pressed={viewMode === "list"} onClick={() => setViewMode("list")}><i className="bi bi-list-ul"></i></button>
          </div>
        </div>

        {loading ? <div className="listing-loading"><span></span>Loading available homes...</div>
          : sortedProperties.length ? <div className={`listing-results-grid ${viewMode === "list" ? "list-view" : ""}`}>
            {sortedProperties.map((property, index) => (
              <Link className="listing-result-card" to={`/property/${property.id}`} key={property.id}>
                <div className="listing-result-image">
                  <img src={getImageUrl(property.imageUrl)} alt={property.title} />
                  <span className={`listing-status${property.isAvailable ? " available" : ""}`}>{property.isAvailable ? "Available" : "Rented"}</span>
                </div>
                <div className="listing-result-copy">
                  <div className="listing-card-topline"><span>{String(index + 1).padStart(2, "0")} / {property.propertyType || property.title || "Home"}</span><i className="bi bi-arrow-up-right"></i></div>
                  <h2>{property.title}</h2>
                  <p className="listing-card-location"><i className="bi bi-geo-alt"></i>{property.area || property.city || property.location}{property.state ? `, ${property.state}` : ""}</p>
                  <div className="listing-card-details">
                    <span><i className="bi bi-door-open"></i>{property.bedrooms} {property.bedrooms === 1 ? "bedroom" : "bedrooms"}</span>
                    {property.bathrooms != null && <span><i className="bi bi-droplet"></i>{property.bathrooms} {property.bathrooms === 1 ? "bath" : "baths"}</span>}
                    {Number(property.builtUpArea) > 0 && <span><i className="bi bi-arrows-angle-expand"></i>{Number(property.builtUpArea).toLocaleString("en-IN")} sq. ft.</span>}
                  </div>
                  <footer><strong>₹{Number(property.rent).toLocaleString("en-IN")}<small> / month</small></strong><span>View home <i className="bi bi-arrow-right"></i></span></footer>
                </div>
              </Link>
            ))}
          </div>
          : <div className="listing-empty-state"><span><i className="bi bi-house-x"></i></span><h2>No homes match your search</h2><p>Try changing the filters or clear them to browse all available properties.</p><button type="button" className="listing-primary-button" onClick={clearFilters}>Clear filters <i className="bi bi-arrow-right"></i></button></div>}
      </main>
      </div>
    </>
  );
}

export default Listings;
