import titleBar from '@/components/title-bar'
import searchGroup from '@/components/search-group'
import tableContainer from '@/components/table-container'
import tableCard from '@/components/table-card'
import myUpload from '@/components/my-upload'
import bigPic from '@/components/big-pic'
import timeSearch from '@/components/time-search'
import remarkModal from '@/components/remark-modal'

const components = {
  install: function(Vue){
    Vue.component('titleBar',titleBar)
    Vue.component('searchGroup',searchGroup)
    Vue.component('tableContainer',tableContainer)
    Vue.component('tableCard',tableCard)
    Vue.component('myUpload',myUpload)
    Vue.component('bigPic', bigPic)
    Vue.component('timeSearch', timeSearch)
    Vue.component('remarkModal', remarkModal)
  }
}

export default components
