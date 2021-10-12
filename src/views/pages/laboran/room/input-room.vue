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

  },
  validations: {
    dataRoom: {
      name: { required },
      desc: { required },
      msteam_code: { required },
      msteam_link: { required },
    },
  },
  data() {
    return {
      //input room
      title: "Room Data",
      dataRoom: { 
          name: "", 
          desc: "", 
          msteam_code: "",
          msteam_link: "",
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
    
    inputRoom() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputRoom(this.dataRoom)
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

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Terjadi kesalahan!',
                        footer: error
                    })
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
        this.dataRoom.name = "";
        this.dataRoom.desc = "";
        this.dataRoom.msteam_code = "";
        this.dataRoom.msteam_link = "";
    },
  }
};
</script>

<template>
    <div div class="row mt-4">
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="inputRoom">
            <!-- <div title="Room Data"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <h4 class="card-title">Tambah Ruangan</h4>
                    <p class="card-title-desc">Isi semua informasi dibawah ini</p>
                    
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
                        >Berhasil dibatalkan!</b-alert>

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
                                <label for="nama">Nama Ruangan</label>
                                <input 
                                v-model="dataRoom.name"
                                id="nama" 
                                name="nama" 
                                type="text" 
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.dataRoom.name.$error }" />

                                <div
                                v-if="submitted && !$v.dataRoom.name.required"
                                class="invalid-feedback"
                                >Nama Ruangan harus diisi!</div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="nim">Deskripsi</label>
                                <input
                                    v-model="dataRoom.desc"
                                    id="desc"
                                    name="desc"
                                    type="text"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataRoom.desc.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataRoom.desc.required"
                                class="invalid-feedback"
                                >Deskripsi harus diisi!</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="nim">Link MS Teams</label>
                                <input
                                    v-model="dataRoom.msteam_link"
                                    id="msteam_link"
                                    name="msteam_link"
                                    type="text"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataRoom.msteam_link.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataRoom.msteam_link.required"
                                class="invalid-feedback"
                                >Link MS Teams harus diisi!</div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="nama">Kode MS Teams</label>
                                <input 
                                v-model="dataRoom.msteam_code"
                                id="msteam_code" 
                                name="msteam_code" 
                                type="text" 
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.dataRoom.msteam_code.$error }" />

                                <div
                                v-if="submitted && !$v.dataRoom.msteam_code.required"
                                class="invalid-feedback"
                                >Kode MS Teams harus diisi!</div>
                            </div>
                        </div>
                    </div>

                    <div class="text-center mt-4">
                        <button
                        type="submit"
                        class="btn btn-primary mr-2 waves-effect waves-light"
                        >Simpan</button>
                        <button type="button" @click="cancelSubmit" class="btn btn-light waves-effect">Batalkan</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>