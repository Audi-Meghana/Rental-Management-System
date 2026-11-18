import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import {
  getAdminNewsArticles,
  getAdminReports,
  getAdminSupportTickets
} from "../../services/propertyService";

function AdminDashboard() {
  const [summary, setSummary] = useState({
    pendingReports: 0,
    openTickets: 0,
    publishedArticles: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = () => {
    setLoading(true);
    setError("");
    Promise.all([
      getAdminReports(),
      getAdminSupportTickets(),
      getAdminNewsArticles()
    ])
      .then(([reports, tickets, articles]) => {
        setSummary({
          pendingReports: reports.filter((report) => report.status === "Pending").length,
          openTickets: tickets.filter((ticket) => ["Submitted", "InReview"].includes(ticket.status)).length,
          publishedArticles: articles.filter((article) => article.isPublished).length
        });
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { void Promise.resolve().then(loadSummary); }, []);

  const sections = [
    {
      to: "/admin/reports",
      label: "Property reports",
      description: "Review listing reports and take moderation action.",
      count: summary.pendingReports,
      countLabel: "pending",
      icon: "bi-shield-exclamation",
      tone: "reports"
    },
    {
      to: "/admin/tickets",
      label: "Support tickets",
      description: "Respond to renter and owner complaints.",
      count: summary.openTickets,
      countLabel: "open",
      icon: "bi-chat-left-text",
      tone: "tickets"
    },
    {
      to: "/admin/news",
      label: "News & articles",
      description: "Write, edit, and publish myHOME updates.",
      count: summary.publishedArticles,
      countLabel: "published",
      icon: "bi-journal-richtext",
      tone: "news"
    }
  ];

  return (
    <div className="admin-reports-page">
      <AdminHeader />
      <main className="admin-reports-content admin-dashboard-content">
        <header className="admin-dashboard-heading">
          <div>
            <span className="owner-eyebrow">MYHOME ADMINISTRATION</span>
            <h1>Admin dashboard</h1>
            <p>Manage reports, support requests, and published content from one place.</p>
          </div>
          <button type="button" className="owner-outline-button" onClick={loadSummary} disabled={loading}>
            <i className="bi bi-arrow-clockwise"></i>{loading ? "Updating..." : "Refresh"}
          </button>
        </header>

        {error && <div className="owner-alert" role="alert">{error}</div>}

        <section className="admin-dashboard-cards" aria-label="Admin tools">
          {sections.map((section) => (
            <Link to={section.to} className={`admin-dashboard-card ${section.tone}`} key={section.to}>
              <span className="admin-dashboard-icon"><i className={`bi ${section.icon}`}></i></span>
              <span className="admin-dashboard-card-copy">
                <strong>{section.label}</strong>
                <small>{section.description}</small>
                <span className="admin-dashboard-card-link">Open workspace <i className="bi bi-arrow-up-right"></i></span>
              </span>
              <span className="admin-dashboard-count">
                <strong>{loading ? "—" : section.count}</strong>
                <small>{section.countLabel}</small>
              </span>
            </Link>
          ))}
        </section>

        <section className="admin-dashboard-note">
          <i className="bi bi-info-circle"></i>
          <div>
            <strong>Administrator access</strong>
            <p>These workspaces are restricted to accounts with the Admin role. Sign in with an administrator account to continue.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
