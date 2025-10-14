import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Poems from '../views/Poems.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/poems',
    name: 'Poems',
    component: Poems,
    meta: {
      title: '诗词列表'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - 诗词管理系统`
  next()
})

export default router