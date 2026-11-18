import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { getAdminReports, updateAdminReport } from "../../services/propertyService";

function AdminReports() {
  const [reports, setReports] = useState([]);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingReportId, setUpdatingReportId] = useState(null);

  const loadReports = () => {
    setLoading(true);
    setError("");
    getAdminReports()
      .then(setReports)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { void Promise.resolve().then(loadReports); }, []);

  const updateReport = async (report, status) => {
    if (updatingReportId !== null) return;
    if (status === "HideListing" &&
        !window.confirm("Hide this property from public listings? You can restore it later.")) return;

    setError("");
    setUpdatingReportId(report.id);
    try {
      await updateAdminReport(report.id, status, notes[report.id] ?? report.adminNote ?? "");
      await loadReports();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingReportId(null);
    }
  };

  const statusFilters = [
    { value: "All", label: "All reports" },
    { value: "Pending", label: "Pending" },
    { value: "Reviewed", label: "Reviewed" },
    { value: "Dismissed", label: "Dismissed" },
    { value: "ListingHidden", label: "Hidden listings" }
  ];
  const visibleReports = statusFilter === "All"
    ? reports
    : reports.filter((report) => report.status === statusFilter);
  const countForStatus = (status) => status === "All"
    ? reports.length
    : reports.filter((report) => report.status === status).length;

  return (
    <div className="admin-reports-page">
      <AdminHeader />
      <main className="admin-reports-content">
        <div className="owner-section-heading"><div><span className="owner-eyebrow">SAFETY</span><h1>Property reports</h1><p>Review renter reports and hide or restore a listing when appropriate.</p></div></div>
        {error && <div className="owner-alert" role="alert"><span>{error}</span>{!loading && reports.length === 0 && <button type="button" className="owner-outline-button" onClick={loadReports}>Retry</button>}</div>}
        {!loading && reports.length > 0 && <nav className="admin-report-filters" aria-label="Filter property reports">
          {statusFilters.map(({ value, label }) => (
            <button
              type="button"
              key={value}
              className={statusFilter === value ? "active" : ""}
              aria-pressed={statusFilter === value}
              onClick={() => setStatusFilter(value)}
            >
              {label}<span>{countForStatus(value)}</span>
            </button>
          ))}
        </nav>}
        {loading ? <div className="owner-loading"><span></span>Loading reports...</div> : reports.length ? visibleReports.length ? <div className="admin-report-list">
          {visibleReports.map((report) => <article className="admin-report-card" key={report.id} aria-busy={updatingReportId === report.id}>
            <header><div><span className="owner-eyebrow">{report.category}</span><h2><Link to={`/property/${report.property.id}`}>{report.property.title}</Link></h2></div><em className={`admin-report-status status-${report.status.toLowerCase()}`}>{report.status}</em></header>
            <p className="admin-report-description">{report.description}</p>
            <div className="admin-report-meta"><span>Reported by {report.reporter.fullName} ({report.reporter.email})</span><span>{new Date(report.createdAt).toLocaleString("en-IN")}</span><span>{report.property.location}</span></div>
            {report.reviewedAt && <p className="admin-report-note">Previous note: {report.adminNote || "No note recorded."}</p>}
            <label className="admin-report-note-field">Moderation note<textarea rows="2" maxLength="2000" disabled={updatingReportId !== null} value={notes[report.id] ?? report.adminNote ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [report.id]: event.target.value }))} /></label>
            {updatingReportId === report.id && <p className="admin-report-updating" role="status">Saving moderation decision...</p>}
            <div className="owner-enquiry-actions">
              {report.status !== "ListingHidden" && <button type="button" className="owner-outline-button" disabled={updatingReportId !== null} onClick={() => updateReport(report, "Reviewed")}>Mark reviewed</button>}
              {report.status !== "ListingHidden" && <button type="button" className="owner-outline-button" disabled={updatingReportId !== null} onClick={() => updateReport(report, "Dismissed")}>Dismiss report</button>}
              {report.status === "ListingHidden"
                ? <button type="button" className="owner-primary-button" disabled={updatingReportId !== null} onClick={() => updateReport(report, "RestoreListing")}>Restore listing</button>
                : <button type="button" className="owner-primary-button admin-hide-listing" disabled={updatingReportId !== null} onClick={() => updateReport(report, "HideListing")}>Hide listing</button>}
            </div>
          </article>)}
        </div> : <div className="owner-empty-state"><i className="bi bi-filter-circle"></i><h3>No {statusFilters.find((filter) => filter.value === statusFilter)?.label.toLowerCase()} to show</h3><p>Choose another status filter to see more reports.</p><button type="button" className="owner-outline-button" onClick={() => setStatusFilter("All")}>Show all reports</button></div> : error ? null : <div className="owner-empty-state"><i className="bi bi-shield-check"></i><h3>No property reports</h3><p>New reports submitted by renters will appear here.</p></div>}
      </main>
    </div>
  );
}

export default AdminReports;
