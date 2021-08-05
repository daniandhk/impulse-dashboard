<script>
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';

/**
 * Orders Component
 */
export default {
  components: {
    //
  },
  validations: {
    dataStaff: {
      name: { required },
      nip: { required },
      code: { required },
    },
  },
  data() {
    return {
      //input staff
      title: "Staff Data",
      dataStaff: { 
          name: "", 
          nip: "", 
          code: "",
          },
      submitted: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  methods: {
    ...notificationMethods,
    
    inputStaff() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputStaff(this.dataStaff)
                .then(response => {
                    this.tryingToInput = false;
                    this.isInputError = false;
                    this.inputSuccess = true;
                
                    if (this.inputSuccess) {
                        this.clearForm();
                        this.submitted = false;
                        Swal.fire("Submitted!", "The form submitted successfully.", "success");
                    }
                })
                .catch(error => {
                    //pop up
                    this.submitted = false;
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: error
                    })
                })
          );
      }
    },

    cancelSubmit(){
        Swal.fire({
            title: "Are you sure?",
            text: "the form that you have filled in will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Yes, cancel it!"
        }).then(result => {
            if (result.value) {
                this.clearForm();
                this.submitted = false;
                this.isInputCanceled = true;
                Swal.fire("Canceled!", "The form has been left blank.", "success");
            }
        });
    },

    clearForm(){
        this.dataStaff.name = "";
        this.dataStaff.nip = "";
        this.dataStaff.code = "";
    },
  }
};
</script>

<template>
    <div div class="row mt-4">
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="inputStaff">
            <!-- <div title="Staff Data"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <h4 class="card-title">Add Staff</h4>
                    <p class="card-title-desc">Fill all information below</p>
                    
                    <div>
                        <b-alert
                        v-model="inputSuccess"
                        class="mt-3"
                        variant="success"
                        dismissible
                        >Input data completed successfully!</b-alert>

                        <b-alert
                        v-model="isInputError"
                        class="mt-3"
                        variant="danger"
                        dismissible
                        >{{inputError}}</b-alert>

                        <b-alert
                        v-model="isInputCanceled"
                        class="mt-3"
                        variant="success"
                        dismissible
                        >Canceled!</b-alert>

                        <b-alert
                        variant="danger"
                        class="mt-3"
                        v-if="notification.message"
                        show
                        dismissible
                        >{{notification.message}}</b-alert>
                    </div>

                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="nim">NIP</label>
                                <input
                                    v-model="dataStaff.nip"
                                    id="nip"
                                    name="nip"
                                    type="number"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataStaff.nip.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataStaff.nip.required"
                                class="invalid-feedback"
                                >NIP is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="nama">Nama Dosen</label>
                                <input 
                                v-model="dataStaff.name"
                                id="nama" 
                                name="nama" 
                                type="text" 
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.dataStaff.name.$error }" />

                                <div
                                v-if="submitted && !$v.dataStaff.name.required"
                                class="invalid-feedback"
                                >Nama Dosen is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="code">Kode Dosen</label>
                                <input 
                                v-model="dataStaff.code"
                                id="code" 
                                name="code" 
                                type="text" 
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.dataStaff.code.$error }" />

                                <div
                                v-if="submitted && !$v.dataStaff.code.required"
                                class="invalid-feedback"
                                >Kode Dosen is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="text-center mt-4">
                        <button
                        type="submit"
                        class="btn btn-primary mr-2 waves-effect waves-light"
                        >Save Changes</button>
                        <button type="button" @click="cancelSubmit" class="btn btn-light waves-effect">Cancel</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>