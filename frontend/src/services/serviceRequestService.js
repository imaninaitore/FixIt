import api from "./api";

// Get all service requests for the logged-in user
export const getServiceRequests = async () => {
  const response = await api.get("/api/requests/");
  return response.data;
};

// Create a new service request
export const createServiceRequest = async (requestData) => {
  const response = await api.post("/api/requests/", requestData);
  return response.data;
};

// Get one service request
export const getServiceRequest = async (requestId) => {
  const response = await api.get(`/api/requests/${requestId}/`);
  return response.data;
};

// Update a service request
export const updateServiceRequest = async (requestId, requestData) => {
  const response = await api.patch(
    `/api/requests/${requestId}/`,
    requestData
  );

  return response.data;
};