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

  },
  validations: {
    dataEdit: {
      nip: { required },
      name: { required },
      code: { required },
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      //list staff
      isFentchingData: false,
      dataStaffs: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "nip",
      sortDesc: false,
      fields: [
        { key: "nip", sortable: true, label: "NIP" },
        { key: "name", sortable: true, label: "Name" },
        { key: "code", sortable: true, label: "Kode Dosen" },
        { key: "action", sortable: false }
      ],

      //modal edit
      idDataEdit: "",
      dataEdit: { 
          nip: "",
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
      return this.dataStaffs;
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
      console.log("fentching data")

      const params = this.getRequestParams(
        this.filter,
        this.currentPage,
        this.perPage,
        this.sortBy,
        this.sortDesc
      );
      return (
        api.getAllStaffs(params)
          .then(response => {
            this.isFentchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataStaffs = response.data.data;
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
          text: data.item.nip + " will be deleted!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, delete it!"
      }).then(result => {
          if (result.value) {
              this.deleteStaff(data.item.id, data.item.nip);
          }
      });
    },

    deleteStaff(id, nip){
      return (
        api.deleteStaff(id)
          .then(response => {
            Swal.fire("Deleted!", nip + " has been deleted.", "success");
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
      this.dataEdit.nip = data.item.nip;
      this.dataEdit.code = data.item.code;
      this.dataEdit.name = data.item.name;
      this.$bvModal.show('modal-edit');
    },

    editStaff(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } 
      else {
        return (
          api.editStaff(this.idDataEdit, this.dataEdit)
            .then(response => {
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEdit.nip + " has been edited.", "success");
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
      <b-modal 
        size="lg" 
        id="modal-edit" 
        title="Edit Staff" 
        hide-footer 
        title-class="font-18"
      >
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="editStaff">
          <div class="tab-pane" id="metadata">
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nip">NIP</label>
                    <input 
                    style="background-color: #F0F4F6;"
                    :disabled="true"
                    v-model="dataEdit.nip"
                    id="nip" 
                    name="nip" 
                    type="number" 
                    class="form-control"
                    :class="{ 'is-invalid': submitted && $v.dataEdit.nip.$error }" />

                    <div
                    v-if="submitted && !$v.dataEdit.nip.required"
                    class="invalid-feedback"
                    >NIP is required.</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nama">Nama Dosen</label>
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
                    >Nama Dosen is required.</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="code">Kode Dosen</label>
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