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
        start: "Mulai",
        end: "Berakhir",
        auth: "Auth",
        kelas: "Kelas",
        matkul: "Mata Kuliah",
        tahun: "Tahun / Smt",
        modul: "Modul",
        nama_ruangan: "Nama",
        detail_ruangan: "Deskripsi",
        msteam_link: "MS Teams Link",
        msteam_code: "MS Teams Code",
        tanggal: "Tanggal",
        mulai: "Jam Mulai",
        terakhir: "Jam Terakhir",
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

      urlJadwal: "/asprak/schedule/",

    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  watch: {
    $route: async function() {
      this.loading(true);
      await this.loadData();
      this.loading(false);
    }
  },
  mounted: async function() {
    this.loading(true);
    await this.loadData();
    this.loading(false);
  },
  methods: {
    ...notificationMethods,

    async loadData(){
      this.isPretestStart = false;
      this.isJournalStart = false;
      this.isPosttestStart = false;

      this.setId(this.$route.params.id);
      await this.fetchData();
      await this.setDate();

      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.pretest_id, 'pretest');
      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.posttest_id, 'posttest');
      await this.getTestSchedule(this.schedule_data.id, this.schedule_data.module.journal_id, 'journal');

      this.setSchedule();
    },

    setSchedule(){
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
      this.urlJadwal = "/asprak/schedule/detail/" + this.schedule_data.id;
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
    },

    async setDate(){
      this.time_date = this.dateFormatted(this.schedule_data.date);
      if(this.schedule_data.start){
        this.time_start = moment(String(this.schedule_data.start)).format('HH:mm:ss');
      }
      else{
        this.time_start = "-";
      }
      if(this.schedule_data.end){
        this.time_end = moment(String(this.schedule_data.end)).format('HH:mm:ss');
      }
      else{
        this.time_end = "-";
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
            text: 'ID tidak valid!',
            footer: 'Anda dialihkan ke menu Cari Jadwal',
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
      this.loading(true);
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
                  name: 'asprak-practicum-detail', 
                  params: { id: schedule_id }
              });
            }
          })
          .catch(error => {
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

        this.loading(false);
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
        if(this.isJadwalNull){
          Swal.fire("Jadwal belum diatur...", "Harap input jadwal di menu Jadwal!", "error");
        }
        else{
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
                          message_header = "Tes Awal Dimulai!";
                          message_body = "Tes Awal berhasil dimulai."
                      }
                      if(status == 'stop'){
                          this.pretest_data.is_active = false;
                          message_header = "Tes Awal Berhenti!";
                          message_body = "Tes Awal berhasil diberhentikan."
                      }
                      if(this.isPretestNew){
                          this.loading(true);
                          return (
                              api.inputScheduleTest(this.pretest_data)
                                  .then(response => {
                                      Swal.fire(message_header, message_body, "success");
                                      this.loadData();
                                      this.loading(false);
                                  })
                                  .catch(error => {
                                      //pop up
                                      this.loadData();
                                      this.loading(false);
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
                      else{
                          this.loading(true);
                          return (
                              api.editScheduleTest(id, this.pretest_data)
                                  .then(response => {
                                      Swal.fire(message_header, message_body, "success");
                                      this.loadData();
                                      this.loading(false);
                                  })
                                  .catch(error => {
                                      //pop up
                                      this.loadData();
                                      this.loading(false);
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
                  }
              }
              else{
                Swal.fire("Soal Tes Awal kosong...", "Harap input soal di menu Jadwal!", "error");
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
                          message_header = "Jurnal Dimulai!";
                          message_body = "Jurnal berhasil dimulai."
                      }
                      if(status == 'stop'){
                          this.journal_data.is_active = false;
                          message_header = "Jurnal Berhenti!";
                          message_body = "Jurnal berhasil diberhentikan."
                      }
                      if(this.isJournalNew){
                          this.loading(true);
                          return (
                              api.inputScheduleTest(this.journal_data)
                                  .then(response => {
                                      Swal.fire(message_header, message_body, "success");
                                      this.loadData();
                                      this.loading(false);
                                  })
                                  .catch(error => {
                                      //pop up
                                      this.loadData();
                                      this.loading(false);
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
                      else{
                          this.loading(true);
                          return (
                              api.editScheduleTest(id, this.journal_data)
                                  .then(response => {
                                      Swal.fire(message_header, message_body, "success");
                                      this.loadData();
                                      this.loading(false);
                                  })
                                  .catch(error => {
                                      //pop up
                                      this.loadData();
                                      this.loading(false);
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
                  }
              }
              else{
                Swal.fire("Soal Jurnal kosong...", "Harap input soal di menu Jadwal!", "error");
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
                          message_header = "Tes Akhir Dimulai!";
                          message_body = "Tes Akhir berhasil dimulai."
                      }
                      if(status == 'stop'){
                          this.posttest_data.is_active = false;
                          message_header = "Tes Akhir Berhenti!";
                          message_body = "Tes Akhir berhasil diberhentikan."
                      }
                      if(this.isPosttestNew){
                          this.loading(true);
                          return (
                              api.inputScheduleTest(this.posttest_data)
                                  .then(response => {
                                      Swal.fire(message_header, message_body, "success");
                                      this.loadData();
                                      this.loading(false);
                                  })
                                  .catch(error => {
                                      //pop up
                                      this.loadData();
                                      this.loading(false);
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
                      else{
                          this.loading(true);
                          return (
                              api.editScheduleTest(id, this.posttest_data)
                                  .then(response => {
                                      Swal.fire(message_header, message_body, "success");
                                      this.loadData();
                                      this.loading(false);
                                  })
                                  .catch(error => {
                                      //pop up
                                      this.loadData();
                                      this.loading(false);
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
                  }
              }
              else{
                Swal.fire("Soal Tes Akhir kosong...", "Harap input soal di menu Jadwal!", "error");
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

    dateFormatted(date){
      if(date){
        return moment(date).locale('id').format('LL');
      }
      else{
        return "-";
      }
    },

    loading(isLoad) {
        var x = document.getElementById("loading");

        if(isLoad){
            this.isLoading = true;
            x.style.display = "block";
        } else{
            this.isLoading = false;
            x.style.display = "none";
        }
    },

  },
};

</script>

<template>
  <Layout>
    <PageHeader
      :title="title"
      :items="items"
    />
    <div
      id="loading"
      style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
      <b-spinner
        style="width: 3rem; height: 3rem;"
        class="m-2"
        variant="warning"
        role="status"
      />
    </div>
    <div class="pb-4">
      <div class="card mb-3">
        <div class="card-body">
          <div class="row">
            <div class="col-sm-4 pt-1 pb-1">
              <div
                class="card h-100"
                style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
              >
                <div class="card-body">
                  <div class="text-center form-group mb-0">
                    <div>
                      <h5 class="text-center font-size-15 text-uppercase">
                        Kelas Mata Kuliah
                      </h5>
                      <hr
                        style="margin-left: -20px; 
                                        margin-right: -20px; 
                                        height: 2px; 
                                        background-color: #eee; 
                                        border: 0 none; 
                                        color: #eee;"
                      >
                      <div class="row mt-4">
                        <div class="col-sm-5">
                          <input
                            v-model="text.kelas"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="class_course_data.class.name"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.matkul"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="class_course_data.course.name"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.tahun"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="class_course_data.academic_year.name"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.modul"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <multiselect 
                            v-model="schedule_data.module.index"
                            class="text-center" 
                            :options="dataModules"
                            :allow-empty="false"
                            :disabled="isLoading"
                            select-label=""
                            selected-label="x"
                            deselect-label="x"
                            @select="selectModule"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end card -->
            </div>
            <!-- end col-->
            <div class="col-sm-4 pt-1 pb-1">
              <div
                class="card h-100"
                style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
              >
                <div class="card-body">
                  <div class="text-center form-group mb-0">
                    <div>
                      <h5 class="text-center font-size-15 text-uppercase">
                        Ruangan
                      </h5>
                      <hr
                        style="margin-left: -20px; 
                                        margin-right: -20px; 
                                        height: 2px; 
                                        background-color: #eee; 
                                        border: 0 none; 
                                        color: #eee;"
                      >
                      <div class="row mt-4">
                        <div class="col-sm-5">
                          <input
                            v-model="text.nama_ruangan"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="schedule_data.room.name"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.detail_ruangan"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <textarea
                            v-model="schedule_data.room.desc"
                            rows="1"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          />
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.msteam_link"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="schedule_data.room.msteam_link"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.msteam_code"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="schedule_data.room.msteam_code"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end card -->
            </div>
            <!-- end col-->
            <div class="col-sm-4 pt-1 pb-1">
              <div
                class="card h-100"
                style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);"
              >
                <div class="card-body">
                  <div class="text-center form-group mb-0">
                    <div>
                      <h5 class="text-center font-size-15 text-uppercase">
                        Jadwal
                      </h5>
                      <hr
                        style="margin-left: -20px; 
                                        margin-right: -20px; 
                                        height: 2px; 
                                        background-color: #eee; 
                                        border: 0 none; 
                                        color: #eee;"
                      >
                      <b-alert
                        v-model="isJadwalNull"
                        class="mt-3"
                        variant="danger"
                      >
                        Harap input jadwal di menu <a :href="urlJadwal"><b>Jadwal</b></a>!
                      </b-alert>
                      <div class="row mt-4">
                        <div class="col-sm-5">
                          <input
                            v-model="text.tanggal"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="time_date"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.mulai"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="time_start"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-sm-5">
                          <input
                            v-model="text.terakhir"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="border: 0"
                          >
                        </div>
                        <div class="col-sm-7">
                          <input
                            v-model="time_end"
                            type="text"
                            class="form-control"
                            :disabled="true"
                            style="background-color: #F0F4F6;"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end card -->
            </div>
            <!-- end col-->
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-sm-4 pt-1 pb-1">
          <div class="card h-100">
            <div class="card-body m-2">
              <div class="text-center form-group mb-0">
                <div>
                  <h5 class="text-left font-size-15 text-uppercase">
                    Tes Awal
                  </h5>
                  <p class="text-left mb-0">
                    Merupakan tahapan pertama dalam praktikum.
                  </p>
                  <hr
                    style="margin-left: -28px; 
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
                  >
                    Harap input soal di menu <a :href="urlJadwal"><b>Jadwal</b></a>!
                  </b-alert>
                  <div class="row text-left mt-4 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.start"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0;"
                      >
                    </div>
                    <div class="col-sm-8">
                      <date-picker
                        v-model="pretest_data.time_start"
                        value-type="format"
                        type="time"
                        placeholder="HH:mm:ss"
                        :disabled="isLoading || isPretestNull || isJadwalNull"
                        :class="{ 'is-invalid': submitted && $v.pretest_data.time_start.$error }"
                      />
                      <div
                        v-if="submitted && !$v.pretest_data.time_start.required"
                        class="invalid-feedback"
                      >
                        Waktu Mulai harus diisi!
                      </div>
                    </div>
                  </div>
                  <div class="row text-left mt-2 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.end"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0"
                      >
                    </div>
                    <div class="col-sm-8">
                      <date-picker
                        v-model="pretest_data.time_end"
                        value-type="format"
                        type="time"
                        placeholder="HH:mm:ss"
                        :disabled="isLoading || isPretestNull || isJadwalNull"
                        :class="{ 'is-invalid': submitted && $v.pretest_data.time_end.$error }"
                      />
                      <div
                        v-if="submitted && !$v.pretest_data.time_end.required"
                        class="invalid-feedback"
                      >
                        Waktu Berakhir harus diisi!
                      </div>
                    </div>
                  </div>
                  <div class="row text-left mt-2 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.auth"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0"
                      >
                    </div>
                    <div class="col-sm-8">
                      <input
                        v-model="pretest_data.auth"
                        type="text"
                        class="form-control"
                        :disabled="isLoading || isPretestNull || isJadwalNull"
                        :style="pretest_form"
                        :class="{ 'is-invalid': submitted && $v.pretest_data.auth.$error }"
                      >
                      <div
                        v-if="submitted && !$v.pretest_data.auth.required"
                        class="invalid-feedback"
                      >
                        Auth harus diisi!
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    class="btn btn-primary mt-4 m-1" 
                    style="min-width: 150px;" 
                    @click="submitSchedule('pretest')"
                  >
                    Simpan
                  </button>
                  <button 
                    v-if="isPretestStart == true"
                    type="button" 
                    class="btn btn-danger mt-4 m-1" 
                    style="min-width: 150px;"
                    :disabled="pretest_data.auth == null"
                    @click="submitSchedule('pretest', 'stop')"
                  >
                    Stop
                  </button>
                  <button 
                    v-if="isPretestStart == false"
                    type="button" 
                    class="btn btn-success mt-4 m-1" 
                    style="min-width: 150px;"
                    :disabled="pretest_data.auth == null"
                    @click="submitSchedule('pretest', 'start')"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- end card -->
        </div>
        <!-- end col-->
        <div class="col-sm-4 pt-1 pb-1">
          <div class="card h-100">
            <div class="card-body m-2">
              <div class="text-center form-group mb-0">
                <div>
                  <h5 class="text-left font-size-15 text-uppercase">
                    Jurnal
                  </h5>
                  <p class="text-left mb-0">
                    Merupakan tahapan utama dalam praktikum.
                  </p>
                  <hr
                    style="margin-left: -28px; 
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
                  >
                    Harap input soal di menu <a :href="urlJadwal"><b>Jadwal</b></a>!
                  </b-alert>
                  <div class="row text-left mt-4 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.start"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0;"
                      >
                    </div>
                    <div class="col-sm-8">
                      <date-picker
                        v-model="journal_data.time_start"
                        value-type="format"
                        type="time"
                        placeholder="HH:mm:ss"
                        :disabled="isLoading || isJournalNull || isJadwalNull"
                        :class="{ 'is-invalid': submitted && $v.journal_data.time_start.$error }"
                      />
                      <div
                        v-if="submitted && !$v.journal_data.time_start.required"
                        class="invalid-feedback"
                      >
                        Waktu Mulai harus diisi!
                      </div>
                    </div>
                  </div>
                  <div class="row text-left mt-2 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.end"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0"
                      >
                    </div>
                    <div class="col-sm-8">
                      <date-picker
                        v-model="journal_data.time_end"
                        value-type="format"
                        type="time"
                        placeholder="HH:mm:ss"
                        :disabled="isLoading || isJournalNull || isJadwalNull"
                        :class="{ 'is-invalid': submitted && $v.journal_data.time_end.$error }"
                      />
                      <div
                        v-if="submitted && !$v.journal_data.time_end.required"
                        class="invalid-feedback"
                      >
                        Waktu Berakhir harus diisi!
                      </div>
                    </div>
                  </div>
                  <div class="row text-left mt-2 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.auth"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0"
                      >
                    </div>
                    <div class="col-sm-8">
                      <input
                        v-model="journal_data.auth"
                        type="text"
                        class="form-control"
                        :disabled="isLoading || isJournalNull || isJadwalNull"
                        :style="journal_form"
                        :class="{ 'is-invalid': submitted && $v.journal_data.auth.$error }"
                      >
                      <div
                        v-if="submitted && !$v.journal_data.auth.required"
                        class="invalid-feedback"
                      >
                        Auth harus diisi!
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    class="btn btn-primary mt-4 m-1" 
                    style="min-width: 150px;" 
                    @click="submitSchedule('journal')"
                  >
                    Simpan
                  </button>
                  <button 
                    v-if="isJournalStart == true"
                    type="button" 
                    class="btn btn-danger mt-4 m-1" 
                    style="min-width: 150px;"
                    :disabled="journal_data.auth == null"
                    @click="submitSchedule('journal', 'stop')"
                  >
                    Stop
                  </button>
                  <button 
                    v-if="isJournalStart == false"
                    type="button" 
                    class="btn btn-success mt-4 m-1" 
                    style="min-width: 150px;"
                    :disabled="journal_data.auth == null"
                    @click="submitSchedule('journal', 'start')"
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- end card -->
        </div>
        <!-- end col-->
        <div class="col-sm-4 pt-1 pb-1">
          <div class="card h-100">
            <div class="card-body m-2">
              <div class="text-center form-group mb-0">
                <div>
                  <h5 class="text-left font-size-15 text-uppercase">
                    Tes Akhir
                  </h5>
                  <p class="text-left mb-0">
                    Merupakan tahapan akhir dalam praktikum.
                  </p>
                  <hr
                    style="margin-left: -28px; 
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
                  >
                    Harap input soal di menu <a :href="urlJadwal"><b>Jadwal</b></a>!
                  </b-alert>
                  <div class="row text-left mt-4 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.start"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0;"
                      >
                    </div>
                    <div class="col-sm-8">
                      <date-picker
                        v-model="posttest_data.time_start"
                        value-type="format"
                        type="time"
                        placeholder="HH:mm:ss"
                        :disabled="isLoading || isPosttestNull || isJadwalNull"
                        :class="{ 'is-invalid': submitted && $v.posttest_data.time_start.$error }"
                      />
                      <div
                        v-if="submitted && !$v.posttest_data.time_start.required"
                        class="invalid-feedback"
                      >
                        Waktu Mulai harus diisi!
                      </div>
                    </div>
                  </div>
                  <div class="row text-left mt-2 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.end"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0"
                      >
                    </div>
                    <div class="col-sm-8">
                      <date-picker
                        v-model="posttest_data.time_end"
                        value-type="format"
                        type="time"
                        placeholder="HH:mm:ss"
                        :disabled="isLoading || isPosttestNull || isJadwalNull"
                        :class="{ 'is-invalid': submitted && $v.posttest_data.time_end.$error }"
                      />
                      <div
                        v-if="submitted && !$v.posttest_data.time_end.required"
                        class="invalid-feedback"
                      >
                        Waktu Berakhir harus diisi!
                      </div>
                    </div>
                  </div>
                  <div class="row text-left mt-2 mr-2">
                    <div class="col-sm-4">
                      <input
                        v-model="text.auth"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0"
                      >
                    </div>
                    <div class="col-sm-8">
                      <input
                        v-model="posttest_data.auth"
                        type="text"
                        class="form-control"
                        :disabled="isLoading || isPosttestNull || isJadwalNull"
                        :style="posttest_form"
                        :class="{ 'is-invalid': submitted && $v.posttest_data.auth.$error }"
                      >
                      <div
                        v-if="submitted && !$v.posttest_data.auth.required"
                        class="invalid-feedback"
                      >
                        Auth harus diisi!
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button"
                    class="btn btn-primary mt-4 m-1" 
                    style="min-width: 150px;" 
                    @click="submitSchedule('posttest')"
                  >
                    Simpan
                  </button>
                  <button 
                    v-if="isPosttestStart == true"
                    type="button" 
                    class="btn btn-danger mt-4 m-1" 
                    style="min-width: 150px;"
                    :disabled="posttest_data.auth == null"
                    @click="submitSchedule('posttest', 'stop')"
                  >
                    Stop
                  </button>
                  <button 
                    v-if="isPosttestStart == false"
                    type="button" 
                    class="btn btn-success mt-4 m-1" 
                    style="min-width: 150px;"
                    :disabled="posttest_data.auth == null"
                    @click="submitSchedule('posttest', 'start')"
                  >
                    Start
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