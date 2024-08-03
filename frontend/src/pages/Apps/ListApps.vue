<template>
  <card class="card" title="Apps">
    <div class="col-12">
        <card class="card-plain">
          <div class="table-full-width table-responsive">
            <paper-table type="hover" :data="appsTable.data"
                         :columns="appsTable.columns">

            </paper-table>
          </div>
        </card>
      </div>
  </card>
</template>
<script>

import { PaperTable } from "@/components";
import { post, backendRoute, readToken } from './../../tools/network.js';

const tableColumns = ["Name", "AppKey", "CCU", "Used Traffic", "Created At"];

export default {
  components: {
    PaperTable
  },
  data() {
    return {
      appsTable: {
        columns: [...tableColumns],
        data: []
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

      this.appsTable.data = result.data.map(element => {
        return {
          name: element.name,
          appkey: element.app_id,
          ccu: ("-/" + (element.default_ccu + element.subscription_ccu)),
          usedtraffic: "~0.0GB",
          createdat: new Date(element.created_at * 1000).toLocaleDateString("en-US")
        };
      });

    }, (y) => { alert(y); });
  }
};
</script>
<style>
</style>
