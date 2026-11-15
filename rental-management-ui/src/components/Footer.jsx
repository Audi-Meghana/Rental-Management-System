function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="row g-5">

          {/* Brand */}
          <div className="col-lg-4">

            <div className="footer-logo">
              my<span>HOME</span>
            </div>

            <p className="footer-description">
              A simple and convenient rental property
              platform that helps tenants find homes
              and property owners connect with the
              right people.
            </p>

            <div className="footer-social">

              <span>
                <i className="bi bi-facebook"></i>
              </span>

              <span>
                <i className="bi bi-twitter-x"></i>
              </span>

              <span>
                <i className="bi bi-linkedin"></i>
              </span>

              <span>
                <i className="bi bi-instagram"></i>
              </span>

            </div>

          </div>


          {/* Quick Links */}
          <div className="col-6 col-lg-2">

            <h4>
              Quick Links
            </h4>

            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/listings">Listings</a>
            <a href="/contact">Contact</a>

          </div>


          {/* Services */}
          <div className="col-6 col-lg-2">

            <h4>
              Services
            </h4>

            <a href="/listings">
              Find a Home
            </a>

            <a href="/signup">
              List Property
            </a>

            <a href="/login">
              Login
            </a>

            <a href="/signup">
              Register
            </a>

          </div>


          {/* Contact */}
          <div className="col-lg-4">

            <h4>
              Contact Us
            </h4>

            <div className="footer-contact">

              <p>
                <i className="bi bi-geo-alt-fill"></i>
                Nellore, Andhra Pradesh
              </p>

              <p>
                <i className="bi bi-telephone-fill"></i>
                +91 98765 43210
              </p>

              <p>
                <i className="bi bi-envelope-fill"></i>
                hello@rentalhome.com
              </p>

            </div>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 myHOME. All rights reserved.
          </span>

          <span>
            Rental Property Management System
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;