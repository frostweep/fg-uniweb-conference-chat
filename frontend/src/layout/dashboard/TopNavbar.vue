<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <p class="navbar-brand">{{routeName}}</p>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">


          <li class="nav-item" v-if="!authorized">
            <a href="" class="nav-link" @click.prevent="welcome">
              <i class="ti-shift-right"></i>
              <p>
                Welcome
              </p>
            </a>
          </li>

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
              <i class="ti-panel"></i>
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
        </ul>
      </div>
    </div></nav>
</template>
<script>

import router from "./../../router/index";
import { tokenAvailable } from './../../tools/network.js';

export default {
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    }
  },
  created(){
    this.authorized = tokenAvailable();
  },
  data() {
    return {
      activeNotifications: false,
      authorized: false,
    };
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
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
    },
    welcome(){
      router.push('/welcome') 
    }
  }
};
</script>
<style>
</style>
