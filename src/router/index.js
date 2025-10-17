import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Poems from '../views/Poems.vue'
import PoemDetail from '../views/PoemDetail.vue'
import About from '../views/About.vue'
import Authors from '../views/Authors.vue'
import Categories from '../views/Categories.vue'
import AuthorPoems from '../views/AuthorPoems.vue'
import CategoryPoems from '../views/CategoryPoems.vue'

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
  },
  {
    path: '/authors',
    name: 'Authors',
    component: Authors,
    meta: {
      title: '作者管理'
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: {
      title: '分类管理'
    }
  },
  {
    path: '/poems/:id',
    name: 'PoemDetail',
    component: PoemDetail,
    meta: {
      title: '诗词详情'
    }
  },
  {
    path: '/author-poems/:id',
    name: 'AuthorPoems',
    component: AuthorPoems,
    meta: {
      title: '作者诗词'
    }
  },
  {
    path: '/category-poems/:id',
    name: 'CategoryPoems',
    component: CategoryPoems,
    meta: {
      title: '分类诗词'
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