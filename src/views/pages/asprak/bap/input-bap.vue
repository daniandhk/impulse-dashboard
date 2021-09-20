<script>
import Multiselect from "vue-multiselect";
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import * as api from '@/api';
import Swal from "sweetalert2";
import moment from 'moment';

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  page: {
      title: "Input BAP",
      meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  validations: {
    dataInput:{
      materi: { required },
      evaluasi: { required },
      jenis: { required },
    },
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  mounted: async function() {
    this.loading();
    await this.loadData().then(result=>{
      this.loading();
    });
  },
  watch: {
    $route: async function() {
      await this.loadData().then(result=>{
        this.loading();
      });
    }
  },
  data() {
    return {
      title: "Input BAP",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "BAP",
          href: "/asprak/bap"
        },
        {
          text: "Input",
          active: true,
        }
      ],

      schedule_id: this.$route.params.id,

      bap_data: {
        schedule: {
            name: "",
            time_start: "",
            time_end: "",
            date: "",
            class_course: {
                courses: {
                    code: "",
                    name: "",
                },
                classes: {
                    name: "",
                },
                staffs: {
                    code: "",
                    name: "",
                }
            },
            room: {
                name: "",
            },
            module: {
                index: "",
            },
            academic_year: {
                year: "",
                semester: "",
            }
        },
        asprak: [],
        student: [],
      },

      dataInput:{
        asprak: [],
        student: [],
        materi: "",
        evaluasi: "",
        jenis: ""
      },

      dataJenis: ["online", "offline"],

      submitted: false,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      inputError: null,
      isLoading: false,

      asprak_selectedAll: false,
      student_selectedAll: false,

      //list asprak
      asprak_totalRows: 1,
      asprak_currentPage: 1,
      asprak_perPage: 1,
      asprak_filter: "",
      asprak_filterOn: [],
      asprak_sortBy: "nim",
      asprak_sortDesc: false,
      asprak_fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
        { key: "action", sortable: false, label: "Hadir", thClass: 'text-center', tdClass: 'text-center', }
      ],

      //list student
      student_totalRows: 1,
      student_currentPage: 1,
      student_perPage: 1,
      student_filter: "",
      student_filterOn: [],
      student_sortBy: "nim",
      student_sortDesc: false,
      student_fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
        { key: "action", sortable: false, label: "Hadir", thClass: 'text-center', tdClass: 'text-center', }
      ],

      max: 255,

    };
  },
  methods: {
    ...notificationMethods,

    async loadData(){
      await this.fetchData();

      this.asprak_totalRows = this.bap_data.asprak.length;
      this.asprak_perPage = this.bap_data.asprak.length;

      this.student_totalRows = this.bap_data.student.length;
      this.student_perPage = this.bap_data.student.length;
    },

    async fetchData(){
      return (
        api.infoBap(this.schedule_id)
          .then(response => {
            this.isIdValid(response.data);
            if(response.data){
              this.bap_data = response.data;
            }
          })
          .catch(error => {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: error
              })
          })
      );
    },

    isIdValid(data){
      if(data){
        api.showBap(this.schedule_id)
            .then(response => {
                if(response.data.bap.length){
                    this.$router.replace({
                        name: 'asprak-bap-detail', 
                        params: { id: this.schedule_id }
                    });
                }
                else{
                    return true;
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'This ID is invalid!',
                    footer: 'You will be redirected to Schedule Menu',
                    timer: 4000
                })
                this.$router.replace({
                    name: 'asprak-bap'
                });
            })
      }
      else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This ID is invalid!',
            footer: 'You will be redirected to Schedule Menu',
            timer: 4000
        })
        this.$router.replace({
          name: 'asprak-bap'
        });
      }
    },

    cancelSubmit(){
      Swal.fire({
          title: "Are you sure?",
          text: "the form that you have filled in will be reset!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, cancel it!"
      }).then(result => {
          if (result.value) {
              this.loading();
              this.submitted = false;
              this.isInputCanceled = true;

              this.dataInput.asprak = [];
              this.dataInput.student = [];
              this.dataInput.materi = "";
              this.dataInput.evaluasi = "";
              this.dataInput.jenis = "";

              this.loadData().then(result=>{
                this.loading();
              });
              Swal.fire("Canceled!", "The form has been reset.", "success");
          }
      });
    },

    onClickSubmit(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        this.tryingToInput = true;

        Swal.fire({
            title: "Yakin BAP akan di submit?",
            text: "BAP yang ter-submit tidak dapat diubah!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Yes, submit it!"
        }).then(result => {
            if (result.value) {
                this.inputBap(this.schedule_id, this.dataInput);
            }
        });
      }
    },

    inputBap(id, data){
      return (
        api.inputBap(id, data)
          .then(response => {
            this.tryingToInput = false;
            this.isInputError = false;
            this.inputSuccess = true;
            this.submitted = false;
            Swal.fire("Submitted!", "BAP has been submitted.", "success");
            this.$router.replace({
                name: 'asprak-bap-detail', 
                params: { id: this.schedule_id }
            });
          })
          .catch(error => {
            console.log(error)
            this.submitted = false;
            this.tryingToInput = false;
            this.isInputError = true;
            this.inputError = error;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
            })
          })
      );
    },

    asprak_onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.asprak_totalRows = filteredItems.length;
      this.asprak_currentPage = 1;
    },

    student_onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.student_totalRows = filteredItems.length;
      this.student_currentPage = 1;
    },

    asprak_onSelectAll() {
        this.dataInput.asprak = [];
        if(this.asprak_selectedAll == false){
            let data = this.dataInput;
            this.bap_data.asprak.forEach(function (element) {
                data.asprak.push(element.id);
            });
            this.dataInput = data;
        }
        this.asprak_selectedAll = !this.asprak_selectedAll;
    },

    student_onSelectAll() {
        this.dataInput.student = [];
        if(this.student_selectedAll == false){
            let data = this.dataInput;
            this.bap_data.student.forEach(function (element) {
                data.student.push(element.id);
            });
            this.dataInput = data;
        }
        this.student_selectedAll = !this.student_selectedAll;
    },

    loading() {
      if(this.isLoading){
        this.isLoading = false;
      } else{
        this.isLoading = true;
      }

      var x = document.getElementById("loading");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    },

  },
};

