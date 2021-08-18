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
  components: {
    Layout,
    PageHeader,
    Multiselect,
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
    this.loading();
    await this.fetchData().then(result=>{
      this.loading();
    });
  },
  data() {
    return {
      title: "Schedule",
      items: [
        {
          text: "Asisten Lab",
          href: "/"
        },
        {
          text: "Schedule",
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
        { key: "title", sortable: true, label: "Name" },
        { key: "date", sortable: true, label: "Tanggal" },
        { key: "start", sortable: true, label: "Jam Mulai" },
        { key: "end", sortable: true, label: "Jam Terakhir" },
        { key: "room.name", sortable: true, label: "Ruangan" },
        { key: "action", sortable: false }
      ],

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
      eventModal: false,
    };
  },
  methods: {
    ...notificationMethods,

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
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
    async fetchData(){
      await this.loadDataDropdown();
      this.isFetchingData = true;

      const params = this.getRequestParams(
        this.class_name,
        this.course_name,
        this.academic_year_id,
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

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
            })
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
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    async removeKelas(){
        this.class_name = "";
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    async selectCourse(value){
        this.course_name = value.name;
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    async removeCourse(){
        this.course_name = "";
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    async handlePageChange(value) {
        this.currentPage = value;
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    async handlePageSizeChange(value) {
        this.perPage = value;
        this.currentPage = 1;
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
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
        this.schedule_data.start = "empty";
        this.schedule_data.end = "empty";
        this.schedule_data.date = moment(String(data.item.date)).format('YYYY-MM-DD');
      } 
      else{
        this.schedule_data.start = moment(String(data.item.start)).format('YYYY-MM-DD HH:mm:ss');
        this.schedule_data.end = moment(String(data.item.end)).format('YYYY-MM-DD HH:mm:ss');
        this.schedule_data.date = moment(String(data.item.date)).format('YYYY-MM-DD');
      }

      this.eventModal = true;
    },

    closeModal() {
      this.eventModal = false;
    },

    editModal(){
      this.$router.push({
          name: 'aslab-schedule-input', 
          params: { id: this.schedule_data.id }
      });
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
            <hr>
            <div class="row mt-4">
            <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                <label class="d-inline-flex align-items-center">
                    Show&nbsp;
                    <b-form-select 
                    v-model="perPage" 
                    size="sm" 
                    :options="pageOptions"
                    @change="handlePageSizeChange"
                    ></b-form-select>&nbsp;entries
                </label>
                </div>
            </div>
            <!-- Search -->
            <div class="col-sm-12 col-md-6">
                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input
                    v-model="filter_search"
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
                @filtered="onFiltered"
                :headVariant="'dark'"
            >
                <template v-slot:cell(action)="data">
                <a
                    href="javascript:void(0);"
                    @click=onClickEdit(data)
                    class="mr-3 text-primary"
                    v-b-tooltip.hover
                    title="Edit"
                >
                    <i class="mdi mdi-pencil font-size-18"></i>
                </a>
                </template>
            </b-table>
            </div>
            <div class="row">
            <div class="col">
                <div class="dataTables_paginate paging_simple_numbers float-right">
                <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination 
                    v-model="currentPage" 
                    :total-rows="rows" 
                    :per-page="perPage"
                    @input="handlePageChange"
                    ></b-pagination>
                </ul>
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
