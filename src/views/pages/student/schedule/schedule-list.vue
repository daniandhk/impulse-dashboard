<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';
import moment from 'moment';
import i18n from '@/i18n';

/**
 * Orders Component
 */
export default {
  page: {
    title: i18n.t('practicum.list-course.text'),
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: i18n.t('practicum.list-course.text'),
      items: [
        {
          text: i18n.t('student.text'),
          href: "/"
        },
        {
          text: i18n.t('student.schedule.text'),
          href: "/student/schedule/calendar"
        },
        {
          text: i18n.t('practicum.course.text'),
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "module.index",
      sortDesc: false,
      dataSchedules: [],
      fields: [
        { key: "module.index", sortable: true, label: i18n.t('practicum.module.text') },
        { key: "title", label: i18n.t('practicum.calendar-name.text') },
        { key: "date", sortable: true, label: i18n.t('practicum.date.text') },
        { key: "start", sortable: true, label: i18n.t('practicum.time-start.text'), thClass: 'text-center', tdClass: 'text-center' },
        { key: "end", sortable: true, label: i18n.t('practicum.time-end.text'), thClass: 'text-center', tdClass: 'text-center' },
        { key: "room", sortable: false, label: i18n.t('practicum.room.text'), thClass: 'text-center', tdClass: 'text-center' },
        { key: "practicum", sortable: false, label: i18n.t('student.schedule.practicum.text'), thClass: 'text-center', tdClass: 'text-center' },
      ],

      student_id: store.getters.getLoggedUser.id,

      dataClassCourses: [],
      class_course_data: {
          class_name: "",
          course_code: "",
          course_name: "",
          staff_code: "",
          staff_name: "",
          academic_year: "",
      },

      isFetchingData: false,
      isLoading: false,

      room: {
        name: "",
        desc: "",
        msteam_link: "",
        msteam_code: "",
      },
      eventModal: false,

    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.dataSchedules.length;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  mounted: async function() {
    // Set the initial number of items
    this.totalRows = this.dataSchedules.length;
    this.perPage = this.dataSchedules.length;
    
    this.loading(true);
    await this.getStudentCourses();
    await this.refreshData(0);
    this.loading(false);
  },
  methods: {
    ...notificationMethods,
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    
    async getStudentCourses(){
        return (
            api.getStudentCourses(this.student_id)
            .then(response => {
                if(response.data.data){
                    this.dataClassCourses = response.data.data;
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
                      text: i18n.t('component.swal.error.text'),
                      footer: error.response.data.message
                  })
                }
            })
        );
    },

    async getSchedules(class_course_id){
        return (
            api.showSchedules(class_course_id)
            .then(response => {
                if(response.data.data){
                    this.dataSchedules = response.data.data;
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
                      text: i18n.t('component.swal.error.text'),
                      footer: error.response.data.message
                  })
                }
            })
        );
    },

    async refreshData(index){
        this.isFetchingData = true;
        if(this.dataClassCourses.length){
            this.loading(true);
            this.class_course_data = this.dataClassCourses[index];
            let class_course_id = this.class_course_data.class_course_id;
            await this.getSchedules(class_course_id);
            this.loading(false);
        }
        this.isFetchingData = false;
    },

    onClickShow(data) {
      this.room = data.item.room;
      this.eventModal = true;
    },

    onClickPracticum(data){
      let schedule_id = data.item.id;

      this.$router.push({
          name: 'student-schedule-detail', 
          params: { id: schedule_id }
      });
    },

    isNow(data){
      let now = moment().format('YYYY-MM-DD HH:mm:ss');

      if(data.item.start && data.item.end){
        if(now >= data.item.start  && now <= data.item.end){
          return true;
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    },

    dateFormatted(date){
      if(date){
        return moment(date).format('LL');
      }
      else{
        return "-";
      }
    },

    timeFormatted(date){
      if(date){
        return moment(date).format('LT');
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
  }
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
    <div
      v-if="dataClassCourses.length"
      class="row"
    >
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs
              nav-class="nav-tabs-custom"
              @input="refreshData"
            >
              <b-tab
                v-for="(course, index) in dataClassCourses"
                :key="index"
                title-link-class="p-3"
              >
                <template v-slot:title> 
                  <a class="font-weight-bold active ml-sm-5 mr-lg-5">{{ course.course_name }}</a>
                </template>
                <div class="row" />
                <div class="row mt-4">
                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>Kelas</label>
                      <input
                        v-model="class_course_data.class_name"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>

                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>{{ $t('practicum.course.text') }}</label>
                      <input
                        v-model="class_course_data.course_name"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>

                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>{{ $t('practicum.staff-code.text') }}</label>
                      <input
                        v-model="class_course_data.staff_code"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>

                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>{{ $t('practicum.year-semester.text') }}</label>
                      <input
                        v-model="class_course_data.academic_year"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>
                </div>
                <!-- <div class="row mt-4">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label>
                    </div>
                  </div>
                  Search 
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                      <label class="d-inline-flex align-items-center">
                        Search:
                        <b-form-input
                          v-model="filter"
                          type="search"
                          class="form-control form-control-sm ml-2"
                        ></b-form-input>
                      </label>
                    </div>
                  </div>
                  End search
                </div> -->
                <div class="table-responsive mt-2">
                  <b-table
                    class="table-centered"
                    :items="dataSchedules"
                    :fields="fields"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :busy.sync="isFetchingData"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(date)="data">
                      {{ dateFormatted(data.item.date) }}
                    </template>
                    <template v-slot:cell(start)="data">
                      {{ timeFormatted(data.item.start) }}
                    </template>
                    <template v-slot:cell(end)="data">
                      {{ timeFormatted(data.item.end) }}
                    </template>
                    <template v-slot:cell(room)="data">
                      <b-button
                        type="submit" 
                        variant="outline-secondary"
                        size="sm"
                        style="min-width: 75px;"
                        @click="onClickShow(data)" 
                      >
                        {{ data.item.room.name }}
                      </b-button>
                    </template>
                    <template v-slot:cell(practicum)="data">
                      <b-button
                        v-if="isNow(data)" 
                        type="submit"
                        variant="success"
                        size="sm"
                        style="min-width: 125px;"
                        @click="onClickPracticum(data)" 
                      >
                        {{ $t('student.schedule.practicum.button.start-practicum') }}
                      </b-button>
                      <b-button
                        v-if="!isNow(data)" 
                        type="submit"
                        variant="secondary"
                        size="sm"
                        style="min-width: 125px;"
                      >
                        -
                      </b-button>
                    </template>
                  </b-table>
                </div>
                <!-- <div class="row">
                  <div class="col">
                    <div class="paging_simple_numbers float-right">
                      <ul class="pagination pagination-rounded mb-0">
                        pagination
                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div> -->
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!dataClassCourses.length"
      class="row"
    />

    <b-modal
      v-model="eventModal"
      size="lg"
      :title="$t('student.schedule.popup-room')"
      hide-footer 
      title-class="font-18"
    >
      <div
        id="metadata"
        class="tab-pane col-sm-12 col-md-12"
      >
        <div>
          <div class="form-group">
            <label>{{ $t('practicum.room.text') }}</label>
            <input
              v-model="room.name"
              type="text"
              class="form-control"
              :disabled="true"
            >
          </div>
        </div>
        <div>
          <div class="form-group">
            <label>{{ $t('practicum.room.desc.text') }}</label>
            <textarea
              v-model="room.desc"
              rows="2"
              type="text"
              class="form-control"
              :disabled="true"
            />
          </div>
        </div>
        <div>
          <div class="form-group">
            <label>{{ $t('practicum.room.msteams-link.text') }}</label>
            <input
              v-model="room.msteam_link"
              type="text"
              class="form-control"
              :disabled="true"
            >
          </div>
        </div>
        <div>
          <div class="form-group">
            <label>{{ $t('practicum.room.msteams-code.text') }}</label>
            <input
              v-model="room.msteam_code"
              type="text"
              class="form-control"
              :disabled="true"
            >
          </div>
        </div>
      </div>
    </b-modal>
  </Layout>
</template>