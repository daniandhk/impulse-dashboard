<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";

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
    title: "Mulai Praktikum",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    Multiselect,
    PageHeader,
    DatePicker,
  },
  validations: {
    pretest_data: {
        schedule_id: { required },
        test_id: { required },
        time_start: { required },
        time_end: { required },
        is_active: { required },
        auth: { required }
    },
    journal_data: {
        schedule_id: { required },
        test_id: { required },
        time_start: { required },
        time_end: { required },
        is_active: { required },
        auth: { required }
    },
    posttest_data: {
        schedule_id: { required },
        test_id: { required },
        time_start: { required },
        time_end: { required },
        is_active: { required },
        auth: { required }
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
      title: "Mulai Praktikum",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "Jadwal",
          href: "/asprak/schedule/find"
        },
        {
          text: "Mulai Praktikum",
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
        schedule_id: "",
        test_id: "",
        time_start: "",
        time_end: "",
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
        schedule_id: "",
        test_id: "",
        time_start: "",
        time_end: "",
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
        schedule_id: "",
        test_id: "",
        time_start: "",
        time_end: "",
        is_active: false,
        auth: null
      },

      isPretestNew: false,
      isJournalNew: false,
      isPosttestNew: false,

      isPretestNull: false,
      isJournalNull: false,
      isPosttestNull: false,

      isPretestStart: false,
      isJournalStart: false,
      isPosttestStart: false,

      isJadwalNull: false,

      pretest_form: {
        backgroundColor: "#F0F4F6",
      },
      journal_form: {
        backgroundColor: "#F0F4F6",
      },
      posttest_form: {
        backgroundColor: "#F0F4F6",
      },

    };
  },
  methods: {
    ...notificationMethods,

    async loadData(){
      this.setId(this.$route.params.id);
      await this.fetchData();
      await this.setDate();

      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.pretest_id, 'pretest');
      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.posttest_id, 'posttest');
      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.journal_id, 'journal');
    },

    async getTestSchedule(schedule_id, test_id, type){
      if(test_id){
        return api.getTestSchedule(schedule_id, test_id)
          .then(response => {
              if(response.data.data[0]){
                  if(type == 'pretest'){
                      this.isPretestNew = false;
                      this.isPretestNull = false;
                      this.isActive('pretest', true);
                      this.pretest_data = response.data.data[0];
                      this.setDateTest(this.pretest_data);
                      this.setStatusTest('pretest', this.pretest_data);
                      this.pretest_data.schedule_id = this.schedule_data.id;
                      this.pretest_data.test_id = this.schedule_data.module.pretest_id;
                  }
                  else if(type == 'journal'){
                      this.isJournalNew = false;
                      this.isJournalNull = false;
                      this.isActive('journal', true);
                      this.journal_data = response.data.data[0];
                      this.setDateTest(this.journal_data);
                      this.setStatusTest('journal', this.journal_data);
                      this.journal_data.schedule_id = this.schedule_data.id;
                      this.journal_data.test_id = this.schedule_data.module.journal_id;
                  }
                  else if(type == 'posttest'){
                      this.isPosttestNew = false;
                      this.isPosttestNull = false;
                      this.isActive('posttest', true);
                      this.posttest_data = response.data.data[0];
                      this.setDateTest(this.posttest_data);
                      this.setStatusTest('posttest', this.posttest_data);
                      this.posttest_data.schedule_id = this.schedule_data.id;
                      this.posttest_data.test_id = this.schedule_data.module.posttest_id;
                  }
              }
              else{
                  if(type == 'pretest'){
                      this.isPretestNew = true;
                      this.isPretestNull = false;
                      this.isActive('pretest', true);
                      this.pretest_data.schedule_id = this.schedule_data.id;
                      this.pretest_data.test_id = this.schedule_data.module.pretest_id;
                  }
                  else if(type == 'journal'){
                      this.isJournalNew = true;
                      this.isJournalNull = false;
                      this.isActive('journal', true);
                      this.journal_data.schedule_id = this.schedule_data.id;
                      this.journal_data.test_id = this.schedule_data.module.journal_id;
                  }
                  else if(type == 'posttest'){
                      this.isPosttestNew = true;
                      this.isPosttestNull = false;
                      this.isActive('posttest', true);
                      this.posttest_data.schedule_id = this.schedule_data.id;
                      this.posttest_data.test_id = this.schedule_data.module.posttest_id;
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
        if(type == 'pretest'){
            this.isPretestNull = true;
            this.isActive('pretest', false);
        }
        else if(type == 'journal'){
            this.isJournalNull = true;
            this.isActive('journal', false);
        }
        else if(type == 'posttest'){
            this.isPosttestNull = true;
            this.isActive('posttest', false);
        }
      }
    },

    isActive(type, status){
      if(type == 'pretest'){
        if(status){
          this.pretest_form.backgroundColor = "";
        }
        else{
          this.pretest_form.backgroundColor = "#F0F4F6";
        }
      }
      else if(type == 'journal'){
        if(status){
          this.journal_form.backgroundColor = "";
        }
        else{
          this.journal_form.backgroundColor = "#F0F4F6";
        }
      }
      else if(type == 'posttest'){
        if(status){
          this.posttest_form.backgroundColor = "";
        }
        else{
          this.posttest_form.backgroundColor = "#F0F4F6";
        }
      }
    },

    setStatusTest(type, data){
        if(type == 'pretest'){
            if(data.is_active == true){
                this.isPretestStart = true;
            }
            else{
                this.isPretestStart = false;
            }
        }
        else if(type == 'journal'){
            if(data.is_active == true){
                this.isJournalStart = true;
            }
            else{
                this.isJournalStart = false;
            }
        }
        else if(type == 'posttest'){
            if(data.is_active == true){
                this.isPosttestStart = true;
            }
            else{
                this.isPosttestStart = false;
            }
        }
    },

    inputedDate(value){
        let combined = this.time_date + " " + value;
        let date = moment(String(combined)).format('YYYY-MM-DD HH:mm:ss');
        return date;
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

              if(this.schedule_data.date == null || this.schedule_data.start == null || this.schedule_data.end == null){
                this.isJadwalNull = true;
                this.isActive('pretest', false);
                this.isActive('journal', false);
                this.isActive('posttest', false);
              }
              else{
                this.isJadwalNull = false;
                this.isActive('pretest', true);
                this.isActive('journal', true);
                this.isActive('posttest', true);
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
          name: 'asprak-schedule-find'
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
                  name: 'asprak-start-practicum', 
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

      this.pretest_data.time_start = "";
      this.pretest_data.time_end = "";
      this.pretest_data.is_active = false;
      this.pretest_data.auth = null;

      this.journal_data.time_start = "";
      this.journal_data.time_end = "";
      this.journal_data.is_active = false;
      this.journal_data.auth = null;

      this.posttest_data.time_start = "";
      this.posttest_data.time_end = "";
      this.posttest_data.is_active = false;
      this.posttest_data.auth = null;

      this.isPretestNew = false;
      this.isJournalNew = false;
      this.isPosttestNew = false;

      this.isPretestNull = false;
      this.isActive('pretest', true);

      this.isJournalNull = false;
      this.isActive('journal', true);

      this.isPosttestNull = false;
      this.isActive('posttest', true);
    },

    setDateTest(data){
      if(data.time_start){
        data.time_start = moment(String(data.time_start)).format('HH:mm:ss');
      }
      if(data.time_end){
        data.time_end = moment(String(data.time_end)).format('HH:mm:ss');
      }
    },

    submitSchedule(type, status = null){
        this.submitted = true;
        let message_header = "Berhasil submit!";
        let message_body = "Form telah berhasil di submit.";

        if(type=='pretest'){
            if(this.isPretestNull == false){
                this.$v.pretest_data.$touch();
                if (this.$v.pretest_data.$invalid) {
                    return;
                }
                else{
                    let id = this.pretest_data.id;
                    this.pretest_data.time_start = this.inputedDate(this.pretest_data.time_start);
                    this.pretest_data.time_end = this.inputedDate(this.pretest_data.time_end);
                    if(status == 'start'){
                        this.pretest_data.is_active = true;
                        message_header = "Started!";
                        message_body = "Pretest has started."
                    }
                    if(status == 'stop'){
                        this.pretest_data.is_active = false;
                        message_header = "Stopped!";
                        message_body = "Pretest has stopped."
                    }
                    if(this.isPretestNew){
                        return (
                            api.inputScheduleTest(this.pretest_data)
                                .then(response => {
                                    Swal.fire(message_header, message_body, "success");
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                })
                                .catch(error => {
                                    //pop up
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Something went wrong!',
                                        footer: error
                                    })
                                })
                        );
                    }
                    else{
                        return (
                            api.editScheduleTest(id, this.pretest_data)
                                .then(response => {
                                    Swal.fire(message_header, message_body, "success");
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                })
                                .catch(error => {
                                    //pop up
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Something went wrong!',
                                        footer: error
                                    })
                                })
                        );
                    }
                }
            }
        }
        else if(type=='journal'){
            if(this.isJournalNull == false){
                this.$v.journal_data.$touch();
                if (this.$v.journal_data.$invalid) {
                    return;
                }
                else{
                    let id = this.journal_data.id;
                    this.journal_data.time_start = this.inputedDate(this.journal_data.time_start);
                    this.journal_data.time_end = this.inputedDate(this.journal_data.time_end);
                    if(status == 'start'){
                        this.journal_data.is_active = true;
                        message_header = "Started!";
                        message_body = "Journal has started."
                    }
                    if(status == 'stop'){
                        this.journal_data.is_active = false;
                        message_header = "Stopped!";
                        message_body = "Journal has stopped."
                    }
                    if(this.isJournalNew){
                        return (
                            api.inputScheduleTest(this.journal_data)
                                .then(response => {
                                    Swal.fire(message_header, message_body, "success");
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                })
                                .catch(error => {
                                    //pop up
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Something went wrong!',
                                        footer: error
                                    })
                                })
                        );
                    }
                    else{
                        return (
                            api.editScheduleTest(id, this.journal_data)
                                .then(response => {
                                    Swal.fire(message_header, message_body, "success");
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                })
                                .catch(error => {
                                    //pop up
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Something went wrong!',
                                        footer: error
                                    })
                                })
                        );
                    }
                }
            }
        }
        else if(type=='posttest'){
            if(this.isPosttestNull == false){
                this.$v.posttest_data.$touch();
                if (this.$v.posttest_data.$invalid) {
                    return;
                }
                else{
                    let id = this.posttest_data.id;
                    this.posttest_data.time_start = this.inputedDate(this.posttest_data.time_start);
                    this.posttest_data.time_end = this.inputedDate(this.posttest_data.time_end);
                    if(status == 'start'){
                        this.posttest_data.is_active = true;
                        message_header = "Started!";
                        message_body = "Posttest has started."
                    }
                    if(status == 'stop'){
                        this.posttest_data.is_active = false;
                        message_header = "Stopped!";
                        message_body = "Posttest has stopped."
                    }
                    if(this.isPosttestNew){
                        return (
                            api.inputScheduleTest(this.posttest_data)
                                .then(response => {
                                    Swal.fire(message_header, message_body, "success");
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                })
                                .catch(error => {
                                    //pop up
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Something went wrong!',
                                        footer: error
                                    })
                                })
                        );
                    }
                    else{
                        return (
                            api.editScheduleTest(id, this.posttest_data)
                                .then(response => {
                                    Swal.fire(message_header, message_body, "success");
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                })
                                .catch(error => {
                                    //pop up
                                    this.loading();
                                    this.loadData().then(result=>{
                                        this.loading();
                                    });
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: 'Something went wrong!',
                                        footer: error
                                    })
                                })
                        );
                    }
                }
            }
        }
    },

    //minor
    // disableEndPretest(date) {
    //   if(this.time_end){
    //     let hours = this.time_end.split(':')[0];
    //     let minutes = this.time_end.split(':')[1];
    //     let seconds = this.time_end.split(':')[2];
        
    //     return date > new Date(new Date().setHours(hours, minutes, seconds, 0));
    //   }
    // },

    // disableStartPretest(date) {
    //   if(this.time_start){
    //     let hours = this.time_start.split(':')[0];
    //     let minutes = this.time_start.split(':')[1];
    //     let seconds = this.time_start.split(':')[2];
        
    //     return date < new Date(new Date().setHours(hours, minutes-30, seconds, 0));
    //   }
    // },

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
              <multiselect 
                class="text-center"
                v-model="schedule_data.module.index" 
                :options="dataModules"
                @select="selectModule"
                :allow-empty="false"
                :disabled="isLoading"
                :show-labels="false"
              ></multiselect>
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
          <b-alert
              v-model="isJadwalNull"
              class="mt-3 text-center"
              variant="danger"
          >Harap input jadwal di Menu Jadwal!</b-alert>
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
                            <b-alert
                                v-model="isPretestNull"
                                class="mt-3"
                                variant="danger"
                            >Harap input soal di Menu Jadwal!</b-alert>
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
                                <date-picker
                                    v-model="pretest_data.time_start"
                                    value-type="format"
                                    type="time"
                                    placeholder="HH:mm:ss"
                                    :disabled="isLoading || isPretestNull || isJadwalNull"
                                    :class="{ 'is-invalid': submitted && $v.pretest_data.time_start.$error }"
                                ></date-picker>
                                <div
                                v-if="submitted && !$v.pretest_data.time_start.required"
                                class="invalid-feedback"
                                >Start Time harus diisi!</div>
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
                                <date-picker
                                    v-model="pretest_data.time_end"
                                    value-type="format"
                                    type="time"
                                    placeholder="HH:mm:ss"
                                    :disabled="isLoading || isPretestNull || isJadwalNull"
                                    :class="{ 'is-invalid': submitted && $v.pretest_data.time_end.$error }"
                                ></date-picker>
                                <div
                                v-if="submitted && !$v.pretest_data.time_end.required"
                                class="invalid-feedback"
                                >End Time harus diisi!</div>
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
                                    v-model="pretest_data.auth"
                                    type="text"
                                    class="form-control"
                                    :disabled="isLoading || isPretestNull || isJadwalNull"
                                    v-bind:style="pretest_form"
                                    :class="{ 'is-invalid': submitted && $v.pretest_data.auth.$error }"
                                />
                                <div
                                  v-if="submitted && !$v.pretest_data.auth.required"
                                  class="invalid-feedback"
                                  >Auth harus diisi!</div>
                              </div>
                            </div>
                            <button 
                              type="button"
                              @click="submitSchedule('pretest')" 
                              class="btn btn-primary mt-4 m-1" 
                              style="min-width: 150px;"
                            >Simpan
                            </button>
                            <button 
                              type="button"
                              @click="submitSchedule('pretest', 'stop')" 
                              class="btn btn-danger mt-4 m-1" 
                              style="min-width: 150px;"
                              v-if="isPretestStart == true"
                            >Stop
                            </button>
                            <button 
                              type="button"
                              @click="submitSchedule('pretest', 'start')" 
                              class="btn btn-success mt-4 m-1" 
                              style="min-width: 150px;"
                              v-if="isPretestStart == false"
                            >Start
                            </button>
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
                            <b-alert
                                v-model="isJournalNull"
                                class="mt-3"
                                variant="danger"
                            >Harap input soal di Menu Jadwal!</b-alert>
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
                                <date-picker
                                    v-model="journal_data.time_start"
                                    value-type="format"
                                    type="time"
                                    placeholder="HH:mm:ss"
                                    :disabled="isLoading || isJournalNull || isJadwalNull"
                                    :class="{ 'is-invalid': submitted && $v.journal_data.time_start.$error }"
                                ></date-picker>
                                <div
                                v-if="submitted && !$v.journal_data.time_start.required"
                                class="invalid-feedback"
                                >Start Time harus diisi!</div>
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
                                <date-picker
                                    v-model="journal_data.time_end"
                                    value-type="format"
                                    type="time"
                                    placeholder="HH:mm:ss"
                                    :disabled="isLoading || isJournalNull || isJadwalNull"
                                    :class="{ 'is-invalid': submitted && $v.journal_data.time_end.$error }"
                                ></date-picker>
                                <div
                                v-if="submitted && !$v.journal_data.time_end.required"
                                class="invalid-feedback"
                                >End Time harus diisi!</div>
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
                                    v-model="journal_data.auth"
                                    type="text"
                                    class="form-control"
                                    :disabled="isLoading || isJournalNull || isJadwalNull"
                                    v-bind:style="journal_form"
                                    :class="{ 'is-invalid': submitted && $v.journal_data.auth.$error }"
                                />
                                <div
                                  v-if="submitted && !$v.journal_data.auth.required"
                                  class="invalid-feedback"
                                  >Auth harus diisi!</div>
                              </div>
                            </div>
                            <button 
                              type="button"
                              @click="submitSchedule('journal')" 
                              class="btn btn-primary mt-4 m-1" 
                              style="min-width: 150px;"
                            >Simpan
                            </button>
                            <button 
                              type="button"
                              @click="submitSchedule('journal', 'stop')" 
                              class="btn btn-danger mt-4 m-1" 
                              style="min-width: 150px;"
                              v-if="isJournalStart == true"
                            >Stop
                            </button>
                            <button 
                              type="button"
                              @click="submitSchedule('journal', 'start')" 
                              class="btn btn-success mt-4 m-1" 
                              style="min-width: 150px;"
                              v-if="isJournalStart == false"
                            >Start
                            </button>
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
                              Merupakan tahapan akhir dalam praktikum.
                            </p>
                            <hr style="margin-left: -28px; 
                                        margin-right: -28px; 
                                        height: 2px; 
                                        background-color: #eee; 
                                        border: 0 none; 
                                        color: #eee;"
                            >
                            <b-alert
                                v-model="isPosttestNull"
                                class="mt-3"
                                variant="danger"
                            >Harap input soal di Menu Jadwal!</b-alert>
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
                                <date-picker
                                    v-model="posttest_data.time_start"
                                    value-type="format"
                                    type="time"
                                    placeholder="HH:mm:ss"
                                    :disabled="isLoading || isPosttestNull || isJadwalNull"
                                    :class="{ 'is-invalid': submitted && $v.posttest_data.time_start.$error }"
                                ></date-picker>
                                <div
                                v-if="submitted && !$v.posttest_data.time_start.required"
                                class="invalid-feedback"
                                >Start Time harus diisi!</div>
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
                                <date-picker
                                    v-model="posttest_data.time_end"
                                    value-type="format"
                                    type="time"
                                    placeholder="HH:mm:ss"
                                    :disabled="isLoading || isPosttestNull || isJadwalNull"
                                    :class="{ 'is-invalid': submitted && $v.posttest_data.time_end.$error }"
                                ></date-picker>
                                <div
                                v-if="submitted && !$v.posttest_data.time_end.required"
                                class="invalid-feedback"
                                >End Time harus diisi!</div>
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
                                    v-model="posttest_data.auth"
                                    type="text"
                                    class="form-control"
                                    :disabled="isLoading || isPosttestNull || isJadwalNull"
                                    v-bind:style="posttest_form"
                                    :class="{ 'is-invalid': submitted && $v.posttest_data.auth.$error }"
                                />
                                <div
                                  v-if="submitted && !$v.posttest_data.auth.required"
                                  class="invalid-feedback"
                                  >Auth harus diisi!</div>
                              </div>
                            </div>
                            <button 
                              type="button"
                              @click="submitSchedule('posttest')" 
                              class="btn btn-primary mt-4 m-1" 
                              style="min-width: 150px;"
                            >Simpan
                            </button>
                            <button 
                              type="button"
                              @click="submitSchedule('posttest', 'stop')" 
                              class="btn btn-danger mt-4 m-1" 
                              style="min-width: 150px;"
                              v-if="isPosttestStart == true"
                            >Stop
                            </button>
                            <button 
                              type="button"
                              @click="submitSchedule('posttest', 'start')" 
                              class="btn btn-success mt-4 m-1" 
                              style="min-width: 150px;"
                              v-if="isPosttestStart == false"
                            >Start
                            </button>
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