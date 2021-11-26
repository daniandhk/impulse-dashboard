<script>
import DatePicker from "vue2-datepicker";
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";

import * as api from '@/api';
import Swal from "sweetalert2";
import moment from 'moment';

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import tableRoomVue from '../laboran/room/table-room.vue';

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Edit Jadwal",
    meta: [{ name: "description" }],
  },
  components: {
    DatePicker,
    Layout,
    Multiselect,
    PageHeader
  },
  validations: {
    schedule_data:{
      title: { required },
      room: {
        id: { required },
      },
    },

    time_start: { required },
    time_end: { required },
    time_date: { required },
  },
  data() {
    return {
      title: "Edit Jadwal",
      items: [
        {
          text: "Asisten Lab",
          href: "/"
        },
        {
          text: "Jadwal",
          href: "/aslab/schedule"
        },
        {
          text: "Edit",
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
          index: "",
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

      dataRooms: [],
      time_date: "",
      time_start: "",
      time_end: "",
      dataModules: [],

      isLoading: false,

      dataEdit:{
        time_start: null,
        time_end: null,
        name: "",
        room_id: "",
        class_course_id: "",
        academic_year_id: "",
        module_id: "",
        date: null,
      },
      submitted: false,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      inputError: null,

      room: {
        name: "",
        desc: "",
        msteam_link: "",
        msteam_code: "",
      },

      isRuanganShowed: false,

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
      this.setId(this.$route.params.id);
      await this.fetchData();
      await this.loadDropdown();
      await this.setDate();
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

    isIdValid(data){
      if(data){
        return true;
      }
      else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ID tidak valid!',
            footer: 'Anda dialihkan ke menu Jadwal',
            timer: 4000
        })
        this.$router.replace({
          name: 'aslab-schedule'
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
      this.schedule_data.title = "";
      this.time_start = null;
      this.time_end = null;
      this.time_date = null;

      api.showSchedules(class_course_id, params)
          .then(response => {
            if(response.data.data){
              let schedule_id = response.data.data[0].id;
              this.$router.push({
                  name: 'aslab-schedule-input', 
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

    async setDate(){
      this.time_date = this.schedule_data.date;
      if(this.schedule_data.start){
        this.time_start = moment(String(this.schedule_data.start)).format('HH:mm:ss');
      }
      if(this.schedule_data.end){
        this.time_end = moment(String(this.schedule_data.end)).format('HH:mm:ss');
      }
    },

    notAfterTimeEnd(date) {
      if(this.time_end){
        let hours = this.time_end.split(':')[0];
        let minutes = this.time_end.split(':')[1];
        let seconds = this.time_end.split(':')[2];
        
        return date > new Date(new Date().setHours(hours, minutes, seconds, 0));
      }
    },

    notBeforeTimeStart(date) {
      if(this.time_start){
        let hours = this.time_start.split(':')[0];
        let minutes = this.time_start.split(':')[1];
        let seconds = this.time_start.split(':')[2];
        
        return date < new Date(new Date().setHours(hours, minutes, seconds, 0));
      }
    },

    async loadDropdown(){
      await this.getRoomsData();

      if(this.schedule_data.room.name){
        this.setRoom(this.schedule_data.room.name);
      }
    },

    setRoom(name){
      let data_room = this.dataRooms.find(data => data.name === name);
      this.selectRoom(data_room);
    },

    async getRoomsData(){
      return (
        api.getAllRooms()
          .then(response => {
            if (response.data.rooms){
              this.dataRooms = response.data.rooms;
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
              this.loading(true);
              this.submitted = false;
              this.isInputCanceled = true;
              this.loadData();
              this.loading(false);
              Swal.fire("Berhasil dibatalkan!", "Form telah dikosongkan.", "success");
          }
      });
    },

    updateSchedule(){
      this.submitted = true;

      this.$v.time_date.$touch();
      if (this.$v.time_date.$invalid) {
        return;
      }

      this.$v.time_start.$touch();
      if (this.$v.time_start.$invalid) {
        return;
      }

      this.$v.time_end.$touch();
      if (this.$v.time_end.$invalid) {
        return;
      }

      this.$v.schedule_data.$touch();
      if (this.$v.schedule_data.$invalid) {
        return;
      }
      this.tryingToInput = true;

      let combined_start = this.time_date + " " + this.time_start;
      let time_start = moment(String(combined_start)).format('YYYY-MM-DD HH:mm:ss');
      this.dataEdit.time_start = time_start;

      let combined_end = this.time_date + " " + this.time_end;
      let time_end = moment(String(combined_end)).format('YYYY-MM-DD HH:mm:ss')
      this.dataEdit.time_end = time_end;

      let schedule_id = this.schedule_data.id;
      this.dataEdit.date = moment(String(this.time_date)).format('YYYY-MM-DD');
      this.dataEdit.name = this.schedule_data.title;
      this.dataEdit.room_id = this.schedule_data.room.id;
      this.dataEdit.class_course_id = this.schedule_data.class_course.id;
      this.dataEdit.academic_year_id = this.schedule_data.academic_year.id;
      this.dataEdit.module_id = this.schedule_data.module.id;

      this.editSchedule(schedule_id, this.dataEdit);
    },

    editSchedule(id, data){
      return (
        api.editSchedule(id, data)
          .then(response => {
            this.loading(true);
            this.tryingToInput = false;
            this.isInputError = false;
            this.inputSuccess = true;
            this.submitted = false;
            Swal.fire("Berhasil diubah!", data.name + " telah terubah.", "success");
            this.loadData();
            this.loading(false);
          })
          .catch(error => {
            this.submitted = false;
            this.tryingToInput = false;
            this.isInputError = true;
            this.inputError = error;
            
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

    onClickRuangan(){
      this.isRuanganShowed = !this.isRuanganShowed;
    },

    selectRoom(value){
      this.room = value;
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
                >
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
                >
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
                >
              </div>
            </div>
          </div>

          <div class="form-group text-center">
            <label>Modul</label>
            <multiselect 
              v-model="schedule_data.module.index"
              class="text-center" 
              :options="dataModules"
              :allow-empty="false"
              :disabled="isLoading"
              :show-labels="false"
              @select="selectModule"
            />
          </div>
        </div>
      </div>
      <form
        class="form-horizontal"
        @submit.prevent="updateSchedule"
      >
        <div class="card">
          <div class="card-body">
            <div>
              <b-alert
                v-model="inputSuccess"
                class="mt-3"
                variant="success"
                dismissible
              >
                Data updated successfully!
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

            <div class="row mb-2 mt-2">
              <div class="form-group col-sm-12">
                <label>Nama untuk Kalender</label>
                <input 
                  v-model="schedule_data.title"
                  type="text"
                  class="form-control"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': submitted && $v.schedule_data.title.$error }"
                >
                <div
                  v-if="submitted && !$v.schedule_data.title.required"
                  class="invalid-feedback"
                >
                  Name harus diisi!
                </div>
              </div>
            </div>

            <div class="row mb-2 mt-2">
              <div class="form-group col-sm-4">
                <label>Tanggal</label>
                <br>
                <date-picker
                  v-model="time_date" 
                  :first-day-of-week="1" 
                  lang="en"
                  :clearable="false"
                  value-type="format"
                  :disabled="isLoading"
                  :class="{ 'is-invalid': submitted && $v.time_date.$error }"
                />
                <div
                  v-if="submitted && !$v.time_date.required"
                  class="invalid-feedback"
                >
                  Tanggal harus diisi!
                </div>
              </div>

              <div class="form-group col-sm-4">
                <label>Jam Mulai</label>
                <br>
                <date-picker
                  v-model="time_start"
                  value-type="format"
                  type="time"
                  placeholder="HH:mm:ss"
                  :disabled="isLoading"
                  :disabled-time="notAfterTimeEnd"
                  :class="{ 'is-invalid': submitted && $v.time_start.$error }"
                />
                <div
                  v-if="submitted && !$v.time_start.required"
                  class="invalid-feedback"
                >
                  Jam Mulai harus diisi!
                </div>
              </div>
              
              <div class="form-group col-sm-4">
                <label>Jam Terakhir</label>
                <br>
                <date-picker
                  v-model="time_end"
                  value-type="format"
                  type="time"
                  placeholder="HH:mm:ss"
                  :disabled="isLoading"
                  :disabled-time="notBeforeTimeStart"
                  :class="{ 'is-invalid': submitted && $v.time_end.$error }"
                />
                <div
                  v-if="submitted && !$v.time_end.required"
                  class="invalid-feedback"
                >
                  Jam Terakhir harus diisi!
                </div>
              </div>
            </div>

            <div class="row mb-2 mt-2">
              <div class="form-group col-sm-12">
                <div
                  class="row"
                  style="margin:0!important;"
                >
                  <label class="mr-4">Ruangan</label>
                  <a
                    v-if="!isRuanganShowed"
                    href="javascript:void(0)"
                    class="font-weight-bold active"
                    @click="onClickRuangan"
                  >show</a>
                  <a
                    v-if="isRuanganShowed"
                    href="javascript:void(0)"
                    class="font-weight-bold active"
                    @click="onClickRuangan"
                  >hide</a>
                </div>
                <multiselect 
                  v-model="schedule_data.room" 
                  :options="dataRooms"
                  label="name"
                  track-by="name"
                  :allow-empty="false"
                  :disabled="isLoading"
                  :show-labels="false"
                  :class="{ 'is-invalid': submitted && $v.schedule_data.room.id.$error }"
                  @select="selectRoom"
                />
                <div
                  v-if="submitted && !$v.schedule_data.room.id.required"
                  class="invalid-feedback"
                >
                  Ruangan harus diisi!
                </div>
              </div>
            </div>

            <div
              v-if="isRuanganShowed"
              class="row mb-2 mt-2"
            >
              <div class="form-group col-sm-12">
                <label>Deskripsi Ruangan</label>
                <textarea 
                  v-model="room.desc"
                  rows="2"
                  type="text"
                  class="form-control"
                  :disabled="true"
                  style="background-color: #F0F4F6;"
                />
              </div>
            </div>

            <div
              v-if="isRuanganShowed"
              class="row mb-2 mt-2"
            >
              <div class="form-group col-sm-6">
                <label>MS Teams Link</label>
                <input 
                  v-model="room.msteam_link"
                  type="text"
                  class="form-control"
                  :disabled="true"
                  style="background-color: #F0F4F6;"
                >
              </div>

              <div class="form-group col-sm-6">
                <label>MS Teams Code</label>
                <input 
                  v-model="room.msteam_code"
                  type="text"
                  class="form-control"
                  :disabled="true"
                  style="background-color: #F0F4F6;"
                >
              </div>
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
  </Layout>
</template>