import axios from 'axios';

const apiurl = (process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : 'http://localhost:3000';
export const weburl = apiurl.replace(/\/$/, '');

const defaultOptions = {
  withCredentials: true,
  credentials: 'same-origin',
};

export const post = (path, data) => axios.post(`${weburl}${path}`, data, { ...defaultOptions });

export const get = (path, params) => axios.get(`${weburl}${path}`, {
  ...defaultOptions,
  params,
});
