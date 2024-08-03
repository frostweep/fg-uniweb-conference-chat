<template>
    <div class="col-md-2">
        <card class="card" title="Get Unity SDK">
            <div>
                <div class="text-center">
                    <img class="" src="@/assets/img/UnitylogoMadeWith_small.png" alt="...">
                </div>
            </div>
            <br />
            <div>
                <div class="text-center">
                <p-button type="info"
                            round
                            @click.native.prevent="getUnityPackage">
                    Download
                </p-button>
                </div>
            </div>
        </card>
    </div>
</template>
<script>
import { tokenAvailable } from './../tools/network.js';
import router from "./../router/index";
export default {
  components: {
  },
  methods: {
    getUnityPackage(){
        window.open("https://cdn.archive.frostweepgames.com/uniwebconferencepro/latest/sdk/uniwebconferencepro_1.0.0.unitypackage", '_blank').focus();
    }
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
