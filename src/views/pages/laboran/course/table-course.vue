<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";

/**
 * Orders Component
 */
export default {
  components: {

  },
  validations: {
    dataEdit: {
      code: { required },
      name: { required },
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      //list course
      isFetchingData: false,
      dataCourses: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "code",
      sortDesc: false,
      fields: [
        { key: "code", sortable: true, label: "Kode Mata Kuliah" },
        { key: "name", sortable: true, label: "Nama Mata Kuliah" },
        { key: "action", sortable: false }
      ],

      //modal edit
      idDataEdit: "",
      dataEdit: { 
          code: "", 
          name: "",
          },
      submitted: false,
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
      return this.dataCourses;
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
      this.isFetchingData = true;

      const params = this.getRequestParams(
        this.filter,
        this.currentPage,
        this.perPage,
        this.sortBy,
        this.sortDesc
      );
      return (
        api.getAllCourses(params)
          .then(response => {
            this.isFetchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataCourses = response.data.data;
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

    async handleSortingChange(value){
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
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    async handleSearch(value){
      this.filter = value;
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    async refreshData(){
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    onClickDelete(data){
      Swal.fire({
          title: "Are you sure?",
          text: data.item.code + " will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!"
      }).then(result => {
          if (result.value) {
              this.deleteCourse(data.item.id, data.item.code);
          }
      });
    },

    deleteCourse(id, code){
      return (
        api.deleteCourse(id)
          .then(response => {
            Swal.fire("Deleted!", code + " has been deleted.", "success");
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

    onClickEdit(data){
      this.idDataEdit = data.item.id;
      this.dataEdit.code = data.item.code;
      this.dataEdit.name = data.item.name;
      this.$bvModal.show('modal-edit');
    },

    editCourse(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } 
      else {
        return (
          api.editCourse(this.idDataEdit, this.dataEdit)
            .then(response => {
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEdit.code + " has been edited.", "success");
              this.loading();
              this.fetchData().then(result=>{
                  this.loading();
              });
            })
            .catch(error => {
              this.submitted = false;
              this.hideModal();
              
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
              })
            })
        )
      }
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
            @click=onClickEdit(data)
            class="mr-3 text-primary"
            v-b-tooltip.hover
            title="Edit"
          >
            <i class="mdi mdi-pencil font-size-18"></i>
          </a>
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
    <div name="modalEdit">
      <b-modal 
        size="lg"
        id="modal-edit" 
        title="Edit Course" 
        hide-footer 
        title-class="font-18"
      >
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="editCourse">
          <div class="tab-pane" id="metadata">
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nim">Kode Mata Kuliah</label>
                    <input
                        v-model="dataEdit.code"
                        id="code"
                        name="code"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.dataEdit.code.$error }"
                    />
                    <div
                    v-if="submitted && !$v.dataEdit.code.required"
                    class="invalid-feedback"
                    >Kode Mata Kuliah is required.</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nama">Nama Mata Kuliah</label>
                    <input 
                    v-model="dataEdit.name"
                    id="nama" 
                    name="nama" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': submitted && $v.dataEdit.name.$error }" />

                    <div
                    v-if="submitted && !$v.dataEdit.name.required"
                    class="invalid-feedback"
                    >Nama Mata Kuliah is required.</div>
                </div>
            </div>
            <div class="text-center mt-4">
                <button
                type="submit"
                class="btn btn-primary mr-2 waves-effect waves-light"
                >Save Changes</button>
                <button type="button" @click="hideModal" class="btn btn-light waves-effect">Cancel</button>
            </div>
          </div>
        </form>
      </b-modal>
    </div>
  </div>
</template>