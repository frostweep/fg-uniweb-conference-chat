<template>
  <card class="card-user">
    <div>
      <div class="author">
        <img class="avatar border-white" src="@/assets/img/faces/face-2.jpg" alt="...">
        <h4 class="title">{{user.email}}</h4>
      </div>
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
  }
};
</script>
<style>
</style>
