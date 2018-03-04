import Vue from 'vue'
import Router from 'vue-router'
import TrisGame from '@/components/TrisGame'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TrisGame',
      component: TrisGame
    }
  ]
})
