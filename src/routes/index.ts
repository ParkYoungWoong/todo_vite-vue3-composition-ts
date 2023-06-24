import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './MainPage.vue'
import TodoModal from './TodoModal.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainPage,
      children: [
        {
          path: '/:id',
          component: TodoModal
        }
      ]
    }
  ]
})
