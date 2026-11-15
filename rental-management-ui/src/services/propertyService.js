const API_URL = "http://localhost:5123/api/Properties";
const INTERACTION_URL = "http://localhost:5123/api/interactions";

async function request(url, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data || "Something went wrong.");
  return data;
}

function propertyRequest(path = "", options) { return request(`${API_URL}${path}`, options); }
function interactionRequest(path, options) { return request(`${INTERACTION_URL}${path}`, options); }

export function getImageUrl(imageUrl) {
  if (!imageUrl) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
  return imageUrl.startsWith("http") ? imageUrl : `http://localhost:5123${imageUrl}`;
}

export function getPropertyImages(property) {
  const gallery = property?.imageUrls
    ? property.imageUrls.split("|").filter(Boolean)
    : [];
  const images = property?.imageUrl ? [property.imageUrl, ...gallery] : gallery;
  return [...new Set(images)].map(getImageUrl);
}

export function getProperties(filters = {}) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) query.set(key, value);
  });
  return propertyRequest(query.toString() ? `?${query}` : "");
}
export function getOwnerProperties() { return propertyRequest("/owner"); }
export function getProperty(id) { return propertyRequest(`/${id}`); }
export function createProperty(property) { return propertyRequest("", { method: "POST", body: JSON.stringify(property) }); }
export function updateProperty(id, property) { return propertyRequest(`/${id}`, { method: "PUT", body: JSON.stringify(property) }); }
export function deleteProperty(id) { return propertyRequest(`/${id}`, { method: "DELETE" }); }
export function uploadPropertyImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  return propertyRequest("/upload-image", { method: "POST", body: formData });
}
export function showInterest(propertyId) { return interactionRequest(`/interest/${propertyId}`, { method: "POST" }); }
export function getMyInterests() { return interactionRequest("/my-interests"); }
export function getOwnerInterests() { return interactionRequest("/owner-interests"); }
export function getNotifications() { return interactionRequest("/notifications"); }
export function getChat(propertyId) { return interactionRequest(`/chat/${propertyId}`); }
export function sendChat(propertyId, message) { return interactionRequest(`/chat/${propertyId}`, { method: "POST", body: JSON.stringify({ message }) }); }

async function reviewRequest(path, options) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5123/api/reviews${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || "Unable to load reviews.");
  return data;
}

export function getPropertyReviews(propertyId) { return reviewRequest(`/property/${propertyId}`); }
export function addPropertyReview(propertyId, review) { return reviewRequest(`/property/${propertyId}`, { method: "POST", body: JSON.stringify(review) }); }
export function getRecommendedProperties() { return reviewRequest("/recommended"); }
