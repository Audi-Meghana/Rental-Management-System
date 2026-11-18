import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { getImageUrl, getNewsArticle } from "../services/propertyService";

function NewsArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      setError("");
      try {
        const result = await getNewsArticle(slug);
        if (active) setArticle(result);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, [slug]);

  return (
    <>
      <SiteHeader />
      <main className="news-article-page">
        <div className="news-article-container">
          <Link to="/news" className="news-back-link"><i className="bi bi-arrow-left"></i> Back to news</Link>
          {loading ? <div className="news-loading"><span></span>Loading article...</div>
            : error ? <div className="news-empty"><i className="bi bi-journal-x"></i><h1>Article unavailable</h1><p>{error}</p><Link to="/news">Browse articles</Link></div>
              : article && <article>
                <span className="news-category">{article.category}</span>
                <h1>{article.title}</h1>
                <p className="news-article-summary">{article.summary}</p>
                <div className="news-article-date"><i className="bi bi-calendar3"></i>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "Recently published"}</div>
                <img className="news-article-cover" src={getImageUrl(article.imageUrl)} alt="" />
                <div className="news-article-body">{article.content.split(/\r?\n/).filter(Boolean).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>)}</div>
              </article>}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default NewsArticle;
