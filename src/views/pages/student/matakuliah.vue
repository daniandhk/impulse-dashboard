<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import Swal from "sweetalert2";

/**
 * Orders Component
 */
export default {
  page: {
    title: "Jadwal Mata Kuliah",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      matkuldata: [
        {
          
          tanggal: "28 April 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "5 Mei 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
           tanggal: "12 Mei 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "19 Mei 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "26 Mei 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "2 Juni 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "9 Juni 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "16 Juni 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "23 Juni 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "30 Juni 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "7 Juli 2021",
          hari: "Kamis",
          jam: "09:30 - 12:30",
          kodematakuliah: "CII3J4",
          ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        }
      ],
       matkuldata2: [
        {
          
          tanggal: "26 April 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
           tanggal: "3 Mei 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
           tanggal: "10 Mei 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
           tanggal: "17 Mei 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
            tanggal: "31 Mei 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
           tanggal: "7 Juni 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "14 Juni 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "21 Juni 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "28 Juni 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "5 Juli 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        },
        {
          tanggal: "12 Juli 2021",
          hari: "Senin",
          jam: "13:30 - 15:30",
          kodematakuliah: "CII3H4",
          ruangan: "LABIF-01 (KULTUBAI SELATAN LT.3)",
          status: "Tetap"
        }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "Hari",
      sortDesc: false,
    //    : "28 April 2021",
    //       hari: "Kamis",
    //       jam: "09:30 - 12:30",
    //       kodematakuliah: "CII3J4",
    //       ruangan: "LABIF-02 (KULTUBAI SELATAN LT.3)",
    //       status: "Tetap"
      fields: [
        
        { key: "tanggal", sortable: true },
        { key: "hari", label: "Hari" },
        { key: "jam", label: "Jam" },
        { key: "kodematakuliah", label: "Kode Mata Kuliah" },
        { key: "ruangan",  label: "Ruangan" },
        { key: "status", label: "Status" },
        { key: "action", label :"Kehadiran"  }
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.matkuldata.length;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.matkuldata.length;
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
    
    inputStaff() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputStaff(this.dataStaff)
                .then(response => {
                    this.tryingToInput = false;
                    this.isInputError = false;
                    this.inputSuccess = true;
                
                    if (this.inputSuccess) {
                        console.log(response)
                        this.deleteForm();
                        Swal.fire("Submitted!", "The form submitted successfully.", "success");
                    }
                })
                .catch(error => {
                    //pop up
                    console.log(error.response)
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;
                })
          );
      }
    },

    cancelSubmit(){
        Swal.fire({
            title: "Are you sure?",
            text: "the form that you have filled in will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Yes, cancel it!"
        }).then(result => {
            if (result.value) {
                this.deleteForm();
                this.submitted = false;
                this.isInputCanceled = true;
                Swal.fire("Canceled!", "The form has been left blank.", "success");
            }
        });
    },

    deleteForm(){
        this.dataStaff.name = "";
        this.dataStaff.nim = "";
        this.dataStaff.gender = "";
        this.dataStaff.religion = "";
        this.kelas = "";
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
            <b-tabs nav-class="nav-tabs-custom">
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Algoritma Pemograman</a>
                </template>
                <div class="row mt-4">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <!-- <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label> -->
                    </div>
                  </div>
                  <!-- Search 
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
                  End search -->
                </div>
                <div class="table-responsive">
                  <b-table
                    class="table-centered"
                    :items="matkuldata"
                    :fields="fields"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(paymentstatus)="row">
                      <div
                        class="badge font-size-12"
                        :class="{'badge-soft-danger': `${row.value}` === 'Chargeback',
                            'badge-soft-success': `${row.value}` === 'Paid',
                            'badge-soft-warning': `${row.value}` === 'Unpaid'}"
                      >{{ row.value}}</div>
                    </template>
                    <template v-slot:cell(invoice)>
                      <button class="btn btn-light btn-rounded">
                        Invoice
                        <i class="mdi mdi-download ml-2"></i>
                      </button>
                    </template>
                    <template v-slot:cell(action)>
                      <a
                        href="javascript:void(0);"
                        class="mr-3 text-primary"
                        v-b-tooltip.hover
                        title="Hadir"
                      >
                        <i class="mdi mdi-check-circle-outline font-size-18"></i>
                      </a>
                    </template>
                  </b-table>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="dataTables_paginate paging_simple_numbers float-right">
                      <ul class="pagination pagination-rounded mb-0">
                        <!-- pagination -->
                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div>
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Aplikasi Berbasis Platform</a>
                </template>
                <div class="row mt-4">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <!-- <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label> -->
                    </div>
                  </div>
                  <!-- Search 
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
                  End search -->
                </div>
                <div class="table-responsive">
                  <b-table
                    class="table-centered"
                    :items="matkuldata2"
                    :fields="fields"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(paymentstatus)="row">
                      <div
                        class="badge font-size-12"
                        :class="{'badge-soft-danger': `${row.value}` === 'Chargeback',
                            'badge-soft-success': `${row.value}` === 'Paid',
                            'badge-soft-warning': `${row.value}` === 'Unpaid'}"
                      >{{ row.value}}</div>
                    </template>
                    <template v-slot:cell(invoice)>
                      <button class="btn btn-light btn-rounded">
                        Invoice
                        <i class="mdi mdi-download ml-2"></i>
                      </button>
                    </template>
                    <template v-slot:cell(action)>
                      <a
                        href="javascript:void(0);"
                        class="mr-3 text-primary"
                        v-b-tooltip.hover
                        title="Hadir"
                      >
                        <i class="mdi mdi-check-circle-outline font-size-18"></i>
                      </a>
                    </template>
                  </b-table>
                </div>
                <div class="row">
                  <div class="col">
                    <div class="dataTables_paginate paging_simple_numbers float-right">
                      <ul class="pagination pagination-rounded mb-0">
                        <!-- pagination -->
                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>