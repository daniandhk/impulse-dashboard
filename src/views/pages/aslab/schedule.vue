<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import * as api from '@/api';
import Swal from "sweetalert2";

import { notificationMethods } from "@/state/helpers";
import Multiselect from "vue-multiselect";
import moment from 'moment';

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Jadwal",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  data() {
    return {
      title: "Jadwal",
      items: [
        {
          text: "Asisten Lab",
          href: "/"
        },
        {
          text: "Jadwal",
          active: true,
        },
      ],

      //list class-course
      isFetchingData: false,
      dataSchedules: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter_search: "",
      filterOn: [],
      sortBy: "title",
      sortDesc: false,
      fields: [
        { key: "title", sortable: true, label: "Nama Kalender" },
        { key: "class_course.class.name", sortable: true, label: "Kelas" },
        { key: "class_course.course.name", sortable: true, label: "Mata Kuliah" },
        { key: "date", sortable: true, label: "Tanggal" },
        { key: "start", sortable: true, label: "Jam Mulai", thClass: 'text-center', tdClass: 'text-center' },
        { key: "end", sortable: true, label: "Jam Terakhir", thClass: 'text-center', tdClass: 'text-center' },
        { key: "room", sortable: false, label: "Ruangan", thClass: 'text-center', tdClass: 'text-center' },
        { key: "action", label: "Aksi", sortable: false, }
      ],

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
          class: {
            name: "",
          },
          course: {
            name: "",
          },
          staff: {
            name: "",
          },
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
      eventModal: false,
      eventModalRuangan: false,

      room: {
        name: "",
        desc: "",
        msteam_link: "",
        msteam_code: "",
      },

      isRuanganShowed: false,

      isCourseSelected: false,
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.totalRows;
    },
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
    this.loading(false);
  },
  methods: {
    ...notificationMethods,

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
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
    async fetchData(){
      await this.loadDataDropdown();
      this.isFetchingData = true;

      const params = this.getRequestParams(
        this.class_name,
        this.course_name,
        this.academic_year_id,
        this.module_index
      );

      return (
        api.getAllSchedules(params)
          .then(response => {
            if (response.data.data){
              this.totalRows = response.data.data.length;
              this.dataSchedules = response.data.data;
            }
            this.isFetchingData = false;
          })
          .catch(error => {
            this.isFetchingData = false;

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

    async handlePageChange(value) {
        this.loading(true);
        this.currentPage = value;
        await this.fetchData();
        this.loading(false);
    },

    async handlePageSizeChange(value) {
        this.loading(true);
        this.perPage = value;
        this.currentPage = 1;
        await this.fetchData();
        this.loading(false);
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
    async onClickEdit(data) {
      //set data
      await this.getClassCourse(data.item.class_course.id);

      this.schedule_data.id = data.item.id;
      this.schedule_data.title = data.item.title;
      this.schedule_data.room = data.item.room;
      this.schedule_data.class_course = data.item.class_course;
      this.schedule_data.module = data.item.module;
      this.schedule_data.academic_year = data.item.academic_year;
      if(!data.item.start){
        this.schedule_data.start = "-";
        this.schedule_data.end = "-";
        this.schedule_data.date = this.dateFormatted(data.item.date);
      } 
      else{
        this.schedule_data.start = this.timeFormatted(data.item.start);
        this.schedule_data.end = this.timeFormatted(data.item.end);
        this.schedule_data.date = this.dateFormatted(data.item.date);
      }

      this.eventModal = true;
    },

    closeModal() {
      this.eventModal = false;
    },

    editModal(data){
      this.schedule_data.id = data.item.id;
      this.$router.push({
          name: 'aslab-schedule-input', 
          params: { id: this.schedule_data.id }
      });
    },

    onClickShow(data) {
      this.room = data.item.room;
      this.eventModalRuangan = true;
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
        <hr
          style="margin-left: -28px; 
                        margin-right: -28px; 
                        height: 2px; 
                        background-color: #eee; 
                        border: 0 none; 
                        color: #eee;"
        >
        <div class="row mt-4">
          <div class="col-sm-12 col-md-6">
            <div
              id="tickets-table_length"
              class="dataTables_length"
            >
              <label class="d-inline-flex align-items-center">
                Show&nbsp;
                <b-form-select 
                  v-model="perPage" 
                  size="sm" 
                  :options="pageOptions"
                  @change="handlePageSizeChange"
                />&nbsp;entries
              </label>
            </div>
          </div>
          <!-- Search -->
          <div class="col-sm-12 col-md-6">
            <div
              id="tickets-table_filter"
              class="dataTables_filter text-md-right"
            >
              <label class="d-inline-flex align-items-center">
                Search:
                <b-form-input
                  v-model="filter_search"
                  type="search"
                  class="form-control form-control-sm ml-2"
                />
              </label>
            </div>
          </div>
          <!-- End search -->
        </div>
        <div class="table-responsive">
          <b-table
            ref="table"
            class="table-centered"
            :items="datas"
            :fields="fields"
            responsive="sm"
            :per-page="perPage"
            :busy.sync="isFetchingData"
            :current-page="currentPage"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            :filter="filter_search"
            :filter-included-fields="filterOn"
            :head-variant="'dark'"
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
            <template v-slot:cell(action)="data">
              <a
                v-b-tooltip.hover
                href="javascript:void(0);"
                class="m-1 text-primary"
                title="Detail"
                @click="onClickEdit(data)"
              >
                <i class="mdi mdi-eye-outline font-size-18" />
              </a>
              <a
                v-b-tooltip.hover
                href="javascript:void(0);"
                class="m-1 text-primary"
                title="Edit"
                @click="editModal(data)"
              >
                <i class="mdi mdi-pencil font-size-18" />
              </a>
            </template>
          </b-table>
        </div>
        <div class="row">
          <div class="col">
            <div class="paging_simple_numbers float-right">
              <ul class="pagination pagination-rounded mb-0">
                <!-- pagination -->
                <b-pagination 
                  v-model="currentPage" 
                  :total-rows="rows" 
                  :per-page="perPage"
                  @input="handlePageChange"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      v-model="eventModalRuangan"
      size="lg"
      title="Detail Ruangan"
      hide-footer 
      title-class="font-18"
    >
      <div
        id="metadata"
        class="tab-pane col-sm-12 col-md-12"
      >
        <div>
          <div class="form-group">
            <label>Ruangan</label>
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
            <label>Deskripsi Ruangan</label>
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
            <label>MS Teams Link</label>
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
            <label>MS Teams Code</label>
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
        <div v-if="isRuanganShowed">
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
        <!-- <div class="text-right mt-4">
            <button
            type="button"
            @click="editModal"
            class="btn btn-info mr-2 waves-effect waves-light"
            >Edit</button>
            <button type="button" @click="closeModal" class="btn btn-light waves-effect">Kembali</button>
        </div> -->
      </div>
    </b-modal>
  </Layout>
</template>
