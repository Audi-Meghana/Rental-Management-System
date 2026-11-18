import { useEffect, useMemo, useState } from "react";
import AdminHeader from "../../components/AdminHeader";
import { downloadSupportTicketAttachment, getAdminSupportTickets, updateAdminSupportTicket } from "../../services/propertyService";

const filters = [
  ["All", "All tickets"],
  ["Submitted", "Submitted"],
  ["InReview", "In review"],
  ["Resolved", "Resolved"],
  ["Closed", "Closed"]
];
const ticketStatuses = ["Submitted", "InReview", "Resolved", "Closed"];

function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [statusDrafts, setStatusDrafts] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadTickets = () => {
    setLoading(true);
    setError("");
    getAdminSupportTickets()
      .then(setTickets)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { void Promise.resolve().then(loadTickets); }, []);

  const visibleTickets = useMemo(
    () => filter === "All" ? tickets : tickets.filter((ticket) => ticket.status === filter),
    [tickets, filter]
  );
  const countForStatus = (status) => status === "All"
    ? tickets.length
    : tickets.filter((ticket) => ticket.status === status).length;

  const saveTicket = async (ticket) => {
    if (updatingId !== null) return;
    setUpdatingId(ticket.id);
    setError("");
    setMessage("");
    try {
      const status = statusDrafts[ticket.id] || ticket.status;
      await updateAdminSupportTicket(ticket.id, status, notes[ticket.id] ?? ticket.adminNote ?? "");
      setMessage(`Ticket ${ticket.ticketCode} updated.`);
      await getAdminSupportTickets().then(setTickets);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const downloadAttachment = async (ticket) => {
    setError("");
    try {
      await downloadSupportTicketAttachment(ticket.id, ticket.attachmentFileName);
    } catch (downloadError) {
      setError(downloadError.message);
    }
  };

  return (
    <div className="admin-reports-page">
      <AdminHeader />
      <main className="admin-reports-content">
        <div className="owner-section-heading"><div><span className="owner-eyebrow">CUSTOMER CARE</span><h1>Support tickets</h1><p>Review submitted complaints and keep ticket statuses up to date.</p></div><button type="button" className="owner-outline-button" onClick={loadTickets} disabled={loading}>Refresh</button></div>
        {error && <div className="owner-alert" role="alert">{error}</div>}
        {message && <div className="news-admin-message" role="status">{message}</div>}
        {!loading && <nav className="admin-report-filters" aria-label="Filter support tickets">
          {filters.map(([value, label]) => <button type="button" key={value} className={filter === value ? "active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{countForStatus(value)}</span></button>)}
        </nav>}
        {loading ? <div className="owner-loading"><span></span>Loading support tickets...</div>
          : visibleTickets.length ? <div className="admin-ticket-list">
            {visibleTickets.map((ticket) => <article className="admin-ticket-card" key={ticket.id} aria-busy={updatingId === ticket.id}>
              <header><div><span className="owner-eyebrow">{ticket.category} · {ticket.requesterType}</span><h2>{ticket.subject}</h2></div><span className={`admin-ticket-status status-${ticket.status.toLowerCase()}`}>{ticket.status}</span></header>
              <p>{ticket.description}</p>
              <div className="admin-ticket-meta"><span><strong>{ticket.fullName}</strong> · {ticket.email} · {ticket.phoneNumber}</span><span>{ticket.ticketCode}</span><span>{new Date(ticket.createdAt).toLocaleString("en-IN")}</span></div>
              {ticket.hasAttachment && <button type="button" className="admin-ticket-attachment" onClick={() => downloadAttachment(ticket)}><i className="bi bi-paperclip"></i>{ticket.attachmentFileName || "Download attachment"}</button>}
              <div className="admin-ticket-controls">
                <label>Status<select value={statusDrafts[ticket.id] || ticket.status} disabled={updatingId !== null} onChange={(event) => setStatusDrafts((current) => ({ ...current, [ticket.id]: event.target.value }))}>{ticketStatuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
                <label>Admin note<textarea rows="2" maxLength="2000" disabled={updatingId !== null} value={notes[ticket.id] ?? ticket.adminNote ?? ""} onChange={(event) => setNotes((current) => ({ ...current, [ticket.id]: event.target.value }))} /></label>
                <button type="button" className="owner-primary-button" disabled={updatingId !== null} onClick={() => saveTicket(ticket)}>{updatingId === ticket.id ? "Saving..." : "Save update"}</button>
              </div>
            </article>)}
          </div> : <div className="owner-empty-state"><i className="bi bi-ticket-perforated"></i><h3>No support tickets</h3><p>New complaints will appear here when someone submits the contact form.</p></div>}
      </main>
    </div>
  );
}

export default AdminTickets;
