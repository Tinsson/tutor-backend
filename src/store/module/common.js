import axios from '@/assets/js/axios'
const state = {
  cur_path :sessionStorage.getItem('cur_path'),
  table_loading: false
}

const actions = {
  table_axios(context,obj) {
    return new Promise((resolve,reject)=>{
      context.commit('TOGGLE_TBALE_LOADING',true)
      axios.post(obj.path,obj.data).then(res=>{
        context.commit('TOGGLE_TBALE_LOADING',false);
        resolve(res);
      })
    })
  }
}
const getters = {}
const mutations = {
  SET_CUR_PATH(state,path) {
    state.cur_path = path;
  },
  TOGGLE_TBALE_LOADING(state,status) {
    state.table_loading = status
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
