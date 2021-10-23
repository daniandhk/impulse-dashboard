<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";

/**
 * Orders Component
 */
export default {
  components: {
    Multiselect,
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      //list class-course
      isFetchingData: false,
      dataClassCourses: [],
      dataTable: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter_search: "",
      filterOn: [],
      sortBy: "class.name",
      sortDesc: false,
      fields: [
        { key: "class.name", sortable: true, label: "Nama Kelas" },
        { key: "course.code", sortable: true, label: "Kode MK" },
        { key: "course.name", sortable: true, label: "Nama MK" },
        { key: "staff.name", sortable: true, label: "Nama Dosen" },
        { key: "academic_year.semester", sortable: true, label: "Semester" },
        { key: "academic_year.name", sortable: true, label: "Tahun Akademik" },
        { key: "action", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
      ],

      class_name: "",
      course_name: "",
      academic_year_id: "",
      course_data: "",
      course_code: "",
      class_data: "",
      dataDropdown:{
          classes: [],
          courses: [],
          staffs: [],
          academic_year: [],
      },

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
      return this.dataClassCourses;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  mounted: async function() {
    // Set the initial number of items
    this.loading();
    await this.fetchData().then(result=>{
        this.loading();
    });
    this.loadDataDropdown();
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
    fetchData(){
      this.loadDataDropdown();
      this.isFetchingData = true;

      const params = this.getRequestParams(
        this.class_name,
        this.course_name,
        this.academic_year_id,
      );

      return (
        api.getAllClassCourses(params)
          .then(response => {
            if (response.data.data){
              this.totalRows = response.data.data.length;
              this.dataClassCourses = response.data.data;
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
        this.isCourseSelected = true;
        this.course_code = value.code;
        this.course_name = value.name;
        this.loading();
        await this.fetchData().then(result=>{
            this.loading();
        });
    },

    async removeCourse(){
        this.isCourseSelected = false;
        this.course_code = "";
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

    async refreshData(){
      this.filter = "";
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    onClickDelete(data){
      Swal.fire({
          title: "Anda yakin?",
          text: data.item.class.name + " | " + data.item.course.name + " akan dihapus!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, hapus!"
      }).then(result => {
          if (result.value) {
              this.deleteClassCourse(data.item.id, data.item.class.name, data.item.course.name);
          }
      });
    },

    async deleteClassCourse(id, class_name, course_name){
      return (
        api.deleteClassCourse(id)
          .then(response => {
            Swal.fire("Berhasil dihapus!", class_name + " | " + course_name + " telah terhapus.", "success");
            this.loading();
            this.fetchData().then(result=>{
                this.loading();
            });
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
  <div>
    <div id="loading" style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <b-spinner style="width: 3rem; height: 3rem;" class="m-2" variant="warning" role="status"></b-spinner>
    </div>
    <div class="row mt-4">
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
                :show-labels="false"
            ></multiselect>
          </div>
        </div>
        <div class="col-sm-12 col-md-4">
          <div class="form-group">
            <multiselect
                placeholder="Mata Kuliah"
                v-model="course_data"
                :options="dataDropdown.courses"
                label="name"
                track-by="name"
                @select="selectCourse"
                @remove="removeCourse"
                :show-labels="false"
            ></multiselect>
          </div>
        </div>
        <div class="col-sm-12 col-md-2">
          <div class="form-group">
            <input
                v-if="isCourseSelected"
                v-model="course_code"
                :disabled="true"
                class="form-control text-center"
                type="text"
                style="background-color: #F0F4F6;"
            >
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
          <a
            href="javascript:void(0);"
            @click=onClickDelete(data)
            class="text-danger"
            v-b-tooltip.hover
            title="Delete"
          >
            <i class="mdi mdi-trash-can font-size-18"></i>
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
</template>