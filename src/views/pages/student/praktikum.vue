<script>
import Vue from "vue";
import Swal from "sweetalert2";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import {
  required,
  email,
  minLength,
  sameAs,
  maxLength,
  minValue,
  maxValue,
  numeric,
  url,
  alphaNum
} from "vuelidate/lib/validators";

/**
 * Form validation component
 */
export default {
  page: {
    title: "Halaman Praktikum",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Aplikasi Berbasis Platfrom (C2215F)",
      form: {
        fname: "",
        lname: "",
        city: "",
        state: "",
        zipcode: ""
      },
      tooltipform: {
        fname: "",
        lname: "",
        username: "",
        city: "",
        state: ""
      },
      range: {
        minlen: "",
        maxlength: "",
        between: "",
        minval: "",
        maxval: "",
        rangeval: "",
        expr: ""
      },
      typeform: {
        name: "",
        password: "",
        confirmPassword: "",
        email: "",
        url: "",
        digit: "",
        number: "",
        alphanum: "",
        textarea: ""
      },
      submitted: false,
      submitform: false,
      submit: false,
      typesubmit: false
    };
  },
  validations: {
    form: {
      fname: { required },
      lname: { required },
      city: { required },
      state: { required },
      zipcode: { required }
    },
    tooltipform: {
      fname: { required },
      lname: { required },
      username: { required },
      city: { required },
      state: { required }
    },
    range: {
      minlen: { required, minLength: minLength(6) },
      maxlength: { required, maxLength: maxLength(6) },
      between: { required, minLength: minLength(5), maxLength: maxLength(10) },
      minval: { required, minValue: minValue(6) },
      maxval: { required, maxValue: maxValue(6) },
      rangeval: { required, minValue: minValue(6), maxValue: maxValue(100) },
      expr: { required }
    },
    typeform: {
      name: { required },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs("password") },
      email: { required, email },
      url: { required, url },
      digit: { required, numeric },
      number: { required, numeric },
      alphanum: { required, alphaNum },
      textarea: { required }
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    formSubmit(e) {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();
    },

    tooltipForm() {
      this.submitform = true;
      this.$v.$touch();
    },

    /**
     * Range validation form submit
     */
    // eslint-disable-next-line no-unused-vars
    rangeform(e) {
      this.submit = true;
      // stop here if form is invalid
      this.$v.$touch();
    },
    /**
     * Validation type submit
     */
    // eslint-disable-next-line no-unused-vars
    typeForm(e) {
      this.typesubmit = true;
      // stop here if form is invalid
      this.$v.$touch();
    },
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
          

            <form action="#" @submit.prevent="typeForm">
  
              <div class="text-center form-group mb-0">
                <div>
                  <h5 class="text-left font-size-15 text-uppercase mt-4">Tes Awal</h5>
                  <p class="text-left mb-0">
                        Merupakan tahapan pertama dalam praktikum. <br>
                        Soal - soal pada Tes Awal adalah soal pilihan ganda

                      </p>
                  <h5 class="text-left font-size-15 text-uppercase mt-4"> </h5>
                <button type="submit" class="btn btn-success" >
                  <router-link
                                  to="/praktikan/tes_awal"
                                  class="font-weight-medium"
                                  href="javascript:void(0);"
                                  style="color: white;"
                                >Mulai Tes Awal</router-link>
                  </button>
      
                </div>
              </div>
            </form>
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col-->
    
    </div>

     <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
          

            <form action="#" @submit.prevent="typeForm">
  
              <div class="text-center form-group mb-0">
                <div>
                  <h5 class="text-left font-size-15 text-uppercase mt-4">Jurnal</h5>
                  <p class="text-left mb-0">
                        Merupakan tahapan utama dalam praktikum. <br>
                        Pada Jurnal akan berisi latihan yang hampir sama pada Tugas Pendahuluan yang sebelumnya telah anda kerjakan.
                        

                      </p>
                  <h5 class="text-left font-size-15 text-uppercase mt-4"> </h5>
                <button type="submit" class="btn btn-success" >
                  <router-link
                                  to="/praktikan/jurnal"
                                  class="font-weight-medium"
                                  href="javascript:void(0);"
                                  style="color: white;"
                                > Mulai Jurnal </router-link>
                  </button>
      
                </div>
              </div>
            </form>
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col-->
    
    </div>
    
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
          

            <form action="#" @submit.prevent="typeForm">
  
              <div class="text-center form-group mb-0">
                <div>
                  <h5 class="text-left font-size-15 text-uppercase mt-4">Tes Akhir</h5>
                  <p class="text-left mb-0">
                        Merupakan tahapan akhir dalam praktikum. <br>
                        Soal - soal pada Tes Akhir adalah soal pilihan ganda

                      </p>
                  <h5 class="text-left font-size-15 text-uppercase mt-4"> </h5>
                <button type="submit" class="btn btn-success" >
                  <router-link
                                  to="/praktikan/tes_akhir"
                                  class="font-weight-medium"
                                  href="javascript:void(0);"
                                  style="color: white;"
                                >Mulai Tes Akhir</router-link>
                  </button>
      
                </div>
              </div>
            </form>
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col-->
    
    </div>
  </Layout>
</template>

