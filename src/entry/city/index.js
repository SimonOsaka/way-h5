import entry from '../../views/city/citylist.vue'
import http from '../../tools/http'
//vuex
import store from '../../store'

Vue.use(http)

export default new Vue({
    el: '#root',
    store,
    render: h => h(entry)
})