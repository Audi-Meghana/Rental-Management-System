import { useCallback, useEffect, useState } from "react";
import { downloadRentalAgreement, getMyTenancies, getOwnerTenancies, respondToTenancy, uploadRentalAgreement } from "../services/propertyService";
import { getUser } from "../services/authService";

function Tenancies() {
  const isOwner = getUser()?.role === "Owner";
  const [tenancies, setTenancies] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadTenancies = useCallback(() => {
    const request = isOwner ? getOwnerTenancies : getMyTenancies;
    request().then(setTenancies).catch((loadError) => setError(loadError.message));
  }, [isOwner]);

  useEffect(() => { loadTenancies(); }, [loadTenancies]);

  const respond = async (tenancyId, confirm) => {
    setBusyId(tenancyId);
    setError("");
    try {
      await respondToTenancy(tenancyId, confirm);
      loadTenancies();
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setBusyId(null);
    }
  };

  const uploadAgreement = async (tenancyId, event) => {
    const form = event.currentTarget;
    const file = form.elements.agreement.files[0];
    if (!file) return;
    setBusyId(tenancyId);
    setError("");
    try {
      await uploadRentalAgreement(tenancyId, file);
      loadTenancies();
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusyId(null);
      form.reset();
    }
  };

  const downloadAgreement = async (tenancyId) => {
    setBusyId(tenancyId);
    setError("");
    try {
      await downloadRentalAgreement(tenancyId);
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={isOwner ? "owner-inner-page" : "user-page"}>
      <div className={isOwner ? "owner-section-heading" : "user-page-heading"}>
        <div><span className="owner-eyebrow">RENTAL AGREEMENTS</span><h1>{isOwner ? "Tenancies" : "My tenancies"}</h1><p>Confirm rental terms and securely manage signed agreement documents.</p></div>
      </div>
      {error && <div className="owner-alert" role="alert">{error}</div>}
      {tenancies.length ? <div className="tenancy-list">{tenancies.map((tenancy) => (
        <article className="tenancy-card" key={tenancy.id}>
          <div className="owner-enquiry-heading"><div><span className="owner-eyebrow">{isOwner ? tenancy.renter.fullName : tenancy.owner.fullName}</span><h2>{tenancy.property.title}</h2></div><em>{tenancy.status}</em></div>
          <div className="tenancy-details">
            <span><strong>Monthly rent</strong>₹{Number(tenancy.monthlyRent).toLocaleString("en-IN")}</span>
            <span><strong>Lease begins</strong>{new Date(tenancy.leaseStartDate).toLocaleDateString("en-IN")}</span>
            <span><strong>Lease ends</strong>{new Date(tenancy.leaseEndDate).toLocaleDateString("en-IN")}</span>
          </div>
          {tenancy.status === "PendingRenterConfirmation" && !isOwner && <div className="owner-enquiry-actions">
            <button type="button" className="owner-primary-button" disabled={busyId === tenancy.id} onClick={() => respond(tenancy.id, true)}>Confirm tenancy</button>
            <button type="button" className="owner-outline-button" disabled={busyId === tenancy.id} onClick={() => respond(tenancy.id, false)}>Decline</button>
          </div>}
          {isOwner && tenancy.status === "Confirmed" && !tenancy.hasAgreement && <form className="tenancy-upload-form" onSubmit={(event) => { event.preventDefault(); void uploadAgreement(tenancy.id, event); }}>
            <label>Upload signed agreement (PDF, max 15 MB)<input type="file" name="agreement" accept="application/pdf,.pdf" required /></label>
            <button type="submit" className="owner-primary-button" disabled={busyId === tenancy.id}>Upload agreement</button>
          </form>}
          {tenancy.hasAgreement && <button type="button" className="owner-outline-button" disabled={busyId === tenancy.id} onClick={() => downloadAgreement(tenancy.id)}><i className="bi bi-file-earmark-pdf"></i>Download signed agreement</button>}
        </article>
      ))}</div> : <div className="owner-empty-state"><i className="bi bi-file-earmark-text"></i><h3>No tenancies yet</h3><p>{isOwner ? "Propose tenancy terms from a renter enquiry to get started." : "Owner tenancy proposals will appear here."}</p></div>}
    </div>
  );
}

export default Tenancies;
