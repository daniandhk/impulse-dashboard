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
        { key: "action", label: "Aksi", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
      ],

      class_name: "",
      course_name: "",
      academic_year_id: "",
      course_data: null,
      course_code: "",
      class_data: null,
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
  created() {
    document.body.classList.add("auth-body-bg");
  },
  mounted: async function() {
    this.loading(true);
    await this.fetchData();
    this.loadDataDropdown();
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

    async refreshData(){
      this.loading(true);
      this.filter = "";
      await this.fetchData();
      this.loading(false);
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
            this.loading(true);
            this.fetchData();
            this.loading(false);
            Swal.fire("Berhasil dihapus!", class_name + " | " + course_name + " telah terhapus.", "success");
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

    resetFilter(){
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
  }
};
</script>

<template>
  <div>
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
          v-if="(course_data != null || class_data != null)"
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
        <template v-slot:cell(action)="data">
          <a
            v-b-tooltip.hover
            href="javascript:void(0);"
            class="m-1 text-danger"
            title="Delete"
            @click="onClickDelete(data)"
          >
            <i class="mdi mdi-trash-can font-size-18" />
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
</template>