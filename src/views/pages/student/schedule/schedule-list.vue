<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';

/**
 * Orders Component
 */
export default {
  page: {
    title: "List Course",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      title: "List Course",
      items: [
        {
          text: "Praktikan",
          href: "/"
        },
        {
          text: "Jadwal",
          href: "/praktikan/schedule/calendar"
        },
        {
          text: "Mata Kuliah",
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
        { key: "module.index", sortable: true, label: "Modul" },
        { key: "class_course.course.code", label: "Kode Mata Kuliah" },
        { key: "title", label: "Nama Kalender" },
        { key: "date", sortable: true, label: "Tanggal" },
        { key: "start", sortable: true, label: "Mulai" },
        { key: "end", sortable: true, label: "Terakhir" },
        { key: "room.name", label: "Ruangan" },
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
  mounted: async function() {
    // Set the initial number of items
    this.totalRows = this.dataSchedules.length;
    this.perPage = this.dataSchedules.length;
    // Set the initial number of items
    await this.getStudentCourses();
    await this.refreshData(0);
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                })
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                })
            })
        );
    },

    async refreshData(index){
        this.isFetchingData = true;
        if(this.dataClassCourses.length){
            this.loading();
            this.class_course_data = this.dataClassCourses[index];
            let class_course_id = this.class_course_data.class_course_id;
            await this.getSchedules(class_course_id).then(response =>{
                this.loading();
            })
        }
        this.isFetchingData = false;
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
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div id="loading" style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <b-spinner style="width: 3rem; height: 3rem;" class="m-2" variant="warning" role="status"></b-spinner>
    </div>
    <div class="row" v-if="dataClassCourses.length">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs nav-class="nav-tabs-custom" @input="refreshData">
              <b-tab title-link-class="p-3" v-for="(course, index) in dataClassCourses" :key="index">
                <template v-slot:title> 
                  <a class="font-weight-bold active ml-sm-5 mr-lg-5" >{{course.course_name}}</a>
                </template>
                <div class="row"></div>
                <div class="row mt-4">
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>Kelas</label>
                            <input
                                v-model="class_course_data.class_name"
                                type="text"
                                class="form-control"
                                disabled="true"
                                style="background-color: #F0F4F6;"
                            />
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>Mata Kuliah</label>
                            <input
                                v-model="class_course_data.course_name"
                                type="text"
                                class="form-control"
                                disabled="true"
                                style="background-color: #F0F4F6;"
                            />
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>Kode Dosen</label>
                            <input
                                v-model="class_course_data.staff_code"
                                type="text"
                                class="form-control"
                                disabled="true"
                                style="background-color: #F0F4F6;"
                            />
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>Tahun / Semester</label>
                            <input
                                v-model="class_course_data.academic_year"
                                type="text"
                                class="form-control"
                                disabled="true"
                                style="background-color: #F0F4F6;"
                            />
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
                    @filtered="onFiltered"
                    :busy.sync="isFetchingData"
                  >
                  </b-table>
                </div>
                <!-- <div class="row">
                  <div class="col">
                    <div class="dataTables_paginate paging_simple_numbers float-right">
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
    <div class="row" v-if="!dataClassCourses.length">
    </div>
  </Layout>
</template>