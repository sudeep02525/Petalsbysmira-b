import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

let cachedToken = null;
let tokenExpiry = null;

export const authenticate = async () => {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to authenticate with Shiprocket");
  }

  cachedToken = data.token;
  // Token is valid for 10 days, we set expiry to 9 days to be safe
  tokenExpiry = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000);
  
  return cachedToken;
};

const fetchWithAuth = async (endpoint, options = {}) => {
  const token = await authenticate();
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || `Shiprocket API error at ${endpoint}`);
  }
  
  return data;
};

export const getShippingRates = async ({ deliveryPincode, weight, cod, pickupPincode }) => {
  // pickupPincode should ideally come from env or default to primary pickup location
  const pickup = pickupPincode || process.env.SHIPROCKET_PICKUP_PINCODE || "400001"; 
  const isCod = cod ? 1 : 0;
  
  const query = new URLSearchParams({
    pickup_postcode: pickup,
    delivery_postcode: deliveryPincode,
    weight: weight || 0.5,
    cod: isCod
  }).toString();

  return fetchWithAuth(`/courier/serviceability/?${query}`, { method: "GET" });
};

export const createOrder = async (orderData) => {
  return fetchWithAuth(`/orders/create/adhoc`, {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const assignAWB = async (shipmentId, courierId) => {
  return fetchWithAuth(`/courier/assign/awb`, {
    method: "POST",
    body: JSON.stringify({
      shipment_id: shipmentId,
      courier_id: courierId,
    }),
  });
};

export const requestPickup = async (shipmentId) => {
  return fetchWithAuth(`/courier/generate/pickup`, {
    method: "POST",
    body: JSON.stringify({
      shipment_id: [shipmentId],
    }),
  });
};

export const generateLabel = async (shipmentId) => {
  return fetchWithAuth(`/courier/generate/label`, {
    method: "POST",
    body: JSON.stringify({
      shipment_id: [shipmentId],
    }),
  });
};

export const generateManifest = async (shipmentId) => {
  return fetchWithAuth(`/manifests/generate`, {
    method: "POST",
    body: JSON.stringify({
      shipment_id: [shipmentId],
    }),
  });
};

export const getTracking = async (awbCode) => {
  return fetchWithAuth(`/courier/track/awb/${awbCode}`, { method: "GET" });
};

export const cancelShipment = async (awbCode) => {
  return fetchWithAuth(`/orders/cancel/awb`, {
    method: "POST",
    body: JSON.stringify({ awbs: [awbCode] }),
  });
};
