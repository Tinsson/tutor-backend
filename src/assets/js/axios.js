import axios from 'axios'
import Vue from './vue'
import catchCode from './catchCode'
import router from '@/router'
import qs from 'qs'
import urlList from './url'
let myvue = new Vue()

axios.interceptors.request.use(config => {
  //config.data = qs.stringify(config.data)
  if(config.headers['Content-Type'] != 'multipart/form-data'){
    config.data = qs.stringify(config.data);
  }
  let url = config.url;
  let token = localStorage.getItem('token');
  let path = localStorage.getItem('cur_path');

  if(urlList[url]) {
    config.url = urlList[url];
  }
  if (token) {
    config.headers['token'] = token;
  }else{
    if(path !== '/login'){
      router.push({path: '/login'});
    }
  }
  // config.headers.common['token'] = 'SJK3zSvzciwY6MF3jjCIXTduwg3+vcQqhLQrX6L1KdtAPz8=aCRRGiE1oboQYgRSI+zBsEce9XLWbk4qRGjc6949';
  return config
}, err => {
  myvue.$Message.error('网络错误')
  return Promise.reject(err)
})

// http response 拦截
axios.interceptors.response.use(response => {
  if (response.data.status == 0 && response.data.code == 20004) {
    myvue.$Message.error(response.data.message);
    localStorage.clear();
    router.push('/login');
    //清空session信息
    return ''
  } else if (response.data.status == 0 && catchCode.indexOf(response.data.code) == -1) {
    myvue.$Message.warning(response.data.message);
    return ''
  } else {
    return response.data
  }

}, error => {

  myvue.$Message.error('网络错误');
  return Promise.reject(error);

  // if(error.data.status === 0 && error.data.code === 20004){
  //   myvue.$Message.error(error.data.message);
  //   localStorage.clear();
  //   router.push('/login');
  //   return;
  // }else{
  //
  // }
})

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.common['token'] = 'Bearer ' + res.token
//axios.defaults.headers.common['token'] = 'SJK3zSvzciwY6MF3jjCIXTduwg3+vcQqhLQrX6L1KdtAPz8=aCRRGiE1oboQYgRSI+zBsEce9XLWbk4qRGjc6949';

axios.defaults.headers.common['hash'] = 'NhEtQ0tyvNB7vhvFnn7M4xUv2+yrDYjwLENQqXnA8ZvmOcoObY2TAiV7EePXvJmnTuVVQztXdtsaoVz2pQYvyytA0qxTDrT1SytWUWZX7Z0A3Dn6xdIKzgXJAq5cErAbPGQcS17mbbiSBn7U0BrZa9N/d23t361lb1o9J6SbBe0='

axios.defaults.timeout = 60000

let baseUrl = '';
switch(process.env.NODE_ENV){
  case 'production':
    baseUrl = 'https://api.jjwxcx.com';
    break;
  case 'testing':
    baseUrl = 'https://apitest.jjwxcx.com';
    break;
  case 'development':
    baseUrl = "";
    break;
}

axios.defaults.baseURL = baseUrl;

export default axios
