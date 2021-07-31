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
      //list class-course
      isFentchingData: false,
      dataClassCourses: [],
      dataTable: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filter_search: "",
      filterOn: [],
      sortBy: "class.name",
      sortDesc: false,
      fields: [
        { key: "class.name", sortable: true, label: "Nama Kelas" },
        { key: "course.name", sortable: true, label: "Nama MK" },
        { key: "staff.name", sortable: true, label: "Nama Dosen" },
        { key: "academic_year.semester", sortable: true, label: "Semester" },
        { key: "academic_year.name", sortable: true, label: "Tahun Akademik" },
        { key: "action", sortable: false }
      ],

      namaKelasData: [],
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
    getRequestParams(kelas) {
      let params = {};

      if (kelas) {
        params["kelas"] = kelas;
      }

      return params;
    },
    fetchData(){
      this.loadDataDropdown();
      this.isFentchingData = true;
      console.log("fentching data")

      const params = this.getRequestParams(
        this.filter,
      );

      return (
        api.getAllClassCourses(params)
          .then(response => {
            if (response.data.data){
              this.totalRows = response.data.data.length;
              this.dataClassCourses = response.data.data;
            }
            this.isFentchingData = false;
          })
          .catch(error => {
            console.log(error)
            this.isFentchingData = false;
          })
      )
    },

    setKelas(value) {
      this.filter = value.name;
      this.fetchData();
    },

    removeKelas() {
      this.filter = "";
      this.fetchData();
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

    handlePageChange(value) {
      this.currentPage = value;
      this.fetchData();
    },

    handlePageSizeChange(value) {
      this.perPage = value;
      this.currentPage = 1;
      this.fetchData();
    },

    refreshData(){
      this.filter = "";
      this.fetchData();
    },

    onClickDelete(data){
      Swal.fire({
          title: "Are you sure?",
          text: data.item.class.name + " | " + data.item.course.name + " will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!"
      }).then(result => {
          if (result.value) {
              this.deleteClassCourse(data.item.id, data.item.class.name, data.item.course.name);
          }
      });
    },

    deleteClassCourse(id, class_name, course_name){
      return (
        api.deleteClassCourse(id)
          .then(response => {
            Swal.fire("Deleted!", class_name + " | " + course_name + " has been deleted.", "success");
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
                v-model="filter"
                :options="namaKelasData"
                label="name"
                track-by="name"
                @select="setKelas"
                @remove="removeKelas"
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
        :busy.sync="isFentchingData"
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