import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import { getUser } from "../services/authService";
import { createSupportTicket, getSupportTicket } from "../services/propertyService";

const issueCategories = [
  { value: "Property Listing Issue", icon: "bi-house", description: "Incorrect or misleading details" },
  { value: "Owner / Tenant Issue", icon: "bi-person", description: "Communication or conduct" },
  { value: "Payment / Rent Issue", icon: "bi-currency-rupee", description: "Rent, deposit or refund" },
  { value: "Agreement Issue", icon: "bi-file-earmark-text", description: "Rental agreement related" },
  { value: "Fake Listing / Fraud", icon: "bi-exclamation-triangle", description: "Suspicious or duplicate listing" },
  { value: "Account Issue", icon: "bi-gear", description: "Login, profile or access problem" },
  { value: "Other", icon: "bi-three-dots", description: "Any other issue" }
];

const statusLabels = {
  Submitted: "Received",
  InReview: "Being reviewed",
  Resolved: "Resolved",
  Closed: "Closed"
};

function Contact() {
  const user = getUser();
  const [form, setForm] = useState({
    requesterType: "Tenant",
    category: issueCategories[0].value,
    fullName: user?.fullName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    subject: "",
    description: ""
  });
  const [attachment, setAttachment] = useState(null);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [trackedTicket, setTrackedTicket] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [tracking, setTracking] = useState(false);

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const chooseAttachment = (event) => {
    const file = event.target.files?.[0] || null;
    setSubmitError("");
    if (file && file.size > 5 * 1024 * 1024) {
      setAttachment(null);
      setSubmitError("The attachment must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    if (file && !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.type.toLowerCase())) {
      setAttachment(null);
      setSubmitError("Choose a JPG, PNG, WEBP, or PDF proof file.");
      event.target.value = "";
      return;
    }
    setAttachment(file);
  };

  const submitComplaint = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const result = await createSupportTicket({ ...form, attachment });
      setCreatedTicket(result);
      setTrackedTicket(null);
      setForm((current) => ({ ...current, subject: "", description: "" }));
      setAttachment(null);
      event.target.reset();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const trackComplaint = async (event) => {
    event.preventDefault();
    setTrackError("");
    setTrackedTicket(null);
    setTracking(true);
    try {
      setTrackedTicket(await getSupportTicket(ticketCode.trim()));
    } catch (error) {
      setTrackError(error.message);
    } finally {
      setTracking(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="support-page">
        <section className="support-hero">
          <div className="support-hero-copy">
            <span className="support-eyebrow">SUPPORT &amp; COMPLAINTS</span>
            <h1>Facing an issue?</h1>
            <p>Tell us what happened. We’re here to help with rental, listing, and account concerns.</p>
          </div>
          <div className="support-hero-icon"><i className="bi bi-headset"></i></div>
        </section>

        <div className="support-content">
          <section className="support-form-card">
            {createdTicket ? <div className="support-confirmation" role="status">
              <span><i className="bi bi-check2-circle"></i></span>
              <p className="support-eyebrow">COMPLAINT RECEIVED</p>
              <h2>Thank you for letting us know.</h2>
              <p>Your ticket has been created. Save this ID to check its status at any time.</p>
              <strong className="support-ticket-code">{createdTicket.ticketCode}</strong>
              <button type="button" className="support-secondary-button" onClick={() => setCreatedTicket(null)}>Submit another complaint</button>
            </div> : <>
              <header className="support-card-heading">
                <span><i className="bi bi-ticket-perforated"></i></span>
                <div><h2>Raise a complaint / report an issue</h2><p>Share the details and our support team will review them.</p></div>
              </header>
              {submitError && <p className="support-error" role="alert">{submitError}</p>}
              <form className="support-form" onSubmit={submitComplaint}>
                <fieldset className="support-role-select">
                  <legend>I am a</legend>
                  {[["Tenant", "Tenant / Renter", "bi-person"], ["Owner", "Property Owner", "bi-house"]].map(([value, label, icon]) => (
                    <label className={form.requesterType === value ? "selected" : ""} key={value}>
                      <input type="radio" name="requesterType" value={value} checked={form.requesterType === value} onChange={() => updateField("requesterType", value)} />
                      <i className={`bi ${icon}`}></i>{label}
                    </label>
                  ))}
                </fieldset>

                <fieldset className="support-category-field">
                  <legend>Issue category</legend>
                  <div className="support-category-grid">
                    {issueCategories.map((item) => <label className={form.category === item.value ? "selected" : ""} key={item.value}>
                      <input type="radio" name="issueCategory" value={item.value} checked={form.category === item.value} onChange={() => updateField("category", item.value)} />
                      <i className={`bi ${item.icon}`}></i><span><strong>{item.value}</strong><small>{item.description}</small></span>
                    </label>)}
                  </div>
                </fieldset>

                <div className="support-contact-fields">
                  <label>Full name<input required maxLength="100" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Your name" /></label>
                  <label>Email address<input required type="email" maxLength="150" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" /></label>
                  <label>Phone number<input required type="tel" maxLength="20" value={form.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} placeholder="+91 ..." /></label>
                </div>

                <label className="support-input-label">Subject
                  <input required maxLength="180" value={form.subject} onChange={(event) => updateField("subject", event.target.value)} placeholder="Briefly mention your issue" />
                </label>
                <label className="support-input-label">Describe the issue
                  <textarea required maxLength="4000" rows="5" value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Provide enough detail for our team to understand and investigate..." />
                </label>
                <div className="support-submit-row">
                  <label className="support-file-picker">
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={chooseAttachment} />
                    <i className="bi bi-paperclip"></i>
                    <span><strong>{attachment?.name || "Attach proof (optional)"}</strong><small>JPG, PNG, WEBP or PDF · max 5 MB</small></span>
                  </label>
                  <button type="submit" className="support-submit-button" disabled={submitting}>{submitting ? "Submitting..." : "Submit complaint"}<i className="bi bi-send"></i></button>
                </div>
              </form>
            </>}
          </section>

          <aside className="support-sidebar">
            <section className="support-help-card">
              <div className="support-illustration"><i className="bi bi-person-workspace"></i><span>myHOME care</span></div>
              <div><h2>We’re here for you</h2><ul><li>Report listing, owner, or renter concerns</li><li>Get support from the myHOME team</li><li>Track your ticket using its private ID</li><li>Help us keep the rental experience safer</li></ul></div>
            </section>

            <section className="support-track-card">
              <header><i className="bi bi-search"></i><div><h2>Track your complaint</h2><p>Already contacted us? Enter your ticket ID to check the latest status.</p></div></header>
              <form onSubmit={trackComplaint}>
                <label className="visually-hidden" htmlFor="support-ticket-code">Complaint ticket ID</label>
                <input id="support-ticket-code" required value={ticketCode} onChange={(event) => setTicketCode(event.target.value)} placeholder="Enter your ticket ID (e.g. MH-12AB34CD56EF)" />
                <button type="submit" disabled={tracking}>{tracking ? "Checking..." : "Track status"}</button>
              </form>
              {trackError && <p className="support-error" role="alert">{trackError}</p>}
              {trackedTicket && <div className="support-track-result" role="status"><span>Ticket {trackedTicket.ticketCode}</span><strong>{statusLabels[trackedTicket.status] || trackedTicket.status}</strong><small>{trackedTicket.subject} · Updated {new Date(trackedTicket.updatedAt).toLocaleString("en-IN")}</small></div>}
            </section>

            <section className="support-commitment-card">
              <i className="bi bi-clock-history"></i><div><h2>Our support commitment</h2><p>We review every report and keep your ticket status updated.</p></div>
            </section>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Contact;