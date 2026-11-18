import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import {
  createAdminNewsArticle,
  deleteAdminNewsArticle,
  getAdminNewsArticles,
  updateAdminNewsArticle
} from "../../services/propertyService";

const categories = ["Rental Tips", "Market Trends", "Platform Updates", "Owner Guide", "Tenant Guide", "Legal & Agreements"];
const emptyArticle = {
  title: "",
  summary: "",
  content: "",
  category: categories[0],
  imageUrl: "",
  isFeatured: false,
  isPublished: false
};

function AdminNews() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(emptyArticle);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadArticles = () => {
    setLoading(true);
    setError("");
    getAdminNewsArticles()
      .then(setArticles)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { void Promise.resolve().then(loadArticles); }, []);

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const startEditing = (article) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      summary: article.summary,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl || "",
      isFeatured: article.isFeatured,
      isPublished: article.isPublished
    });
    setMessage("");
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyArticle);
  };

  const saveArticle = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (editingId == null) await createAdminNewsArticle(form);
      else await updateAdminNewsArticle(editingId, form);
      setMessage(form.isPublished ? "Article published." : "Draft saved.");
      resetForm();
      await getAdminNewsArticles().then(setArticles);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const removeArticle = async (article) => {
    if (!window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return;
    setError("");
    setMessage("");
    try {
      await deleteAdminNewsArticle(article.id);
      setArticles((current) => current.filter((item) => item.id !== article.id));
      if (editingId === article.id) resetForm();
      setMessage("Article deleted.");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="admin-reports-page">
      <AdminHeader />
      <main className="admin-reports-content">
        <div className="owner-section-heading"><div><span className="owner-eyebrow">PUBLISHING</span><h1>News &amp; articles</h1><p>Create, edit, feature, and publish myHOME editorial content.</p></div></div>
        {error && <div className="owner-alert" role="alert">{error}</div>}
        {message && <div className="news-admin-message" role="status">{message}</div>}

        <div className="admin-news-layout">
          <form className="admin-news-form" onSubmit={saveArticle}>
            <h2>{editingId == null ? "Create an article" : "Edit article"}</h2>
            <label>Title<input required maxLength="180" value={form.title} onChange={(event) => updateField("title", event.target.value)} /></label>
            <label>Category<select value={form.category} onChange={(event) => updateField("category", event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label>Short summary<textarea required rows="3" maxLength="500" value={form.summary} onChange={(event) => updateField("summary", event.target.value)} /></label>
            <label>Article content<textarea required rows="12" maxLength="20000" value={form.content} onChange={(event) => updateField("content", event.target.value)} /></label>
            <label>Cover image URL<input type="url" maxLength="500" value={form.imageUrl} onChange={(event) => updateField("imageUrl", event.target.value)} placeholder="https://..." /></label>
            <div className="admin-news-toggles">
              <label><input type="checkbox" checked={form.isFeatured} onChange={(event) => updateField("isFeatured", event.target.checked)} /> Feature this article</label>
              <label><input type="checkbox" checked={form.isPublished} onChange={(event) => updateField("isPublished", event.target.checked)} /> Publish article</label>
            </div>
            <div className="owner-enquiry-actions">
              <button type="submit" className="owner-primary-button" disabled={saving}>{saving ? "Saving..." : form.isPublished ? "Save & publish" : "Save draft"}</button>
              {editingId != null && <button type="button" className="owner-outline-button" onClick={resetForm} disabled={saving}>Cancel edit</button>}
            </div>
          </form>

          <section className="admin-news-list">
            <header><h2>All articles</h2><button type="button" className="owner-outline-button" onClick={loadArticles} disabled={loading}>Refresh</button></header>
            {loading ? <div className="owner-loading"><span></span>Loading articles...</div>
              : articles.length ? articles.map((article) => <article className="admin-news-row" key={article.id}>
                <div><span className={`admin-news-status ${article.isPublished ? "published" : ""}`}>{article.isPublished ? "Published" : "Draft"}</span><strong>{article.title}</strong><small>{article.category} · Updated {new Date(article.updatedAt).toLocaleDateString("en-IN")}{article.isFeatured ? " · Featured" : ""}</small></div>
                <div><button type="button" className="owner-outline-button" onClick={() => startEditing(article)}>Edit</button><button type="button" className="owner-outline-button admin-news-delete" onClick={() => removeArticle(article)}>Delete</button></div>
              </article>) : <div className="news-empty"><i className="bi bi-journal-text"></i><h3>No articles yet</h3><p>Create your first article to publish it on the News page.</p></div>}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminNews;
