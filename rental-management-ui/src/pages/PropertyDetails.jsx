/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import {
  addFavorite, addPropertyReview, createPropertyEnquiry, getChat, getFavorites,
  addPropertyAlert, getImageUrl, getMyTenancies, getPropertyAlerts, getPropertyImages, getProperties,
  getProperty, getPropertyReviews, getRecentlyViewed, getRecommendedProperties,
  recordPropertyView, removeFavorite, removePropertyAlert, reportProperty, sendChat
} from "../services/propertyService";
import { getUser } from "../services/authService";

const reviewCategories = [
  ["cleanlinessRating", "Cleanliness"],
  ["locationRating", "Location"],
  ["maintenanceRating", "Maintenance"],
  ["ownerCommunicationRating", "Owner communication"]
];

const amenityIcons = {
  "Wi-Fi": "bi-wifi", Parking: "bi-car-front", Lift: "bi-arrow-up-square",
  Security: "bi-shield-check", "Water supply": "bi-droplet", "Power backup": "bi-lightning",
  CCTV: "bi-camera-video", Laundry: "bi-basket", Garden: "bi-flower1",
  Gym: "bi-heart-pulse", "Swimming pool": "bi-water", "Dining area": "bi-cup-hot"
};

const currency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;
const displayValue = (value, suffix = "") => value === null || value === undefined || value === ""
  ? "Not provided"
  : `${value}${suffix}`;
