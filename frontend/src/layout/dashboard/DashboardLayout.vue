<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" name="Dashboard" icon="ti-panel"/>
        <sidebar-link to="/apps" name="Apps" icon="ti-layers-alt"/>
        <sidebar-link to="/profile" name="User Profile" icon="ti-user"/>
        <sidebar-link to="/downloads" name="Downloads" icon="ti-download"/>
      </template>
      <mobile-menu>
          <li class="nav-item" v-if="!authorized">
            <a href="" class="nav-link" @click.prevent="signIn">
              <i class="ti-shift-right"></i>
              <p>
                Sign In
              </p>
            </a>
          </li>
          <li class="nav-item" v-if="authorized">
            <a href="" class="nav-link" @click.prevent="dashboard">
              <i class="ti-dashboard"></i>
              <p>
                Dashboard
              </p>
            </a>
          </li>
          <li class="nav-item" v-if="authorized">
            <a href="" class="nav-link" @click.prevent="logout">
              <i class="ti-shift-left"></i>
              <p>
                Log out
              </p>
            </a>
          </li>
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import router from "./../../router/index";
import { tokenAvailable } from './../../tools/network.js';

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu
  },
  created(){
    this.authorized = tokenAvailable();
  },
  data() {
    return {
      authorized: false
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    logout(){
      localStorage.clear();
      router.push('/welcome') 
    },
    signIn(){
      router.push('/sign-in') 
    },
    dashboard(){
      router.push('/dashboard') 
    }
  }
};
</script>
