import titleBar from '@/components/title-bar'
import searchGroup from '@/components/search-group'
import tableContainer from '@/components/table-container'
import tableCard from '@/components/table-card'
import myUpload from '@/components/my-upload'

const components = {
  install: function(Vue){
    Vue.component('titleBar',titleBar)
    Vue.component('searchGroup',searchGroup)
    Vue.component('tableContainer',tableContainer)
    Vue.component('tableCard',tableCard)
    Vue.component('myUpload',myUpload)
  }
}

export default components
