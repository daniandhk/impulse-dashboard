<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";

import * as api from '@/api';
import Swal from "sweetalert2";
import moment from 'moment';

import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  components: {
    Layout,
    Multiselect,
    PageHeader,
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    /**
     * Total no. of records
     */
    rows() {
      return this.totalRows;
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
      title: "List Test",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "Grading",
          href: "/asprak/grading/"
        },
        {
          text: "List",
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

      //list schedule grade
      isFetchingData: false,
      dataScheduleGrades: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter_search: "",
      filterOn: [],
      sortBy: "nim",
      sortDesc: false,
      fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
        { key: "grade.pretest", sortable: true, label: "Nilai Pretest", thClass: 'text-center', tdClass: 'text-center', },
        { key: "grade.journal", sortable: true, label: "Nilai Jurnal", thClass: 'text-center', tdClass: 'text-center', },
        { key: "grade.posttest", sortable: true, label: "Nilai Posttest", thClass: 'text-center', tdClass: 'text-center', },
        { key: "pretest", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
        { key: "journal", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
        { key: "posttest", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
      ],
    };
  },
  methods: {
    ...notificationMethods,

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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

    setId(id){
      this.schedule_data.id = id;
    },

    async loadData(){
      this.setId(this.$route.params.id);
      await this.fetchData();
      await this.setDate();
      await this.getScheduleGrades();
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

    async getScheduleGrades(){
      return (
        api.getScheduleGrades(this.schedule_data.id)
          .then(response => {
            if(response.data.data){
              this.dataScheduleGrades = response.data.data;
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

      api.showSchedules(class_course_id, params)
          .then(response => {
            if(response.data.data){
              let schedule_id = response.data.data[0].id;
              this.$router.push({
                  name: 'asprak-grading-list', 
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

    onShowClick(data){
        let student_id = data.item.id;
        let test_id = "";
        let type = "";

        if(data.field.key == "pretest"){
            test_id = data.item.test_id.pretest_id;
            type = "pretest";
        }
        else if(data.field.key == "journal"){
            test_id = data.item.test_id.journal_id;
            type = "journal";
        }
        else if(data.field.key == "posttest"){
            test_id = data.item.test_id.posttest_id;
            type = "posttest";
        }

        this.$router.push({
            name: 'asprak-grading-detail', 
            params: { id:this.schedule_data.id, student_id: student_id, type: type, test_id: test_id }
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
              <label>Module</label>
              <multiselect 
                class="text-center"
                v-model="schedule_data.module.index" 
                :options="dataModules"
                @select="selectModule"
                :allow-empty="false"
                :disabled="isLoading"
              ></multiselect>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
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
                :items="dataScheduleGrades"
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
                <template v-slot:cell(pretest)="data">
                    <b-button
                        v-if="data.item.test_id.pretest_id && data.item.submitted.pretest"
                        type="submit" 
                        variant="success"
                        @click=onShowClick(data)
                        style="min-width: 75px;"
                        >Show
                    </b-button>
                    <b-button
                        v-if="!data.item.test_id.pretest_id || !data.item.submitted.pretest"
                        type="submit" 
                        variant="danger"
                        style="min-width: 75px;"
                        >-
                    </b-button>
                </template>
                <template v-slot:cell(journal)="data">
                    <b-button
                        v-if="data.item.test_id.journal_id && data.item.submitted.journal"
                        type="submit" 
                        variant="success"
                        @click=onShowClick(data)
                        style="min-width: 75px;"
                        >Show
                    </b-button>
                    <b-button
                        v-if="!data.item.test_id.journal_id || !data.item.submitted.journal"
                        type="submit" 
                        variant="danger"
                        style="min-width: 75px;"
                        >-
                    </b-button>
                </template>
                <template v-slot:cell(posttest)="data">
                    <b-button
                        v-if="data.item.test_id.posttest_id && data.item.submitted.posttest"
                        type="submit" 
                        variant="success"
                        @click=onShowClick(data)
                        style="min-width: 75px;"
                        >Show
                    </b-button>
                    <b-button
                        v-if="!data.item.test_id.posttest_id || !data.item.submitted.posttest"
                        type="submit" 
                        variant="danger"
                        style="min-width: 75px;"
                        >-
                    </b-button>
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
    </div>
  </Layout>
</template>