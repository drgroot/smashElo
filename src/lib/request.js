import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://smasheloapi.herokuapp.com/';
export const API_URL = REACT_APP_API_URL.replace(/\/$/, '');

const defaultOptions = {
  withCredentials: true,
  credentials: 'same-origin',
};

export const post = (path, data) => axios.post(`${API_URL}${path}`, data, { ...defaultOptions });

export const get = (path, params) => axios.get(`${API_URL}${path}`, {
  ...defaultOptions,
  params,
});
