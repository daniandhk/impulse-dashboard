<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";

import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';
import { required } from "vuelidate/lib/validators";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import moment from 'moment';
import Multiselect from "vue-multiselect";

/**
 * Calendar component
 */
export default {
  page: {
    title: "Calendar",
    meta: [{ name: "description" }],
  },
  components: { FullCalendar, Layout, PageHeader, Multiselect, },
  data() {
    return {
      title: "Calendar",
      items: [
        {
          text: "Aslab",
        },
        {
          text: "Calendar",
          active: true,
        },
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
      dataFilter:{
        class_name: "",
        course_name: "",
        academic_year_id: "",
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
      },
      currentEvents: [],
      eventModal: false,
    };
  },
  validations: {
    event: {
      title: { required },
      category: { required },
    },
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
    await this.fetchData();
    await this.loadDataDropdown();
  },
  methods: {
    getRequestParams(class_name, course_name, academic_year_id) {
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

      return params;
    },
    async getSchedules() {
      const params = this.getRequestParams(
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
                element.className = 'bg-success text-white';
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
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: error
              })
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
        this.schedule_data.start = "empty";
        this.schedule_data.end = "empty";
        this.schedule_data.date = info.event.startStr;
      } 
      else{
        this.schedule_data.start = moment(String(info.event.startStr)).format('YYYY-MM-DD hh:mm:ss');
        this.schedule_data.end = moment(String(info.event.endStr)).format('YYYY-MM-DD hh:mm:ss');
        this.schedule_data.date = moment(String(info.event.startStr)).format('YYYY-MM-DD');
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
      this.dataFilter.class_name = this.class_course_data.class.name;
      this.dataFilter.course_name = this.class_course_data.course.name;
      this.dataFilter.academic_year_id = this.class_course_data.academic_year.id;
      this.$router.push({
          name: 'aslab-schedule-input', 
          params: { dataFilter: this.dataFilter, id: this.schedule_data.id }
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                })
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
        this.class_name = value.name;
        await this.fetchData();
    },

    async removeKelas(){
        this.class_name = "";
        await this.fetchData();
    },

    async selectCourse(value){
        this.course_name = value.name;
        await this.fetchData();
    },

    async removeCourse(){
        this.course_name = "";
        await this.fetchData();
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
    <PageHeader :title="title" :items="items" />
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
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <multiselect
                        placeholder="Kelas"
                        v-model="class_data"
                        :options="dataDropdown.classes"
                        label="name"
                        track-by="name"
                        @select="selectKelas"
                        @remove="removeKelas"
                    ></multiselect>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3">
                  <div class="form-group">
                    <multiselect
                        placeholder="Mata Kuliah"
                        v-model="course_data"
                        :options="dataDropdown.courses"
                        label="name"
                        track-by="name"
                        @select="selectCourse"
                        @remove="removeCourse"
                    ></multiselect>
                  </div>
                </div>
              </div>
            </div>
            <div class="app-calendar mt-4">
              <FullCalendar
                ref="fullCalendar"
                :options="calendarOptions"
              ></FullCalendar>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <b-modal
      size="lg"
      v-model="eventModal"
      title="Detail Schedule"
      hide-footer 
      title-class="font-18"
    >
      <div class="tab-pane col-sm-12 col-md-12" id="metadata">
        <div>
            <div class="form-group">
                <label>Title</label>
                <input
                    v-model="schedule_data.title"
                    type="text"
                    class="form-control"
                    disabled="true"
                />
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
                      disabled="true"
                  />
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
                  />
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
                  />
              </div>
          </div>
          <div class="col-sm-3">
              <div class="form-group">
                  <label>Module</label>
                  <input
                      v-model="schedule_data.module.index"
                      type="text"
                      class="form-control"
                      disabled="true"
                  />
              </div>
          </div>
        </div>
        <div>
            <div class="form-group">
                <label>Room</label>
                <input
                    v-model="schedule_data.room.name"
                    type="text"
                    class="form-control"
                    disabled="true"
                />
            </div>
        </div>
        <div>
            <div class="form-group">
                <label>Date</label>
                <input
                    v-model="schedule_data.date"
                    type="text"
                    class="form-control"
                    disabled="true"
                />
            </div>
        </div>
        <div class="row">
          <div class="col-sm-6">
              <div class="form-group">
                  <label>Start</label>
                  <input
                      v-model="schedule_data.start"
                      type="text"
                      class="form-control"
                      disabled="true"
                  />
              </div>
          </div>
          <div class="col-sm-6">
              <div class="form-group">
                  <label>End</label>
                  <input
                      v-model="schedule_data.end"
                      type="text"
                      class="form-control"
                      disabled="true"
                  />
              </div>
          </div>
        </div>
        <div class="text-right mt-4">
            <button
            type="button"
            @click="editModal"
            class="btn btn-info mr-2 waves-effect waves-light"
            >Edit</button>
            <button type="button" @click="closeModal" class="btn btn-light waves-effect">Close</button>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>