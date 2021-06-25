<script>
import DatePicker from "vue2-datepicker";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import Multiselect from "vue-multiselect";

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Input Jadwal",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: {
    DatePicker,
    Layout,
    Multiselect,
    PageHeader
  },
  data() {
    return {
      title: "Input Jadwal",
      items: [
        {
          text: "Forms",
          href: "/"
        },
        {
          text: "Advanced",
          active: true
        }
      ],
      defaultdate: "",
      autoClose: "",
      daterange: "",
      demoMonth: "",
      demoYear: "",
      time: null,
      enabled: false,
      enabled1: false,
      enabled2: false,
      enabled3: false,
      enabled4: false,
      enabled5: false,
      small: false,
      small1: false,
      small2: false,
      small3: false,
      danger: false,
      info: false,
      success: false,
      primary: false,
      secondary: false,
      customColor: false,
      customColor1: false,
      customColor2: false,
      customColor3: false,
      value: null,
      value1: null,
      options: [
        "Alaska",
        "Hawaii",
        "California",
        "Nevada",
        "Oregon",
        "Washington",
        "Arizona",
        "Colorado",
        "Idaho",
        "Montana",
        "Nebraska",
        "New Mexico",
        "North Dakota",
        "Utah",
        "Wyoming",
        "Alabama",
        "Arkansas",
        "Illinois",
        "Iowa"
      ],
      maxlen: "",
      data: "",
      option: "",
      textarea: "",
      yourVModel: 1,
      defaultNull: null
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Input Jadwal Praktikum</h4>
            <p class="card-title-desc">Examples of bootstrap datepicker.</p>

            <div class="form-group mb-3">
                <label>Praktikum</label>
                <multiselect v-model="value" :options="options"></multiselect>
            </div>

            <div>
              <div class="form-group mb-3">
                <label>Tanggal</label>
                <br />
                <date-picker v-model="autoClose" :first-day-of-week="1" lang="en"></date-picker>
              </div>
            </div>
            <div class="form-group mb-3">
                <label>Jam Mulai</label>
                <br />
                <date-picker
                  v-model="time"
                  format="hh:mm:ss a"
                  value-type="format"
                  type="time"
                  placeholder="hh:mm:ss a"
                ></date-picker>
            </div>
            <div class="form-group mb-3">
                <label>Jam Terakhir</label>
                <br />
                <date-picker
                  v-model="time"
                  format="hh:mm:ss a"
                  value-type="format"
                  type="time"
                  placeholder="hh:mm:ss a"
                ></date-picker>
            </div>

            <div class="form-group mb-3">
                <label>Kelas</label>
                <multiselect v-model="value" :options="options"></multiselect>
            </div>

            <div class="form-group mb-3">
                <label>Ruangan</label>
                <multiselect v-model="value" :options="options"></multiselect>
            </div>
          </div>
        </div>
      </div>
      <!-- End datepicker -->
    </div>
  </Layout>
</template>