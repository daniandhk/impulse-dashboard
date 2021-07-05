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
    title: "Pengaturan",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Ganti Password",
      items: [
        {
          text: "Pengaturan",
          href: "/"
        },
        {
          text: "Ganti Password",
          active: true
        }
      ],
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
    position() {
      Vue.swal({
        position: "center",
        icon: "success",
        title: "Password telah berhasil diganti",
        showConfirmButton: false,
        timer: 1500
      });
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
              <div class="form-group">
                <label>Masukkan Password Lama</label>
                <input
                  v-model="typeform.name"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  name="name"
                  :class="{ 'is-invalid': typesubmit && $v.typeform.name.$error }"
                />
                <div v-if="typesubmit && $v.typeform.name.$error" class="invalid-feedback">
                  <span v-if="!$v.typeform.name.required">This value is required.</span>
                </div>
              </div>

              <div class="form-group">
                <label>Masukkan Password Baru</label>
                <div>
                  <input
                    v-model="typeform.password"
                    type="password"
                    name="password"
                    class="form-control"
                    :class="{ 'is-invalid': typesubmit && $v.typeform.password.$error }"
                    placeholder="Password"
                  />
                  <div v-if="typesubmit && $v.typeform.password.$error" class="invalid-feedback">
                    <span v-if="!$v.typeform.password.required">This value is required.</span>
                    <span
                      v-if="!$v.typeform.password.minLength"
                    >Password must be at least 6 characters.</span>
                  </div>
                </div>
                <div class="mt-2">
                  <input
                    v-model="typeform.confirmPassword"
                    type="password"
                    name="confirmPassword"
                    class="form-control"
                    :class="{ 'is-invalid': typesubmit && $v.typeform.confirmPassword.$error }"
                    placeholder="Re-Type Password"
                  />
                  <div
                    v-if="typesubmit && $v.typeform.confirmPassword.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.typeform.confirmPassword.required">This value is required.</span>
                    <span
                      v-else-if="!$v.typeform.confirmPassword.sameAsPassword"
                    >This value should be the same.</span>
                  </div>
                </div>
              </div>

         
              <div class="text-center form-group mb-0">
                <div>
                <button type="submit" class="btn btn-primary" @click="position">Submit</button>
      
                </div>
              </div>
            </form>
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col-->
    
    </div>
    <!-- end row -->
  </Layout>
</template>