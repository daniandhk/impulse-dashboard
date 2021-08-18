<script>
import Multiselect from "vue-multiselect";
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
    Multiselect,
  },
  validations: {
    dataStudent: {
      name: { required },
      nim: { required },
      gender: { required },
      religion: { required },
    },
  },
  data() {
    return {
      //input student
      title: "Student Data",
      dataStudent: { 
          name: "", 
          nim: "", 
          gender: "", 
          religion: "",
          },
      submitted: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      isFetchingData: false,

      //dropdown list data
      religionData: ['islam', 'protestan', 'katolik', 'buddha', 'hindu', 'khonghucu', 'kristen'],
      genderData: ['male', 'female'],
    };
  },
  mounted() {
      
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    ...notificationMethods,
    
    inputStudent() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputStudent(this.dataStudent)
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
        this.dataStudent.name = "";
        this.dataStudent.nim = "";
        this.dataStudent.gender = "";
        this.dataStudent.religion = "";
    },
  }
};
</script>

<template>
    <div div class="row mt-4">
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="inputStudent">
            <!-- <div title="Student Data"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <h4 class="card-title">Add Student</h4>
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
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="nim">NIM</label>
                                <input
                                    v-model="dataStudent.nim"
                                    id="nim"
                                    name="nim"
                                    type="number"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataStudent.nim.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataStudent.nim.required"
                                class="invalid-feedback"
                                >NIM is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="nama">Nama Mahasiswa</label>
                                <input 
                                v-model="dataStudent.name"
                                id="nama" 
                                name="nama" 
                                type="text" 
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.name.$error }" />

                                <div
                                v-if="submitted && !$v.dataStudent.name.required"
                                class="invalid-feedback"
                                >Nama Mahasiswa is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Jenis Kelamin</label>
                            <multiselect
                                v-model="dataStudent.gender"
                                :options="genderData"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.gender.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataStudent.gender.required"
                                class="invalid-feedback"
                                >Jenis Kelamin is required.</div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Agama</label>
                            <multiselect
                                v-model="dataStudent.religion"
                                :options="religionData"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.religion.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataStudent.religion.required"
                                class="invalid-feedback"
                                >Agama is required.</div>
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