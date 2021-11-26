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
      nip: { required },
      name: { required },
      code: { required },
    },
  },
  data() {
    return {
      //list staff
      isFetchingData: false,
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
        { key: "name", sortable: true, label: "Nama" },
        { key: "code", sortable: true, label: "Kode Dosen" },
        { key: "action", label: "Aksi", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
      ],

      //modal edit
      idDataEdit: "",
      dataEdit: { 
          nip: "",
          code: "", 
          name: "",
          },
      submitted: false,

      //edit role
      roleData: ['laboran', 'dosen'],
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
      main_role: "staff",
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
  created() {
    document.body.classList.add("auth-body-bg");
  },
  mounted: async function() {
    this.loading(true);
    await this.fetchData();
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
        api.getAllStaffs(params)
          .then(response => {
            this.isFetchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataStaffs = response.data.data;
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

    async handleSortingChange(value){
      this.loading(true);
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
      await this.fetchData();
      this.loading(false);
    },

    async handleSearch(value){
      this.loading(true);
      this.filter = value;
      await this.fetchData();
      this.loading(false);
    },

    async refreshData(){
      this.loading(true);
      await this.fetchData();
      this.loading(false);
    },

    onClickDelete(data){
      Swal.fire({
          title: "Anda yakin?",
          text: data.item.nip + " akan dihapus!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, hapus!"
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
            this.loading(true);
            this.fetchData();
            this.loading(false);
            Swal.fire("Berhasil dihapus!", nip + " telah terhapus.", "success");
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

    onClickEdit(data){
      this.idDataEdit = data.item.id;
      this.dataEdit.nip = data.item.nip;
      this.dataEdit.code = data.item.code;
      this.dataEdit.name = data.item.name;

      //edit role
      this.dataEditRole.no_induk = data.item.nip;
      this.getRoles(this.dataEditRole.no_induk);
      this.setRoles(this.role_data, this.dataEditRole);

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
              this.loading(true);
              this.submitted = false;
              this.fetchData();
              this.loading(false);
              this.hideModal();
              Swal.fire("Berhasil diubah!", this.dataEdit.nip + " telah terubah.", "success");
            })
            .catch(error => {
              this.submitted = false;
              this.hideModal();
              
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

    setRoles(role_data, dataEditRole){
        if (role_data.includes("staff") == false){
            role_data.push("staff");
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
              this.loading(true);
              this.submitted = false;
              this.fetchData();
              this.loading(false);
              this.hideModal();
              Swal.fire("Berhasil diubah!", this.dataEdit.nip + " telah terubah.", "success");
            })
            .catch(error => {
              this.submitted = false;
              this.hideModal();
              
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

    removeRole(value){
        if (value == "staff") {
            this.role_data.push("staff");
        }
    },

    hideModal(){
      this.$bvModal.hide('modal-edit');
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
              v-model="filter"
              type="search"
              class="form-control form-control-sm ml-2"
              @input="handleSearch"
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
        :per-page="0"
        :busy.sync="isFetchingData"
        :current-page="currentPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter-included-fields="filterOn"
        :head-variant="'dark'"
        @sort-changed="handleSortingChange"
        @filtered="onFiltered"
      >
        <template v-slot:cell(action)="data">
          <a
            v-b-tooltip.hover
            href="javascript:void(0);"
            class="m-1 text-primary"
            title="Edit"
            @click="onClickEdit(data)"
          >
            <i class="mdi mdi-pencil font-size-18" />
          </a>
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
    <div name="modalEdit">
      <b-modal 
        id="modal-edit" 
        size="lg" 
        title="Edit Staff" 
        hide-footer 
        title-class="font-18"
      >
        <b-tabs nav-class="nav-tabs-custom">
          <b-tab title-link-class="p-3">
            <template v-slot:title>
              <a class="font-weight-bold active">Edit Data</a>
            </template>
            <template>
              <div class="mt-4">
                <form
                  class="form-horizontal col-sm-12 col-md-12"
                  @submit.prevent="editStaff"
                >
                  <div
                    id="metadata"
                    class="tab-pane"
                  >
                    <div class="col-sm-12">
                      <div class="form-group">
                        <label for="nip">NIP</label>
                        <input 
                          id="nip"
                          v-model="dataEdit.nip" 
                          name="nip" 
                          type="text" 
                          class="form-control"
                          :class="{ 'is-invalid': submitted && $v.dataEdit.nip.$error }"
                        >

                        <div
                          v-if="submitted && !$v.dataEdit.nip.required"
                          class="invalid-feedback"
                        >
                          NIP harus diisi!
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-12">
                      <div class="form-group">
                        <label for="nama">Nama Dosen</label>
                        <input 
                          id="nama"
                          v-model="dataEdit.name" 
                          name="nama" 
                          type="text" 
                          class="form-control"
                          :class="{ 'is-invalid': submitted && $v.dataEdit.name.$error }"
                        >

                        <div
                          v-if="submitted && !$v.dataEdit.name.required"
                          class="invalid-feedback"
                        >
                          Nama Dosen harus diisi!
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-12">
                      <div class="form-group">
                        <label for="code">Kode Dosen</label>
                        <input
                          id="code"
                          v-model="dataEdit.code"
                          name="code"
                          type="text"
                          class="form-control"
                          :class="{ 'is-invalid': submitted && $v.dataEdit.code.$error }"
                        >
                        <div
                          v-if="submitted && !$v.dataEdit.code.required"
                          class="invalid-feedback"
                        >
                          Kode Mata Kuliah harus diisi!
                        </div>
                      </div>
                    </div>
                    <div class="text-center mt-4">
                      <button
                        type="submit"
                        class="btn btn-primary mr-2 waves-effect waves-light"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        class="btn btn-light waves-effect"
                        @click="hideModal"
                      >
                        Batalkan
                      </button>
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
              <div class="mt-4">
                <form
                  class="form-horizontal col-sm-12 col-md-12"
                  @submit.prevent="editRole"
                >
                  <div
                    id="metadata"
                    class="tab-pane"
                  >
                    <div class="col-sm-12">
                      <div class="form-group">
                        <label class="control-label">Roles</label>
                        <multiselect
                          v-model="role_data"
                          :options="roleData"
                          :multiple="true"
                          :show-labels="false"
                          @remove="removeRole"
                        />
                      </div>
                    </div>
                    <div class="text-center mt-4">
                      <button
                        type="submit"
                        class="btn btn-primary mr-2 waves-effect waves-light"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        class="btn btn-light waves-effect"
                        @click="hideModal"
                      >
                        Batalkan
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </template>
          </b-tab>
        </b-tabs>
      </b-modal>
    </div>
  </div>
</template>