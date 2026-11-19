import { API_BASE_URL, API_ORIGIN } from "./apiConfig";

const API_URL = `${API_BASE_URL}/Properties`;

const INTERACTION_URL = `${API_BASE_URL}/interactions`;
const TENANCY_URL = `${API_BASE_URL}/tenancies`;
const ADMIN_URL = `${API_BASE_URL}/admin`;
const NEWS_URL = `${API_BASE_URL}/news`;
const ADMIN_NEWS_URL = `${API_BASE_URL}/admin/news`;
const SUPPORT_URL = `${API_BASE_URL}/support/tickets`;
const ADMIN_TICKETS_URL = `${API_BASE_URL}/admin/tickets`;

const pendingGetRequests = new Map();

async function request(url, options = {}, includeToken = true) {
  const token = localStorage.getItem("token");
  const method = (options.method || "GET").toUpperCase();
  const requestKey = method === "GET"
    ? `${url}|${includeToken ? token || "" : ""}`
    : null;
  const pendingRequest = requestKey ? pendingGetRequests.get(requestKey) : null;

  if (pendingRequest) return pendingRequest;

  const requestPromise = performRequest(url, options, includeToken ? token : null);
  if (requestKey) pendingGetRequests.set(requestKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    if (requestKey && pendingGetRequests.get(requestKey) === requestPromise) {
      pendingGetRequests.delete(requestKey);
    }
  }
}

