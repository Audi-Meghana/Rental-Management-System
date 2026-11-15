import { useEffect, useState } from "react";

import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { getImageUrl, getProperties } from "../services/propertyService";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProperties({ isAvailable: true })
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (filters) => {
    const query = new URLSearchParams(filters).toString();
    navigate(`/listings${query ? `?${query}` : ""}`);
  };

  return (
    <>
      <TopBar />
      <Navbar />
        <Hero onSearch={handleSearch} />

      {/* =====================================
          FEATURED PROPERTIES
      ====================================== */}

      <section className="featured-section">
        <div className="container">

          <div className="section-heading text-center">

            <span className="section-label">
              THE BEST DEALS
            </span>

            <h2>
              Featured Properties
            </h2>

            <p>
              Discover beautiful homes and apartments
              available for rent.
            </p>

          </div>


          {loading ? (

            <div className="text-center py-5">
              <div
                className="spinner-border"
                role="status"
              ></div>

              <p className="text-muted mt-3">
                Loading properties...
              </p>
            </div>

          ) : properties.length === 0 ? (

            <div className="empty-properties">
              <i className="bi bi-house-door"></i>

              <h4>
                No properties available
              </h4>

              <p>
                New rental properties will appear here.
              </p>
            </div>

          ) : (

            <div className="row g-4">

              {properties.slice(0, 6).map((property) => (

                <div
                  className="col-lg-4 col-md-6"
                  key={property.id}
                >

                  <Link to={`/property/${property.id}`} className="property-card home-property-link">

                    <div className="property-image">

                      <img
                        src={
                          getImageUrl(property.imageUrl)
                        }
                        alt={property.title}
                      />

                      <span
                        className={
                          property.isAvailable
                            ? "property-status available"
                            : "property-status rented"
                        }
                      >
                        {property.isAvailable
                          ? "AVAILABLE"
                          : "RENTED"}
                      </span>

                    </div>


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
                          ₹{property.rent.toLocaleString("en-IN")}
                          <small> / month</small>
                        </strong>

                      </div>

                    </div>

                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>
      </section>


      {/* =====================================
          WHY CHOOSE US
      ====================================== */}

      <section className="why-section">

        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <span className="section-label">
                WHY CHOOSE US
              </span>

              <h2 className="section-title">
                Find a place you can
                <span> call home.</span>
              </h2>

              <p className="section-description">
                We make finding and renting a property
                simple, transparent and convenient.
                Browse available homes, connect with
                property owners and find the right place
                for your lifestyle.
              </p>

              <div className="why-list">

                <div className="why-item">
                  <div className="why-icon">
                    <i className="bi bi-house-check"></i>
                  </div>

                  <div>
                    <h4>
                      Verified Properties
                    </h4>

                    <p>
                      Explore properties listed by
                      registered owners.
                    </p>
                  </div>
                </div>


                <div className="why-item">
                  <div className="why-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>

                  <div>
                    <h4>
                      Safe & Secure
                    </h4>

                    <p>
                      Your information and property
                      searches are handled securely.
                    </p>
                  </div>
                </div>


                <div className="why-item">
                  <div className="why-icon">
                    <i className="bi bi-headset"></i>
                  </div>

                  <div>
                    <h4>
                      Easy Communication
                    </h4>

                    <p>
                      Connect with owners and discuss
                      rental requirements easily.
                    </p>
                  </div>
                </div>

              </div>

            </div>


            <div className="col-lg-6">

              <div className="why-image-wrapper">

                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
                  alt="Modern house"
                />

                <div className="experience-card">

                  <strong>
                    100%
                  </strong>

                  <span>
                    Better way to
                    <br />
                    find your home
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          SERVICES
      ====================================== */}

      <section className="services-section">

        <div className="container">

          <div className="section-heading text-center">

            <span className="section-label">
              WHAT WE OFFER
            </span>

            <h2>
              Our Services
            </h2>

            <p>
              Everything you need for a smooth
              rental experience.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-lg-4 col-md-6">

              <div className="service-card">

                <div className="service-icon">
                  <i className="bi bi-search"></i>
                </div>

                <h3>
                  Find Properties
                </h3>

                <p>
                  Search homes and apartments based
                  on location, rooms, rent and
                  availability.
                </p>

                <a href="/listings">
                  Explore Listings
                  <i className="bi bi-arrow-right"></i>
                </a>

              </div>

            </div>


            <div className="col-lg-4 col-md-6">

              <div className="service-card">

                <div className="service-icon">
                  <i className="bi bi-building"></i>
                </div>

                <h3>
                  List Your Property
                </h3>

                <p>
                  Property owners can add their
                  properties and reach potential
                  tenants.
                </p>

                <a href="/signup">
                  Become an Owner
                  <i className="bi bi-arrow-right"></i>
                </a>

              </div>

            </div>


            <div className="col-lg-4 col-md-6">

              <div className="service-card">

                <div className="service-icon">
                  <i className="bi bi-chat-dots"></i>
                </div>

                <h3>
                  Connect Directly
                </h3>

                <p>
                  Contact property owners and discuss
                  your rental requirements directly.
                </p>

                <a href="/contact">
                  Contact Us
                  <i className="bi bi-arrow-right"></i>
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          POPULAR LOCATIONS
      ====================================== */}

      <section className="locations-section">

        <div className="container">

          <div className="section-heading text-center">

            <span className="section-label">
              EXPLORE
            </span>

            <h2>
              Popular Locations
            </h2>

            <p>
              Find your next home in a location
              that suits you.
            </p>

          </div>


          <div className="row g-3">
            {[...new Map(properties.map((property) => [property.location, property])).values()]
              .slice(0, 3)
              .map((property, index) => (
                <div
                  className={index === 0 ? "col-lg-6" : "col-lg-3 col-md-6"}
                  key={property.location}
                >
                  <Link
                    to={`/listings?location=${encodeURIComponent(property.location)}`}
                    className={`location-card ${index === 0 ? "large" : ""}`}
                  >
                    <img src={getImageUrl(property.imageUrl)} alt={property.location} />
                    <div className="location-overlay">
                      <h3>{property.location}</h3>
                      <span>Explore properties</span>
                    </div>
                  </Link>
                </div>
              ))}
          </div>

        </div>

      </section>


      {/* =====================================
          HOW IT WORKS
      ====================================== */}

      <section className="steps-section">

        <div className="container">

          <div className="section-heading text-center">

            <span className="section-label">
              SIMPLE PROCESS
            </span>

            <h2>
              How It Works
            </h2>

            <p>
              Find your perfect rental in just a
              few simple steps.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-lg-4">

              <div className="step-card">

                <div className="step-number">
                  01
                </div>

                <div className="step-icon">
                  <i className="bi bi-search"></i>
                </div>

                <h3>
                  Search
                </h3>

                <p>
                  Browse available properties and
                  filter them according to your needs.
                </p>

              </div>

            </div>


            <div className="col-lg-4">

              <div className="step-card">

                <div className="step-number">
                  02
                </div>

                <div className="step-icon">
                  <i className="bi bi-house-heart"></i>
                </div>

                <h3>
                  Choose
                </h3>

                <p>
                  Compare properties, locations,
                  rooms and monthly rent.
                </p>

              </div>

            </div>


            <div className="col-lg-4">

              <div className="step-card">

                <div className="step-number">
                  03
                </div>

                <div className="step-icon">
                  <i className="bi bi-person-lines-fill"></i>
                </div>

                <h3>
                  Connect
                </h3>

                <p>
                  Contact the property owner and
                  take the next step toward your new home.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          CTA
      ====================================== */}

      <section className="cta-section">

        <div className="cta-overlay"></div>

        <div className="container position-relative">

          <div className="cta-content text-center">

            <span className="section-label">
              YOUR NEXT HOME IS WAITING
            </span>

            <h2>
              Ready to find your
              <span> perfect home?</span>
            </h2>

            <p>
              Explore available rental properties
              and find a place that feels right for you.
            </p>

            <div className="cta-buttons">

              <a
                href="/listings"
                className="cta-primary"
              >
                FIND A HOME
              </a>

              <a
                href="/signup"
                className="cta-secondary"
              >
                LIST YOUR PROPERTY
              </a>

            </div>

          </div>

        </div>

      </section>


      <Footer />

    </>
  );
}

export default Home;