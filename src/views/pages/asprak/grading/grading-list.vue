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
  page: {
    title: "List Tes",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    Multiselect,
    PageHeader,
  },
  data() {
    return {
      title: "List Tes",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        // {
        //   text: "Penilaian",
        //   href: "/asprak/schedule-grading/"
        // },
        {
          text: "Jadwal",
          href: "/asprak/schedule"
        },
        {
          text: "List Tes",
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
        { key: "name", sortable: true, label: "Nama" },
        { key: "pretest", label: "Tes Awal", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
        { key: "journal", label: "Jurnal", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
        { key: "posttest", label: "Tes Akhir", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
        { key: "grade.total", sortable: true, label: "Nilai Total", thClass: 'text-center', tdClass: 'text-center', },
      ],
    };
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

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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

    async getScheduleGrades(){
      return (
        api.getScheduleGrades(this.schedule_data.id)
          .then(response => {
            if(response.data.data){
              this.dataScheduleGrades = response.data.data;
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
            text: 'ID tidak valid!',
            footer: 'Anda dialihkan ke menu Jadwal',
            timer: 4000
        })
        this.$router.replace({
          name: 'asprak-schedule'
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

      api.showSchedules(class_course_id, params)
          .then(response => {
            if(response.data.data){
              let schedule_id = response.data.data[0].id;
              this.$router.push({
                  name: 'asprak-grading-list', 
                  params: { id: schedule_id }
              });
            }
            this.loading(false);
          })
          .catch(error => {
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
                  :disabled="true"
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
                  :disabled="true"
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
                  :disabled="true"
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
              select-label=""
              selected-label="x"
              deselect-label="x"
              @select="selectModule"
            />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="row">
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
              :head-variant="'dark'"
              @filtered="onFiltered"
            >
              <template v-slot:cell(pretest)="data">
                <b-button
                  v-if="(data.item.test_id.pretest_id && data.item.submitted.pretest) && !data.item.is_late.pretest"
                  :id="'test-pretest' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-info"
                  style="min-width: 75px;"
                  @click="onShowClick(data)"
                >
                  {{ data.item.grade.pretest }}
                </b-button>
                <b-tooltip
                  v-if="(data.item.test_id.pretest_id && data.item.submitted.pretest) && !data.item.is_late.pretest"
                  :target="'test-pretest' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Lihat Jawaban
                </b-tooltip>

                <b-button
                  v-if="(data.item.test_id.pretest_id && data.item.submitted.pretest) && data.item.is_late.pretest"
                  :id="'late-pretest' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-warning"
                  style="min-width: 75px;"
                  @click="onShowClick(data)"
                >
                  {{ data.item.grade.pretest }}
                </b-button>
                <b-tooltip
                  v-if="(data.item.test_id.pretest_id && data.item.submitted.pretest) && data.item.is_late.pretest"
                  :target="'late-pretest' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Lihat Jawaban<br>(Submit Terlambat)
                </b-tooltip>

                <b-button
                  v-if="!data.item.test_id.pretest_id || !data.item.submitted.pretest"
                  :id="'null-pretest' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-danger"
                  style="min-width: 75px;"
                >
                  -
                </b-button>
                <b-tooltip
                  v-if="!data.item.test_id.pretest_id || !data.item.submitted.pretest"
                  :target="'null-pretest' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Tes Belum Dimulai
                </b-tooltip>
              </template>
              <template v-slot:cell(journal)="data">
                <b-button
                  v-if="(data.item.test_id.journal_id && data.item.submitted.journal) && !data.item.is_late.journal"
                  :id="'test-journal' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-info"
                  style="min-width: 75px;"
                  @click="onShowClick(data)"
                >
                  {{ data.item.grade.journal }}
                </b-button>
                <b-tooltip
                  v-if="(data.item.test_id.journal_id && data.item.submitted.journal) && !data.item.is_late.journal"
                  :target="'test-journal' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Lihat Jawaban
                </b-tooltip>

                <b-button
                  v-if="(data.item.test_id.journal_id && data.item.submitted.journal) && data.item.is_late.journal"
                  :id="'late-journal' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-warning"
                  style="min-width: 75px;"
                  @click="onShowClick(data)"
                >
                  {{ data.item.grade.journal }}
                </b-button>
                <b-tooltip
                  v-if="(data.item.test_id.journal_id && data.item.submitted.journal) && data.item.is_late.journal"
                  :target="'late-journal' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Lihat Jawaban<br>(Submit Terlambat)
                </b-tooltip>

                <b-button
                  v-if="!data.item.test_id.journal_id || !data.item.submitted.journal"
                  :id="'null-journal' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-danger"
                  style="min-width: 75px;"
                >
                  -
                </b-button>
                <b-tooltip
                  v-if="!data.item.test_id.journal_id || !data.item.submitted.journal"
                  :target="'null-journal' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Tes Belum Dimulai
                </b-tooltip>
              </template>
              <template v-slot:cell(posttest)="data">
                <b-button
                  v-if="(data.item.test_id.posttest_id && data.item.submitted.posttest) && !data.item.is_late.posttest"
                  :id="'test-posttest' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-info"
                  style="min-width: 75px;"
                  @click="onShowClick(data)"
                >
                  {{ data.item.grade.posttest }}
                </b-button>
                <b-tooltip
                  v-if="(data.item.test_id.posttest_id && data.item.submitted.posttest) && !data.item.is_late.posttest"
                  :target="'test-posttest' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Lihat Jawaban
                </b-tooltip>

                <b-button
                  v-if="(data.item.test_id.posttest_id && data.item.submitted.posttest) && data.item.is_late.posttest"
                  :id="'late-posttest' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-warning"
                  style="min-width: 75px;"
                  @click="onShowClick(data)"
                >
                  {{ data.item.grade.posttest }}
                </b-button>
                <b-tooltip
                  v-if="(data.item.test_id.posttest_id && data.item.submitted.posttest) && data.item.is_late.posttest"
                  :target="'late-posttest' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Lihat Jawaban<br>(Submit Terlambat)
                </b-tooltip>

                <b-button
                  v-if="!data.item.test_id.posttest_id || !data.item.submitted.posttest"
                  :id="'null-posttest' + data.index"
                  type="submit" 
                  size="sm" 
                  variant="outline-danger"
                  style="min-width: 75px;"
                >
                  -
                </b-button>
                <b-tooltip
                  v-if="!data.item.test_id.posttest_id || !data.item.submitted.posttest"
                  :target="'null-posttest' + data.index"
                  variant="dark"
                  placement="right"
                >
                  Tes Belum Dimulai
                </b-tooltip>
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
    </div>
  </Layout>
</template>