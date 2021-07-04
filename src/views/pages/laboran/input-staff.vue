<script>
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import Swal from "sweetalert2";
import vue2Dropzone from "vue2-dropzone";
import store from '@/store';

/**
 * Orders Component
 */
export default {
  components: {
    vueDropzone: vue2Dropzone,
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

      //dropzone
      seen: false,
      dropzoneOptions: {
        url: process.env.VUE_APP_BACKEND_URL + "/staff/import",
        thumbnailWidth: 150,
        maxFilesize: 5,
        
        headers:{"Authorization":'Bearer ' + store.getters.getLoggedUser.token},
        acceptedFiles: "text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        maxFiles: 1,
        init: function() {
          this.on('addedfile', function(file) {
            console.log(file)
            if (this.files.length > 1) {
            this.removeFile(this.files[0]);
            }
          });
          this.on('error', function(file, response){
            console.log(response)
            Swal.fire("Failed to upload your file!", "Cek kembali kesesuaian file dengan deskripsi.", "error");
          });
          this.on('success', function(file, response){
            console.log(response)
            Swal.fire("Uploaded!", "Your file has been uploaded.", "success");
          })
        }
      }
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
                    console.log(error.response)
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;

                    Swal.fire({
                        type: 'error',
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
        <div class="col-sm-12 col-md-12">
            <!-- <div title="Import Excel"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <center>
                    <b-button variant="success" @click="seen = !seen">Import Excel</b-button>
                    </center>
                    <div class="card mt-2" v-if="seen">
                        <div class="card-body">
                            <p style="color: red; font-size: 12px; margin: 0 !important;">IMPORTANT – PLEASE READ CAREFULLY</p>
                            <p class="mt-2" style="color: black; font-size: 14px; margin-bottom: 0 !important;">Deskripsi upload file Excel:</p>
                            <p class="card-title-desc" style="font-size: 14px; margin: 0 !important;">
                                - Pastikan file bertipe <b>.CSV</b> atau <b>.XSLX</b>,<br>
                                - Pastikan hanya ada <b>satu sheet</b>,<br>
                                - Pastikan Header / Row ke 1 dan urutan data di dalam file sama seperti berikut ini:<br>
                            </p>
                            <img src="@/assets/images/staff-excel-example.png" style="box-sizing: border-box; 
                                                                                                    width: 25%; 
                                                                                                    margin: auto;"/>
                            <div class="mb-4 mt-2">
                                <p class="card-title-desc" style="font-size: 14px; margin: 0 !important;">
                                    Contoh file Excel: <a href="/files/staffdummy.xlsx" download>staffdummy.xlsx</a><br>
                                </p>
                            </div>
                            <!-- file upload -->
                            <vue-dropzone
                                id="dropzone"
                                ref="myVueDropzone"
                                :use-custom-slot="true"
                                :options="dropzoneOptions"
                            >
                                <div class="dropzone-custom-content">
                                <i class="display-4 text-muted bx bxs-cloud-upload"></i>
                                <h4>Drop a file here or click to upload.</h4>
                                </div>
                            </vue-dropzone>
                        </div>
                    </div>
                    <center class="mt-4">
                        <p>Or</p>
                    </center>
                </div>
            </div>
        </div>
        <form class="form-horizontal col-sm-12 col-md-12 mt-4" @submit.prevent="inputStaff">
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