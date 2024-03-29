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
      //list academic year
      isFetchingData: false,
      dataAcademicYears: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: "",
      filterOn: [],
      sortBy: "year",
      sortDesc: false,
      fields: [
        { key: "year", sortable: true, label: "Tahun Akademik" },
        { key: "semester", sortable: true, label: "Semester" },
        { key: "action", label: "Aksi", sortable: false, thClass: 'text-center', tdClass: 'text-center', }
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
      return this.dataAcademicYears;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  mounted: async function() {
    // Set the initial number of items
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
        api.getAllAcademicYears()
          .then(response => {
            if (response.data.academic_years){
              this.totalRows = response.data.academic_years.length;
              this.dataAcademicYears = response.data.academic_years;
              this.dataAcademicYears.forEach((element, index, array) => {
                  element.name = String(element.year) + " (" + String(element.semester) + ")"
              });
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
              this.deleteAcademicYear(data.item.id, data.item.name);
          }
      });
    },

    deleteAcademicYear(id, name){
      return (
        api.deleteAcademicYear(id)
          .then(response => {
            Swal.fire("Berhasil dihapus!", name + " telah terhapus.", "success");
            this.loading(true);
            this.fetchData();
            this.loading(false);
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
  </div>
</template>