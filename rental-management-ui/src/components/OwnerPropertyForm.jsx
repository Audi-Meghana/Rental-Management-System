import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty, getPropertyImages, uploadPropertyImage, updateProperty } from "../services/propertyService";

const emptyProperty = {
  title: "", location: "", zipCode: "", rent: "", bedrooms: "", description: "",
  isAvailable: true, imageUrl: "", imageUrls: "", propertyType: "Apartment",
  bathrooms: "", balconies: "", builtUpArea: "", floorNumber: "", totalFloors: "",
  furnishing: "", propertyAge: "", facing: "", parking: "", waterSupply: "",
  address: "", area: "", city: "", state: "", latitude: "", longitude: "",
  nearbyLandmarks: "", securityDeposit: "", maintenanceCharges: "",
  brokerageCharges: "", advancePayment: "", electricityCharges: "", waterCharges: "",
  isRentNegotiable: false, amenities: "", preferredTenants: "", genderPreference: "",
  petsAllowed: "", smokingAllowed: "", drinkingAllowed: "", visitorsAllowed: "",
  minimumStayMonths: "", leaseDurationMonths: "", noticePeriodMonths: "", availableFrom: ""
};

const amenities = [
  "Wi-Fi", "Parking", "Lift", "Security", "Water supply", "Power backup",
  "CCTV", "Laundry", "Garden", "Gym", "Swimming pool", "Dining area"
];

const nullableNumberFields = [
  "bathrooms", "balconies", "builtUpArea", "floorNumber", "totalFloors", "propertyAge",
  "securityDeposit", "maintenanceCharges", "brokerageCharges", "advancePayment",
  "minimumStayMonths", "leaseDurationMonths", "noticePeriodMonths", "latitude", "longitude"
];

const nullableBooleanFields = ["petsAllowed", "smokingAllowed", "drinkingAllowed", "visitorsAllowed"];

