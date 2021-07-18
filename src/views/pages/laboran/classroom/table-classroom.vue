<script>
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";

/**
 * Orders Component
 */
export default {
  components: {
    //
  },
  validations: {
    dataEdit: {
      name: { required },
      academic_year: { required },
      semester: { required },
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      //list classroom
      isFentchingData: false,
      dataClassrooms: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "name",
      sortDesc: false,
      fields: [
        { key: "name", sortable: true, label: "Nama Kelas" },
        { key: "semester", sortable: true, label: "Semester" },
        { key: "academic_year", sortable: true, label: "Tahun Akademik" },
        { key: "action", sortable: false }
      ],

      //modal edit
      idDataEdit: "",
      dataEdit: { 
          name: "",
          academic_year: "", 
          semester: "",
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
      return this.dataClassrooms;
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
      console.log("fentching data")

      const params = this.getRequestParams(
        this.filter,
        this.currentPage,
        this.perPage,
        this.sortBy,
        this.sortDesc
      );
      return (
        api.getAllClassrooms(params)
          .then(response => {
            this.isFentchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataClassrooms = response.data.data;
            if (this.dataClassrooms){
                this.setData(this.dataClassrooms);
            }
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
          text: data.item.name + " will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!"
      }).then(result => {
          if (result.value) {
              this.deleteClassroom(data.item.id, data.item.name);
          }
      });
    },

    deleteClassroom(id, name){
      return (
        api.deleteClassroom(id)
          .then(response => {
            Swal.fire("Deleted!", name + " has been deleted.", "success");
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

    onClickEdit(data){
      this.idDataEdit = data.item.id;
      this.dataEdit.name = data.item.name;
      this.dataEdit.academic_year = data.item.academic_year;
      this.dataEdit.semester = data.item.semester;

      this.$bvModal.show('modal-edit');
    },

    editClassroom(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } 
      else {
        return (
          api.editClassroom(this.idDataEdit, this.dataEdit)
            .then(response => {
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEdit.name + " has been edited.", "success");
              this.fetchData();
            })
            .catch(error => {
              console.log(error)

              this.submitted = false;
              this.hideModal();
              Swal.fire({
                type: 'error',
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
  }
};
</script>

<template>
  <div>
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
      <b-modal centered id="modal-edit" title="Edit Classroom" hide-footer title-class="font-18">
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="editClassroom">
          <div class="tab-pane" id="metadata">
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="name">Nama Kelas</label>
                    <input
                        v-model="dataEdit.name"
                        v-mask="'AA-##-##'"
                        id="name"
                        name="name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.dataEdit.name.$error }"
                    />
                    <span class="text-muted">e.g IF-42-03</span>
                    <div
                    v-if="submitted && !$v.dataEdit.name.required"
                    class="invalid-feedback"
                    >Nama Kelas is required.</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="semester">Semester</label>
                    <input 
                    v-model="dataEdit.semester"
                    id="semester" 
                    name="semester" 
                    type="number"
                    min="0"
                    class="form-control"
                    :class="{ 'is-invalid': submitted && $v.dataEdit.semester.$error }" />

                    <div
                    v-if="submitted && !$v.dataEdit.semester.required"
                    class="invalid-feedback"
                    >Semester is required.</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="academic_year">Tahun Akademik</label>
                    <input
                        v-model="dataEdit.academic_year"
                        id="academic_year"
                        name="academic_year"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.dataEdit.academic_year.$error }"
                    />
                    <div
                    v-if="submitted && !$v.dataEdit.academic_year.required"
                    class="invalid-feedback"
                    >Tahun Akademik is required.</div>
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