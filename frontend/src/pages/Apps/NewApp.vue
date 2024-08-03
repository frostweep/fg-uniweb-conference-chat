<template>
  <card class="card" title="New App">
    <div>
      <form @submit.prevent>
        <div class="row">
          <div class="col-md-4">
            <fg-input type="text"
                      label="Name"
                      placeholder="Name here..."
                      v-model="app.name"
                      :maxlength="50">
            </fg-input>
          </div>
        </div>
        <div class="row">
          <div class="col-md-9">
            <fg-input type="text"
                      label="Description"
                      placeholder="Description here..."
                      v-model="app.description"
                      :maxlength="200">
            </fg-input>
          </div>
        </div>

        <div class="text-center">
          <p-button type="info"
                    round
                    @click.native.prevent="addNewApp">
            Create An App
          </p-button>
        </div>
        <div class="clearfix"></div>
      </form>
    </div>
  </card>
</template>
<script>

import { post, backendRoute, readToken } from './../../tools/network.js';
import router from "./../../router/index";

export default {
  data() {
    return {
      app: {
        name: "",
        description: ""
      }
    };
  },
  methods: {
    addNewApp() {

      if(this.app.name.replace(" ", "") == ""){
        alert("Name is empty. Please insert app name.");
        return;
      }

      if(confirm("Do you really want to create new app?")){
        let request = {
          api:"createApp",
          data:{
            name: this.app.name.trimStart().trimEnd(),
            description: this.app.description,
            token: readToken()
          }
        };

        post(backendRoute, request, (result) => { 

          if(result.status == false){
            alert("Failed to create an app.");
            return;
          }

          router.go(); 
        }, (y) => { alert(y); });
      }
    }
  }
};
</script>
<style>
</style>
