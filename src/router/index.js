import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
//import VueMeta from 'vue-meta';
//Vue.use(VueMeta);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta:{
      title:'Accueil Groupomania',
      metaList:
        [
          {name:'description', content:"Page d'accueil Groupomania"}
        ],      
    },
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: Home,
    meta:{
      title:'A propos',
      metaList:
        [
          {name:'description', content:'Page à propos'}
        ],
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Home,
    meta:{
      title:'Se connecter',
      metaList:
        [
          {name:'description', content:' page de connexion au réseau social de Groupomania'}
        ],
    }
  },
  {
    path: '/signin',
    name: 'Signin',
    component: Home,
    meta:{
      title:"S'enregistrer",
      metaList:
        [
          {name:'description', content:' page de connexion au réseau social de Groupomania'}
        ],
    
    }
  },
  {
    path: '/connected',
    name: 'Connected',
    meta:{
      title:'Liste des publications',
      metaList:
        [
          {name:'description', content:'liste des publications de Groupomania'}
        ],
    },
    // route level code-splitting
    // this generates a separate chunk (connected   .[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "connected" */ '../views/Connected.vue')
  },
  {
    path: '/creating',
    name: 'Create',
    meta:{
      title:"publier",
      metaList:
        [
          {name:'description', content:'ajouter une publication'}
        ],
    },
    // route level code-splitting
    // this generates a separate chunk (connected   .[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "connected" */ '../views/Connected.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    meta:{
      title:"Mon profil",
      metaList:
        [
          {name:'description', content:'Page pour afficher et modifier mon profil'}
        ],
    },
    // route level code-splitting
    // this generates a separate chunk (connected   .[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "connected" */ '../views/Connected.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    meta:{
      title:'Administration',
      metaList:
        [
          {name:'description', content:'page réservée aux administrateurs pour gérer les utilisateurs, les publications et les commentaires'}
        ],
    },
    // route level code-splitting
    // this generates a separate chunk (admin   .[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    meta:{
      title:'page 404',
      metaList:
        [
          {name:'description', content:'page inexistante'}
        ],
    },
    component: ()=> import('../views/PathNotFound.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to) =>{
  document.title=to.meta.title;
  
  let tag=document.createElement('meta');
      tag.name=to.meta.metaList[0].name;
      tag.content=to.meta.metaList[0].content;
  document.head.appendChild(tag);

})

export default router
