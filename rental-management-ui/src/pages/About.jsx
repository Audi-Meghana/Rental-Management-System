import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProperties, getImageUrl } from "../services/propertyService";

function About() {
  const [propertyCount, setPropertyCount] = useState(null);
  const [locationCount, setLocationCount] = useState(null);

  useEffect(() => {
    getProperties()
      .then((properties) => {
        setPropertyCount(properties.length);
        setLocationCount(new Set(properties.map((property) => property.location).filter(Boolean)).size);
      })
      .catch(() => {
        setPropertyCount(0);
        setLocationCount(0);
      });
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <main className="about-page">
        <section className="about-hero">
          <div className="container about-hero-inner">
            <div className="about-hero-copy">
              <span className="section-label">THE myHOME PROMISE</span>
              <h1>A better way to find where life happens.</h1>
              <p>myHOME brings renters and property owners together through clear listings, real conversations, and a simpler path to feeling at home.</p>
              <div className="about-hero-actions"><Link to="/listings" className="owner-primary-button">Explore homes <i className="bi bi-arrow-up-right"></i></Link><Link to="/contact" className="about-secondary-link">Talk to our team <i className="bi bi-arrow-right"></i></Link></div>
            </div>
            <div className="about-hero-image"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85" alt="Bright modern home interior" /><div className="about-hero-badge"><i className="bi bi-shield-check"></i><span><strong>Built around trust</strong><small>Every step is designed to feel clear.</small></span></div></div>
          </div>
        </section>

        <section className="about-stats-section"><div className="container about-stats"><div><strong>{propertyCount === null ? "..." : propertyCount}</strong><span>live properties</span></div><div><strong>{locationCount === null ? "..." : locationCount}</strong><span>locations represented</span></div><div><strong>2</strong><span>ways to belong</span></div><div><strong>1</strong><span>simple place to start</span></div></div></section>

        <section className="about-story-section"><div className="container about-story-grid"><div className="about-story-aside"><span className="section-label">WHY WE EXIST</span><div className="about-mark"><span>my</span>HOME</div></div><div className="about-story-copy"><h2>Finding a home should feel hopeful, not exhausting.</h2><p>Property search often gets buried under unclear details, scattered messages, and uncertainty about who is on the other side. myHOME gives renters a focused way to discover available homes and gives owners the tools to present them honestly.</p><p>From the first search to the first conversation, we keep the important details close: location, rent, availability, ownership, interest, and feedback from people who have explored the home before.</p></div></div></section>

        <section className="about-principles-section"><div className="container"><div className="about-section-heading"><span className="section-label">WHAT WE STAND FOR</span><h2>Trust is designed into the experience.</h2><p>Small details make a big difference when the decision is where to live.</p></div><div className="about-principles-grid"><article><span><i className="bi bi-eye"></i></span><h3>Clear by default</h3><p>Rent, location, bedrooms, availability, images, and owner contact stay visible so people can make informed choices.</p></article><article><span><i className="bi bi-shield-check"></i></span><h3>Respectfully secure</h3><p>Accounts, verification, and authenticated conversations are handled with care so every side can participate confidently.</p></article><article><span><i className="bi bi-chat-heart"></i></span><h3>Human connection</h3><p>Interest, chat, notifications, and renter feedback help turn a listing into a meaningful conversation.</p></article></div></div></section>

        <section className="about-paths-section"><div className="container"><div className="about-section-heading"><span className="section-label">A PLACE FOR BOTH SIDES</span><h2>Start from where you are.</h2></div><div className="about-paths-grid"><article className="about-path-card renter"><div><span className="section-label">FOR RENTERS</span><h3>Find a home that fits your life.</h3><p>Search by location and bedrooms, compare real details, save homes that interest you, speak with owners, and learn from renter reviews.</p><Link to="/listings">Browse available homes <i className="bi bi-arrow-up-right"></i></Link></div><i className="bi bi-house-heart about-path-icon"></i></article><article className="about-path-card owner"><div><span className="section-label">FOR OWNERS</span><h3>Present your property with confidence.</h3><p>Create a trusted listing with multiple images, location details, availability, interested-user updates, and direct conversations.</p><Link to="/">List your property <i className="bi bi-arrow-up-right"></i></Link></div><i className="bi bi-building about-path-icon"></i></article></div></div></section>

        <section className="about-feature-section"><div className="container about-feature-grid"><div className="about-feature-image"><img src={getImageUrl("https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=85")} alt="Welcoming living room" /></div><div className="about-feature-copy"><span className="section-label">A QUIETER SEARCH</span><h2>Less noise. Better decisions.</h2><p>myHOME is built to help you slow down enough to notice what matters about a property, while giving owners a thoughtful way to show what they offer.</p><ul><li><i className="bi bi-check2-circle"></i>Live property information from the platform</li><li><i className="bi bi-check2-circle"></i>Secure account-based interactions</li><li><i className="bi bi-check2-circle"></i>Feedback that helps the next renter</li></ul><Link to="/listings" className="owner-outline-button">Begin your search <i className="bi bi-arrow-right"></i></Link></div></div></section>

        <section className="about-final-cta"><div className="container"><span className="section-label">YOUR NEXT CHAPTER</span><h2>It starts with a place.</h2><p>Discover the homes and people that make myHOME feel different.</p><Link to="/listings" className="owner-primary-button">Explore homes <i className="bi bi-arrow-up-right"></i></Link></div></section>
      </main>
      <Footer />
    </>
  );
}

export default About;
