import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addPropertyReview, getChat, getImageUrl, getPropertyImages, getProperties, getProperty, getPropertyReviews, getRecommendedProperties, sendChat, showInterest } from "../services/propertyService";
import { getUser } from "../services/authService";

function PropertyDetails() {
  const { id } = useParams();
  const user = getUser();
  const [property, setProperty] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewNotice, setReviewNotice] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getProperty(id)
      .then((data) => {
        setProperty(data);
        return getProperties({ zipCode: data.zipCode, isAvailable: true });
      })
      .then((data) => setNearby(data.filter((item) => String(item.id) !== String(id)).slice(0, 3)))
      .catch((loadError) => setError(loadError.message));
  }, [id]);

  useEffect(() => {
    getPropertyReviews(id).then(setReviews).catch(() => {});
    getRecommendedProperties().then(setRecommendations).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (user && id) getChat(id).then(setMessages).catch(() => {});
  }, [id, user]);

  const interest = async () => {
    if (!user) {
      setError("Please login to show interest in this property.");
      return;
    }
    try {
      const result = await showInterest(id);
      setNotice(result.message);
    } catch (interestError) {
      setError(interestError.message);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
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
    try {
      await showInterest(id);
      const result = await addPropertyReview(id, { rating: Number(rating), comment: reviewText });
      setReviewNotice(result.message);
      setReviewText("");
      setReviews(await getPropertyReviews(id));
    } catch (reviewError) {
      setReviewNotice(reviewError.message);
    }
  };

  if (!property) {
    return <><TopBar /><Navbar /><div className="owner-loading property-details-loading"><span></span>{error || "Loading property..."}</div><Footer /></>;
  }

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="property-detail-page">
        <div className="container">
          <Link to="/listings" className="detail-back"><i className="bi bi-arrow-left"></i> Back to listings</Link>

          <section className="detail-hero-grid">
            <div className="detail-gallery">
              {getPropertyImages(property).length > 0 && <img src={getPropertyImages(property)[activeImage] || getPropertyImages(property)[0]} alt={property.title} />}
              <span className="detail-image-label"><i className="bi bi-camera"></i> Property view</span>
              {getPropertyImages(property).length > 1 && <div className="detail-thumbnails">{getPropertyImages(property).map((image, index) => <button type="button" className={index === activeImage ? "active" : ""} key={image} onClick={() => setActiveImage(index)}><img src={image} alt={`${property.title} view ${index + 1}`} /></button>)}</div>}
            </div>
            <div className="detail-summary">
              <span className="section-label">{property.isAvailable ? "AVAILABLE NOW" : "CURRENTLY RENTED"}</span>
              <h1>{property.title}</h1>
              <p className="detail-location"><i className="bi bi-geo-alt-fill"></i>{property.location}</p>
              <div className="detail-summary-price">₹{Number(property.rent).toLocaleString("en-IN")}<small>/ month</small></div>
              <div className="detail-summary-facts"><span><i className="bi bi-door-open"></i>{property.bedrooms} bedrooms</span><span><i className="bi bi-pin-map"></i>ZIP {property.zipCode || "-"}</span><span className={property.isAvailable ? "detail-available" : ""}><i className="bi bi-circle-fill"></i>{property.isAvailable ? "Available" : "Rented"}</span></div>
              <button type="button" className="owner-primary-button detail-interest-button" onClick={interest}><i className="bi bi-heart"></i>I’m interested</button>
              {notice && <p className="detail-success">{notice}</p>}
              {error && <p className="detail-error">{error}</p>}
            </div>
          </section>

          <section className="detail-content-grid">
            <article className="detail-copy">
              <span className="section-label">THE HOME</span>
              <h2>Space to settle into.</h2>
              <p className="detail-description">{property.description}</p>
            </article>
            <aside className="owner-contact-card">
              <span className="section-label">DIRECT CONTACT</span>
              <h2>Talk to the owner</h2>
              {property.owner ? <>
                <div className="contact-person"><span>{property.owner.fullName.charAt(0)}</span><div><strong>{property.owner.fullName}</strong><small>Verified property owner</small></div></div>
                <a href={`tel:${property.owner.phoneNumber}`}><i className="bi bi-telephone"></i>{property.owner.phoneNumber || "Phone available after interest"}</a>
                <a href={`mailto:${property.owner.email}`}><i className="bi bi-envelope"></i>{property.owner.email}</a>
                {user && <form className="detail-chat" onSubmit={sendMessage}><div className="chat-history">{messages.length ? messages.map((item) => <p key={item.id}>{item.message}</p>) : <span>Show interest to start a conversation.</span>}</div><div><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message" /><button type="submit" aria-label="Send message"><i className="bi bi-send"></i></button></div></form>}
              </> : <p>Owner contact details are being prepared.</p>}
            </aside>
          </section>

          <section className="nearby-homes-section">
            <div className="detail-section-heading"><div><span className="section-label">KEEP EXPLORING</span><h2>More homes nearby</h2><p>Other available properties in ZIP {property.zipCode || property.location}.</p></div><Link to={`/listings?zipCode=${encodeURIComponent(property.zipCode || "")}`}>View all <i className="bi bi-arrow-up-right"></i></Link></div>
            {nearby.length ? <div className="nearby-homes-grid">{nearby.map((item) => <Link to={`/property/${item.id}`} className="nearby-home-card" key={item.id}><img src={getImageUrl(item.imageUrl)} alt={item.title} /><div><h3>{item.title}</h3><p><i className="bi bi-geo-alt"></i>{item.location}</p><strong>₹{Number(item.rent).toLocaleString("en-IN")}<small>/ month</small></strong></div></Link>)}</div> : <div className="nearby-empty">No other available homes have been listed in this area yet.</div>}
          </section>

          <section className="reviews-section">
            <div className="detail-section-heading"><div><span className="section-label">FROM THE COMMUNITY</span><h2>Reviews from renters</h2><p>Honest notes from people who explored this home.</p></div></div>
            <div className="reviews-layout">
              <div className="review-list">{reviews.length ? reviews.map((review) => <article className="review-card" key={review.id}><div className="review-card-header"><strong>{review.reviewer}</strong><span>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span></div><p>{review.comment}</p><small>{new Date(review.createdAt).toLocaleDateString("en-IN")}</small></article>) : <div className="nearby-empty">No renter reviews yet. Be the first to share a useful note.</div>}</div>
              {user?.role === "User" && <form className="review-form" onSubmit={submitReview}><span className="section-label">YOUR EXPERIENCE</span><h3>Help the next renter</h3><label>Rating<select value={rating} onChange={(event) => setRating(event.target.value)}><option value="5">5 - Excellent</option><option value="4">4 - Very good</option><option value="3">3 - Good</option><option value="2">2 - Fair</option><option value="1">1 - Needs attention</option></select></label><textarea required rows="4" value={reviewText} onChange={(event) => setReviewText(event.target.value)} placeholder="What should another renter know?" /><button type="submit" className="owner-primary-button">Publish review <i className="bi bi-arrow-right"></i></button>{reviewNotice && <small className="detail-success">{reviewNotice}</small>}</form>}
            </div>
          </section>

          {recommendations.length > 0 && <section className="nearby-homes-section recommended-section"><div className="detail-section-heading"><div><span className="section-label">RENTERS RECOMMEND</span><h2>Suggestions from the community</h2><p>Available homes with the strongest renter feedback.</p></div></div><div className="nearby-homes-grid">{recommendations.filter((item) => String(item.id) !== String(id)).slice(0, 3).map((item) => <Link to={`/property/${item.id}`} className="nearby-home-card" key={item.id}><img src={getImageUrl(item.imageUrl)} alt={item.title} /><div><h3>{item.title}</h3><p><i className="bi bi-star-fill"></i> {item.averageRating.toFixed(1)} from {item.reviewCount} review{item.reviewCount === 1 ? "" : "s"}</p><strong>₹{Number(item.rent).toLocaleString("en-IN")}<small>/ month</small></strong></div></Link>)}</div></section>}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PropertyDetails;
