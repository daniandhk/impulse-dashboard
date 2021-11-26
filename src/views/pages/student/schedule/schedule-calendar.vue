<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";
import idLocale from "@fullcalendar/core/locales/id";

import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';

import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import moment from 'moment';

/**
 * Calendar component
 */
export default {
  page: {
    title: "Kalender",
  },
  components: { FullCalendar, Layout, PageHeader, },
  data() {
    return {
      title: "Kalender",
      items: [
        {
          text: "Praktikan",
          href: "/"
        },
        {
          text: "Jadwal",
          active: true,
        }
      ],
      user: store.getters.getLoggedUser,
      //list schedule
      isFetchingData: false,
      dataSchedules: [],
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
      class_name: "",
      course_name: "",
      academic_year_id: "",
      course_data: "",
      class_data: "",
      dataDropdown:{
          classes: [],
          courses: [],
          staffs: [],
          academic_year: [],
      },

      calendarOptions: {
        headerToolbar: {
          left: "prev,next",
          center: "title",
          right: "today",
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrapPlugin,
          listPlugin,
        ],
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        events: [],
        eventTextColor: "#FFFFFF",
        editable: false,
        droppable: false,
        eventResizableFromStart: true,
        eventClick: this.detailEvent,
        eventsSet: this.handleEvents,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        locale: idLocale,
        dayHeaderFormat: { weekday: 'long' },
      },
      currentEvents: [],
      eventModal: false,

      isNow: false,
      isRuanganShowed: false,
    };
  },
  computed: {
    datas() {
      return this.dataSchedules;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  mounted: async function() {
      this.loading(true);
      await this.fetchData();
      await this.loadDataDropdown();
      this.loading(false);
  },
  methods: {
    getRequestParams(student_id, class_name, course_name, academic_year_id) {
      let params = {};

      if (student_id) {
        params["student_id"] = student_id;
      }

      if (class_name) {
        params["class_name"] = class_name;
      }

      if (course_name) {
        params["course_name"] = course_name;
      }

      if (academic_year_id) {
        params["academic_year_id"] = academic_year_id;
      }

      return params;
    },
    async getSchedules() {
      const params = this.getRequestParams(
        this.user.id,
        this.class_name,
        this.course_name,
        this.academic_year_id,
      );

      return (
        api.getAllSchedules(params)
          .then(response => {
            if(response.data.data){
              this.dataSchedules = response.data.data;
              this.dataSchedules.forEach(function (element) {
                let now = moment().format('YYYY-MM-DD HH:mm:ss');

                if(element.start && element.end){
                  if(now >= element.start  && now <= element.end){
                    element.className = 'bg-success text-white';
                  }
                  else{
                    element.className = 'bg-dark text-white';
                  }
                }
                else{
                  element.className = 'bg-dark text-white';
                }
              });
              //get schedule test, get is_active, set warna
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

    async fetchData(){
      this.isFetchingData = true;
      //emptying data
      this.dataSchedules = [];
      await this.getSchedules();
      //await sleep(1000);
      this.calendarOptions.events = this.datas;
      this.isFetchingData = false;
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

    /**
     * Modal open for deta event
     */
    async detailEvent(info) {
      //info.event = title, start, end, id
      //info.event.extendedProps = other fields

      //set data
      await this.getClassCourse(info.event.extendedProps.class_course.id);

      this.schedule_data.id = info.event.id;
      this.schedule_data.title = info.event.title;
      this.schedule_data.room = info.event.extendedProps.room;
      this.schedule_data.class_course = info.event.extendedProps.class_course;
      this.schedule_data.module = info.event.extendedProps.module;
      this.schedule_data.academic_year = info.event.extendedProps.academic_year;
      if(info.event.endStr == ""){
        this.schedule_data.start = "-";
        this.schedule_data.end = "-";
        this.schedule_data.date = this.dateFormatted(info.event.startStr);
      } 
      else{
        this.schedule_data.start = this.timeFormatted(info.event.startStr);
        this.schedule_data.end = this.timeFormatted(info.event.endStr);
        this.schedule_data.date = this.dateFormatted(info.event.startStr);
      }

      // testing
      // this.isNow = true;
      await this.setStart(this.schedule_data.date, this.schedule_data.start, this.schedule_data.end);

      this.eventModal = true;
    },

    async setStart(date, start, end){
      let now = moment().format('YYYY-MM-DD HH:mm:ss');

      if(start != "-" && end != "-"){
        if(now >= start  && now <= end){
          this.isNow = true;
        }
        else{
          this.isNow = false;
        }
      }
      else{
        this.isNow = false;
      }
      //v-if="isNow" di div button
    },

    closeModal() {
      this.eventModal = false;
    },

    /**
     * Show list of events
     */
    handleEvents(events) {
      this.currentEvents = events;
    },

    detailModal(){
      this.$router.push({
          name: 'praktikan-schedule-detail', 
          params: { id: this.schedule_data.id }
      });
    },

    async loadDataDropdown(){
        this.getDataDropdown();
    },

    async getDataDropdown(){
        return (
            api.getClassCourseStaffYear()
            .then(response => {
                if(response.data.data){
                    this.setDataDropdown(response.data.data);
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
        )
    },

    setDataDropdown(data){
        data.academic_year.forEach((element, index, array) => {
            element.year = String(element.year) + " / " + String(element.semester)
        });
        this.dataDropdown = data;
    },

    async selectKelas(value){
        this.loading(true);
        this.class_name = value.name;
        await this.fetchData();
        this.loading(false);
    },

    async removeKelas(){
        this.loading(true);
        this.class_name = "";
        await this.fetchData();
        this.loading(false);
    },

    async selectCourse(value){
        this.loading(true);
        this.course_name = value.name;
        await this.fetchData();
        this.loading(false);
    },

    async removeCourse(){
        this.loading(true);
        this.course_name = "";
        await this.fetchData();
        this.loading(false);
    },

    onClickRuangan(){
      this.isRuanganShowed = !this.isRuanganShowed;
    },

    dateFormatted(date){
      if(date){
        return moment(date).locale('id').format('LL');
      }
      else{
        return "-";
      }
    },

    timeFormatted(date){
      if(date){
        return moment(date).locale('id').format('LT');
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
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
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="app-calendar">
              <FullCalendar
                ref="fullCalendar"
                :options="calendarOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <b-modal
      v-model="eventModal"
      size="lg"
      title="Detail Jadwal"
      hide-footer 
      title-class="font-18"
    >
      <div
        id="metadata"
        class="tab-pane col-sm-12 col-md-12"
      >
        <div class="row">
          <div class="col-sm-9">
            <div class="form-group">
              <label>Kelas</label>
              <input
                v-model="class_course_data.class.name"
                type="text"
                class="form-control"
                disabled="true"
              >
            </div>
          </div>
          <div class="col-sm-3">
            <div class="form-group">
              <label>Tahun / Semester</label>
              <input
                v-model="class_course_data.academic_year.name"
                type="text"
                class="form-control"
                disabled="true"
              >
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-9">
            <div class="form-group">
              <label>Mata Kuliah</label>
              <input
                v-model="class_course_data.course.name"
                type="text"
                class="form-control"
                disabled="true"
              >
            </div>
          </div>
          <div class="col-sm-3">
            <div class="form-group">
              <label>Modul</label>
              <input
                v-model="schedule_data.module.index"
                type="text"
                class="form-control"
                disabled="true"
              >
            </div>
          </div>
        </div>
        <div>
          <div class="form-group">
            <label>Tanggal</label>
            <input
              v-model="schedule_data.date"
              type="text"
              class="form-control"
              disabled="true"
            >
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
            <div class="form-group">
              <label>Jam Mulai</label>
              <input
                v-model="schedule_data.start"
                type="text"
                class="form-control"
                disabled="true"
              >
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label>Jam Terakhir</label>
              <input
                v-model="schedule_data.end"
                type="text"
                class="form-control"
                disabled="true"
              >
            </div>
          </div>
        </div>
        <div>
          <div class="form-group">
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
            <input
              v-model="schedule_data.room.name"
              type="text"
              class="form-control"
              disabled="true"
            >
          </div>
        </div>
        <div v-if="isRuanganShowed">
          <div class="form-group">
            <label>Deskripsi Ruangan</label>
            <textarea
              v-model="schedule_data.room.desc"
              rows="2"
              type="text"
              class="form-control"
              disabled="true"
            />
          </div>
        </div>
        <div v-if="isRuanganShowed">
          <div class="form-group">
            <label>MS Teams Link</label>
            <input
              v-model="schedule_data.room.msteam_link"
              type="text"
              class="form-control"
              disabled="true"
            >
          </div>
        </div>
        <div v-if="isRuanganShowed">
          <div class="form-group">
            <label>MS Teams Code</label>
            <input
              v-model="schedule_data.room.msteam_code"
              type="text"
              class="form-control"
              disabled="true"
            >
          </div>
        </div>
        <div class="text-right mt-4">
          <button
            type="button"
            class="btn btn-success mr-2 waves-effect waves-light"
            :disabled="!isNow"
            @click="detailModal"
          >
            Mulai Praktikum
          </button>
          <button
            type="button"
            class="btn btn-light waves-effect"
            @click="closeModal"
          >
            Batalkan
          </button>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>

<style>
   .fc-more-popover{
       max-height: 200px;
       overflow-y: scroll;
   }
</style>
