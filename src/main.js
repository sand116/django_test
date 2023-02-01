import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// vue 인스턴스 생성 -> render함수에 의해 app.vue component 호출
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
