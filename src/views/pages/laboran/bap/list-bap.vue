<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';

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
      title: "Berita Acara Praktikum",
      items: [
        {
          text: "Laboran",
          href: "/"
        },
        {
          text: "BAP",
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
      sortBy: "class_course.class.name",
      sortDesc: false,
      fields: [
        { key: "title", sortable: true, label: "Name" },
        { key: "class_course.class.name", sortable: true, label: "Kelas" },
        { key: "class_course.course.name", sortable: true, label: "Mata Kuliah" },
        { key: "date", sortable: true, label: "Tanggal" },
        { key: "start", sortable: true, label: "Jam Mulai" },
        { key: "end", sortable: true, label: "Jam Terakhir" },
        { key: "class_course.staff.code", sortable: true, label: "Kode Dosen" },
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
        api.getListBap(params)
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

    /**
     * Modal open for deta event
     */
    async onClickEdit(data) {
      if(data.item.is_present){
        this.$router.push({
            name: 'laboran-bap-detail', 
            params: { id: data.item.id }
        });
      }
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
            <hr style="margin-left: -28px; 
                        margin-right: -28px; 
                        height: 2px; 
                        background-color: #eee; 
                        border: 0 none; 
                        color: #eee;"
            >
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
                    <b-button
                        v-if="data.item.is_present" 
                        type="submit" 
                        variant="primary"
                        @click=onClickEdit(data)
                        style="min-width: 75px;" 
                        >Show
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
  </Layout>
</template>
