import api from '../utils/api';

export const uploadResource = async (formData) => {
  const response = await api.post('/student/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getMyResources = async () => {
  const response = await api.get('/student/my-resources');
  return response.data;
};

export const getApprovedResources = async () => {
  const response = await api.get('/student/resources');
  return response.data;
};

export const getPendingResources = async () => {
  const response = await api.get('/admin/pending');
  return response.data;
};

export const approveResource = async (id) => {
  const response = await api.put(`/admin/approve/${id}`);
  return response.data;
};

export const rejectResource = async (id) => {
  const response = await api.put(`/admin/reject/${id}`);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/admin/delete/${id}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};
