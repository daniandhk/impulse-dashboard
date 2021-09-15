<script>
import * as api from '@/api';
import Swal from "sweetalert2";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import { required, minLength, sameAs } from "vuelidate/lib/validators";

/**
 * Form validation component
 */
export default {
  page: {
    title: "Settings",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Change Password",
      items: [
        {
          text: "Settings",
          href: "/settings/change-password"
        },
        {
          text: "Change Password",
          active: true
        }
      ],
      typeform: {
        old_password: "",
        new_password: "",
        new_password_confirmation: "",
      },
      typesubmit: false
    };
  },
  validations: {
    typeform: {
      old_password: { required },
      new_password: { required, minLength: minLength(6) },
      new_password_confirmation: { required, sameAsPassword: sameAs("new_password") },
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    formSubmit(e) {
      this.typesubmit = true;
      // stop here if form is invalid
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      }
      else{
        return (
          api.changePassword(this.typeform)
              .then(response => {
                Swal.fire("Updated!", "You password has been updated.", "success");
              })
              .catch(error => {
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Check again you Old Password!',
                      footer: error
                  })
              })
          );
      }
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
          

            <form action="#" @submit.prevent="formSubmit">
              <div class="form-group">
                <label>Masukkan Password Lama</label>
                <input
                  v-model="typeform.old_password"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  name="old_password"
                  :class="{ 'is-invalid': typesubmit && $v.typeform.old_password.$error }"
                />
                <div v-if="typesubmit && $v.typeform.old_password.$error" class="invalid-feedback">
                  <span v-if="!$v.typeform.old_password.required">This value is required.</span>
                </div>
              </div>

              <div class="form-group">
                <label>Masukkan Password Baru</label>
                <div>
                  <input
                    v-model="typeform.new_password"
                    type="password"
                    name="new_password"
                    class="form-control"
                    :class="{ 'is-invalid': typesubmit && $v.typeform.new_password.$error }"
                    placeholder="Password"
                  />
                  <div v-if="typesubmit && $v.typeform.new_password.$error" class="invalid-feedback">
                    <span v-if="!$v.typeform.new_password.required">This value is required.</span>
                    <span
                      v-if="!$v.typeform.new_password.minLength"
                    >Password must be at least 6 characters.</span>
                  </div>
                </div>
                <div class="mt-2">
                  <input
                    v-model="typeform.new_password_confirmation"
                    type="password"
                    name="new_password_confirmation"
                    class="form-control"
                    :class="{ 'is-invalid': typesubmit && $v.typeform.new_password_confirmation.$error }"
                    placeholder="Re-Type Password"
                  />
                  <div
                    v-if="typesubmit && $v.typeform.new_password_confirmation.$error"
                    class="invalid-feedback"
                  >
                    <span v-if="!$v.typeform.new_password_confirmation.required">This value is required.</span>
                    <span
                      v-else-if="!$v.typeform.new_password_confirmation.sameAsPassword"
                    >This value should be the same.</span>
                  </div>
                </div>
              </div>
              
              <div class="text-center form-group mb-0">
                <div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
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