async function performRequest(url, options, token) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body != null && !(options.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Unable to reach the API at ${API_BASE_URL}. Check that the backend is running and allows this site in CORS.`,
        { cause: error }
      );
    }
    throw error;
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || data || `API request failed with status ${response.status}.`);
  }
  return data;
}

function propertyRequest(path = "", options, includeToken = true) { return request(`${API_URL}${path}`, options, includeToken); }
function interactionRequest(path, options) { return request(`${INTERACTION_URL}${path}`, options); }
function tenancyRequest(path, options) { return request(`${TENANCY_URL}${path}`, options); }

export function getImageUrl(imageUrl) {
  if (!imageUrl) return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
  return new URL(imageUrl, API_ORIGIN).toString();
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
  return propertyRequest(query.toString() ? `?${query}` : "", undefined, false);
}
export function getOwnerProperties() { return propertyRequest("/owner"); }
export function getProperty(id) { return propertyRequest(`/${id}`, undefined, false); }
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
export function createPropertyEnquiry(propertyId, enquiry) { return interactionRequest(`/enquiry/${propertyId}`, { method: "POST", body: JSON.stringify(enquiry) }); }
export function getOwnerEnquiries() { return interactionRequest("/owner-enquiries"); }
export function updateEnquiryStatus(enquiryId, status) {
  return interactionRequest(`/enquiry/${enquiryId}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
}
export function reportProperty(propertyId, report) {
  return interactionRequest(`/report/${propertyId}`, { method: "POST", body: JSON.stringify(report) });
}
export function getFavorites() { return interactionRequest("/favorites"); }
export function addFavorite(propertyId) { return interactionRequest(`/favorites/${propertyId}`, { method: "POST" }); }
export function removeFavorite(propertyId) { return interactionRequest(`/favorites/${propertyId}`, { method: "DELETE" }); }
export function recordPropertyView(propertyId) { return interactionRequest(`/view/${propertyId}`, { method: "POST" }); }
export function getRecentlyViewed() { return interactionRequest("/recently-viewed"); }
export function getPropertyAlerts() { return interactionRequest("/alerts"); }
export function addPropertyAlert(propertyId) { return interactionRequest(`/alerts/${propertyId}`, { method: "POST" }); }
export function removePropertyAlert(propertyId) { return interactionRequest(`/alerts/${propertyId}`, { method: "DELETE" }); }
export function createTenancyFromEnquiry(enquiryId, tenancy) {
  return tenancyRequest(`/from-enquiry/${enquiryId}`, { method: "POST", body: JSON.stringify(tenancy) });
}
export function getOwnerTenancies() { return tenancyRequest("/owner"); }
export function getMyTenancies() { return tenancyRequest("/mine"); }
export function respondToTenancy(tenancyId, confirm) {
  return tenancyRequest(`/${tenancyId}/confirmation`, { method: "PATCH", body: JSON.stringify({ confirm }) });
}
export function uploadRentalAgreement(tenancyId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return tenancyRequest(`/${tenancyId}/agreement`, { method: "POST", body: formData });
}
export async function downloadRentalAgreement(tenancyId) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${TENANCY_URL}/${tenancyId}/agreement`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to download the rental agreement.");
  }
  const blobUrl = URL.createObjectURL(await response.blob());
  const download = document.createElement("a");
  download.href = blobUrl;
  download.download = "rental-agreement.pdf";
  document.body.appendChild(download);
  download.click();
  download.remove();
  URL.revokeObjectURL(blobUrl);
}
export function getAdminReports() { return request(`${ADMIN_URL}/reports`); }
export function updateAdminReport(reportId, status, adminNote) {
  return request(`${ADMIN_URL}/reports/${reportId}`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminNote })
  });
}
export function getNewsArticles(filters = {}) {
  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) query.set(key, value);
  });
  return request(query.toString() ? `${NEWS_URL}?${query}` : NEWS_URL);
}
export function getNewsArticle(slug) { return request(`${NEWS_URL}/${encodeURIComponent(slug)}`); }
export function subscribeToNews(email) {
  return request(`${NEWS_URL}/subscribe`, { method: "POST", body: JSON.stringify({ email }) });
}
export function getAdminNewsArticles() { return request(ADMIN_NEWS_URL); }
export function createAdminNewsArticle(article) {
  return request(ADMIN_NEWS_URL, { method: "POST", body: JSON.stringify(article) });
}
export function updateAdminNewsArticle(articleId, article) {
  return request(`${ADMIN_NEWS_URL}/${articleId}`, { method: "PUT", body: JSON.stringify(article) });
}
export function deleteAdminNewsArticle(articleId) {
  return request(`${ADMIN_NEWS_URL}/${articleId}`, { method: "DELETE" });
}
export function createSupportTicket(ticket) {
  const formData = new FormData();
  Object.entries(ticket).forEach(([key, value]) => {
    if (value !== null && value !== undefined) formData.append(key, value);
  });
  return request(SUPPORT_URL, { method: "POST", body: formData });
}
export function getSupportTicket(ticketCode) {
  return request(`${SUPPORT_URL}/${encodeURIComponent(ticketCode)}`);
}
export function getAdminSupportTickets(status) {
  return request(status && status !== "All"
    ? `${ADMIN_TICKETS_URL}?status=${encodeURIComponent(status)}`
    : ADMIN_TICKETS_URL);
}
export function updateAdminSupportTicket(ticketId, status, adminNote) {
  return request(`${ADMIN_TICKETS_URL}/${ticketId}`, {
    method: "PATCH",
    body: JSON.stringify({ status, adminNote })
  });
}
export async function downloadSupportTicketAttachment(ticketId, fileName) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${ADMIN_TICKETS_URL}/${ticketId}/attachment`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Unable to download the support attachment.");
  }
  const blobUrl = URL.createObjectURL(await response.blob());
  const download = document.createElement("a");
  download.href = blobUrl;
  download.download = fileName || "support-attachment";
  document.body.appendChild(download);
  download.click();
  download.remove();
  URL.revokeObjectURL(blobUrl);
}

function reviewRequest(path, options, includeToken = true) { return request(`${API_BASE_URL}/reviews${path}`, options, includeToken); }

export function getPropertyReviews(propertyId) { return reviewRequest(`/property/${propertyId}`, undefined, false); }
export function addPropertyReview(propertyId, review) { return reviewRequest(`/property/${propertyId}`, { method: "POST", body: JSON.stringify(review) }); }
export function getRecommendedProperties() { return reviewRequest("/recommended", undefined, false); }
