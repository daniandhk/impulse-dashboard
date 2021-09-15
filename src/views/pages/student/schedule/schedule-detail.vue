<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";

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
    title: "Practicum Details",
  },
  components: {
    Layout,
    PageHeader
  },
  validations: {
    dataInput: {
      auth_pretest: { required },
      auth_journal: { required },
      auth_posttest: { required },
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
      title: "Practicum Details",
      items: [
        {
          text: "Dashboard",
          href: "/"
        },
        {
          text: "Schedule",
          href: "/praktikan/schedule/calendar"
        },
        {
          text: "Practicum Details",
          active: true,
        }
      ],
      schedule_data: {
        id: "",
        title: "",
        start: "",
        end: "",
        room: {
          name: "",
        },
        class_course: {
          id: "",
        },
        module: {
          id: "",
          index: "",
          pretest_id: "",
          journal_id: "",
          posttest_id: "",
        },
        academic_year: {
          year: "",
          semester: "",
        },
        date: ""
      },
      class_course_data: {
        class: {
          name: "",
        },
        course: {
          name: "",
        },
        academic_year: {
          name: "",
        }
      },

      time_date: "",
      time_start: "",
      time_end: "",
      dataModules: [],

      isLoading: false,

      submitted: false,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      inputError: null,

      text: {
        start: "Start",
        end: "End",
        auth: "Auth"
      },

      //data module
      pretest_data: {
        id: "",
        schedule: {
            id: "",
            name: "",
        },
        test: {
            id: "",
            type: "",
        },
        time_start: "not set yet",
        time_end: "not set yet",
        is_active: false,
        auth: null
      },
      journal_data: {
        id: "",
        schedule: {
            id: "",
            name: "",
        },
        test: {
            id: "",
            type: "",
        },
        time_start: "not set yet",
        time_end: "not set yet",
        is_active: false,
        auth: null
      },
      posttest_data: {
        id: "",
        schedule: {
            id: "",
            name: "",
        },
        test: {
            id: "",
            type: "",
        },
        time_start: "not set yet",
        time_end: "not set yet",
        is_active: false,
        auth: null
      },

      dataInput: {
        auth_pretest: "",
        auth_journal: "",
        auth_posttest: "",
      },

      pretest_form: {
        backgroundColor: "#F0F4F6",
      },
      journal_form: {
        backgroundColor: "#F0F4F6",
      },
      posttest_form: {
        backgroundColor: "#F0F4F6",
      },

      isAuthPretestWrong: false,
      isAuthJournalWrong: false,
      isAuthPosttestWrong: false,
    };
  },
  methods: {
    ...notificationMethods,

    async loadData(){
      this.setId(this.$route.params.id);
      await this.fetchData();
      await this.setDate();
      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.pretest_id, 'pretest');
      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.journal_id, 'journal');
      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.posttest_id, 'posttest');
    },

    setId(id){
      this.schedule_data.id = id;
    },

    async fetchData(){
      return (
        api.showSchedule(this.schedule_data.id)
          .then(response => {
            this.isIdValid(response.data.data);
            if(response.data.data){
              this.schedule_data = response.data.data;
              this.getClassCourse(this.schedule_data.class_course.id);
              this.getListSchedules(this.schedule_data.class_course.id);
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

    async setDate(){
      this.time_date = this.schedule_data.date;
      if(this.schedule_data.start){
        this.time_start = moment(String(this.schedule_data.start)).format('HH:mm:ss');
      }
      if(this.schedule_data.end){
        this.time_end = moment(String(this.schedule_data.end)).format('HH:mm:ss');
      }
    },

    isIdValid(data){
      if(data){
        return true;
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
          name: 'praktikan-schedule-calendar'
        });
      }
    },

    async getClassCourse(id){
      return (
        api.showClassCourse(id)
          .then(response => {
            if(response.data.data){
              this.class_course_data = response.data.data;
              this.class_course_data.academic_year.name = String(this.class_course_data.academic_year.name) + " / " + String(this.class_course_data.academic_year.semester);
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

    getListSchedules(class_course_id){
      return (
        api.showSchedules(class_course_id)
          .then(response => {
            if(response.data.data){
              this.generateModule(response.data.data.length);
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

    generateModule(sum){
      this.dataModules = Array.from({length: sum}, (_, i) => i + 1)
    },

    getRequestParams(module) {
      let params = {};

      if (module) {
        params["module"] = module;
      }

      return params;
    },

    selectModule(value){
      this.loading();
      const params = this.getRequestParams(
        value,
      );
      const class_course_id = this.class_course_data.id;
      this.clearData();

      api.showSchedules(class_course_id, params)
          .then(response => {
            if(response.data.data){
              let schedule_id = response.data.data[0].id;
              this.$router.push({
                  name: 'praktikan-schedule-detail', 
                  params: { id: schedule_id }
              });
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
    },

    clearData(){
      this.schedule_data.title = "";
      this.time_start = null;
      this.time_end = null;
      this.time_date = null;

      this.pretest_form.backgroundColor = "#F0F4F6";
      this.pretest_data.time_start = "not set yet";
      this.pretest_data.time_end = "not set yet";
      this.pretest_data.is_active = false;
      this.pretest_data.auth = null;

      this.journal_form.backgroundColor = "#F0F4F6";
      this.journal_data.time_start = "not set yet";
      this.journal_data.time_end = "not set yet";
      this.journal_data.is_active = false;
      this.journal_data.auth = null;

      this.posttest_form.backgroundColor = "#F0F4F6";
      this.posttest_data.time_start = "not set yet";
      this.posttest_data.time_end = "not set yet";
      this.posttest_data.is_active = false;
      this.posttest_data.auth = null;
    },

    async getTestSchedule(schedule_id, test_id, type){
      if(test_id){
        return api.getTestSchedule(schedule_id, test_id)
          .then(response => {
            if(response.data.data[0]){
              if(type == 'pretest'){
                this.pretest_data = response.data.data[0];
                this.setDateTest(this.pretest_data);
                this.isActive(this.pretest_data,type);
              }
              else if(type == 'journal'){
                this.journal_data = response.data.data[0];
                this.setDateTest(this.journal_data);
                this.isActive(this.journal_data,type);
              }
              else if(type == 'posttest'){
                this.posttest_data = response.data.data[0];
                this.setDateTest(this.posttest_data);
                this.isActive(this.posttest_data,type);
              }
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
      }
      else{
        // isDatNull
      }
    },

    setDateTest(data){
      if(data.time_start){
        data.time_start = moment(String(data.time_start)).format('HH:mm:ss');
      }
      if(data.time_end){
        data.time_end = moment(String(data.time_end)).format('HH:mm:ss');
      }
    },

    isActive(data, type){
      if(type == 'pretest'){
        if(data.is_active){
          this.pretest_form.backgroundColor = "";
        }
        else{
          this.pretest_form.backgroundColor = "#F0F4F6";
        }
      }
      else if(type == 'journal'){
        if(data.is_active){
          this.journal_form.backgroundColor = "";
        }
        else{
          this.journal_form.backgroundColor = "#F0F4F6";
        }
      }
      else if(type == 'posttest'){
        if(data.is_active){
          this.posttest_form.backgroundColor = "";
        }
        else{
          this.posttest_form.backgroundColor = "#F0F4F6";
        }
      }
    },

    changedAuth(type){
      if(type == 'pretest'){
        this.isAuthPretestWrong = false;
        if(this.dataInput.auth_pretest == ""){
          this.submitted = false;
        }
      }
      else if(type == 'journal'){
        this.isAuthJournalWrong = false;
        if(this.dataInput.auth_journal == ""){
          this.submitted = false;
        }
      }
      else if(type == 'posttest'){
        this.isAuthPosttestWrong = false;
        if(this.dataInput.auth_posttest == ""){
          this.submitted = false;
        }
      }
    },

    checkAuth(type){
      this.submitted = true;
      if(type == 'pretest'){
        if(this.pretest_data.is_active){
          this.$v.dataInput.auth_pretest.$touch();
          if (this.$v.dataInput.auth_pretest.$invalid) {
            this.isAuthPretestWrong = false;
            return;
          }
          if(this.pretest_data.auth){
            if(this.dataInput.auth_pretest == this.pretest_data.auth){
              this.isAuthPretestWrong = false;
              this.$router.push({
                  name: 'praktikan-schedule-test', 
                  params: { 
                    id: this.pretest_data.test.id, 
                    schedule_test_id: this.pretest_data.id, 
                    type: "pretest",
                    auth: this.dataInput.auth_pretest,
                  }
              });
            }
            else{
              this.isAuthPretestWrong = true;
            }
          }
          else{
            this.isAuthPretestWrong = true;
          }
        }
      }
      else if(type == 'journal'){
        if(this.journal_data.is_active){
          this.$v.dataInput.auth_journal.$touch();
          if (this.$v.dataInput.auth_journal.$invalid) {
            this.isAuthJournalWrong = false;
            return;
          }
          if(this.journal_data.auth){
            if(this.dataInput.auth_journal == this.journal_data.auth){
              this.isAuthJournalWrong = false;
              this.$router.push({
                  name: 'praktikan-schedule-test', 
                  params: { 
                    id: this.journal_data.test.id, 
                    schedule_test_id: this.journal_data.id, 
                    type: "journal",
                    auth: this.dataInput.auth_pretest,
                  }
              });
            }
            else{
              this.isAuthJournalWrong = true;
            }
          }
          else{
            this.isAuthJournalWrong = true;
          }
        }
      }
      else if(type == 'posttest'){
        if(this.posttest_data.is_active){
          this.$v.dataInput.auth_posttest.$touch();
          if (this.$v.dataInput.auth_posttest.$invalid) {
            this.isAuthPosttestWrong = false;
            return;
          }
          if(this.posttest_data.auth){
            if(this.dataInput.auth_posttest == this.posttest_data.auth){
              this.isAuthPosttestWrong = false;
              this.$router.push({
                  name: 'praktikan-schedule-test', 
                  params: { 
                    id: this.posttest_data.test.id, 
                    schedule_test_id: this.posttest_data.id, 
                    type: "posttest",
                    auth: this.dataInput.auth_pretest,
                  }
              });
            }
            else{
              this.isAuthPosttestWrong = true;
            }
          }
          else{
            this.isAuthPosttestWrong = true;
          }
        }
      }
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
      <div class="card">
        <div class="card-body">
          <div class="row">
              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Kelas</label>
                      <input
                          v-model="class_course_data.class.name"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>

              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Mata Kuliah</label>
                      <input
                          v-model="class_course_data.course.name"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>

              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Tahun / Semester</label>
                      <input
                          v-model="class_course_data.academic_year.name"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>
          </div>

          <div class="form-group text-center">
              <label>Modul</label>
              <input
                      v-model="schedule_data.module.index"
                      type="text"
                      class="form-control text-center bg-#00000 "
                      disabled="true"
                  />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="text-center font-size-15 text-uppercase">JADWAL</h5>
          <div class="row mt-2">
              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Tanggal</label>
                      <input
                          v-model="time_date"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>

              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Jam Mulai</label>
                      <input
                          v-model="time_start"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>

              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Jam Terakhir</label>
                      <input
                          v-model="time_end"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-4">
            <div class="card">
                <div class="card-body m-2">
                    <div class="text-center form-group mb-0">
                        <div>
                            <h5 class="text-left font-size-15 text-uppercase">Tes Awal</h5>
                            <p class="text-left mb-0">
                                Merupakan tahapan pertama dalam praktikum.
                            </p>
                            <hr style="margin-left: -28px; 
                                        margin-right: -28px; 
                                        height: 2px; 
                                        background-color: #eee; 
                                        border: 0 none; 
                                        color: #eee;"
                            >
                            <div class="row text-left mt-4 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.start"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0;"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="pretest_data.time_start"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="background-color: #F0F4F6;"
                                />
                              </div>
                            </div>
                            <div class="row text-left mt-2 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.end"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="pretest_data.time_end"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="background-color: #F0F4F6;"
                                />
                              </div>
                            </div>
                            <div class="row text-left mt-2 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.auth"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="dataInput.auth_pretest"
                                    type="text"
                                    class="form-control"
                                    :disabled="!pretest_data.is_active"
                                    v-bind:style="pretest_form"
                                    @input="changedAuth('pretest')"
                                    :class="{ 'is-invalid': submitted && $v.dataInput.auth_pretest.$error }"
                                />
                                <div
                                  v-if="submitted && !$v.dataInput.auth_pretest.required"
                                  class="invalid-feedback"
                                  >Auth is required.</div>
                              </div>
                            </div>
                            <button 
                              type="submit" 
                              @click="checkAuth('pretest')" 
                              class="btn btn-success mt-4" 
                              style="min-width: 150px;"
                              :class="{
                                'is-invalid': submitted && isAuthPretestWrong}" 
                            >Mulai Tes Awal
                            </button>
                            <div
                              v-if="isAuthPretestWrong"
                              class="invalid-feedback"
                            >Invalid Auth, please try again!</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end card -->
        </div>
        <!-- end col-->
        <div class="col-sm-4">
            <div class="card">
                <div class="card-body m-2">
                    <div class="text-center form-group mb-0">
                        <div>
                            <h5 class="text-left font-size-15 text-uppercase">Jurnal</h5>
                            <p class="text-left mb-0">
                              Merupakan tahapan utama dalam praktikum.
                            </p>
                            <hr style="margin-left: -28px; 
                                        margin-right: -28px; 
                                        height: 2px; 
                                        background-color: #eee; 
                                        border: 0 none; 
                                        color: #eee;"
                            >
                            <div class="row text-left mt-4 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.start"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0;"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="journal_data.time_start"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="background-color: #F0F4F6;"
                                />
                              </div>
                            </div>
                            <div class="row text-left mt-2 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.end"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="journal_data.time_end"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="background-color: #F0F4F6;"
                                />
                              </div>
                            </div>
                            <div class="row text-left mt-2 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.auth"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="dataInput.auth_journal"
                                    type="text"
                                    class="form-control"
                                    :disabled="!journal_data.is_active"
                                    v-bind:style="journal_form"
                                    @input="changedAuth('journal')"
                                    :class="{ 'is-invalid': submitted && $v.dataInput.auth_journal.$error }"
                                />
                                <div
                                  v-if="submitted && !$v.dataInput.auth_journal.required"
                                  class="invalid-feedback"
                                  >Auth is required.</div>
                              </div>
                            </div>
                            <button 
                              type="submit" 
                              @click="checkAuth('journal')" 
                              class="btn btn-success mt-4" 
                              style="min-width: 150px;"
                              :class="{
                                'is-invalid': submitted && isAuthJournalWrong}" 
                            >Mulai Jurnal
                            </button>
                            <div
                              v-if="isAuthJournalWrong"
                              class="invalid-feedback"
                            >Invalid Auth, please try again!</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end card -->
        </div>
        <!-- end col-->
        <div class="col-sm-4">
            <div class="card">
                <div class="card-body m-2">
                    <div class="text-center form-group mb-0">
                        <div>
                            <h5 class="text-left font-size-15 text-uppercase">Tes Akhir</h5>
                            <p class="text-left mb-0">
                              Merupakan tahapan terakhir dalam praktikum.
                            </p>
                            <hr style="margin-left: -28px; 
                                        margin-right: -28px; 
                                        height: 2px; 
                                        background-color: #eee; 
                                        border: 0 none; 
                                        color: #eee;"
                            >
                            <div class="row text-left mt-4 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.start"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0;"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="posttest_data.time_start"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="background-color: #F0F4F6;"
                                />
                              </div>
                            </div>
                            <div class="row text-left mt-2 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.end"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="posttest_data.time_end"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="background-color: #F0F4F6;"
                                />
                              </div>
                            </div>
                            <div class="row text-left mt-2 mr-2">
                              <div class="col-sm-4">
                                <input
                                    v-model="text.auth"
                                    type="text"
                                    class="form-control"
                                    disabled="true"
                                    style="border: 0"
                                />
                              </div>
                              <div class="col-sm-8">
                                <input
                                    v-model="dataInput.auth_posttest"
                                    type="text"
                                    class="form-control"
                                    :disabled="!posttest_data.is_active"
                                    v-bind:style="posttest_form"
                                    @input="changedAuth('posttest')"
                                    :class="{ 'is-invalid': submitted && $v.dataInput.auth_posttest.$error }"
                                />
                                <div
                                  v-if="submitted && !$v.dataInput.auth_posttest.required"
                                  class="invalid-feedback"
                                  >Auth is required.</div>
                              </div>
                            </div>
                            <button 
                              type="submit" 
                              @click="checkAuth('posttest')" 
                              class="btn btn-success mt-4" 
                              style="min-width: 150px;"
                              :class="{
                                'is-invalid': submitted && isAuthPosttestWrong}" 
                            >Mulai Tes Akhir
                            </button>
                            <div
                              v-if="isAuthPosttestWrong"
                              class="invalid-feedback"
                            >Invalid Auth, please try again!</div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- end card -->
        </div>
        <!-- end col-->
      </div>
    </div>
  </Layout>
</template>