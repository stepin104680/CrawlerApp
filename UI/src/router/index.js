import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: import("../components/viewClient.vue"),
    },
    {
      path: "/clients",
      name: "Clients",
      component: () => import("../components/viewClient.vue"),
    },
    {
      path: "/clients/create",
      name: "ClientCreate",
      component: () => import("../components/createClient.vue"),
    },
    {
      path: "/clients/:id/edit",
      name: "ClientEdit",
      component: () => import("../components/editClient.vue"),
    },
  ],
});

export default router;
