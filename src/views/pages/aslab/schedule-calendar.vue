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

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import moment from 'moment';
import Multiselect from "vue-multiselect";

/**
 * Calendar component
 */
export default {
  page: {
    title: "Kalender",
    meta: [{ name: "description" }],
  },
  components: { FullCalendar, Layout, PageHeader, Multiselect, },
  data() {
    return {
      title: "Kalender",
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
          text: "Kalender",
          active: true,
        }
      ],
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
      module_index: "",
      course_data: null,
      class_data: null,
      module_data: null,
      dataModules: [
        {name: "Modul 1", index: 1}, 
        {name: "Modul 2", index: 2}, 
        {name: "Modul 3", index: 3}, 
        {name: "Modul 4", index: 4}, 
        {name: "Modul 5", index: 5}, 
        {name: "Modul 6", index: 6},
        {name: "Modul 7", index: 7},
        {name: "Modul 8", index: 8},
        {name: "Modul 9", index: 9},
        {name: "Modul 10", index: 10},
        {name: "Modul 11", index: 11},
        {name: "Modul 12", index: 12},
        {name: "Modul 13", index: 13},
        {name: "Modul 14", index: 14}
      ],
      dataDropdown:{
          classes: [],
          courses: [],
          staffs: [],
          academic_year: [],
      },

      isCourseSelected: false,

      calendarOptions: {
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
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
    getRequestParams(class_name, course_name, academic_year_id, module_index) {
      let params = {};

      if (class_name) {
        params["class_name"] = class_name;
      }

      if (course_name) {
        params["course_name"] = course_name;
      }

      if (academic_year_id) {
        params["academic_year_id"] = academic_year_id;
      }

      if (module_index) {
        params["module_index"] = module_index;
      }

      return params;
    },
    async getSchedules() {
      const params = this.getRequestParams(
        this.class_name,
        this.course_name,
        this.academic_year_id,
        this.module_index
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

      this.eventModal = true;
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

    editModal(){
      this.$router.push({
          name: 'aslab-schedule-input', 
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

    async selectModule(value){
        this.loading(true);
        this.module_index = value.index;
        await this.fetchData();
        this.loading(false);
    },

    async removeModule(){
        this.loading(true);
        this.module_index = "";
        await this.fetchData();
        this.loading(false);
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
        this.isCourseSelected = true;
        this.course_code = value.code;
        this.course_name = value.name;
        await this.fetchData();
        this.loading(false);
    },

    async removeCourse(){
        this.loading(true);
        this.isCourseSelected = false;
        this.course_code = "";
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

    resetFilter(){
      this.removeModule()
      this.module_data = null
      this.removeKelas()
      this.class_data = null
      this.removeCourse()
      this.course_data = null
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
            <div class="row">
              <div class="col-sm-12 col-md-12">
                <label class="d-inline-flex align-items-center">
                  Filter:
                </label>
              </div>
              <div class="row col-sm-12 col-md-12">
                <div class="col-sm-12 col-md-2">
                  <div class="form-group">
                    <multiselect
                      v-model="module_data"
                      placeholder="Modul"
                      :options="dataModules"
                      label="name"
                      track-by="name"
                      select-label=""
                      selected-label="x"
                      deselect-label="x"
                      @select="selectModule"
                      @remove="removeModule"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-2">
                  <div class="form-group">
                    <multiselect
                      v-model="class_data"
                      placeholder="Kelas"
                      :options="dataDropdown.classes"
                      label="name"
                      track-by="name"
                      select-label=""
                      selected-label="x"
                      deselect-label="x"
                      @select="selectKelas"
                      @remove="removeKelas"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4">
                  <div class="form-group">
                    <multiselect
                      v-model="course_data"
                      placeholder="Mata Kuliah"
                      :options="dataDropdown.courses"
                      label="name"
                      track-by="name"
                      select-label=""
                      selected-label="x"
                      deselect-label="x"
                      @select="selectCourse"
                      @remove="removeCourse"
                    />
                  </div>
                </div>
                <div
                  v-if="isCourseSelected"
                  class="col-sm-12 col-md-2"
                >
                  <div class="form-group">
                    <input
                      v-model="course_code"
                      :disabled="true"
                      class="form-control text-center"
                      type="text"
                      style="background-color: #F0F4F6;"
                    >
                  </div>
                </div>
                <div
                  v-if="(course_data != null || class_data != null || module_data != null)"
                  class="col-sm-12 col-md-2"
                >
                  <div class="form-group">
                    <button 
                  
                      type="button"
                      class="btn btn-secondary"
                      @click="resetFilter"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="app-calendar mt-4">
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
        <div>
          <div class="form-group">
            <label>Nama Kalender</label>
            <input
              v-model="schedule_data.title"
              type="text"
              class="form-control"
              :disabled="true"
            >
          </div>
        </div>
        <div class="row">
          <div class="col-sm-9">
            <div class="form-group">
              <label>Kelas</label>
              <input
                v-model="class_course_data.class.name"
                type="text"
                class="form-control"
                :disabled="true"
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
                :disabled="true"
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
                :disabled="true"
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
                :disabled="true"
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
              :disabled="true"
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
                :disabled="true"
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
                :disabled="true"
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
              :disabled="true"
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
              :disabled="true"
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
              :disabled="true"
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
              :disabled="true"
            >
          </div>
        </div>
        <div class="text-right mt-4">
          <button
            type="button"
            class="btn btn-info mr-2 waves-effect waves-light"
            @click="editModal"
          >
            Edit
          </button>
          <button
            type="button"
            class="btn btn-light waves-effect"
            @click="closeModal"
          >
            Kembali
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
