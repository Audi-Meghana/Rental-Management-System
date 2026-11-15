import { Link } from "react-router-dom";
import OwnerPropertyForm from "../../components/OwnerPropertyForm";

function AddProperty() {
	return (
		<div className="owner-inner-page">
			<div className="owner-breadcrumb"><Link to="/owner/dashboard">Dashboard</Link><i className="bi bi-chevron-right"></i><span>Add property</span></div>
			<div className="owner-section-heading"><div><span className="owner-eyebrow">GROW YOUR PORTFOLIO</span><h1>Add a new property</h1><p>Give future tenants a clear, beautiful first impression.</p></div></div>
			<OwnerPropertyForm />
		</div>
	);
}

export default AddProperty;
