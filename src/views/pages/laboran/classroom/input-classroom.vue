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
    dataClassroom: {
      name: { required },
    },
  },
  data() {
    return {
      //input course
      title: "Classroom Data",
      dataClassroom: { 
          name: "",
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
    },
  },
  mounted() {
      //
  },
  methods: {
    ...notificationMethods,
    
    inputClassroom() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputClassroom(this.dataClassroom)
                .then(response => {
                    this.tryingToInput = false;
                    this.isInputError = false;
                    this.inputSuccess = true;
                
                    if (this.inputSuccess) {
                        this.clearForm();
                        this.submitted = false;
                        Swal.fire("Berhasil submit!", "Form telah berhasil di submit.", "success");
                    }
                })
                .catch(error => {
                    //pop up
                    this.submitted = false;
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;

                    if(error.response.status == 401){
                      this.$router.replace({
                          name: 'login', params: { tokenExpired: true }
                      });
                    }
                    else{
                      Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Terjadi kesalahan!',
                          footer: error.response.data.message
                      })
                    }
                })
          );
      }
    },

    cancelSubmit(){
        Swal.fire({
            title: "Anda yakin?",
            text: "Form yang telah terisi akan dikosongkan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, batalkan!"
        }).then(result => {
            if (result.value) {
                this.clearForm();
                this.submitted = false;
                this.isInputCanceled = true;
                Swal.fire("Berhasil dibatalkan!", "Form telah dikosongkan.", "success");
            }
        });
    },

    clearForm(){
        this.dataClassroom.name = "";
    },
  }
};
</script>

<template>
  <div
    div
    class="row mt-4"
  >
    <form
      class="form-horizontal col-sm-12 col-md-12"
      @submit.prevent="inputClassroom"
    >
      <!-- <div title="Course Data"> -->
      <div>
        <div
          id="metadata"
          class="tab-pane"
        >
          <h4 class="card-title">
            Tambah Kelas
          </h4>
          <p class="card-title-desc">
            Isi semua informasi dibawah ini
          </p>
                    
          <div>
            <b-alert
              v-model="inputSuccess"
              class="mt-3"
              variant="success"
              dismissible
            >
              Input data telah berhasil!
            </b-alert>

            <b-alert
              v-model="isInputError"
              class="mt-3"
              variant="danger"
              dismissible
            >
              {{ inputError }}
            </b-alert>

            <b-alert
              v-model="isInputCanceled"
              class="mt-3"
              variant="success"
              dismissible
            >
              Berhasil dibatalkan!
            </b-alert>

            <b-alert
              v-if="notification.message"
              variant="danger"
              class="mt-3"
              show
              dismissible
            >
              {{ notification.message }}
            </b-alert>
          </div>

          <div class="row">
            <div class="col-sm-4" />

            <div class="col-sm-4">
              <div class="form-group">
                <label for="nama">Nama Kelas</label>
                <input
                  id="nama"
                  v-model="dataClassroom.name"
                  v-mask="'AA-##-##'"
                  name="nama"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataClassroom.name.$error }"
                >
                <span class="text-muted">contoh: IF-42-03</span>
                <div
                  v-if="submitted && !$v.dataClassroom.name.required"
                  class="invalid-feedback"
                >
                  Nama Kelas harus diisi!
                </div>
              </div>
            </div>

            <div class="col-sm-4" />
          </div>

          <div class="text-center mt-4">
            <button
              type="submit"
              class="btn btn-primary mr-2 waves-effect waves-light"
            >
              Simpan
            </button>
            <button
              type="button"
              class="btn btn-light waves-effect"
              @click="cancelSubmit"
            >
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>