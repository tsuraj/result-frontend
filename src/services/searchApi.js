import api from './api';

export const searchJobs = async (query) => {
  return api.get(`/jobs/search?q=${query}`);
};