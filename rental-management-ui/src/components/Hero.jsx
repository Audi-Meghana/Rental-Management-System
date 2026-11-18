import { useState } from "react";

function Hero({ onSearch }) {
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const search = (event) => {
    event.preventDefault();
    onSearch({ location: location.trim(), bedrooms, propertyType });
  };

  return (
    <section className="hero-section reference-hero">
      <div className="hero-overlay"></div>
      <div className="container reference-hero-inner">
        <div className="reference-hero-copy">
          <h1>Homes that feel like<br />your own.</h1>
          <p>Live beautifully, wherever you are.</p>
        </div>
        <form className="hero-search reference-hero-search" onSubmit={search}>
          <div className="reference-search-field">
            <label htmlFor="home-property-type">Property type</label>
            <div><i className="bi bi-building"></i><select id="home-property-type" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
              <option value="">Any property type</option>
              <option value="Apartment">Apartment</option>
              <option value="Independent house">Independent house</option>
              <option value="Villa">Villa</option>
              <option value="PG">PG</option>
              <option value="Studio">Studio</option>
              <option value="Other">Other</option>
            </select><i className="bi bi-chevron-down reference-select-chevron"></i></div>
          </div>
          <div className="reference-search-field">
            <label htmlFor="home-bedrooms">Bedrooms</label>
            <div><i className="bi bi-door-open"></i><select id="home-bedrooms" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)}>
              <option value="">Any bedrooms</option>
              {[1, 2, 3, 4, 5].map((count) => <option value={count} key={count}>{count} bedroom{count === 1 ? "" : "s"}</option>)}
            </select><i className="bi bi-chevron-down reference-select-chevron"></i></div>
          </div>
          <div className="reference-search-field">
            <label htmlFor="home-location">Location</label>
            <div><i className="bi bi-geo-alt"></i><input id="home-location" type="search" placeholder="Enter city or locality" value={location} onChange={(event) => setLocation(event.target.value)} /></div>
          </div>
          <button type="submit" className="search-btn"><i className="bi bi-search"></i>Search homes</button>
        </form>
      </div>
    </section>
  );
}

export default Hero;
