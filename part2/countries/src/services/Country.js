import axios from 'axios';

const getAll = (url) => {
  const req = axios.get(url);
  const response = req.then(res => res.data)
  return response;
}

export default {  getAll }
