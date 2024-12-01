import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/citas',
    name: 'Citas',
    component: () => import('../views/Citas.vue')
  },
  {
    path: '/buscar',
    name: 'Buscar',
    component: () => import('../views/Buscar.vue')
  },
  {
    path: '/para-ti',
    name: 'ParaTi',
    component: () => import('../views/ParaTi.vue')
  },
  {
    path: '/soporte',
    name: 'Soporte',
    component: () => import('../views/Soporte.vue')
  },
  {
    path: '/cuenta/password',
    name: 'CambiarContrasena',
    component: () => import('../views/CambiarContrasena.vue')
  },
  {
    path: '/seguridad/pin',
    name: 'BloqueoPin',
    component: () => import('../views/BloqueoPin.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router