import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { getImageUrl, getProperties, getPropertyReviews } from "../services/propertyService";
import { getUser } from "../services/authService";

const currency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
const titleCase = (value) => value?.trim().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
const displayArea = (property) => [property.area, property.city]
  .map(titleCase)
  .filter(Boolean)
  .join(", ") || titleCase(property.location) || "";

function Home() {
  const [properties, setProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    getProperties({ isAvailable: true })
      .then(async (items) => {
        if (!active) return;
        setProperties(items);
        setLoading(false);

        const reviewResults = await Promise.allSettled(
          items.slice(0, 6).map((property) => getPropertyReviews(property.id))
        );
        if (!active) return;

        const actualReviews = reviewResults
          .flatMap((result, index) => result.status === "fulfilled"
            ? result.value.map((review) => ({
            ...review,
            propertyId: items[index].id,
            propertyLocation: displayArea(items[index])
            }))
            : [])
          .filter((review) => review.comment?.trim())
          .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
          .slice(0, 3);
        setReviews(actualReviews);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || "Unable to load properties right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const locations = useMemo(() => {
    const groups = new Map();
    properties.forEach((property) => {
      const location = displayArea(property);
      if (!location) return;
      const group = groups.get(location) || { name: location, count: 0, imageUrl: property.imageUrl };
      group.count += 1;
      if (!group.imageUrl && property.imageUrl) group.imageUrl = property.imageUrl;
      groups.set(location, group);
    });
    return [...groups.values()].sort((first, second) => second.count - first.count).slice(0, 3);
  }, [properties]);

  const handleSearch = (filters) => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== "")
    ).toString();
    navigate(`/listings${query ? `?${query}` : ""}`);
  };

  const ownerLink = getUser()?.role === "Owner" ? "/owner/properties/add" : "/login";

  return (
    <div className="reference-home">
      <SiteHeader />
      <Hero onSearch={handleSearch} />

      <section className="rh-trust-strip" aria-label="Rental platform benefits">
        <div><i className="bi bi-house-check"></i><span><strong>Clear listings</strong><small>Compare real property details</small></span></div>
        <div><i className="bi bi-shield-check"></i><span><strong>Safer decisions</strong><small>Review the terms before enquiring</small></span></div>
        <div><i className="bi bi-chat-dots"></i><span><strong>Direct enquiries</strong><small>Connect with the listing owner</small></span></div>
        <div><i className="bi bi-cash-coin"></i><span><strong>Rental costs upfront</strong><small>See charges provided by the owner</small></span></div>
      </section>

      <main>
        <section className="rh-section rh-featured">
          <div className="rh-section-heading">
            <div><span className="rh-eyebrow">THE BEST DEALS</span><h2>Featured properties</h2><p>Available homes currently listed on myHOME.</p></div>
            <Link to="/listings" className="rh-text-link">View all listings <i className="bi bi-arrow-right"></i></Link>
          </div>
          {error && <div className="rh-error" role="alert">{error}<button type="button" onClick={() => window.location.reload()}>Retry</button></div>}
          {loading ? <div className="rh-loading" role="status">Loading available properties…</div>
            : properties.length ? <div className="rh-property-grid">
              {properties.slice(0, 3).map((property) => (
                <Link to={`/property/${property.id}`} className="rh-property-card" key={property.id}>
                  <div className="rh-property-photo">
                    <img src={getImageUrl(property.imageUrl)} alt={property.title} loading="lazy" />
                    <span className="rh-availability">AVAILABLE</span>
                  </div>
                  <div className="rh-property-info">
                    <div className="rh-property-title"><h3>{property.title}</h3><strong>{currency(property.rent)}<small> / month</small></strong></div>
                    <p className="rh-property-location"><i className="bi bi-geo-alt-fill"></i>{displayArea(property)}</p>
                    <div className="rh-property-facts">
                      <span><i className="bi bi-door-open"></i>{property.bedrooms} bedroom{property.bedrooms === 1 ? "" : "s"}</span>
                      {property.bathrooms != null && <span><i className="bi bi-droplet"></i>{property.bathrooms} bath</span>}
                      {property.builtUpArea != null && <span><i className="bi bi-arrows-angle-expand"></i>{Number(property.builtUpArea).toLocaleString("en-IN")} sq. ft.</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div> : <div className="rh-empty-state"><i className="bi bi-house"></i><h3>No available properties yet</h3><p>New listings will appear here when an owner publishes them.</p></div>}
        </section>

        <section className="rh-stat-banner" aria-label="Current listing totals">
          <div className="rh-stat-message"><span>myHOME</span><h2>A better way to<br />find your home.</h2><p>Make rental decisions with more clarity and less hassle.</p></div>
          <div className="rh-stat"><i className="bi bi-buildings"></i><strong>{properties.length}</strong><span>Available properties</span></div>
          <div className="rh-stat"><i className="bi bi-geo-alt"></i><strong>{locations.length}</strong><span>Featured areas</span></div>
          <Link to="/listings" className="rh-stat-action">Explore homes <i className="bi bi-arrow-up-right"></i></Link>
        </section>

        {locations.length > 0 && <section className="rh-section rh-locations">
          <div className="rh-section-heading">
            <div><span className="rh-eyebrow">EXPLORE</span><h2>Popular locations</h2><p>Browse places represented in current listings.</p></div>
            <Link to="/listings" className="rh-text-link">All locations <i className="bi bi-arrow-right"></i></Link>
          </div>
          <div className="rh-location-grid">
            {locations.map((location) => (
              <Link to={`/listings?location=${encodeURIComponent(location.name)}`} className="rh-location-card" key={location.name}>
                <img src={getImageUrl(location.imageUrl)} alt={`Homes in ${location.name}`} loading="lazy" />
                <div><h3>{location.name}</h3><span>{location.count} available listing{location.count === 1 ? "" : "s"}</span><i className="bi bi-arrow-up-right"></i></div>
              </Link>
            ))}
          </div>
        </section>}

        {reviews.length > 0 && <section className="rh-section rh-reviews">
          <div className="rh-section-heading">
            <div><span className="rh-eyebrow">FROM OUR RENTERS</span><h2>What renters say</h2><p>Recent feedback shared on listed properties.</p></div>
          </div>
          <div className="rh-review-grid">
            {reviews.map((review) => (
              <article className="rh-review-card" key={`${review.propertyId}-${review.id}`}>
                <div className="rh-review-header"><span className="rh-review-avatar">{review.reviewer?.charAt(0)?.toUpperCase() || "R"}</span><div><strong>{review.reviewer}</strong><small><i className="bi bi-geo-alt-fill"></i>{review.propertyLocation}</small></div><span className="rh-review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(review.rating)}</span></div>
                <p>“{review.comment}”</p>
                {review.isVerifiedRenter && <span className="rh-verified"><i className="bi bi-patch-check-fill"></i>Verified renter</span>}
              </article>
            ))}
          </div>
        </section>}

        <section className="rh-section rh-how">
          <div className="rh-section-heading"><div><span className="rh-eyebrow">SIMPLE PROCESS</span><h2>How it works</h2><p>From your first search to arranging a visit, every step is simple.</p></div></div>
          <div className="rh-steps">
            <article>
              <div className="rh-step-visual"><span>01</span><i className="bi bi-search"></i></div>
              <div className="rh-step-content"><small>DISCOVER</small><h3>Search homes</h3><p>Find available rentals by location, property type, and bedrooms.</p><Link to="/listings">Browse listings <i className="bi bi-arrow-right"></i></Link></div>
            </article>
            <article>
              <div className="rh-step-visual"><span>02</span><i className="bi bi-house-check"></i></div>
              <div className="rh-step-content"><small>CHOOSE</small><h3>Compare options</h3><p>Check photos, rent, fees, amenities, and rental terms.</p><Link to="/compare">Compare homes <i className="bi bi-arrow-right"></i></Link></div>
            </article>
            <article>
              <div className="rh-step-visual"><span>03</span><i className="bi bi-chat-dots"></i></div>
              <div className="rh-step-content"><small>CONNECT</small><h3>Contact the owner</h3><p>Ask questions or send an enquiry to arrange a visit.</p><Link to="/listings">Find a home <i className="bi bi-arrow-right"></i></Link></div>
            </article>
          </div>
        </section>

        <section className="rh-owner-cta">
          <div className="rh-owner-copy"><span className="rh-eyebrow">FOR PROPERTY OWNERS</span><h2>Have a home to rent?</h2><p>Share your listing with renters looking for their next place.</p></div>
          <Link to={ownerLink} className="rh-owner-button"><i className="bi bi-plus-lg"></i>List your property</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
