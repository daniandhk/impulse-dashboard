<script>
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

/**
 * Orders Component
 */
export default {
  components: {
      Multiselect,
  },
  validations: {
    dataEdit: {
      nim: { required },
      name: { required },
      gender: { required },
      religion: { required },
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      //list student
      isFetchingData: false,
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
        { key: "name", sortable: true, label: "Nama" },
        { key: "gender", sortable: true, label: "Gender" },
        { key: "religion", sortable: true, label: "Religion" },
        { key: "action", sortable: false }
      ],

      //modal edit
      idDataEdit: "",
      dataEdit: { 
          nim: "",
          name: "",
          gender: "",
          religion: "",
          },
      submitted: false,

      religionData: ['islam', 'protestan', 'katolik', 'buddha', 'hindu', 'khonghucu', 'kristen'],
      genderData: ['male', 'female'],

      //edit role
      roleData: ['asprak', 'aslab'],
      role_data: [],
      dataEditRole: {
          no_induk: "",
          student: 0,
          asprak: 0,
          aslab: 0,
          staff: 0,
          laboran: 0,
          dosen: 0,
      },
      main_role: "student",
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
        api.getAllStudents(params)
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

    handleSearch(value){
      this.filter = value;
      this.fetchData();
    },

    async refreshData(){
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
    },

    onClickDelete(data){
      Swal.fire({
          title: "Anda yakin?",
          text: data.item.nim + " akan dihapus!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, hapus!"
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
            Swal.fire("Berhasil dihapus!", nim + " telah terhapus.", "success");
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
      //edit data
      this.idDataEdit = data.item.id;
      this.dataEdit.nim = data.item.nim;
      this.dataEdit.name = data.item.name;
      this.dataEdit.gender = data.item.gender;
      this.dataEdit.religion = data.item.religion;

      //edit role
      this.dataEditRole.no_induk = data.item.nim;
      this.getRoles(this.dataEditRole.no_induk);
      this.setRoles(this.role_data, this.dataEditRole);

      this.$bvModal.show('modal-edit');
    },

    editStudent(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } 
      else {
        return (
          api.editStudent(this.idDataEdit, this.dataEdit)
            .then(response => {
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEdit.nim + " has been edited.", "success");
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

    getRoles(no_induk){
        return (
          api.getRoles(no_induk)
            .then(response => {
              if(response.data.data){
                  this.role_data = response.data.data.roles
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

    setRoles(role_data, dataEditRole){
        if (role_data.includes("student") == false){
            role_data.push("student");
        }
        role_data.forEach((element, index, array) => {
            if (element == "student") {
                dataEditRole.student = 1
            }
            if (element == "asprak") {
                dataEditRole.asprak = 1
            }
            if (element == "aslab") {
                dataEditRole.aslab = 1
            }
            if (element == "staff") {
                dataEditRole.staff = 1
            }
            if (element == "laboran") {
                dataEditRole.laboran = 1
            }
            if (element == "dosen") {
                dataEditRole.dosen = 1
            }
        });
    },

    editRole(){
        this.setRoles(this.role_data, this.dataEditRole);
        return (
          api.setRoles(this.dataEditRole)
            .then(response => {
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEdit.nim + " has been edited.", "success");
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
    },

    removeRole(value){
        if (value == "student") {
            this.role_data.push("student");
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
        title="Edit Student" 
        hide-footer 
        title-class="font-18"
      >
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs nav-class="nav-tabs-custom">
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Edit Data</a>
                </template>
                <template>
                    <div class='mt-4'>
                        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="editStudent">
                        <div class="tab-pane" id="metadata">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="nim">NIM</label>
                                    <input 
                                    style="background-color: #F0F4F6;"
                                    :disabled="true"
                                    v-model="dataEdit.nim"
                                    id="nip" 
                                    name="nip" 
                                    type="number" 
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataEdit.nim.$error }" />

                                    <div
                                    v-if="submitted && !$v.dataEdit.nim.required"
                                    class="invalid-feedback"
                                    >NIM harus diisi!</div>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="nama">Nama Mahasiswa</label>
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
                                    >Nama Dosen harus diisi!</div>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label class="control-label">Jenis Kelamin</label>
                                    <multiselect
                                        v-model="dataEdit.gender"
                                        :options="genderData"
                                        :show-labels="false"
                                        :class="{ 'is-invalid': submitted && $v.dataEdit.gender.$error }" 
                                    ></multiselect>
                                        <div
                                        v-if="submitted && !$v.dataEdit.gender.required"
                                        class="invalid-feedback"
                                        >Jenis Kelamin harus diisi!</div>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label class="control-label">Agama</label>
                                    <multiselect
                                        v-model="dataEdit.religion"
                                        :options="religionData"
                                        :show-labels="false"
                                        :class="{ 'is-invalid': submitted && $v.dataEdit.religion.$error }" 
                                    ></multiselect>
                                        <div
                                        v-if="submitted && !$v.dataEdit.religion.required"
                                        class="invalid-feedback"
                                        >Agama harus diisi!</div>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button
                                type="submit"
                                class="btn btn-primary mr-2 waves-effect waves-light"
                                >Simpan</button>
                                <button type="button" @click="hideModal" class="btn btn-light waves-effect">Batalkan</button>
                            </div>
                        </div>
                        </form>
                    </div>
                </template>
              </b-tab>
              <b-tab title-link-class="p-3">
                  <template v-slot:title>
                      <a class="font-weight-bold active">Edit Roles</a>
                  </template>
                  <template>
                    <div class='mt-4'>
                        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="editRole">
                        <div class="tab-pane" id="metadata">
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label class="control-label">Roles</label>
                                    <multiselect
                                        v-model="role_data"
                                        :options="roleData"
                                        :multiple="true"
                                        @remove="removeRole"
                                        :show-labels="false"
                                    ></multiselect>
                                </div>
                            </div>
                            <div class="text-center mt-4">
                                <button
                                type="submit"
                                class="btn btn-primary mr-2 waves-effect waves-light"
                                >Simpan</button>
                                <button type="button" @click="hideModal" class="btn btn-light waves-effect">Batalkan</button>
                            </div>
                        </div>
                        </form>
                    </div>
                </template>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>