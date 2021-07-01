<script>
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
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
      //list students
      isFentchingData: false,
      dataStudents: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "nim",
      sortDesc: false,
      fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
        { key: "class_name", sortable: true, label: "Kelas MK" },
        { key: "course_code", sortable: true, label: "Kode MK" },
        { key: "course_name", sortable: true, label: "Nama MK" },
        { key: "staff_code", sortable: true, label: "Kode Dosen" },
        { key: "academic_year", sortable: true, label: "Tahun Ajaran" },
        { key: "semester", sortable: true, label: "Semester" },
        { key: "action", sortable: false }
      ],

      courseData: [],
      kelasData: [],
      namaKelasData: [],
      isKelasNotSelected: true,

      //v-model dropdown value = array of objects
      course_data: "",
      class_data: "",

      filter_course: "",
      filter_class: "",
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
  mounted() {
    // Set the initial number of items
    this.fetchData();

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

      if (search) {
        params["search"] = search;
      }

      if (kelas) {
        params["kelas"] = kelas;
      }

      if (course) {
        params["course"] = course;
      }

      if (page) {
        params["page"] = page;
      }

      if (pageSize) {
        params["per_page"] = pageSize;
      }

      if (orderBy) {
        params["orderBy"] = orderBy;
      }

      if (sortDesc) {
        params["sortedBy"] = "DESC";
      } else {
        params["sortedBy"] = "ASC";
      }

      return params;
    },
    fetchData(){
      this.isFentchingData = true;
      console.log("fentching data")

      let class_name = (this.class_data) ? this.class_data.name : "";
      let course_name = (this.course_data) ? this.course_data.name : "";

      const params = this.getRequestParams(
        this.filter,
        class_name,
        course_name,
        this.currentPage,
        this.perPage,
        this.sortBy,
        this.sortDesc
      );
      return (
        api.getAllStudents(params)
          .then(response => {
            this.isFentchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataStudents = response.data.data;
          })
          .catch(error => {
            this.isFentchingData = false;
            console.log(error)
          })
      )
    },

    handlePageChange(value) {
      this.currentPage = value;
      this.fetchData();
    },

    handlePageSizeChange(value) {
      this.perPage = value;
      this.currentPage = 1;
      this.fetchData();
    },

    handleSortingChange(value){
      if(value.sortBy !== this.sortBy) {
        this.sortDesc = false
      } 
      else {
        if(this.sortDesc) {
          this.sortDesc = false
        } 
        else {
          this.sortDesc = true
        }
      }
      this.sortBy = value.sortBy;
      this.fetchData();
    },

    handleSearch(value){
      this.filter = value;
      this.fetchData();
    },

    refreshData(){
      this.fetchData();
    },

    onClickDelete(data){
      Swal.fire({
          title: "Are you sure?",
          text: data.item.nim + " will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!"
      }).then(result => {
          if (result.value) {
              this.deleteStudent(data.item.id, data.item.nim);
          }
      });
    },

    deleteStudent(id, nim){
      return (
        api.deleteStudent(id)
          .then(response => {
            console.log(response)

            Swal.fire("Deleted!", nim + " has been deleted.", "success");
            this.fetchData();
          })
          .catch(error => {
            console.log(error)
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: error
            })
          })
      )
    },

    loadDataDropdown(){
        this.getClassroomNames();
    },

    getClassroomNames(){
        return (
            api.getByNameClassrooms()
            .then(response => {
                if(response.data.classes){
                    this.namaKelasData = response.data.classes;
                }
            })
            .catch(error => {
                console.log(error)
            })
        )
    },

    async getDataClassrooms(namaKelasData){
        const params = this.getRequestParams(
                namaKelasData.name
        );
        return api.getListClassrooms(params)
            .then(response => {
                if (response.data.classes){
                    this.kelasData = response.data.classes;
                }
            })
            .catch(error => {
                console.log(error)
            })
    },

    async getDataCourses(kelasData){
        return new Promise((resolve, reject) => {
            kelasData.forEach((element, index, array) => {
                const params = this.getRequestParams(
                    element.course_id
                );
                api.getListCourses(params)
                    .then(response => {
                        if (response.data.courses){
                            this.courseData = response.data.courses
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
                if (index === array.length -1) resolve();
            });
        })
        .catch(error => {
            console.log(error)
        });
    },

    async setKelas(value){
        this.class_data = value;
        this.removeCourse();

        await this.getDataClassrooms(value);
        await this.getDataCourses(this.kelasData);

        this.isKelasNotSelected = false;
    },

    async setCourse(value){
        this.course_data = value;
        this.fetchData();
    },

    removeKelas(){
        this.isKelasNotSelected = true;
        this.class_data = "";
        this.courseData = [];
        this.removeCourse();
    },

    removeCourse(){
        this.course_data = "";
        this.fetchData();
    },
  }
};
</script>

<template>
  <div>
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
                :options="namaKelasData"
                label="name"
                track-by="name"
                @select="setKelas"
                @remove="removeKelas"
            ></multiselect>
          </div>
        </div>
        <div class="col-sm-12 col-md-3">
          <div class="form-group">
            <multiselect
                placeholder="Nama Mata Kuliah"
                v-model="course_data"
                :options="loadCourseData"
                :disabled="isKelasNotSelected"
                label="name"
                track-by="name"
                @select="setCourse"
                @remove="removeCourse"
            ></multiselect>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-2">
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
              v-model="filter"
              @input="handleSearch"
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
        :per-page="0"
        :busy.sync="isFentchingData"
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