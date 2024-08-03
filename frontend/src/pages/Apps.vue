<template>
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-6">
        <new-app></new-app>
        <manage-app></manage-app>
      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        <list-apps></list-apps>
      </div>
    </div>
</template>
<script>
import NewApp from "./Apps/NewApp.vue";
import ListApps from "./Apps/ListApps.vue";
import ManageApp from "./Apps/ManageApp.vue";
import { tokenAvailable } from './../tools/network.js';
import router from "./../router/index";

export default {
  components: {
    NewApp,
    ListApps,
    ManageApp
  },
  data() {
    return {
    };
  },
  created(){
    if(!tokenAvailable()){
      setTimeout(function routeToPanel () { router.push('/welcome'); }, 1000);
    }
  }
};
</script>
<style>
</style>
