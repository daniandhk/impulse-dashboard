<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import Swal from "sweetalert2";
import appConfig from "@/app.config";

import {
  linewithDataChart,
  dashedLineChart,
  splineAreaChart,
  columnChart,
/*   columnChart2, */
  columnDatalabelChart,
  barChart,
  mixedChart,
  radialChart,
  pieChart,
  donutChart
} from "./data-apex";

import {
  smilAnimationChart,
  simpleLineChart,
  polarBarChart,
  areaLineChart,
  lineSmoothingChart,
  overlappingBarChart,
  stackBarChart,
  horizontalBarChart,
  donutAnimateChart,
  simplePieChart,
  distributedSeries,
  labelPlacementChart,
  extremeConfiguration,
  lineAreaChart
} from "./data-chartist";
/**
 * Orders Component
 */
export default {
  page: {
    title: "Nilai",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      linewithDataChart: linewithDataChart,
      dashedLineChart: dashedLineChart,
      splineAreaChart: splineAreaChart,
      columnChart: columnChart,
      columnDatalabelChart: columnDatalabelChart,
      barChart: barChart,
      mixedChart: mixedChart,
      radialChart: radialChart,
      pieChart: pieChart,
      donutChart: donutChart,
      overlappingBarChart: overlappingBarChart,
      
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs nav-class="nav-tabs-custom">
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Dasar Algoritma Pemograman</a>
                </template>
             
            <!-- Column Charts -->
            <apexchart
              class="apex-charts"
              height="350"
              type="bar"
              dir="ltr"
              :series="columnChart.series"
              :options="columnChart.chartOptions"
            ></apexchart>
              </b-tab>

              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Struktur Data</a>
                </template>
                <apexchart
              class="apex-charts"
              height="350"
              type="bar"
              dir="ltr"
              :series="columnChart.series"
              :options="columnChart.chartOptions"
            ></apexchart>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>