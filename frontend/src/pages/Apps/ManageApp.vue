<template>
  <card class="card" title="Manage Apps">
    <div class="col-md-4">
        <drop-down class="nav-item"
                     :title=selectedApp.name
                     title-classes="nav-link">
            <a v-for="app in apps"
                :value="app"
                :key="app.name"
             class="dropdown-item" href="#"
             @click.prevent="selectApp(app)" >{{app.name}}</a>
        </drop-down>
    </div>
    <br />
    <div class="col-md-9" v-if="appSelected">
     <fg-input type="text"
                    label="Voucher"
                    placeholder="Voucher here..."
                    v-model="voucherNumber"
                    :maxlength="50">
      </fg-input>
      <!-- <p-button type="info" style="margin-left:20px;" round @click.native.prevent="increaseCCU">Increase CCU</p-button> -->
      <p-button type="info" round @click.native.prevent="applyVoucher">Apply Voucher</p-button>
      <p-button type="info" style="margin-left:20px;" round @click.native.prevent="deleteApp">Delete An App</p-button>

    </div>
    <br />
    <div name="payout-buttons-info" class="col-md-10" >
      <b>Buy additional 100 CCU up to 1 year for 95$ (Need more? - contact support)</b>
      <!-- <div id="smart-button-container">
        <div style="text-align: center;">
          <div id="paypal-button-container"></div>
        </div>
      </div> -->

      <google-pay-button
        id="google-pay-btn"
        :options="options"
        @payed="googlePayed"
        @cancel="googleCancelled"
      />
    </div>
  </card>
</template>
<script>

import { post, backendRoute, readToken } from '../../tools/network.js';
import router from "../../router/index";


export default {
  components: {
  },
  data() {
    return {
      apps: [],
      selectedApp: {
        name: "Select App"
      },
      paypalButtons: null,
      appSelected: false,
      voucherNumber: "",
      initPayPalButton:  function initPayPalButton() {
            this.paypalButtons = window.paypal.Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'buynow',
                
              },
        
              createOrder: function(data, actions) {
                return actions.order.create({
                  purchase_units: [{"description":"100 CCU","amount":{"currency_code":"USD","value":49.99}}]
                });
              },
        
              onApprove: function(data, actions) {
                return actions.order.capture().then(function(orderData) {
                  
                  // Full available details
                  //console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
        
                  alert("Thank you for purchasing!");
                  router.go();
                });
              },
        
              onError: function(err) {
                console.log(err);
              }
            });
            this.paypalButtons.render('#paypal-button-container');
      },
      options: {
        environment: 'TEST',
        buttonColor: 'black',
        allowedCardNetworks: [
          'AMEX',
          'DISCOVER',
          'INTERAC',
          'JCB',
          'MASTERCARD',
          'VISA'
        ],
        allowedCardAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        merchantInfo: {
          merchantName: 'Example Merchant',
          merchantId: '0123456789'
        },
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: '1.00',
          currencyCode: 'USD',
          countryCode: 'US'
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
              gateway: 'example',
              gatewayMerchantId: 'exampleGatewayMerchantId'
          }
        }
      }
    };
  },
  created(){
    let request = {
      api:"getApps",
      data:{ token: readToken() }
    };

    post(backendRoute, request, (result) => { 
      if(result.status == false){
        console.log(result.data);
        return;
      }

      this.apps = result.data;
    }, (y) => { alert(y); });
  },
  mounted(){
    document.getElementsByName("payout-buttons-info")[0].style.display = "none";
  },
  methods: {
    deleteApp(){
      if(confirm("Do you really want to delete an app?")){
        let request = {
          api:"deleteApp",
          data: {
            app_id: this.selectedApp.app_id,
            token: readToken()
          }
        };

        post(backendRoute, request, (result) => { 
          if(result.status == false){
            console.log(result.data);
            return;
          }

          router.go();

          }, (y) => { alert(y); });
      }
    },
    selectApp(app){
      this.selectedApp = app;
      this.appSelected = true;

      // if(this.paypalButtons == null){
      //   this.initPayPalButton();
      // } else {
      //   this.paypalButtons.close().then(() => {
      //     this.initPayPalButton();
      //   }).catch((err) => {
      //     console.log(err);
      //   });
      // }


      document.getElementsByName("payout-buttons-info")[0].style.display = "block";
    },
    increaseCCU(){
    },
    applyVoucher(){
      if(this.voucherNumber.replace(" ", "") == ""){
        alert("Voucher is empty. Please insert voucher code.");
        return;
      }

      let request = {
        api:"registerVoucher",
        data:{ 
          token: readToken(),
          app_id: this.selectedApp.app_id,
          invoice: this.voucherNumber.replace(" ", "")
        }
      };

      this.voucherNumber = "";

      post(backendRoute, request, (result) => { 
        if(result.status == false){
          alert(result.data); 
          return;
        }

        router.go();
      }, (y) => { alert(y); });
    },
    googlePayed (paymentData) {
      // process payment
    },
    googleCancelled () {
        // handle cancel event
    }
  }
};
</script>
<style>
</style>