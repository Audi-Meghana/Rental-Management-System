import { useState } from "react";

function Hero({ onSearch }) {
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");

  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container h-100 position-relative">
        <div className="hero-property-box">
          <h2>Homes that feel like<br />your own.</h2>
          <span className="hero-price">Live beautifully, wherever you are.</span>
        </div>
        <h1 className="find-home">Find your home</h1>
        <div className="hero-search">
          <div className="search-field">
            <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
              <option value="">Property type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Room">Room</option>
            </select>
            <i className="bi bi-chevron-down"></i>
          </div>
          <div className="search-field">
            <select value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
              <option value="">Any bedrooms</option>
              <option value="1">1 bedroom</option>
              <option value="2">2 bedrooms</option>
              <option value="3">3 bedrooms</option>
              <option value="4">4 bedrooms</option>
            </select>
            <i className="bi bi-chevron-down"></i>
          </div>
          <div className="search-field">
            <input type="text" placeholder="Location" value={location} onChange={(event) => setLocation(event.target.value)} />
          </div>
          <button type="button" className="search-btn" onClick={() => onSearch({ location, bedrooms, propertyType })}>SEARCH HOMES</button>
        </div>
      </div>
      <button type="button" className="hero-next" aria-label="Next"><i className="bi bi-chevron-right"></i></button>
    </section>
  );
}

export default Hero;
