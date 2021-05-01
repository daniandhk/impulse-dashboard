<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import InputStudent from "./input-student";
import Swal from "sweetalert2";

/**
 * Orders Component
 */
export default {
  components: {
    Layout,
    PageHeader,
    InputStudent
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      title: "Student Data",
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Student Data",
          active: true
        }
      ],

      //list students
      isFentchingData: false,
      dataStudents: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 15,
      pageOptions: [15, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "nim",
      sortDesc: false,
      fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
        { key: "class_name", sortable: true, label: "Kelas MK" },
        { key: "gender", sortable: true, label: "Gender" },
        { key: "religion", sortable: true, label: "Religion" },
        { key: "course_code", sortable: true, label: "Kode MK" },
        { key: "course_name", sortable: true, label: "Nama MK" },
        { key: "staff_code", sortable: true, label: "Kode Dosen" },
        { key: "academic_year", sortable: true, label: "Tahun Ajaran" },
        { key: "semester", sortable: true, label: "Semester" },
        { key: "action" }
      ],
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
  },
  mounted() {
    // Set the initial number of items
    this.fetchData();
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
    getRequestParams(search, page, pageSize, orderBy, sortDesc) {
      let params = {};

      if (search) {
        params["search"] = search;
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
      console.log("fentching")

      const params = this.getRequestParams(
        this.filter,
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

    refreshData(value){
      console.log(value)
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

    //export to excel
    getDate(){
      const d = new Date();
      const date = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
          
      this.todayDate = "[" + date + "/" + month + "/" + year + "]";
    },
    
    getAllData(){
      this.getDate();
      console.log("All Dataaa")
      const params = this.getRequestParams(
        null,
        1,
        this.totalRows,
        this.sortBy,
        this.sortDesc
      );
      return (
        api.getAllStudents(params)
          .then(response => {
            this.allDatasArray = response.data.data;
          })
          .catch(error => {
            console.log(error)
            this.allDatasArray = [];
          })
      )
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs nav-class="nav-tabs-custom" @input="refreshData">
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">All Students</a>
                </template>
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
                    :current-page="currentPage"
                    @sort-changed="handleSortingChange"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(action)="data">
                      <center>
                      <a
                        href="javascript:void(0);"
                        @click=onClickDelete(data)
                        class="text-danger"
                        v-b-tooltip.hover
                        title="Delete"
                      >
                        <i class="mdi mdi-trash-can font-size-18"></i>
                      </a>
                      </center>
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
              </b-tab>
              <InputStudent/>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>