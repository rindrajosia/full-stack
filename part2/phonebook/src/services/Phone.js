import axios from 'axios';

const getAll = (url) => {
  const req = axios.get(url);
  const response = req.then(res => res.data);
  return response;
}

const remove = (url, id) => {
  const req = axios.delete(`${url}${id}`);
  const response = req.then(res => res.data);
  return response;
}

const create = (url, data) => {
  const req = axios.post(url, data);
  const response = req.then(res => res.data);
  return response;
}

const update = (url, data) => {
  const req = axios.put(url, data);
  const response = req.then(res => res.data);
  return response;
}

export default {  getAll, remove, create, update }
