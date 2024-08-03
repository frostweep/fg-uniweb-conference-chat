<template>
  <div>

    <!--Stats cards-->
    <div class="row">
      <div class="col-md-6 col-xl-3" v-for="stats in statsCards" :key="stats.title">
        <stats-card>
          <div class="icon-big text-center" :class="`icon-${stats.type}`" slot="header">
            <i :class="stats.icon"></i>
          </div>
          <div class="numbers" slot="content">
            <p>{{stats.title}}</p>
            {{stats.value}}
          </div>
          <div class="stats" slot="footer">
            <i :class="stats.footerIcon"></i> {{stats.footerText}}
          </div>
        </stats-card>
      </div>
    </div>

    <!--Charts-->
    <div class="row">

      <div class="col-12">
        <chart-card title="CCU"
                    sub-title="Last 24 hours"
                    :chart-data="usersChart.data"
                    :chart-options="usersChart.options">
          <span slot="footer">
            <i class="ti-reload"></i> Updated now
          </span>
          <div slot="legend">
            <i class="fa fa-circle text-info"></i> CCU Per App
          </div>
        </chart-card>
      </div>

    </div>

  </div>
</template>
<script>
import { StatsCard, ChartCard } from "@/components/index";
import Chartist from 'chartist';
import { post, backendRoute, readToken, tokenAvailable } from '../tools/network.js';
import router from "./../router/index";

export default {
  components: {
    StatsCard,
    ChartCard
  },
  data() {
    return {
      apps:[],
      statsCards: [
        {
          type: "warning",
          icon: "ti-server",
          title: "Apps",
          value: "0",
          footerText: "Updated now",
          footerIcon: "ti-reload"
        },
        {
          type: "success",
          icon: "ti-server",
          title: "Traffic Used",
          value: "0GB",
          footerText: "Updated now",
          footerIcon: "ti-reload"
        },
        // {
        //   type: "danger",
        //   icon: "ti-pulse",
        //   title: "Errors",
        //   value: "23",
        //   footerText: "In the last hour",
        //   footerIcon: "ti-timer"
        // },
        // {
        //   type: "info",
        //   icon: "ti-twitter-alt",
        //   title: "Followers",
        //   value: "+45",
        //   footerText: "Updated now",
        //   footerIcon: "ti-reload"
        // }
      ],
      usersChart: {
        data: {
          labels: [ "00:00AM", "03:00AM", "06:00AM", "09:00AM", "12:00AM", "03:00PM", "06:00PM", "09:00PM", "11:00PM" ],
          series: []
        },
        options: {
          low: 0,
          high: 10,
          showArea: true,
          height: "245px",
          axisX: {
            showGrid: false
          },
          lineSmooth: Chartist.Interpolation.simple({
            divisor: 3
          }),
          showLine: true,
          showPoint: true
        }
      }
    };
  },
  created(){
    if(!tokenAvailable()){
      setTimeout(function routeToPanel () { router.push('/welcome'); }, 1000);
      return;
    }

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
      let trafficUsed = 0;

      this.statsCards[0].value = this.apps.length.toString();

      for(let i = 0; i < this.apps.length; i++){
        let stats = this.apps[i].stats;
        trafficUsed += stats.used_traffic;
        
        stats.current_ccu = i == 0 ? 3 : 1;

        let timeFrameSeries = [];
        timeFrameSeries.push(stats.current_ccu, stats.current_ccu, stats.current_ccu, stats.current_ccu, stats.current_ccu, stats.current_ccu, stats.current_ccu, stats.current_ccu, stats.current_ccu);
        this.usersChart.data.series.push(timeFrameSeries);
      }

      this.statsCards[1].value = (trafficUsed / 1024 / 1024).toFixed(2) + " GB";

    }, (y) => { alert(y); });
  },
};
</script>
<style>
</style>
