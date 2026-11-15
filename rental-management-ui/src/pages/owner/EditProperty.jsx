import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import OwnerPropertyForm from "../../components/OwnerPropertyForm";
import { getProperty } from "../../services/propertyService";

function EditProperty() {
	const { id } = useParams();
	const [property, setProperty] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		getProperty(id).then(setProperty).catch((loadError) => setError(loadError.message));
	}, [id]);

	return (
		<div className="owner-inner-page">
			<div className="owner-breadcrumb"><Link to="/owner/properties">My properties</Link><i className="bi bi-chevron-right"></i><span>Edit property</span></div>
			<div className="owner-section-heading"><div><span className="owner-eyebrow">REFINE YOUR LISTING</span><h1>Edit property</h1><p>Keep the details accurate so the right people can find it.</p></div></div>
			{error && <div className="owner-alert"><i className="bi bi-exclamation-circle"></i>{error}</div>}
			{property ? <OwnerPropertyForm property={property} editMode /> : !error && <div className="owner-loading"><span></span>Loading property...</div>}
		</div>
	);
}

export default EditProperty;
