<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import store from '@/store';
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";

import * as api from '@/api';

/**
 * Form-element component
 */
export default {
  page: {
    title: "Ganti Password",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },

  validations: {
    dataEdit: {
      old_password: { required },
      new_password: { required },
      new_password_confirmation: { required },
    },
  },

  data() {
    return {
      title: "Ganti Password",

      dataEdit: { 
        old_password: "",
        new_password: "",
        new_password_confirmation: ""
      },
        submitted: false,
    };
  },

  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },

  methods:{
    ...notificationMethods,
    editPassword(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        console.log("test")
        return;
      } 
      else {
          if(this.dataEdit.new_password == this.dataEdit.new_password_confirmation){
            return (
                api.editPassword(store.getters.getLoggedUser.id, this.dataEdit)
                .then(response => {
                  this.submitted = false;
                  Swal.fire("Edited!", "success");
                })
                .catch(error => {
                  this.submitted = false;

                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                  })
                })
            )
          }
          else{
            return(
            Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Password does not match',
                  })
            )}
      }
    },
  }


};


</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <form class="form-horizontal" @submit.prevent="editPassword">
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-lock-2-line auti-custom-input-icon"></i>
                            <label for="old_password">Password Lama</label>
                            <input
                              type="password"
                              v-model="dataEdit.old_passsword"
                              class="form-control"
                   
                              placeholder="Password Lama"
                              :class="{ 'is-invalid': submitted && $v.dataEdit.old_passsword.$error }"
                            />
                            <div 
                            v-if="submitted && !$v.dataEdit.old_passsword.required" 
                            class="invalid-feedback">
                              old password is required.
                            </div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-lock-2-line auti-custom-input-icon"></i>
                            <label for="new_password">Password Baru</label>
                            <input
                              v-model="dataEdit.new_password"
                              type="password"
                              class="form-control"
                         
                              placeholder="Password Baru"
                              :class="{ 'is-invalid': submitted && $v.dataEdit.new_password.$error }"
                            />
                            <div
                              v-if="submitted && !$v.dataEdit.new_password.required"
                              class="invalid-feedback"
                            >New password is required.</div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-lock-2-line auti-custom-input-icon"></i>
                            <label for="new_password_confirmation">Konfirmasi Password Baru</label>
                            <input
                              v-model="dataEdit.new_password_confirmation"
                              type="password"
                              class="form-control"
                          
                              placeholder="Konfirmasi Password Baru"
                              :class="{ 'is-invalid': submitted && $v.dataEdit.new_password_confirmation.$error }"
                            />
                            <div
                              v-if="submitted && !$v.dataEdit.new_password_confirmation.required"
                              class="invalid-feedback"
                            >Confirmation password is required.</div>
                          </div>

                          <div class="mt-4 text-center">
                            <button
                              class="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >Ganti Password</button>
                          </div>
                        </form>
              
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
   
  </Layout>
</template>