<template>
  <div class="wrapper">
  <top-navbar></top-navbar>

      <!-- banner -->
    <div class="jumbotron jumbotron-fluid" id="banner" :style="{'background-image': 'url(' + require('@/assets/img/welcome/banner-bk.jpg') + ')'}">
        <div class="container text-center text-md-left">
            <header>
                <div class="row justify-content-between">
                    <div class="col-2">
                        <img src="@/assets/img/favicon.png" alt="logo">
                    </div>
                </div>
            </header>
            <h1 data-aos="fade" data-aos-easing="linear" data-aos-duration="1000" data-aos-once="true" class="display-3 text-white font-weight-bold my-5">
            	Software Solutions<br>
            	For Everyone
            </h1>
            <p data-aos="fade" data-aos-easing="linear" data-aos-duration="1000" data-aos-once="true" class="lead text-white my-4">
                Use our services to save your time for developing own solutions.
                <br> Keep hard work on us - use simple plugins in your projects by few clicks integration.
            </p>
            
            <router-link :to="{path: (authorized ? '/dashboard' : '/sign-in')}"><a href="" data-aos="fade" data-aos-easing="linear" data-aos-duration="1000" data-aos-once="true" class="btn my-4 font-weight-bold atlas-cta cta-green">Dashboard</a></router-link>

            <router-link :to="{path: (authorized ? '/downloads' : '/sign-in')}"><a href="" style="margin-left:20px;" data-aos="fade" data-aos-easing="linear" data-aos-duration="1000" data-aos-once="true" class="btn my-4 font-weight-bold atlas-cta cta-green">Get SDK</a></router-link>
        </div>
    </div>
    <!-- three-blcok -->
    <div class="container my-5 py-2">
        <h2 class="text-center font-weight-bold my-5">Powerful services for your projects</h2>
        <div class="row">
            <div data-aos="fade-up" data-aos-delay="0" data-aos-duration="1000" data-aos-once="true" class="col-md-4 text-center">
                <img src="@/assets/img/welcome/smart-protect-1.jpg" alt="Anti-spam" class="mx-auto">
                <h4>AVT Chat</h4>
                <p>Audio/Video/Text chat for Unity WebGL Platform</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000" data-aos-once="true" class="col-md-4 text-center">
                <img src="@/assets/img/welcome/smart-protect-2.jpg" alt="Phishing Detect" class="mx-auto">
                <h4>Unity Plugins</h4>
                <p>Top rated Unity Assets for your projects</p>
            </div>
            <div data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000" data-aos-once="true" class="col-md-4 text-center">
                <img src="@/assets/img/welcome/smart-protect-3.jpg" alt="Smart Scan" class="mx-auto">
                <h4>Frequent Updates</h4>
                <p>Most of the products are frequently updating.</p>
            </div>
        </div>
    </div>


  </div>
</template>
<style lang="scss">
/********** common setting **********/
h2 {
    font-size: 2.8rem !important;
    font-weight: 700;
}

img {
    display: block;
    max-width: 100%;
}

a,
button {
    cursor: pointer;
}

.jumbotron {
    margin-bottom: 0 !important;
}

.atlas-cta {
    border-radius: 22px !important;
    padding: 12px 30px !important;
    font-weight: 700;
    transition: .3s ease-in-out !important;
}

.atlas-cta:hover {
    text-decoration: none;
    transform: translateY(-5px);
}

.atlas-cta-wide {
    width: 100%;
}

.cta-green {
    background: #00FFAD;
    color: #192440;
}

.cta-green:hover {
    color: #ffffff;
    background: #00e69c;
}

.cta-blue {
    background: #192440;
    color: #ffffff;
}

.cta-blue:hover {
    color: #ffffff;
    background: #121a2e;
}

.cta-ghost {
    border: 2px solid #192440 !important;
    color: #192440;
}

.cta-ghost:hover {
    color: #ffffff;
    background: #121a2e;
}

#banner {
    background-size: cover;
}

/********** banner **********/
#banner header {
    overflow: hidden;
}

#banner header img {
    max-width: 80px;
}

/********** feature (skew background) **********/
.feature img {
    width: 100%;
    max-width: 480px;
}

#feature-first {
    background: linear-gradient(168deg, #ffffff 55%, #00FFAD 0);
}

#feature-last {
    background: #00FFAD;
}

/********** price table **********/
#price-table {
    padding-top: 4rem !important;
    padding-bottom: 4rem !important;
}

#price-table__premium {
    background: #192440;
    color: #ffffff;
}

#price-table ul li {
    padding: 5px 0;
}

/********** contact **********/
#contact {
    background-size: cover;
}

#contact ul li {
    padding: 3px 0;
}

#contact form {
    color: #00FFAD;
}

#contact form input,
#contact form textarea {
    background: transparent;
    border: 1px solid #00FFAD;
    color: #ffffff;
}

/********** copyright **********/
#copyright {
    background: #192440;
    padding: 2rem 3rem;
}

#copyright #social-media a {
    width: 40px;
    height: 40px;
    border-radius: 99%;
    background: #ffffff;
    transition: .4s ease;
}

#copyright #social-media a i {
    color: #192440;
    font-size: 1.2rem;
    line-height: 40px;
}

#copyright #social-media a:hover {
    background: #00FFAD;
}

#copyright #social-media a:hover i {
    color: #ffffff;
}

/********** RWD **********/
@media (max-width: 575px) {
    #banner h1 {
        font-size: 3.6rem;
    }
}
</style>
<script>

import TopNavbar from "./../layout/dashboard/TopNavbar.vue";
import router from "./../router/index";
import { tokenAvailable } from './../tools/network.js';

export default {
    components: { TopNavbar, router },
    created(){
        this.authorized = tokenAvailable();
    },
    data() {
        return {
            authorized: false,
        };
    },
    methods: {
    }
};
</script>
<style>
</style>
