import axios from '@/assets/js/axios'
const state = {
  cur_path :localStorage.getItem('cur_path'),
  table_loading: false,
  tags: [],
  teach_range: [],
  teach_subject: []
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
  },
  CONFIG_SET(state, list){
    state.tags = list.tags;
    state.teach_range = list.teach_range;
    state.teach_subject = list.teach_subject;
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
