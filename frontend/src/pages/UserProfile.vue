<template>
    <div class="row">
      <div class="col-xl-4 col-lg-5 col-md-6">
        <user-card>

        </user-card>
      </div>
      <div class="col-xl-8 col-lg-7 col-md-6">
        <edit-profile-form>

        </edit-profile-form>
      </div>
    </div>
</template>
<script>
import EditProfileForm from "./UserProfile/EditProfileForm.vue";
import UserCard from "./UserProfile/UserCard.vue";
import { tokenAvailable } from './../tools/network.js';
import router from "./../router/index";

export default {
  components: {
    EditProfileForm,
    UserCard
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
