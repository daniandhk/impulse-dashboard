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
      //list classroom
      isFetchingData: false,
      dataAccounts: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "username",
      sortDesc: false,
      fields: [
        { key: "username", sortable: true, label: "Username" },
        { key: "name", sortable: false, label: "Nama" },
        { key: "action", label: "Aksi", sortable: false, thClass: 'text-center', tdClass: 'text-center', },
        { key: "logout", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
      ],

      //edit role
      roleData: ['laboran', 'dosen', 'asprak', 'aslab'],
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
      main_role: "",
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
      return this.dataAccounts;
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
        api.getAllAccounts(params)
          .then(response => {
            this.isFetchingData = false;

            this.totalRows = response.data.meta.pagination.total;
            this.dataAccounts = response.data.data;
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

    onClickReset(data){
      Swal.fire({
          title: "Anda yakin?",
          text: "Password " + data.item.username + " akan diubah sesuai Username!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, reset password!"
      }).then(result => {
          if (result.value) {
              this.resetUserPassword(data.item.id, data.item.username);
          }
      });
    },

    resetUserPassword(id, username){
      return (
        api.resetUserPassword(id)
          .then(response => {
            this.loading(true);
            this.fetchData();
            this.loading(false);
            Swal.fire("Berhasil diatur ulang!", "Password " + username + " telah diubah sesuai Username.", "success");
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

    async onClickEdit(data){
      //edit role
      if(data.item.nim){
          this.dataEditRole.no_induk = data.item.nim;
          this.roleData = ['asprak', 'aslab'];
          this.main_role = "student";
      }
      else if(data.item.nip){
          this.dataEditRole.no_induk = data.item.nip;
          this.roleData = ['laboran', 'dosen'];
          this.main_role = "staff";
      }
      this.getRoles(this.dataEditRole.no_induk);
      this.setRoles(this.role_data, this.dataEditRole);

      this.$bvModal.show('modal-edit');
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
        if(this.main_role == "student"){
            if (role_data.includes("student") == false){
                role_data.push("student");
            }
        }
        else if(this.main_role == "staff"){
            if (role_data.includes("staff") == false){
                role_data.push("staff");
            }
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
              Swal.fire("Berhasil diubah!", this.dataEditRole.no_induk + " telah terubah.", "success");
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
        if(this.main_role == "student"){
            if (value == "student"){
                this.role_data.push("student");
            }
        }
        else if(this.main_role == "staff"){
            if (value == "staff"){
                this.role_data.push("staff");
            }
        }
    },

    hideModal(){
      this.$bvModal.hide('modal-edit');
    },

    onClickLogout(data){
      Swal.fire({
          title: "Anda yakin?",
          text: "Akun " + data.item.username + " akan di logout paksa!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, logout paksa!"
      }).then(result => {
          if (result.value) {
              this.logoutAccount(data.item.id, data.item.username);
          }
      });
    },

    logoutAccount(id, username){
      return (
        api.logoutAccount(id)
          .then(response => {
            this.loading(true);
            this.fetchData();
            this.loading(false);
            if(response.data.success){
              Swal.fire("Berhasil logout!", "Akun " + username + " telah di logout paksa.", "success");
            }
            else{
              Swal.fire("Oops", response.data.message, "error");
            }
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Terjadi kesalahan!',
              footer: error.response.data.message
            })
          })
      )
    },

    loading(isLoad) {
        var x = document.getElementById("loading");

        if(isLoad){
            this.isFetchingData = true;
            this.isLoading = true;
            x.style.display = "block";
        } else{
            this.isFetchingData = false;
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
              placeholder="Username"
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
            title="Edit Roles"
            @click="onClickEdit(data)" 
          >
            <i class="mdi mdi-pencil font-size-18" />
          </a>
          <a
            v-b-tooltip.hover
            href="javascript:void(0);"
            class="m-1 text-danger"
            title="Reset Password"
            @click="onClickReset(data)" 
          >
            <i class="mdi mdi-account-convert font-size-18" />
          </a>
        </template>
        <template v-slot:cell(logout)="data">
          <a
            v-b-tooltip.hover
            href="javascript:void(0);"
            class="m-1 text-danger"
            title="Logout"
            @click="onClickLogout(data)" 
          >
            <i class="mdi mdi-login-variant font-size-18" />
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
        title="Edit Roles" 
        hide-footer 
        title-class="font-18"
      >
        <div>
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
                  <label for="nip">Username</label>
                  <input 
                    id="nip"
                    v-model="dataEditRole.no_induk"
                    style="background-color: #F0F4F6;"
                    :disabled="true" 
                    name="no_induk" 
                    type="text" 
                    class="form-control"
                  >
                </div>
              </div>
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
      </b-modal>
    </div>
  </div>
</template>