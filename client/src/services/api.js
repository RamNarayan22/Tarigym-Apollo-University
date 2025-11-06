import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

export const adminAPI = {
  createJudge: (data) => axios.post('/api/admin/judges', data),
  getJudges: () => axios.get('/api/admin/judges'),
  uploadPoster: (formData) => axios.post('/api/admin/posters', formData),
  getPosters: () => axios.get('/api/admin/posters'),
  assignPoster: (data) => axios.post('/api/admin/assign', data),
  getAllScores: () => axios.get('/api/admin/scores'),
  getPosterScores: (posterId) => axios.get(`/api/admin/scores/${posterId}`)
};

export const judgeAPI = {
  getAssignedPosters: () => axios.get('/api/judge/posters'),
  submitScore: (data) => axios.post('/api/judge/score', data)
};
