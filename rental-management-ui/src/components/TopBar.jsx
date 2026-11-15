function TopBar() {
  return (
    <div className="top-bar">
      <div className="container-fluid px-4 px-lg-5">
        <div className="topbar-content">

          <div className="topbar-left">
            <span>
              <i className="bi bi-telephone-fill"></i>
              +91 98765 43210
            </span>

            <span className="d-none d-md-flex">
              <i className="bi bi-geo-alt-fill"></i>
              Nellore, Andhra Pradesh
            </span>

            <span className="d-none d-lg-flex">
              <i className="bi bi-envelope-fill"></i>
              hello@rentalhome.com
            </span>
          </div>

          <div className="topbar-right">

            <div className="social-icons">
              <span><i className="bi bi-facebook"></i></span>
              <span><i className="bi bi-twitter-x"></i></span>
              <span><i className="bi bi-linkedin"></i></span>
              <span><i className="bi bi-instagram"></i></span>
            </div>

            <span className="top-login">
              LOGIN / REGISTER
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}

export default TopBar;