import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/connected',
    name: 'Connected',
    // route level code-splitting
    // this generates a separate chunk (connected   .[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "connected" */ '../views/Connected.vue')
  },
  {
    path: '/test1',
    name: 'Test1',
    // route level code-splitting
    // this generates a separate chunk (test1   .[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "test1" */ '../views/Test1.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
