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
      desc: { required },
      name: { required },
      msteam_link: { required },
      msteam_code: { required },
    },
  },
  data() {
    return {
      //list room
      isFetchingData: false,
      dataRooms: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "name",
      sortDesc: false,
      fields: [
        { key: "name", sortable: true, label: "Nama Ruangan" },
        { key: "desc", sortable: true, label: "Deskripsi" },
        { key: "msteam_link", sortable: true, label: "Link MS Teams" },
        { key: "msteam_code", sortable: true, label: "Kode MS Teams" },
        { key: "action", label: "Aksi", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
      ],

      //modal edit
      idDataEdit: "",
      dataEdit: { 
          desc: "", 
          name: "",
          desmsteam_linkc: "", 
          msteam_code: "",
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
      return this.dataRooms;
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
    fetchData(){
      this.isFetchingData = true;

      return (
        api.getAllRooms()
          .then(response => {
            if (response.data.rooms){
              this.totalRows = response.data.rooms.length;
              this.dataRooms = response.data.rooms;
            }
            this.isFetchingData = false;
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

    async refreshData(){
      this.loading(true);
      await this.fetchData();
      this.loading(false);
    },

    onClickDelete(data){
      Swal.fire({
          title: "Anda yakin?",
          text: data.item.name + " akan dihapus!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, hapus!"
      }).then(result => {
          if (result.value) {
              this.deleteRoom(data.item.id, data.item.name);
          }
      });
    },

    deleteRoom(id, name){
      return (
        api.deleteRoom(id)
          .then(response => {
            this.loading(true);
            this.fetchData();
            this.loading(false);
            Swal.fire("Berhasil dihapus!", name + " telah terhapus.", "success");
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
      this.dataEdit.desc = data.item.desc;
      this.dataEdit.name = data.item.name;
      this.dataEdit.msteam_link = data.item.msteam_link;
      this.dataEdit.msteam_code = data.item.msteam_code;
      this.$bvModal.show('modal-edit');
    },

    editRoom(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } 
      else {
        return (
          api.editRoom(this.idDataEdit, this.dataEdit)
            .then(response => {
              this.loading(true);
              this.submitted = false;
              this.fetchData();
              this.loading(false);
              this.hideModal();
              Swal.fire("Berhasil diubah!", this.dataEdit.name + " telah terubah.", "success");
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
        :per-page="perPage"
        :busy.sync="isFetchingData"
        :current-page="currentPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter="filter"
        :filter-included-fields="filterOn"
        :head-variant="'dark'"
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
        title="Edit Room" 
        hide-footer 
        title-class="font-18"
      >
        <form
          class="form-horizontal col-sm-12 col-md-12"
          @submit.prevent="editRoom"
        >
          <div
            id="metadata"
            class="tab-pane"
          >
            <div class="col-sm-12">
              <div class="form-group">
                <label for="nim">Nama Ruangan</label>
                <input
                  id="name"
                  v-model="dataEdit.name"
                  name="name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataEdit.name.$error }"
                >
                <div
                  v-if="submitted && !$v.dataEdit.name.required"
                  class="invalid-feedback"
                >
                  Nama Ruangan harus diisi!
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="form-group">
                <label for="nama">Deskripsi</label>
                <input 
                  id="desc"
                  v-model="dataEdit.desc" 
                  name="desc" 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataEdit.desc.$error }"
                >

                <div
                  v-if="submitted && !$v.dataEdit.desc.required"
                  class="invalid-feedback"
                >
                  Deskripsi harus diisi!
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="form-group">
                <label for="nim">Link MS Teams</label>
                <input
                  id="msteam_link"
                  v-model="dataEdit.msteam_link"
                  name="msteam_link"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataEdit.msteam_link.$error }"
                >
                <div
                  v-if="submitted && !$v.dataEdit.msteam_link.required"
                  class="invalid-feedback"
                >
                  Link MS Teams harus diisi!
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="form-group">
                <label for="nama">Kode MS Teams</label>
                <input 
                  id="msteam_code"
                  v-model="dataEdit.msteam_code" 
                  name="msteam_code" 
                  type="text" 
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataEdit.msteam_code.$error }"
                >

                <div
                  v-if="submitted && !$v.dataEdit.msteam_code.required"
                  class="invalid-feedback"
                >
                  Kode MS Teams harus diisi!
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
      </b-modal>
    </div>
  </div>
</template>