</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div id="loading" style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <b-spinner style="width: 3rem; height: 3rem;" class="m-2" variant="warning" role="status"></b-spinner>
    </div>
    <div>
        <form class="form-horizontal" @submit.prevent="onClickSubmit">
            <div class="card">
                <div class="card-body">
                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Kelas"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.class_course.classes.name" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Mata Kuliah"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.class_course.courses.name" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Dosen"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.class_course.staffs.name" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Modul"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.module.index" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Tanggal"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.date" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Jam Mulai"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.time_start" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Jam Terakhir"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.time_end" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Ruangan"
                    >
                        <b-form-input 
                            for="text" 
                            v-model="bap_data.schedule.room.name" 
                            :disabled="true" 
                            style="border: none;"
                        ></b-form-input>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Jenis Interaksi"
                    >
                        <multiselect
                            v-model="dataInput.jenis"
                            :options="dataJenis"
                            :show-labels="false"
                            :class="{ 'is-invalid': submitted && $v.dataInput.jenis.$error }" 
                        ></multiselect>
                        <div
                        v-if="submitted && !$v.dataInput.jenis.required"
                        class="invalid-feedback"
                        >Jenis Interaksi is required.</div>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Materi Praktikum"
                    >
                        <div class="input-group">
                          <input
                              v-model="dataInput.materi"
                              type="text"
                              class="form-control"
                              :maxlength="max"
                              :class="{ 'is-invalid': submitted && $v.dataInput.materi.$error }"
                          />
                          <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2">{{max - dataInput.materi.length}}</span>
                          </div>
                        </div>
                        <div
                        v-if="submitted && !$v.dataInput.materi.required"
                        class="invalid-feedback"
                        >Materi Praktikum is required.</div>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Evaluasi Praktikum"
                    >
                        <div class="input-group">
                          <input
                              v-model="dataInput.evaluasi"
                              type="text"
                              class="form-control"
                              :maxlength="max"
                              :class="{ 'is-invalid': submitted && $v.dataInput.evaluasi.$error }"
                          />
                          <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2">{{max - dataInput.evaluasi.length}}</span>
                          </div>
                        </div>
                        <div
                        v-if="submitted && !$v.dataInput.evaluasi.required"
                        class="invalid-feedback"
                        >Evaluasi Praktikum is required.</div>
                    </b-form-group>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <h4 class="card-title">Kehadiran Asisten Praktikum</h4>
                    <hr style="margin-left: -28px; 
                                margin-right: -28px; 
                                height: 2px; 
                                background-color: #eee; 
                                border: 0 none; 
                                color: #eee;"
                    >
                    <div class="row mt-4">
                        <div class="col-sm-12 col-md-6">
                            <b-button
                                v-if="!asprak_selectedAll"
                                variant="success"
                                @click=asprak_onSelectAll()
                                style="min-width: 120px;" 
                                size="sm"
                                >Select All
                            </b-button>
                            <b-button
                                v-if="asprak_selectedAll"
                                variant="danger"
                                @click=asprak_onSelectAll()
                                style="min-width: 120px;" 
                                size="sm"
                                >Deselect All
                            </b-button>
                        </div>
                        <!-- Search -->
                        <div class="col-sm-12 col-md-6">
                            <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                            <label class="d-inline-flex align-items-center">
                                Search:
                                <b-form-input
                                v-model="asprak_filter"
                                type="search"
                                class="form-control form-control-sm ml-2"
                                ></b-form-input>
                            </label>
                            </div>
                        </div>
                        <!-- End search -->
                    </div>
                    <div class="table-responsive">
                    <b-table
                        ref="table"
                        class="table-centered"
                        :items="bap_data.asprak"
                        :fields="asprak_fields"
                        responsive="sm"
                        :per-page="asprak_perPage"
                        :current-page="asprak_currentPage"
                        :sort-by="asprak_sortBy"
                        :sort-desc="asprak_sortDesc"
                        :filter="asprak_filter"
                        :filter-included-fields="asprak_filterOn"
                        @filtered="asprak_onFiltered"
                        :headVariant="'dark'"
                    >
                        <template v-slot:cell(action)="data">
                            <input 
                                type="checkbox"
                                :value="data.item.id"
                                v-model="dataInput.asprak" />
                        </template>
                    </b-table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <h4 class="card-title">Kehadiran Praktikan</h4>
                    <hr style="margin-left: -28px; 
                                margin-right: -28px; 
                                height: 2px; 
                                background-color: #eee; 
                                border: 0 none; 
                                color: #eee;"
                    >
                    <div class="row mt-4">
                        <div class="col-sm-12 col-md-6">
                            <b-button
                                v-if="!student_selectedAll"
                                variant="success"
                                @click=student_onSelectAll()
                                style="min-width: 120px;" 
                                size="sm"
                                >Select All
                            </b-button>
                            <b-button
                                v-if="student_selectedAll"
                                variant="danger"
                                @click=student_onSelectAll()
                                style="min-width: 120px;" 
                                size="sm"
                                >Deselect All
                            </b-button>
                        </div>
                        <!-- Search -->
                        <div class="col-sm-12 col-md-6">
                            <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                            <label class="d-inline-flex align-items-center">
                                Search:
                                <b-form-input
                                v-model="student_filter"
                                type="search"
                                class="form-control form-control-sm ml-2"
                                ></b-form-input>
                            </label>
                            </div>
                        </div>
                        <!-- End search -->
                    </div>
                    <div class="table-responsive">
                    <b-table
                        ref="table"
                        class="table-centered"
                        :items="bap_data.student"
                        :fields="student_fields"
                        responsive="sm"
                        :per-page="student_perPage"
                        :current-page="student_currentPage"
                        :sort-by="student_sortBy"
                        :sort-desc="student_sortDesc"
                        :filter="student_filter"
                        :filter-included-fields="student_filterOn"
                        @filtered="student_onFiltered"
                        :headVariant="'dark'"
                    >
                        <template v-slot:cell(action)="data">
                            <input 
                                type="checkbox"
                                :value="data.item.id"
                                v-model="dataInput.student" />
                        </template>
                    </b-table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-body text-center">
                    <button
                        type="submit"
                        class="btn btn-primary mr-2 waves-effect waves-light"
                    >Save Changes</button>
                    <button type="button" @click="cancelSubmit" class="btn btn-light waves-effect">Cancel</button>
                </div>
            </div>
        </form>
    </div>
  </Layout>
</template>