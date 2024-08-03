import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import SignIn from "@/pages/SignIn.vue";
import SignUp from "@/pages/SignUp.vue";
import Apps from "@/pages/Apps.vue";
import Welcome from "@/pages/Welcome.vue";
import Downloads from "@/pages/Downloads.vue";

const routes = [
  {
    path: "/welcome",
    name: "welcome",
    component: Welcome
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignIn
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUp
  },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/welcome",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "apps",
        name: "apps",
        component: Apps
      },
      {
        path: "profile",
        name: "profile",
        component: UserProfile
      },
      {
        path: "downloads",
        name: "downloads",
        component: Downloads
      }
    ]
  },
  { path: "*", component: NotFound }
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