const dateInputValue = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function PropertyDetails() {
  const { id } = useParams();
  const user = useMemo(() => getUser(), []);
  const [property, setProperty] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [reviewNotice, setReviewNotice] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [enquiry, setEnquiry] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    preferredVisitDate: "",
    preferredVisitTime: "",
    numberOfOccupants: 1,
    message: ""
  });
  const [report, setReport] = useState({ category: "Incorrect information", description: "" });
  const [review, setReview] = useState({
    rating: 5, cleanlinessRating: 5, locationRating: 5,
    maintenanceRating: 5, ownerCommunicationRating: 5, comment: ""
  });
  const [budget, setBudget] = useState("");

  useEffect(() => {
    let active = true;
    setProperty(null);
    setActiveImage(0);
    setLightboxOpen(false);
    setError("");

    getProperty(id)
      .then(async (data) => {
        if (!active) return;
        setProperty(data);
        const [propertiesResult, reviewsResult, recommendationsResult] = await Promise.allSettled([
          getProperties({ zipCode: data.zipCode, isAvailable: true }),
          getPropertyReviews(id),
          getRecommendedProperties()
        ]);
        if (!active) return;
        if (propertiesResult.status === "fulfilled") {
          setNearby(propertiesResult.value.filter((item) => String(item.id) !== String(id)).slice(0, 3));
        } else {
          setError(propertiesResult.reason.message);
        }
        if (reviewsResult.status === "fulfilled") setReviews(reviewsResult.value);
        else setReviewNotice(reviewsResult.reason.message);
        if (recommendationsResult.status === "fulfilled") setRecommendations(recommendationsResult.value);
        else setError((current) => current || recommendationsResult.reason.message);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      });

    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    setEnquiry((current) => ({
      ...current,
      fullName: current.fullName || user?.fullName || "",
      phoneNumber: current.phoneNumber || user?.phoneNumber || "",
      email: current.email || user?.email || ""
    }));
    if (!user || user.role !== "User" || !id) return;

    getFavorites()
      .then((items) => setFavorite(items.some((item) => String(item.property.id) === String(id))))
      .catch((favoriteError) => setError(favoriteError.message));
    getPropertyAlerts()
      .then((items) => setAlertEnabled(items.some((item) => String(item.property.id) === String(id))))
      .catch((alertError) => setError(alertError.message));
    getMyTenancies()
      .then((items) => setCanReview(items.some((item) =>
        String(item.property.id) === String(id) && item.status === "Confirmed")))
      .catch((tenancyError) => setError(tenancyError.message));
    recordPropertyView(id)
      .then(() => getRecentlyViewed())
      .then((items) => setRecentlyViewed(items.filter((item) => String(item.property.id) !== String(id)).slice(0, 3)))
      .catch((viewError) => setError(viewError.message));
    getChat(id).then(setMessages).catch((chatError) => setError(chatError.message));
  }, [id, user]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") changeImage(1);
      if (event.key === "ArrowLeft") changeImage(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const images = useMemo(() => {
    if (!property) return [];
    const propertyImages = getPropertyImages(property);
    return propertyImages.length ? propertyImages : [getImageUrl(property.imageUrl)];
  }, [property]);
  const amenities = (property?.amenities || "").split(/[|,]/).map((item) => item.trim()).filter(Boolean);
  const landmarks = (property?.nearbyLandmarks || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  const rentalPreferences = [
    { label: "Preferred tenants", value: property?.preferredTenants?.trim(), icon: "bi-people" },
    { label: "Gender preference", value: property?.genderPreference?.trim(), icon: "bi-person" },
    { label: "Pets", value: property?.petsAllowed == null ? "" : property.petsAllowed ? "Allowed" : "Not allowed", icon: "bi-paw" },
    { label: "Smoking", value: property?.smokingAllowed == null ? "" : property.smokingAllowed ? "Allowed" : "Not allowed", icon: "bi-slash-circle" },
    { label: "Drinking", value: property?.drinkingAllowed == null ? "" : property.drinkingAllowed ? "Allowed" : "Not allowed", icon: "bi-cup" },
    { label: "Visitors", value: property?.visitorsAllowed == null ? "" : property.visitorsAllowed ? "Allowed" : "Restricted", icon: "bi-person-plus" },
    { label: "Minimum stay", value: property?.minimumStayMonths == null ? "" : `${property.minimumStayMonths} months`, icon: "bi-calendar-check" },
    { label: "Lease duration", value: property?.leaseDurationMonths == null ? "" : `${property.leaseDurationMonths} months`, icon: "bi-file-earmark-text" },
    { label: "Notice period", value: property?.noticePeriodMonths == null ? "" : `${property.noticePeriodMonths} months`, icon: "bi-calendar2-week" }
  ].filter((item) => item.value);
  const averageRating = reviews.length
    ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
    : null;
  const categoryAverages = reviewCategories.map(([name, label]) => {
    const ratings = reviews.map((item) => item[name]).filter((value) => value != null);
    return { label, average: ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : null };
  });
  const mapQuery = property
    ? [property.latitude, property.longitude].every((coordinate) => coordinate !== null && coordinate !== undefined)
      ? `${property.latitude},${property.longitude}`
      : [property.address, property.area, property.city, property.state, property.zipCode, property.location]
        .map((value) => typeof value === "string" ? value.trim() : value)
        .filter(Boolean)
        .join(", ")
    : "";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const whatsappNumber = property?.owner?.phoneNumber?.replace(/\D/g, "") || "";
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber.length === 10 ? `91${whatsappNumber}` : whatsappNumber}`
    : "";
  const monthlyTotal = Number(property?.rent || 0) + Number(property?.maintenanceCharges || 0);
  const initialPayment = monthlyTotal + Number(property?.securityDeposit || 0) +
    Number(property?.brokerageCharges || 0) + Number(property?.advancePayment || 0);

  function changeImage(direction) {
    if (images.length < 2) return;
    setActiveImage((current) => (current + direction + images.length) % images.length);
  }

  const openEnquiry = () => {
    if (user?.role !== "User") {
      setError("Sign in as a renter to send an enquiry or schedule a visit.");
      return;
    }
    setError("");
    setEnquiryOpen(true);
  };

  const submitEnquiry = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = await createPropertyEnquiry(id, {
        ...enquiry,
        numberOfOccupants: Number(enquiry.numberOfOccupants),
        preferredVisitDate: enquiry.preferredVisitDate || null
      });
      setNotice(result.message);
      setEnquiryOpen(false);
      setEnquiry((current) => ({ ...current, message: "", preferredVisitDate: "", preferredVisitTime: "" }));
    } catch (enquiryError) {
      setError(enquiryError.message);
    }
  };

  const toggleFavorite = async () => {
    if (user?.role !== "User") {
      setError("Sign in as a renter to save this property.");
      return;
    }
    setError("");
    try {
      if (favorite) await removeFavorite(id);
      else await addFavorite(id);
      setFavorite(!favorite);
      setNotice(favorite ? "Removed from your saved properties." : "Saved to your favorites.");
    } catch (favoriteError) {
      setError(favoriteError.message);
    }
  };

  const toggleAlert = async () => {
    if (user?.role !== "User") {
      setError("Sign in as a renter to receive price and availability alerts.");
      return;
    }
    setError("");
    try {
      if (alertEnabled) await removePropertyAlert(id);
      else await addPropertyAlert(id);
      setAlertEnabled(!alertEnabled);
      setNotice(alertEnabled ? "Price and availability alert removed." : "You’ll be notified if the rent drops or the home becomes available again.");
    } catch (alertError) {
      setError(alertError.message);
    }
  };

  const addToCompare = () => {
    try {
      const current = JSON.parse(localStorage.getItem("comparePropertyIds") || "[]");
      const ids = Array.isArray(current) ? current.map(String) : [];
      if (ids.includes(String(id))) {
        setNotice("This property is already in your comparison.");
        return;
      }
      if (ids.length >= 3) {
        setError("Compare up to three properties at a time. Remove one from the comparison page first.");
        return;
      }
      localStorage.setItem("comparePropertyIds", JSON.stringify([...ids, String(id)]));
      setNotice("Property added to your comparison.");
    } catch {
      setError("Unable to save the comparison in this browser.");
    }
  };

  const shareProperty = async () => {
    const shareData = { title: property.title, text: `Check out ${property.title}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setNotice("Property link copied.");
      } else {
        throw new Error("Sharing is not supported in this browser.");
      }
    } catch (shareError) {
      if (shareError.name !== "AbortError") setError(shareError.message);
    }
  };

  const submitReport = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const result = await reportProperty(id, report);
      setNotice(result.message);
      setReportOpen(false);
      setReport({ category: "Incorrect information", description: "" });
    } catch (reportError) {
      setError(reportError.message);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setError("");
    try {
      const sent = await sendChat(id, message);
      setMessages((current) => [...current, sent]);
      setMessage("");
    } catch (chatError) {
      setError(chatError.message);
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewNotice("");
    try {
      const result = await addPropertyReview(id, {
        ...review,
        rating: Number(review.rating),
        cleanlinessRating: Number(review.cleanlinessRating),
        locationRating: Number(review.locationRating),
        maintenanceRating: Number(review.maintenanceRating),
        ownerCommunicationRating: Number(review.ownerCommunicationRating)
      });
      setReviewNotice(result.message);
      setReview((current) => ({ ...current, comment: "" }));
      setReviews(await getPropertyReviews(id));
    } catch (reviewError) {
      setReviewNotice(reviewError.message);
    }
  };

  if (!property) {
    return <><SiteHeader /><div className="owner-loading property-details-loading"><span></span>{error || "Loading property..."}</div><Footer /></>;
  }

  const renderRating = (name, label) => (
    <label key={name}>
      {label}
      <select value={review[name]} onChange={(event) => setReview((current) => ({ ...current, [name]: event.target.value }))}>
        {[5, 4, 3, 2, 1].map((value) => <option value={value} key={value}>{value} - {value === 5 ? "Excellent" : value === 4 ? "Very good" : value === 3 ? "Good" : value === 2 ? "Fair" : "Needs attention"}</option>)}
      </select>
    </label>
  );

  const propertyFacts = [
    { label: "Bedrooms", value: displayValue(property.bedrooms), icon: "bi-house-door" },
    { label: "Bathrooms", value: displayValue(property.bathrooms), icon: "bi-droplet" },
    { label: "Built-up area", value: displayValue(property.builtUpArea, property.builtUpArea ? " sq. ft." : ""), icon: "bi-bounding-box" },
    { label: "Balconies", value: displayValue(property.balconies), icon: "bi-columns" },
    { label: "Floor", value: property.floorNumber != null ? `${property.floorNumber}${property.totalFloors ? ` of ${property.totalFloors}` : ""}` : "Not provided", icon: "bi-layers" },
    { label: "Furnishing", value: displayValue(property.furnishing), icon: "bi-lamp" },
    { label: "Property age", value: displayValue(property.propertyAge, property.propertyAge != null ? " years" : ""), icon: "bi-calendar3" },
    { label: "Facing", value: displayValue(property.facing), icon: "bi-compass" },
    { label: "Parking", value: displayValue(property.parking), icon: "bi-car-front" },
    { label: "Water supply", value: displayValue(property.waterSupply), icon: "bi-droplet-half" },
    { label: "Available from", value: property.availableFrom ? new Date(property.availableFrom).toLocaleDateString("en-IN") : "Not provided", icon: "bi-calendar-check" }
  ];

  return (
    <>
      <SiteHeader />
      <main className="property-detail-page">
        <div className="container">
          <Link to="/listings" className="detail-back"><i className="bi bi-arrow-left"></i> Back to listings</Link>
          <div className="detail-top-grid">
            <section className={`detail-gallery-grid image-count-${Math.min(images.length, 5)}`} aria-label="Property photo gallery">
              {images.slice(0, 5).map((image, index) => (
                <button type="button" className={`detail-gallery-image detail-gallery-image-${index + 1}`} key={`${image}-${index}`} onClick={() => { setActiveImage(index); setLightboxOpen(true); }} aria-label={`View property photo ${index + 1}`}>
                  <img src={image} alt={`${property.title} view ${index + 1}`} />
                  {index === 0 && <span><i className="bi bi-images"></i>{images.length > 1 ? `1 / ${images.length}` : "View photo"}</span>}
                </button>
              ))}
            </section>
            <section className="detail-summary-card">
              <span className={`detail-status ${property.isAvailable ? "available" : ""}`}>
                <i className="bi bi-circle-fill"></i>{property.isAvailable ? "Available for rent" : "Currently rented"}
              </span>
              <h1>{property.title}</h1>
              <p className="detail-location"><i className="bi bi-geo-alt-fill"></i>{[property.area, property.city, property.state].filter(Boolean).join(", ") || property.location}{property.zipCode ? ` · ${property.zipCode}` : ""}</p>
              <div className="detail-summary-price"><strong>{currency(property.rent)}</strong><small>/ month</small></div>
              {property.isRentNegotiable && <span className="detail-negotiable"><i className="bi bi-chat-dots"></i>Rent negotiable</span>}
              <div className="detail-summary-cta">
                <button type="button" className="owner-primary-button" onClick={openEnquiry}><i className="bi bi-envelope"></i>Send enquiry</button>
                <button type="button" className="detail-schedule-button" onClick={openEnquiry}><i className="bi bi-calendar-check"></i>Schedule visit</button>
              </div>
              <div className="detail-page-actions">
                <button type="button" className={`detail-icon-action${favorite ? " is-saved" : ""}`} onClick={toggleFavorite}><i className={`bi ${favorite ? "bi-heart-fill" : "bi-heart"}`}></i><small>{favorite ? "Saved" : "Save"}</small></button>
                <button type="button" className="detail-icon-action" onClick={shareProperty}><i className="bi bi-share"></i><small>Share</small></button>
                <a className="detail-icon-action" href={`https://wa.me/?text=${encodeURIComponent(`${property.title} ${window.location.href}`)}`} target="_blank" rel="noreferrer"><i className="bi bi-whatsapp"></i><small>WhatsApp</small></a>
                <button type="button" className="detail-icon-action" onClick={addToCompare}><i className="bi bi-columns-gap"></i><small>Compare</small></button>
              </div>
              <Link to="/compare" className="detail-compare-link">View comparison <i className="bi bi-arrow-up-right"></i></Link>
              {user?.role === "User" && <button type="button" className="detail-alert-toggle" onClick={toggleAlert}><i className={`bi ${alertEnabled ? "bi-bell-slash" : "bi-bell"}`}></i>{alertEnabled ? "Turn off price / availability alerts" : "Alert me about price / availability"}</button>}
            </section>
          </div>

          {error && <div className="detail-alert" role="alert"><i className="bi bi-exclamation-circle"></i>{error}{user?.role !== "User" && <Link to="/login">Sign in</Link>}</div>}
          {notice && <div className="detail-toast" role="status"><i className="bi bi-check-circle"></i>{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice("")}><i className="bi bi-x"></i></button></div>}

          <div className="detail-page-layout">
            <div className="detail-main-column">
              <section className="detail-section detail-overview">
                <div className="detail-facts-heading"><span className="section-label">PROPERTY DETAILS</span><span>{property.propertyType || "Rental property"}</span></div>
                <div className="detail-facts-strip">
                  {propertyFacts.map((fact) => (
                    <div key={fact.label}>
                      <i className={`bi ${fact.icon}`}></i>
                      <span><strong>{fact.value}</strong><small>{fact.label}</small></span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="detail-section detail-description-section">
                <span className="section-label">ABOUT THIS HOME</span>
                <h2>Property description</h2>
                <p className="detail-description">{property.description || "The owner has not added a description yet."}</p>
              </section>

              <aside className="detail-sidebar-card owner-contact-card">
                {property.owner ? <>
                  <div className="detail-owner-heading"><span className="detail-owner-avatar">{property.owner.fullName?.charAt(0) || "O"}</span><div><strong>{property.owner.fullName || "Property owner"}</strong><small>Property Owner</small></div></div>
                  {property.owner.phoneNumber && <a href={`tel:${property.owner.phoneNumber}`}><i className="bi bi-telephone"></i>{property.owner.phoneNumber}</a>}
                  {property.owner.email && <a href={`mailto:${property.owner.email}`}><i className="bi bi-envelope"></i>{property.owner.email}</a>}
                  {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer"><i className="bi bi-whatsapp"></i>Message on WhatsApp</a>}
                  {user?.role === "User" && <form className="detail-chat" onSubmit={sendMessage}><div className="chat-history">{messages.length ? messages.map((item) => <p key={item.id}>{item.message}</p>) : <span>Send an enquiry to start a conversation.</span>}</div><div><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message" aria-label="Message to owner" /><button type="submit" aria-label="Send message"><i className="bi bi-send"></i></button></div></form>}
                </> : <p>The listing owner has not provided contact details.</p>}
                {user?.role === "User" && <button type="button" className="detail-report-link" onClick={() => setReportOpen(true)}><i className="bi bi-flag"></i>Report this listing</button>}
              </aside>

              <section className="detail-section detail-amenities-section">
                <span className="section-label">WHAT'S INCLUDED</span>
                <h2>Amenities and facilities</h2>
                {amenities.length ? <div className="detail-amenities-grid">{amenities.map((amenity) => <div key={amenity}><i className={`bi ${amenityIcons[amenity] || "bi-check2-circle"}`}></i><span>{amenity}</span></div>)}</div> : <p className="detail-muted">The owner has not specified amenities for this property.</p>}
              </section>

              <section className="detail-section detail-location-section">
                <div className="detail-section-heading"><div><span className="section-label">EXPLORE THE AREA</span><h2>Location and nearby places</h2></div><a href={mapUrl} target="_blank" rel="noreferrer">Open in Google Maps <i className="bi bi-box-arrow-up-right"></i></a></div>
                <p className="detail-address"><i className="bi bi-geo-alt"></i>{[property.address, property.area, property.city, property.state, property.zipCode].filter(Boolean).join(", ") || property.location}</p>
                <div className="detail-map-frame"><iframe title={`Map showing ${property.title}`} src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
                {landmarks.length > 0 && <div className="detail-landmarks"><h3>Nearby landmarks</h3>{landmarks.map((landmark) => <p key={landmark}><i className="bi bi-signpost-2"></i>{landmark}</p>)}</div>}
              </section>

              <section className="detail-section detail-rental-terms">
                <span className="section-label">RENTAL TERMS</span>
                <h2>Preferences and house rules</h2>
                {rentalPreferences.length
                  ? <div className="detail-rental-rules">{rentalPreferences.map(({ label, value, icon }) => (
                    <div className="detail-rental-rule" key={label}>
                      <i className={`bi ${icon}`}></i>
                      <span><small>{label}</small><strong>{value}</strong></span>
                    </div>
                  ))}</div>
                  : <p className="detail-muted">The owner has not added rental preferences or house rules yet.</p>}
              </section>

              <section className="detail-section detail-affordability detail-budget-section">
                <span className="section-label">PLAN YOUR BUDGET</span>
                <h2>Rent affordability check</h2>
                <p>Compare the monthly rent and listed maintenance against your monthly housing budget.</p>
                <dl className="detail-budget-costs">
                  <div><dt>Monthly rent</dt><dd>{currency(property.rent)}</dd></div>
                  <div><dt>Monthly maintenance</dt><dd>{property.maintenanceCharges != null ? currency(property.maintenanceCharges) : "Not provided"}</dd></div>
                  <div><dt>Security deposit</dt><dd>{property.securityDeposit != null ? currency(property.securityDeposit) : "Not provided"}</dd></div>
                  <div><dt>Brokerage</dt><dd>{property.brokerageCharges != null ? currency(property.brokerageCharges) : "Not provided"}</dd></div>
                  <div><dt>Advance payment</dt><dd>{property.advancePayment != null ? currency(property.advancePayment) : "Not provided"}</dd></div>
                  <div><dt>Electricity / Water</dt><dd>{displayValue(property.electricityCharges)} / {displayValue(property.waterCharges)}</dd></div>
                  <div className="budget-cost-total"><dt>Estimated monthly cost</dt><dd>{currency(monthlyTotal)}</dd></div>
                  <div className="budget-cost-total"><dt>Estimated initial payment</dt><dd>{currency(initialPayment)}</dd></div>
                </dl>
                <label htmlFor="detail-budget">Your monthly housing budget (₹)</label>
                <input id="detail-budget" type="number" min="0" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="e.g. 20000" />
                {budget && <p className={monthlyTotal <= Number(budget) ? "budget-result affordable" : "budget-result over-budget"}>
                  <i className={`bi ${monthlyTotal <= Number(budget) ? "bi-check-circle" : "bi-exclamation-circle"}`}></i>
                  {monthlyTotal <= Number(budget) ? "The listed monthly costs are within your budget." : "The listed monthly costs are above your budget."}
                </p>}
                <small>This is a simple estimate and excludes charges the owner has not listed.</small>
              </section>

              <section className="detail-section reviews-section">
                <div className="detail-section-heading">
                  <div><span className="section-label">RENTER FEEDBACK</span><h2>Reviews and ratings</h2><p>Verified renter labels require a tenancy confirmed by both the owner and renter.</p></div>
                  {averageRating != null && <div className="detail-average-rating"><strong>{averageRating.toFixed(1)}</strong><span>★</span><small>{reviews.length} review{reviews.length === 1 ? "" : "s"}</small></div>}
                </div>
                {categoryAverages.some((item) => item.average != null) && <div className="detail-rating-breakdown">
                  {categoryAverages.filter((item) => item.average != null).map((item) => <div key={item.label}><span>{item.label}</span><progress max="5" value={item.average} /><strong>{item.average.toFixed(1)}</strong></div>)}
                </div>}
                <div className="reviews-layout">
                  <div className="review-list">
                    {reviews.length ? reviews.map((item) => (
                      <article className="review-card" key={item.id}>
                        <div className="review-card-header"><strong>{item.reviewer}{item.isVerifiedRenter && <span className="verified-renter-badge"><i className="bi bi-patch-check-fill"></i>Verified renter</span>}</strong><span>{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span></div>
                        <p>{item.comment}</p>
                        <div className="review-category-ratings">
                          {reviewCategories.map(([name, label]) => item[name] != null && <span key={name}>{label} <strong>{item[name]}/5</strong></span>)}
                        </div>
                        <small>{new Date(item.createdAt).toLocaleDateString("en-IN")}</small>
                      </article>
                    )) : <div className="nearby-empty">{reviewNotice || "No renter reviews yet. Reviews are available after both parties confirm a tenancy."}</div>}
                  </div>
                  {user?.role === "User" && canReview && <form className="review-form" onSubmit={submitReview}>
                    <span className="section-label">YOUR EXPERIENCE</span><h3>Help the next renter</h3>
                    {renderRating("rating", "Overall rating")}
                    {reviewCategories.map(([name, label]) => renderRating(name, label))}
                    <label>Written feedback<textarea required maxLength="2000" rows="4" value={review.comment} onChange={(event) => setReview((current) => ({ ...current, comment: event.target.value }))} placeholder="What should another renter know?" /></label>
                    <button type="submit" className="owner-primary-button">Publish review <i className="bi bi-arrow-right"></i></button>
                    {reviewNotice && <small className="detail-success">{reviewNotice}</small>}
                  </form>}
                  {user?.role === "User" && !canReview && <p className="detail-review-requirement">Only renters with an owner-and-renter-confirmed tenancy can submit a review.</p>}
                </div>
              </section>

              <section className="detail-section nearby-homes-section">
                <div className="detail-section-heading"><div><span className="section-label">KEEP EXPLORING</span><h2>More homes nearby</h2><p>Available properties in ZIP {property.zipCode || property.location}.</p></div><Link to={`/listings?zipCode=${encodeURIComponent(property.zipCode || "")}`}>View all <i className="bi bi-arrow-up-right"></i></Link></div>
                {nearby.length ? <div className="nearby-homes-grid">{nearby.map((item) => <Link to={`/property/${item.id}`} className="nearby-home-card" key={item.id}><img src={getImageUrl(item.imageUrl)} alt={item.title} /><div><h3>{item.title}</h3><p><i className="bi bi-geo-alt"></i>{item.location}</p><strong>{currency(item.rent)}<small>/ month</small></strong></div></Link>)}</div> : <div className="nearby-empty">No other available homes have been listed in this area yet.</div>}
              </section>

              {recommendations.filter((item) => String(item.id) !== String(id)).length > 0 && <section className="detail-section nearby-homes-section recommended-section">
                <div className="detail-section-heading"><div><span className="section-label">RENTER RECOMMENDATIONS</span><h2>Well-reviewed homes</h2><p>Available homes with the strongest renter feedback.</p></div></div>
                <div className="nearby-homes-grid">{recommendations.filter((item) => String(item.id) !== String(id)).slice(0, 3).map((item) => <Link to={`/property/${item.id}`} className="nearby-home-card" key={item.id}><img src={getImageUrl(item.imageUrl)} alt={item.title} /><div><h3>{item.title}</h3><p><i className="bi bi-star-fill"></i> {item.averageRating.toFixed(1)} from {item.reviewCount} review{item.reviewCount === 1 ? "" : "s"}</p><strong>{currency(item.rent)}<small>/ month</small></strong></div></Link>)}</div>
              </section>}
              {recentlyViewed.length > 0 && <section className="detail-section nearby-homes-section">
                <div className="detail-section-heading"><div><span className="section-label">YOUR RECENT ACTIVITY</span><h2>Recently viewed homes</h2><p>Pick up where you left off.</p></div></div>
                <div className="nearby-homes-grid">{recentlyViewed.map(({ property: item }) => <Link to={`/property/${item.id}`} className="nearby-home-card" key={item.id}><img src={getImageUrl(item.imageUrl)} alt={item.title} /><div><h3>{item.title}</h3><p><i className="bi bi-geo-alt"></i>{item.location}</p><strong>{currency(item.rent)}<small>/ month</small></strong></div></Link>)}</div>
              </section>}
            </div>

          </div>
        </div>
      </main>
      <Footer />

      {lightboxOpen && <div className="detail-lightbox" role="presentation" onClick={() => setLightboxOpen(false)}>
        <button type="button" className="detail-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close photo viewer"><i className="bi bi-x-lg"></i></button>
        {images.length > 1 && <button type="button" className="detail-lightbox-arrow previous" onClick={(event) => { event.stopPropagation(); changeImage(-1); }} aria-label="Previous photo"><i className="bi bi-chevron-left"></i></button>}
        <img src={images[activeImage] || getImageUrl(property.imageUrl)} alt={`${property.title} photo ${activeImage + 1}`} onClick={(event) => event.stopPropagation()} />
        {images.length > 1 && <button type="button" className="detail-lightbox-arrow next" onClick={(event) => { event.stopPropagation(); changeImage(1); }} aria-label="Next photo"><i className="bi bi-chevron-right"></i></button>}
        <span>{activeImage + 1} / {images.length}</span>
      </div>}

      {enquiryOpen && <div className="detail-modal-backdrop" role="presentation" onClick={() => setEnquiryOpen(false)}>
        <form className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" onSubmit={submitEnquiry} onClick={(event) => event.stopPropagation()}>
          <button type="button" className="detail-modal-close" onClick={() => setEnquiryOpen(false)} aria-label="Close enquiry"><i className="bi bi-x-lg"></i></button>
          <span className="section-label">PROPERTY ENQUIRY</span><h2 id="enquiry-title">Arrange a viewing</h2><p>Your details and visit preference will be shared with the listing owner.</p>
          <div className="detail-modal-grid">
            <label>Full name<input required maxLength="100" value={enquiry.fullName} onChange={(event) => setEnquiry((current) => ({ ...current, fullName: event.target.value }))} /></label>
            <label>Mobile number<input required type="tel" maxLength="15" value={enquiry.phoneNumber} onChange={(event) => setEnquiry((current) => ({ ...current, phoneNumber: event.target.value }))} /></label>
            <label>Email<input required type="email" maxLength="150" value={enquiry.email} onChange={(event) => setEnquiry((current) => ({ ...current, email: event.target.value }))} /></label>
            <label>Number of occupants<input required type="number" min="1" max="50" value={enquiry.numberOfOccupants} onChange={(event) => setEnquiry((current) => ({ ...current, numberOfOccupants: event.target.value }))} /></label>
            <label>Preferred visit date<input type="date" min={dateInputValue(new Date())} value={enquiry.preferredVisitDate} onChange={(event) => setEnquiry((current) => ({ ...current, preferredVisitDate: event.target.value }))} /></label>
            <label>Preferred visit time<input type="time" value={enquiry.preferredVisitTime} onChange={(event) => setEnquiry((current) => ({ ...current, preferredVisitTime: event.target.value }))} /></label>
            <label className="wide">Message to owner<textarea required maxLength="2000" rows="4" value={enquiry.message} onChange={(event) => setEnquiry((current) => ({ ...current, message: event.target.value }))} placeholder="Tell the owner what you would like to know..." /></label>
          </div>
          <button type="submit" className="owner-primary-button">Send enquiry <i className="bi bi-arrow-right"></i></button>
        </form>
      </div>}

      {reportOpen && <div className="detail-modal-backdrop" role="presentation" onClick={() => setReportOpen(false)}>
        <form className="detail-modal detail-report-modal" role="dialog" aria-modal="true" aria-labelledby="report-title" onSubmit={submitReport} onClick={(event) => event.stopPropagation()}>
          <button type="button" className="detail-modal-close" onClick={() => setReportOpen(false)} aria-label="Close report form"><i className="bi bi-x-lg"></i></button>
          <span className="section-label">LISTING SAFETY</span><h2 id="report-title">Report this property</h2><p>Reports are stored for review; do not include sensitive personal information.</p>
          <label>Reason<select value={report.category} onChange={(event) => setReport((current) => ({ ...current, category: event.target.value }))}><option>Incorrect information</option><option>Suspicious or duplicate listing</option><option>Inappropriate content</option><option>Other concern</option></select></label>
          <label>What should we know?<textarea required maxLength="2000" rows="4" value={report.description} onChange={(event) => setReport((current) => ({ ...current, description: event.target.value }))} /></label>
          <button type="submit" className="owner-primary-button">Submit report <i className="bi bi-flag"></i></button>
        </form>
      </div>}
    </>
  );
}

export default PropertyDetails;
