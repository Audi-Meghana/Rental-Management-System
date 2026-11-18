import { useCallback, useEffect, useState } from "react";
import { createTenancyFromEnquiry, getOwnerEnquiries, getOwnerInterests, updateEnquiryStatus } from "../../services/propertyService";

const formatDateInput = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function InterestedUsers() {
  const [items, setItems] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [error, setError] = useState("");
  const [proposingId, setProposingId] = useState(null);

  const loadData = useCallback(async () => {
    const [interestResult, enquiryResult] = await Promise.allSettled([getOwnerInterests(), getOwnerEnquiries()]);
    if (interestResult.status === "fulfilled") setItems(interestResult.value);
    else setError(interestResult.reason.message);
    if (enquiryResult.status === "fulfilled") setEnquiries(enquiryResult.value);
    else setError((current) => current || enquiryResult.reason.message);
  }, []);

  useEffect(() => { void Promise.resolve().then(loadData); }, [loadData]);

  const changeStatus = async (id, status) => {
    setError("");
    try {
      await updateEnquiryStatus(id, status);
      setEnquiries((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  const proposeTenancy = async (event, enquiry) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setError("");
    try {
      await createTenancyFromEnquiry(enquiry.id, {
        monthlyRent: Number(values.get("monthlyRent")),
        leaseStartDate: values.get("leaseStartDate"),
        leaseEndDate: values.get("leaseEndDate")
      });
      setProposingId(null);
    } catch (proposalError) {
      setError(proposalError.message);
    }
  };

  return (
    <div className="owner-inner-page">
      <div className="owner-section-heading"><div><span className="owner-eyebrow">PEOPLE</span><h1>Renter enquiries</h1><p>Review viewing requests, contact renters, and update enquiry status.</p></div></div>
      {error && <div className="owner-alert" role="alert"><i className="bi bi-exclamation-circle"></i>{error}</div>}
      {enquiries.length ? <div className="owner-enquiry-list">{enquiries.map((item) => (
        <article className="owner-enquiry-card" key={item.id}>
          <div className="owner-enquiry-heading"><div><span className="owner-eyebrow">PROPERTY ENQUIRY</span><h2>{item.property.title}</h2></div><em>{item.status}</em></div>
          <div className="owner-enquiry-renter"><strong>{item.renter.fullName}</strong><a href={`tel:${item.renter.phoneNumber}`}>{item.renter.phoneNumber}</a><a href={`mailto:${item.renter.email}`}>{item.renter.email}</a></div>
          <div className="owner-enquiry-meta">
            <span><i className="bi bi-calendar-event"></i>{item.preferredVisitDate ? new Date(item.preferredVisitDate).toLocaleDateString("en-IN") : "No visit date requested"}</span>
            <span><i className="bi bi-clock"></i>{item.preferredVisitTime || "No visit time requested"}</span>
            <span><i className="bi bi-people"></i>{item.numberOfOccupants} occupant{item.numberOfOccupants === 1 ? "" : "s"}</span>
            <span><i className="bi bi-calendar3"></i>Sent {new Date(item.createdAt).toLocaleDateString("en-IN")}</span>
          </div>
          <p className="owner-enquiry-message">{item.message}</p>
          <div className="owner-enquiry-actions">
            <a className="owner-outline-button" href={`mailto:${item.renter.email}`}><i className="bi bi-reply"></i>Reply by email</a>
            {item.status !== "Accepted" && <button type="button" className="owner-primary-button" onClick={() => changeStatus(item.id, "Accepted")}>Accept visit</button>}
            {item.status !== "Declined" && <button type="button" className="owner-outline-button" onClick={() => changeStatus(item.id, "Declined")}>Decline</button>}
            {item.status !== "Responded" && <button type="button" className="owner-outline-button" onClick={() => changeStatus(item.id, "Responded")}>Mark responded</button>}
            <button type="button" className="owner-outline-button" onClick={() => setProposingId(proposingId === item.id ? null : item.id)}>Propose tenancy</button>
          </div>
          {proposingId === item.id && <form className="tenancy-proposal-form" onSubmit={(event) => proposeTenancy(event, item)}>
            <label>Monthly rent (₹)<input type="number" name="monthlyRent" min="1" max="1000000" defaultValue={item.property.rent} required /></label>
            <label>Lease start<input type="date" name="leaseStartDate" defaultValue={formatDateInput(new Date())} required /></label>
            <label>Lease end<input type="date" name="leaseEndDate" defaultValue={formatDateInput(new Date(new Date().setFullYear(new Date().getFullYear() + 1)))} required /></label>
            <button type="submit" className="owner-primary-button">Send proposal</button>
          </form>}
        </article>
      ))}</div> : <div className="owner-empty-state"><i className="bi bi-calendar2-check"></i><h3>No enquiries yet</h3><p>Viewing requests and messages from renters will appear here.</p></div>}
      <div className="owner-section-heading owner-interest-heading"><div><span className="owner-eyebrow">INTEREST</span><h2>Interested users</h2><p>Renters who saved their interest in one of your listings.</p></div></div>
      {items.length ? <div className="owner-interest-table">{items.map((item) => <article key={item.id}><div className="owner-interest-person"><span>{item.user.fullName.charAt(0)}</span><div><strong>{item.user.fullName}</strong><small>{item.user.email} · {item.user.phoneNumber || "Phone not provided"}</small></div></div><div><small>Interested in</small><strong>{item.property.title}</strong></div><div><small>Date</small><strong>{new Date(item.createdAt).toLocaleDateString("en-IN")}</strong></div><em>{item.status}</em></article>)}</div> : <div className="nearby-empty">No additional property interests.</div>}
    </div>
  );
}

export default InterestedUsers;
