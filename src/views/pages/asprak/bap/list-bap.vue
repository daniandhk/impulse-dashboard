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
  page: {
      title: "List BAP",
      meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  data() {
    return {
      title: "Berita Acara Praktikum",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "BAP",
          active: true,
        },
      ],

      asprak_id: store.getters.getLoggedUser.id,

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
        { key: "start", sortable: true, label: "Jam Mulai" },
        { key: "end", sortable: true, label: "Jam Terakhir" },
        { key: "class_course.staff.code", sortable: true, label: "Kode Dosen" },
        { key: "action", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
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
    getRequestParams(class_name, course_name, academic_year_id, asprak_id) {
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

      if (asprak_id) {
        params["asprak_id"] = asprak_id;
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
        this.asprak_id,
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
                text: 'Terjadi kesalahan!',
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
                    text: 'Terjadi kesalahan!',
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

    /**
     * Modal open for deta event
     */
    async onClickEdit(data) {
      if(data.item.is_present){
        this.$router.push({
            name: 'asprak-bap-detail', 
            params: { id: data.item.id }
        });
      }
      else{
        this.$router.push({
            name: 'asprak-bap-input', 
            params: { id: data.item.id }
        });
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
            <div class="col-sm-12 col-md-3">
              <div class="form-group">
                <multiselect
                  v-model="class_data"
                  placeholder="Kelas"
                  :options="dataDropdown.classes"
                  label="name"
                  track-by="name"
                  :show-labels="false"
                  @select="selectKelas"
                  @remove="removeKelas"
                />
              </div>
            </div>
            <div class="col-sm-12 col-md-3">
              <div class="form-group">
                <multiselect
                  v-model="course_data"
                  placeholder="Mata Kuliah"
                  :options="dataDropdown.courses"
                  label="name"
                  track-by="name"
                  :show-labels="false"
                  @select="selectCourse"
                  @remove="removeCourse"
                />
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
            <template v-slot:cell(action)="data">
              <b-button
                v-if="!data.item.is_present" 
                type="submit" 
                variant="success"
                style="min-width: 75px;"
                @click="onClickEdit(data)" 
              >
                Input
              </b-button>
              <b-button
                v-if="data.item.is_present" 
                type="submit" 
                variant="primary"
                style="min-width: 75px;"
                @click="onClickEdit(data)" 
              >
                Show
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
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
