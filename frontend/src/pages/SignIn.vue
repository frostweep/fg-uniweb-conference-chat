<template>
  <div class="wrapper">
      <top-navbar></top-navbar>
        <div class="col-md-3 center">
            <card class="card" title="Sign In">

                            <form v-if="loaded">
                                <div class="form-group mb-3">
                                    <input id="inputEmail" type="email" placeholder="Email address" required="" v-model="user.email" autofocus="" class="form-control rounded-pill border-0 shadow-sm px-4">
                                </div>
                                <div class="form-group mb-3">
                                    <input id="inputPassword" type="password" placeholder="Password" required="" v-model="user.password" class="form-control rounded-pill border-0 shadow-sm px-4 text-primary">
                                </div>
                                <!-- <div class="custom-control custom-checkbox mb-3">
                                    <input id="customCheck1" type="checkbox" checked class="custom-control-input">
                                    <label for="customCheck1" class="custom-control-label">Remember password</label>
                                </div> -->
                                <VueRecaptcha :sitekey="this.sitekey" :loadRecaptchaScript="true" @verify="validate" @expired="onCaptchaExpired"/>

                                <button @click.prevent="signIn" class="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Sign In</button>
                                <router-link :to="{path:'/sign-up'}"><button class="btn btn-secondary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Sign Up</button></router-link>
                            </form>
            </card>
        </div>
    </div>
</template>
<style lang="scss">

.center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 5px solid #eeedd8;
    padding: 10px;
}

</style>
<script>
import VueRecaptcha from 'vue-recaptcha';

import TopNavbar from "./../layout/dashboard/TopNavbar.vue";
import router from "./../router/index";
import { get, post, tokenAvailable, writeToken, backendRoute } from './../tools/network.js';

export default {
    components: { TopNavbar, VueRecaptcha, router },
    data: () => ({
        sitekey: '{secret}',
        loaded: false,
        user: {
            email: '',
            password: ''
        },
        verifiedCaptcha: false
    }),
    created(){
       if(tokenAvailable()){
        setTimeout(function routeToPanel () {
          this.loaded = true;
          router.push('/dashboard');
        }, 1000);
       } else {
          this.loaded = true;
       }
    },
    methods: {
        onEvent() {
            // when you need a reCAPTCHA challenge
            this.$refs.recaptcha.execute();
        },
        validate (response) {
            let request = {
                api:"validateCaptcha",
                data:{ captchaToken: response }
            };

            post(backendRoute, request, (result) => { 
                this.verifiedCaptcha = result.status;
            }, (y) => { alert(y); });
        },
        onCaptchaExpired () {
            this.$refs.recaptcha.reset();
        },
        signIn(){
            if(this.user.email.trim() == "" ||
                this.user.password.trim() == ""){
                alert("Empty field detected! Please fill required fields!");
                return;
            }

            if(!this.verifiedCaptcha){
                alert("Captcha isn't complete!");
                return;
            }

            this.loaded = false;

            let request = {
                api:"signIn",
                data:{
                    email: this.user.email,
                    password: this.user.password
                }
            };

            post(backendRoute, request, (result) => { 
                this.loaded = true;

                if(result.status == false){
                    this.verifiedCaptcha = false;
                    alert("Login error: " + result.data);
                    return;
                }

                writeToken(result.data);

                router.push('/dashboard') 
            }, (y) => 
            {
                this.verifiedCaptcha = false;

                alert(y);
            });
        }
    }
};
</script>
<style>
</style>
