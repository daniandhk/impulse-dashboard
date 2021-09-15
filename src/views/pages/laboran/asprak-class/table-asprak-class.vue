<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";
// import Multiselect from "vue-multiselect";

/**
 * Orders Component
 */
export default {
  components: {
    // Multiselect,
  },
  validations: {
    dataEdit: {
      student_id: { required },
      class_id: { required },
    },
    dataEditDetail: {
      nim: { required },
      class_name: { required },
      course_name: { required },
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      //list students
      isFetchingData: false,
      dataStudents: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "class_course.classes.name",
      sortDesc: false,
      fields: [
        { key: "student.nim", sortable: false, label: "NIM" },
        { key: "student.name", sortable: false, label: "Name" },
        { key: "class_course.classes.name", sortable: false, label: "Kelas MK" },
        { key: "class_course.courses.code", sortable: false, label: "Kode MK" },
        { key: "class_course.courses.name", sortable: false, label: "Nama MK" },
        { key: "class_course.staffs.code", sortable: false, label: "Kode Dosen" },
        { key: "class_course.academic_years.semester", sortable: false, label: "Semester" },
        { key: "class_course.academic_years.year", sortable: false, label: "Tahun Akademik" },
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
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.totalRows;
    },
    datas() {
      return this.dataStudents;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    loadCourseData() {
        return this.courseData;
    }
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
    getRequestParams(search, kelas, course, page, pageSize, orderBy, sortDesc) {
      let params = {};

      // if (search) {
      //   params["search"] = search;
      // }

      // if (kelas) {
      //   params["kelas"] = kelas;
      // }

      // if (course) {
      //   params["course"] = course;
      // }

      if (page) {
        params["page"] = page;
      }

      if (pageSize) {
        params["per_page"] = pageSize;
      }

      // if (orderBy) {
      //   params["orderBy"] = orderBy;
      // }

      // if (sortDesc) {
      //   params["sortedBy"] = "DESC";
      // } else {
      //   params["sortedBy"] = "ASC";
      // }

      return params;
    },
    fetchData(){
      this.loadDataDropdown();
      this.isFetchingData = true;

      const params = this.getRequestParams(
        this.filter,
        this.class_name,
        this.course_name,
        this.currentPage,
        this.perPage,
        this.sortBy,
        this.sortDesc
      );
      return (
        api.getAllAsprakClasses(params)
          .then(response => {
            this.isFetchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataStudents = response.data.data;
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

    // async handleSortingChange(value){
    //   if(value.sortBy !== this.sortBy) {
    //     this.sortDesc = false
    //   } 
    //   else {
    //     if(this.sortDesc) {
    //       this.sortDesc = false
    //     } 
    //     else {
    //       this.sortDesc = true
    //     }
    //   }
    //   this.sortBy = value.sortBy;
    //   this.loading();
    //   await this.fetchData().then(result=>{
    //       this.loading();
    //   });
    // },

    // async handleSearch(value){
    //   this.filter = value;
    //   this.loading();
    //   await this.fetchData().then(result=>{
    //       this.loading();
    //   });
    // },

    async refreshData(){
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    onClickDelete(data){
      Swal.fire({
          title: "Are you sure?",
          text: data.item.student.nim + " will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!"
      }).then(result => {
          if (result.value) {
              this.deleteAsprakClass(data.item.id, data.item.student.nim);
          }
      });
    },

    deleteAsprakClass(id, nim){
      return (
        api.deleteAsprakClass(id)
          .then(response => {
            Swal.fire("Deleted!", nim + " has been deleted.", "success");
            this.loading();
            this.fetchData().then(result=>{
                this.loading();
            });
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

    hideModal(){
      this.$bvModal.hide('modal-edit');
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
    <!-- <div class="row mt-4">
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
    </div> -->
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
      <!-- <div class="col-sm-12 col-md-6">
        <div id="tickets-table_filter" class="dataTables_filter text-md-right">
          <label class="d-inline-flex align-items-center">
            Search:
            <b-form-input
              v-model="filter"
              @input="handleSearch"
              type="search"
              class="form-control form-control-sm ml-2"
            ></b-form-input>
          </label>
        </div>
      </div> -->
      <!-- End search -->
    </div>
    <div class="table-responsive">
      <b-table
        ref="table"
        class="table-centered"
        :items="datas"
        :fields="fields"
        responsive="sm"
        :per-page="0"
        :busy.sync="isFetchingData"
        :current-page="currentPage"
        @sort-changed="handleSortingChange"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
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