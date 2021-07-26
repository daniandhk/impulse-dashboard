<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import { tableData } from "./data-absen";
/**
 * Form-element component
 */
export default {
  page: {
    title: "Lihat Feedback",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      tableData: tableData,
      title: "Berita Acara Praktikum",
      items: [
        {
          text: "Absensi",
          href: "/"
        },
        {
          text: "Absensi Asprak",
          active: true
        }
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      fields: [
        { key: "no", sortable: true, label: "No." },
        { key: "nim", sortable: true, label: "NIM" },
        { key: "nama_mahasiswa", sortable: true, label: "Nama Mahasiswa" },
        { key: "Presensi", sortable: false }
      ]
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Input Absen</h4>
            <div class="row">
                <div class="col-12">
                    <form class="form-horizontal" role="form">
                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Mata Kuliah"
                            label-for="text"
                        >
                            <b-form-input for="text" value="Dasar Algoritma Pemograman" :disabled="true" style="border: none;"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Dosen"
                            label-for="text"
                        >
                            <b-form-input for="text" value="Artisanal kale" :disabled="true" style="border: none;"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Pertemuan"
                            label-for="text"
                        >
                            <b-form-input for="text" placeholder="1" style="width: 10%"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Asprak yang hadir"
                            label-for="text">
                            <div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" value id="defaultCheck1" />
                                    <label class="form-check-label" for="defaultCheck1">Asprak 1</label>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox"/>
                                    <label class="form-check-label" for="defaultCheck1">Asprak 2</label>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox"/>
                                    <label class="form-check-label" for="defaultCheck1">Asprak 3</label>
                                </div>
                            </div>
                        </b-form-group>

                         <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Tanggal"
                            label-for="text"
                        >
                            <b-form-input for="text" value="Selasa, 15-09-2021" :disabled="true" style="border: none;"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Ruangan"
                            label-for="text"
                        >
                            <b-form-input for="text" value="KU3.10.10" :disabled="true" style="border: none;"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Materi Praktikum"
                            label-for="text"
                        >
                            <b-form-input for="text" value="" placeholder="Materi Praktikum"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Jenis Interaksi"
                            label-for="text"
                        >
                            <b-form-input for="text" value="" placeholder="Jenis Interaksi Praktikum"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Evaluasi Praktikum"
                            label-for="text"
                        >
                            <b-form-input for="text" value="" placeholder="Evaluasi Praktikum"></b-form-input>
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Status Submit"
                            label-for="text"
                        >
                            <b-form-input for="text" value="Sudah Submit" :disabled="true" 
                                style="border: none; color:#228B22; font-weight: bold;">
                            </b-form-input>

                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Tanggal Submit"
                            label-for="text"
                        >
                            <b-form-input for="text" value="15-09-2021" :disabled="true" 
                                style="border: none; color:#228B22; font-weight: bold;">
                            </b-form-input>
                            
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Tanggal Update"
                            label-for="text"
                        >
                            <b-form-input for="text" value="15-09-2021" :disabled="true" 
                                style="border: none; color:#228B22; font-weight: bold;">
                            </b-form-input>
                            
                        </b-form-group>

                        <b-form-group
                            id="example text"
                            label-cols-sm="2"
                            label-cols-lg="2"
                            label="Jenis Pertemuan"
                            label-for="text">
                            <div>
                                <div class="form-check mb-3">
                                    <input
                                    class="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value="option1"
                                    checked
                                    />
                                    <label class="form-check-label" for="exampleRadios1">Praktikum Online</label>
                                </div>
                                <div class="form-check mb-3">
                                    <input
                                    class="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value="option1"
                                    checked
                                    />
                                    <label class="form-check-label" for="exampleRadios1">Praktikum Onsite</label>
                                </div>
                            </div>
                        </b-form-group>

                        <div class="text-center">
                            <b-button type="submit" variant="success"><router-link
                                                to=""
                                                class="font-weight-medium"
                                                style="color: white;"
                                            >Submit BAP</router-link>
                            </b-button>
                        </div>
                        
                    </form>
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->

     <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Data Absensi</h4>
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <div id="tickets-table_length" class="dataTables_length">
                  <label class="d-inline-flex align-items-center">
                    Show&nbsp;
                    <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
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
                      placeholder="Search..."
                      class="form-control form-control-sm ml-2"
                    ></b-form-input>
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                :items="tableData"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
              <template v-slot:cell(Presensi)>
                <div class="form-check mb-3">
                                    <input
                                    class="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value="hadir"
                                    checked
                                    />
                                    <label class="form-check-label mr-5" for="exampleRadios1">Hadir</label>

                                    <input
                                    class="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value="izin"
                                    checked
                                    />
                                    <label class="form-check-label mr-5" for="exampleRadios1">Izin</label>

                                    <input
                                    class="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value=""
                                    checked
                                    />
                                    <label class="form-check-label mr-5" for="exampleRadios1">Sakit</label>

                                    <input
                                    class="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value="alpa"
                                    checked
                                    />
                                    <label class="form-check-label mr-5" for="exampleRadios1">Alpa</label>

                                    
                                    <input
                                    class="form-check-input"
                                    type="radio"
                                    name="exampleRadios"
                                    id="exampleRadios1"
                                    value="dispen"
                                    checked
                                    />
                                    <label class="form-check-label" for="exampleRadios1">Dispen</label>
                                </div>
              </template></b-table>
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
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>