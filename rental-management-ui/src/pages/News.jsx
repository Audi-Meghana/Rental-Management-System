import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { getImageUrl, getNewsArticles, subscribeToNews } from "../services/propertyService";

const categories = ["All News", "Rental Tips", "Market Trends", "Platform Updates", "Owner Guide", "Tenant Guide", "Legal & Agreements"];
const formatDate = (date) => date
  ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  : "Recently published";

function News() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("All News");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionError, setSubscriptionError] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      setError("");
      try {
        const results = await getNewsArticles({
          category: category === "All News" ? "" : category,
          search
        });
        if (active) setArticles(results);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, [category, search]);

  const featuredArticle = useMemo(
    () => articles.find((article) => article.isFeatured) || articles[0],
    [articles]
  );
  const remainingArticles = articles.filter((article) => article.id !== featuredArticle?.id);

  const searchArticles = (event) => {
    event.preventDefault();
    setSearch(searchText.trim());
  };

  const subscribe = async (event) => {
    event.preventDefault();
    setSubscriptionMessage("");
    setSubscriptionError("");
    setSubscribing(true);
    try {
      const result = await subscribeToNews(email);
      setSubscriptionMessage(result.message);
      setEmail("");
    } catch (subscribeError) {
      setSubscriptionError(subscribeError.message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="news-page">
        <section className="news-hero">
          <div className="news-hero-copy">
            <span className="news-eyebrow">NEWS &amp; UPDATES</span>
            <h1>myHOME Updates</h1>
            <p>Rental guidance, platform updates, and ideas to help you make confident housing decisions.</p>
          </div>
        </section>

        <div className="news-content">
          <section className="news-primary-column">
            <form className="news-search" onSubmit={searchArticles}>
              <label htmlFor="news-search-input">Search articles</label>
              <div><i className="bi bi-search"></i><input id="news-search-input" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search rental advice, guides..." /><button type="submit">Search</button></div>
            </form>

            {error && <div className="owner-alert" role="alert">{error}</div>}
            {loading ? <div className="news-loading"><span></span>Loading articles...</div>
              : featuredArticle ? <article className="news-featured">
                <Link to={`/news/${featuredArticle.slug}`} className="news-featured-image">
                  <img src={getImageUrl(featuredArticle.imageUrl)} alt="" />
                  {featuredArticle.isFeatured && <span>Featured</span>}
                </Link>
                <div className="news-featured-copy">
                  <div className="news-meta"><span className="news-category">{featuredArticle.category}</span><span><i className="bi bi-calendar3"></i>{formatDate(featuredArticle.publishedAt)}</span></div>
                  <h2><Link to={`/news/${featuredArticle.slug}`}>{featuredArticle.title}</Link></h2>
                  <p>{featuredArticle.summary}</p>
                  <Link to={`/news/${featuredArticle.slug}`} className="news-read-button">Read article <i className="bi bi-arrow-right"></i></Link>
                </div>
              </article> : null}

            <section className="news-latest">
              <div className="news-section-heading"><div><span className="news-eyebrow">FRESH PERSPECTIVES</span><h2>Latest news &amp; articles</h2></div><span>{articles.length} {articles.length === 1 ? "article" : "articles"}</span></div>
              <div className="news-category-list" aria-label="Filter by news category">
                {categories.map((item) => <button type="button" key={item} className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
              </div>
              {loading ? null : remainingArticles.length ? <div className="news-card-grid">
                {remainingArticles.map((article) => <article className="news-card" key={article.id}>
                  <Link to={`/news/${article.slug}`} className="news-card-image"><img src={getImageUrl(article.imageUrl)} alt="" /></Link>
                  <div className="news-card-copy">
                    <div className="news-meta"><span className="news-category">{article.category}</span><span><i className="bi bi-calendar3"></i>{formatDate(article.publishedAt)}</span></div>
                    <h3><Link to={`/news/${article.slug}`}>{article.title}</Link></h3>
                    <p>{article.summary}</p>
                    <Link to={`/news/${article.slug}`} className="news-text-link">Read more <i className="bi bi-arrow-right"></i></Link>
                  </div>
                </article>)}
              </div> : !featuredArticle && !error ? <div className="news-empty"><i className="bi bi-journal-text"></i><h3>No articles to show</h3><p>There are no published articles in this category yet. Try another category or check back soon.</p><button type="button" onClick={() => { setCategory("All News"); setSearch(""); setSearchText(""); }}>View all articles</button></div> : null}
            </section>
          </section>

          <aside className="news-sidebar">
            <section className="news-sidebar-card">
              <h2><i className="bi bi-fire"></i> More to explore</h2>
              {articles.filter((article) => article.id !== featuredArticle?.id).slice(0, 3).map((article) => <Link className="news-popular-item" to={`/news/${article.slug}`} key={article.id}>
                <img src={getImageUrl(article.imageUrl)} alt="" />
                <span><strong>{article.title}</strong><small><i className="bi bi-calendar3"></i>{formatDate(article.publishedAt)}</small></span>
              </Link>)}
              {!loading && articles.length < 2 && <p className="news-sidebar-empty">Published stories will appear here.</p>}
            </section>

            <section className="news-sidebar-card news-subscribe-card">
              <span className="news-subscribe-icon"><i className="bi bi-envelope-paper"></i></span>
              <h2>Subscribe to myHOME updates</h2>
              <p>Get rental guidance and platform news in your inbox.</p>
              <form onSubmit={subscribe}>
                <label className="visually-hidden" htmlFor="news-subscribe-email">Email address</label>
                <input id="news-subscribe-email" type="email" required maxLength="150" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" />
                <button type="submit" disabled={subscribing}>{subscribing ? "Subscribing..." : "Subscribe"}</button>
              </form>
              {subscriptionMessage && <p className="news-form-success" role="status">{subscriptionMessage}</p>}
              {subscriptionError && <p className="news-form-error" role="alert">{subscriptionError}</p>}
            </section>

            <Link to="/contact" className="news-contact-card"><i className="bi bi-chat-dots"></i><span><strong>Need help?</strong><small>Contact the myHOME support team.</small></span><i className="bi bi-arrow-up-right"></i></Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default News;