function OwnerPropertyForm({ property, editMode = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...emptyProperty, ...(property || {}), propertyType: property?.propertyType || "Apartment" });
  const [imagePreview, setImagePreview] = useState(property ? getPropertyImages(property) : []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const chooseImages = async (event) => {
    const files = [...(event.target.files || [])];
    if (!files.length) return;
    if (files.length > 10) {
      setError("Choose no more than 10 images.");
      event.target.value = "";
      return;
    }
    if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type.toLowerCase()))) {
      setError("Only JPG, PNG, and WEBP images are supported.");
      event.target.value = "";
      return;
    }
    if (files.some((file) => file.size === 0 || file.size > 5 * 1024 * 1024)) {
      setError("Each image must be larger than 0 bytes and no more than 5 MB.");
      event.target.value = "";
      return;
    }
    setError("");
    setImagePreview(files.map((file) => URL.createObjectURL(file)));
    setUploading(true);
    try {
      const results = await Promise.all(files.map((file) => uploadPropertyImage(file)));
      const imageUrls = results.map((result) => result.imageUrl);
      setForm((current) => ({ ...current, imageUrl: imageUrls[0], imageUrls: imageUrls.join("|") }));
    } catch (uploadError) {
      setError(uploadError.message);
      setImagePreview(property ? getPropertyImages(property) : []);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const toggleAmenity = (amenity) => {
    const selected = (form.amenities || "").split("|").filter(Boolean);
    const next = selected.includes(amenity)
      ? selected.filter((item) => item !== amenity)
      : [...selected, amenity];
    updateField("amenities", next.join("|"));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        rent: Number(form.rent),
        bedrooms: Number(form.bedrooms),
        availableFrom: form.availableFrom || null,
        ...Object.fromEntries(nullableNumberFields.map((field) => [
          field,
          form[field] === "" || form[field] == null ? null : Number(form[field])
        ])),
        ...Object.fromEntries(nullableBooleanFields.map((field) => [
          field,
          form[field] === "" || form[field] == null ? null : form[field]
        ]))
      };
      if (editMode) await updateProperty(property.id, payload);
      else await createProperty(payload);
      navigate("/owner/properties");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const textInput = (name, label, options = {}) => (
    <div className={`owner-form-field${options.wide ? " wide" : ""}`} key={name}>
      <label htmlFor={`property-${name}`}>{label}</label>
      <input
        id={`property-${name}`}
        type={options.type || "text"}
        min={options.min}
        max={options.max}
        maxLength={options.maxLength}
        step={options.step}
        required={options.required}
        value={name === "availableFrom" ? (form[name] || "").slice(0, 10) : form[name] ?? ""}
        placeholder={options.placeholder}
        onChange={(event) => updateField(name, event.target.value)}
      />
    </div>
  );

  const selectInput = (name, label, options, allowUnspecified = false) => (
    <div className="owner-form-field" key={name}>
      <label htmlFor={`property-${name}`}>{label}</label>
      <select
        id={`property-${name}`}
        value={form[name] == null ? "" : String(form[name])}
        onChange={(event) => updateField(name, event.target.value === "" ? null : event.target.value)}
      >
        {allowUnspecified && <option value="">Not specified</option>}
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
    </div>
  );

  const booleanSelect = (name, label) => (
    <div className="owner-form-field" key={name}>
      <label htmlFor={`property-${name}`}>{label}</label>
      <select
        id={`property-${name}`}
        value={form[name] == null ? "" : String(form[name])}
        onChange={(event) => updateField(name, event.target.value === "" ? null : event.target.value === "true")}
      >
        <option value="">Not specified</option>
        <option value="true">Allowed</option>
        <option value="false">Not allowed</option>
      </select>
    </div>
  );

  const formSection = (title, description) => (
    <div className="owner-form-section-heading wide" key={title}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <form className="owner-form-card property-owner-form" onSubmit={submit}>
      {error && <div className="owner-alert"><i className="bi bi-exclamation-circle"></i>{error}</div>}
      <div className="owner-form-grid">
        {formSection("Listing basics", "Give renters a clear first impression.")}
        {textInput("title", "Property title", { required: true, wide: true, placeholder: "Modern 2 BHK Apartment" })}
        {selectInput("propertyType", "Property type", ["Apartment", "Independent house", "Villa", "PG", "Studio", "Other"])}
        {textInput("location", "Location summary", { required: true, placeholder: "Neighbourhood or city" })}
        {textInput("zipCode", "PIN / ZIP code", { required: true, maxLength: 10, placeholder: "524001" })}
        {textInput("rent", "Monthly rent (₹)", { required: true, type: "number", min: 1, max: 1000000, step: "0.01" })}
        {textInput("bedrooms", "Bedrooms", { required: true, type: "number", min: 1, max: 20 })}
        {textInput("bathrooms", "Bathrooms", { type: "number", min: 0, max: 30 })}
        {textInput("balconies", "Balconies", { type: "number", min: 0, max: 20 })}
        {formSection("Property specifications", "Only enter details that accurately describe this home.")}
        {textInput("builtUpArea", "Built-up area (sq. ft.)", { type: "number", min: 0, max: 100000, step: "0.01" })}
        {textInput("floorNumber", "Floor number", { type: "number", min: 0, max: 300 })}
        {textInput("totalFloors", "Total floors", { type: "number", min: 1, max: 300 })}
        {textInput("propertyAge", "Property age (years)", { type: "number", min: 0, max: 300 })}
        {selectInput("furnishing", "Furnishing", ["Fully furnished", "Semi-furnished", "Unfurnished"], true)}
        {selectInput("facing", "Facing", ["North", "South", "East", "West", "North-east", "North-west", "South-east", "South-west"], true)}
        {selectInput("parking", "Parking", ["Bike", "Car", "Both", "None"], true)}
        {textInput("waterSupply", "Water supply", { placeholder: "Municipal, borewell, 24/7..." })}
        {formSection("Address and location", "Precise location information helps renters plan a visit.")}
        {textInput("address", "Street address", { wide: true, placeholder: "Building, street and area" })}
        {textInput("area", "Area / locality")}
        {textInput("city", "City")}
        {textInput("state", "State")}
        {textInput("latitude", "Latitude", { type: "number", min: -90, max: 90, step: "any" })}
        {textInput("longitude", "Longitude", { type: "number", min: -180, max: 180, step: "any" })}
        <div className="owner-form-field wide">
          <label htmlFor="property-nearbyLandmarks">Nearby landmarks and distance</label>
          <textarea id="property-nearbyLandmarks" rows="3" value={form.nearbyLandmarks || ""} placeholder={"Railway station — 2 km\nHospital — 500 m"} onChange={(event) => updateField("nearbyLandmarks", event.target.value)} />
        </div>
        {formSection("Rent and monthly costs", "Leave unknown charges empty instead of estimating them.")}
        {textInput("securityDeposit", "Security deposit (₹)", { type: "number", min: 0, max: 100000000, step: "0.01" })}
        {textInput("maintenanceCharges", "Monthly maintenance (₹)", { type: "number", min: 0, max: 100000000, step: "0.01" })}
        {textInput("brokerageCharges", "Brokerage (₹)", { type: "number", min: 0, max: 100000000, step: "0.01" })}
        {textInput("advancePayment", "Advance payment (₹)", { type: "number", min: 0, max: 100000000, step: "0.01" })}
        {textInput("electricityCharges", "Electricity charges", { placeholder: "As per usage, included..." })}
        {textInput("waterCharges", "Water charges", { placeholder: "Included, monthly amount..." })}
        {textInput("availableFrom", "Available from", { type: "date" })}
        <label className="owner-availability-toggle">
          <input type="checkbox" checked={form.isRentNegotiable} onChange={(event) => updateField("isRentNegotiable", event.target.checked)} />
          <span><i className="bi bi-check2"></i></span>
          <strong>Rent is negotiable</strong>
          <small>Let renters know they can discuss the rent.</small>
        </label>
        {formSection("Amenities", "Select only the facilities available at this property.")}
        <div className="property-amenity-picker wide">
          {amenities.map((amenity) => (
            <label key={amenity}>
              <input type="checkbox" checked={(form.amenities || "").split("|").includes(amenity)} onChange={() => toggleAmenity(amenity)} />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
        {formSection("Rental preferences and rules", "Set expectations before renters enquire.")}
        {textInput("preferredTenants", "Preferred tenants", { placeholder: "Families, professionals..." })}
        {textInput("genderPreference", "Gender preference", { placeholder: "Any, male, female..." })}
        {booleanSelect("petsAllowed", "Pets")}
        {booleanSelect("smokingAllowed", "Smoking")}
        {booleanSelect("drinkingAllowed", "Drinking")}
        {booleanSelect("visitorsAllowed", "Visitors")}
        {textInput("minimumStayMonths", "Minimum stay (months)", { type: "number", min: 1, max: 120 })}
        {textInput("leaseDurationMonths", "Lease duration (months)", { type: "number", min: 1, max: 120 })}
        {textInput("noticePeriodMonths", "Notice period (months)", { type: "number", min: 0, max: 24 })}
        {formSection("Description and photographs", "Add enough context and images for renters to assess the home.")}
        <div className="owner-form-field wide">
          <label htmlFor="property-description">Property description</label>
          <textarea id="property-description" required rows="5" value={form.description} placeholder="Describe the home, nearby places, and what makes it special..." onChange={(event) => updateField("description", event.target.value)} />
        </div>
        <div className="owner-form-field wide">
          <label>Property images</label>
          <label className="owner-upload-zone">
            <input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={chooseImages} />
            <i className="bi bi-images"></i>
            <strong>{uploading ? "Uploading images..." : "Choose up to 10 property images"}</strong>
            <small>JPG, PNG, or WEBP, up to 5 MB each. Add at least 5 useful views when possible.</small>
          </label>
          {imagePreview.length > 0 && <div className="owner-upload-previews">{imagePreview.map((image, index) => <img className="owner-upload-preview" key={`${image}-${index}`} src={image} alt={`Property preview ${index + 1}`} />)}</div>}
        </div>
        <label className="owner-availability-toggle">
          <input type="checkbox" checked={form.isAvailable} onChange={(event) => updateField("isAvailable", event.target.checked)} />
          <span><i className="bi bi-check2"></i></span>
          <strong>Available for rent</strong>
          <small>Show this home as available on public listings.</small>
        </label>
      </div>
      <div className="owner-form-actions">
        <button type="button" className="owner-outline-button" onClick={() => navigate("/owner/properties")}>Cancel</button>
        <button type="submit" className="owner-primary-button" disabled={saving || uploading}>{saving ? "Saving..." : editMode ? "Save changes" : "Add property"}<i className="bi bi-arrow-right"></i></button>
      </div>
    </form>
  );
}

export default OwnerPropertyForm;
