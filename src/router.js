import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from "./views/Login.vue"
import Signup from "./views/Signup.vue"
import Dash from "./views/Dashboard.vue"
import Search from "./views/Search.vue"
import Graph from "./views/Graph.vue"

Vue.use(Router)

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "/dash",
      name: "dash",
      component: Dash
    },
    {
      path: "/search",
      name: "search",
      component: Search
    },
    {
      path: "/graph",
      name: "graph",
      component: Graph
    }
  ]
});
