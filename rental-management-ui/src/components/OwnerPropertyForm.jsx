import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty, getPropertyImages, uploadPropertyImage, updateProperty } from "../services/propertyService";

const emptyProperty = { title: "", location: "", zipCode: "", rent: "", bedrooms: "", description: "", isAvailable: true, imageUrl: "", imageUrls: "" };

function OwnerPropertyForm({ property, editMode = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(property || emptyProperty);
  const [imagePreview, setImagePreview] = useState(property ? getPropertyImages(property) : []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const chooseImages = async (event) => {
    const files = [...(event.target.files || [])].slice(0, 5);
    if (!files.length) return;
    setError("");
    setImagePreview(files.map((file) => URL.createObjectURL(file)));
    setUploading(true);
    try {
      const results = await Promise.all(files.map((file) => uploadPropertyImage(file)));
      const imageUrls = results.map((result) => result.imageUrl);
      updateField("imageUrl", imageUrls[0]);
      updateField("imageUrls", imageUrls.join("|"));
    } catch (uploadError) {
      setError(uploadError.message);
      setImagePreview([]);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, rent: Number(form.rent), bedrooms: Number(form.bedrooms) };
      if (editMode) await updateProperty(property.id, payload);
      else await createProperty(payload);
      navigate("/owner/properties");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="owner-form-card" onSubmit={submit}>
      {error && <div className="owner-alert"><i className="bi bi-exclamation-circle"></i>{error}</div>}
      <div className="owner-form-grid">
        <div className="owner-form-field wide"><label>Property title</label><input required value={form.title} placeholder="Modern 2 BHK Apartment" onChange={(event) => updateField("title", event.target.value)} /></div>
        <div className="owner-form-field"><label>Location</label><input required value={form.location} placeholder="Nellore" onChange={(event) => updateField("location", event.target.value)} /></div>
        <div className="owner-form-field"><label>ZIP code</label><input required maxLength="10" value={form.zipCode} placeholder="524001" onChange={(event) => updateField("zipCode", event.target.value)} /></div>
        <div className="owner-form-field"><label>Monthly rent</label><input required min="1" type="number" value={form.rent} placeholder="15000" onChange={(event) => updateField("rent", event.target.value)} /></div>
        <div className="owner-form-field"><label>Bedrooms</label><input required min="1" type="number" value={form.bedrooms} placeholder="2" onChange={(event) => updateField("bedrooms", event.target.value)} /></div>
        <div className="owner-form-field wide"><label>Property description</label><textarea required rows="5" value={form.description} placeholder="Describe the home, nearby places, and what makes it special..." onChange={(event) => updateField("description", event.target.value)} /></div>
        <div className="owner-form-field wide"><label>Property images</label><label className="owner-upload-zone"><input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={chooseImages} /><i className="bi bi-images"></i><strong>{uploading ? "Uploading images..." : "Choose up to 5 property images"}</strong><small>JPG, PNG, or WEBP, up to 5 MB each</small></label>{imagePreview.length > 0 && <div className="owner-upload-previews">{imagePreview.map((image, index) => <img className="owner-upload-preview" key={`${image}-${index}`} src={image} alt={`Property preview ${index + 1}`} />)}</div>}</div>
        <label className="owner-availability-toggle"><input type="checkbox" checked={form.isAvailable} onChange={(event) => updateField("isAvailable", event.target.checked)} /><span><i className="bi bi-check2"></i></span><strong>Available for rent</strong><small>Show this home as available on public listings.</small></label>
      </div>
      <div className="owner-form-actions"><button type="button" className="owner-outline-button" onClick={() => navigate("/owner/properties")}>Cancel</button><button type="submit" className="owner-primary-button" disabled={saving || uploading}>{saving ? "Saving..." : editMode ? "Save changes" : "Add property"}<i className="bi bi-arrow-right"></i></button></div>
    </form>
  );
}

export default OwnerPropertyForm;
