<template>
  <card class="card" title="Edit Profile">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-4">
            <fg-input type="email"
                      label="Email"
                      placeholder="Email here..."
                      v-model="user.email"
                      readonly>
            </fg-input>
          </div>
        </div>

        <div class="text-center">
          <p-button type="info"
                    round
                    @click.native.prevent="updateProfile">
            Update Profile
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>
<script>

import { post, backendRoute, readToken } from './../../tools/network.js';

export default {
  data() {
    return {
      user: {
        email: ""
      }
    };
  },
  created(){
    let request = {
      api:"getUserInfo",
      data:{ token: readToken() }
    };

    post(backendRoute, request, (result) => { 
      if(result.status == false){
        console.log(result.data);
        return;
      }

      this.user = result.data;

    }, (y) => { alert(y); });
  },
  methods: {
    updateProfile() {
     
    }
  }
};
</script>
<style>
</style>
