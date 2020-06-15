import axios from 'axios';
import {Message} from 'element-ui';
import {renderThumbStyle} from 'element-ui/packages/scrollbar/src/util';

// create an axios instance
const service = axios.create({
  baseURL: '/api', // api的base_url
  timeout: 5000 // request timeout
});

// // request interceptor
// service.interceptors.request.use(config => {
//   // Do something before request is sent
//   if (store.getters.token) {
//     config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
//   }
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error); // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  });

let base = '/api';

export const getSysMenuList = params => {
  return axios.post(`${base}/syssetting/getMenuList`, params).then(res => res.data);
  // return service.post('/syssetting/getMenuList', params).then(res => res.data);
};

export const getSysSchoolList = params => {
  return service.post('/syssetting/getSchoolList', params).then(res => res.data);
};

export const getBDQTrackerInfoList = () => {
  return service.get('http://10.231.251.193:6678/api/dbq/list').then(res => res.data);
};

export const getBDQTrackerInfoListByID = (id) => {
  return service.get('http://10.231.251.193:6678/api/dbq/list?id=' + id).then(res => res.data);
};

export const getBDQTrackerInfoListByRecordID = (recordId) => {
  return service.get('http://10.231.251.193:6678/api/dbq/list?record_id=' + recordId).then(res => res.data);
};

export const insert = params => {
  axios.post('http://10.231.251.193:6678/api/dbq/insert', params);
};

export const deleteBDQRecord = id => {
  axios.get('http://10.231.251.193:6678/api/dbq/delete?id=' + id);
};

export const updateBDQRecord = record => {
  axios.post('http://10.231.251.193:6678/api/dbq/update', record).then(res => res.data);
};

export const getHistoryRecord = (recordId, field) => {
  return service.get('http://10.231.251.193:6678/api/dbq/history?record_id=' + recordId + '&field=' + field).then(res => res.data);
};

export const postTest = () => {
  service.post('http://10.231.251.193:6678/api/dbq/postping').then(res => res.data);
};

let api = {
  getSysMenuList,
  getSysSchoolList,
  insert,
  postTest
};

export default api;
