import Vue from "vue";
import App from "./App";
import router from "./router/index";
import { loadScript } from "@paypal/paypal-js";

import PaperDashboard from "./plugins/paperDashboard";
import "vue-notifyjs/themes/default.css";

Vue.use(PaperDashboard);

// loadScript({ 
//   "client-id": "AdVaL6K3lDSysTNVl6I4eUAZxXwC7QKd_n2hcAaSQA4KFKvS3iXc_W8lgwB8QIDeHvDHaRodNIy0X4sS", 
//   currency: "USD"
//  }).then((paypal) => {
//   console.log("paypal loaded");
// }).catch((err) => {
//   console.log(err);
// });

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

