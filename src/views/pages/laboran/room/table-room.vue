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
  created() {
    document.body.classList.add("auth-body-bg");
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
        { key: "action", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
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
            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Terjadi kesalahan!',
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

    async refreshData(){
      this.loading();
      await this.fetchData().then(result=>{
          this.loading();
      });
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
            Swal.fire("Berhasil dihapus!", name + " telah terhapus.", "success");
            this.loading();
            this.fetchData().then(result=>{
                this.loading();
            });
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Terjadi kesalahan!',
              footer: error
            })
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
              this.submitted = false;
              this.hideModal();
              Swal.fire("Edited!", this.dataEdit.name + " has been edited.", "success");
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
                text: 'Terjadi kesalahan!',
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
        :busy.sync="isFetchingData"
        :current-page="currentPage"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :filter="filter"
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
        title="Edit Room" 
        hide-footer 
        title-class="font-18"
      >
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="editRoom">
          <div class="tab-pane" id="metadata">
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nim">Nama Ruangan</label>
                    <input
                        v-model="dataEdit.name"
                        id="name"
                        name="name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.dataEdit.name.$error }"
                    />
                    <div
                    v-if="submitted && !$v.dataEdit.name.required"
                    class="invalid-feedback"
                    >Nama Ruangan harus diisi!</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nama">Deskripsi</label>
                    <input 
                    v-model="dataEdit.desc"
                    id="desc" 
                    name="desc" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': submitted && $v.dataEdit.desc.$error }" />

                    <div
                    v-if="submitted && !$v.dataEdit.desc.required"
                    class="invalid-feedback"
                    >Deskripsi harus diisi!</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nim">Link MS Teams</label>
                    <input
                        v-model="dataEdit.msteam_link"
                        id="msteam_link"
                        name="msteam_link"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && $v.dataEdit.msteam_link.$error }"
                    />
                    <div
                    v-if="submitted && !$v.dataEdit.msteam_link.required"
                    class="invalid-feedback"
                    >Link MS Teams harus diisi!</div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="form-group">
                    <label for="nama">Kode MS Teams</label>
                    <input 
                    v-model="dataEdit.msteam_code"
                    id="msteam_code" 
                    name="msteam_code" 
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': submitted && $v.dataEdit.msteam_code.$error }" />

                    <div
                    v-if="submitted && !$v.dataEdit.msteam_code.required"
                    class="invalid-feedback"
                    >Kode MS Teams harus diisi!</div>
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
      </b-modal>
    </div>
  </div>
</template>