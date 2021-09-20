<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import * as api from '@/api';
import Swal from "sweetalert2";
import moment from 'moment';

import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Detail BAP",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  mounted: async function() {
    this.loading();
    await this.loadData().then(result=>{
      this.loading();
    });
  },
  watch: {
    $route: async function() {
      await this.loadData().then(result=>{
        this.loading();
      });
    }
  },
  data() {
    return {
      title: "Detail BAP",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "BAP",
          href: "/asprak/bap"
        },
        {
          text: "Detail",
          active: true,
        }
      ],

      schedule_id: this.$route.params.id,

      bap_data: {
        bap: [{
            materi: "",
            evaluasi: "",
            jenias: "",
        }],
        schedule: {
            name: "",
            time_start: "",
            time_end: "",
            date: "",
            class_course: {
                courses: {
                    code: "",
                    name: "",
                },
                classes: {
                    name: "",
                },
                staffs: {
                    code: "",
                    name: "",
                }
            },
            room: {
                name: "",
            },
            module: {
                index: "",
            },
            academic_year: {
                year: "",
                semester: "",
            }
        },
        asprak_presence: [],
        student_presence: [],
      },

      //list asprak
      asprak_totalRows: 1,
      asprak_currentPage: 1,
      asprak_perPage: 1,
      asprak_filter: "",
      asprak_filterOn: [],
      asprak_sortBy: "nim",
      asprak_sortDesc: false,
      asprak_fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
      ],

      //list student
      student_totalRows: 1,
      student_currentPage: 1,
      student_perPage: 1,
      student_filter: "",
      student_filterOn: [],
      student_sortBy: "nim",
      student_sortDesc: false,
      student_fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Name" },
      ],

    };
  },
  methods: {
    ...notificationMethods,

    async loadData(){
      await this.fetchData();

      this.asprak_totalRows = this.bap_data.asprak_presence.length;
      this.asprak_perPage = this.bap_data.asprak_presence.length;

      this.student_totalRows = this.bap_data.student_presence.length;
      this.student_perPage = this.bap_data.student_presence.length;
    },

    async fetchData(){
      return (
        api.showBap(this.schedule_id)
          .then(response => {
            this.isIdValid(response.data);
            if(response.data){
              this.bap_data = response.data;
              if(!this.bap_data.asprak_presence){
                  this.bap_data.asprak_presence = [];
              }
              if(!this.bap_data.student_presence){
                  this.bap_data.student_presence = [];
              }
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
      );
    },

    isIdValid(data){
        if(data){
            if(!data.bap.length){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'This ID is invalid!',
                    footer: 'You will be redirected to Schedule Menu',
                    timer: 4000
                })
                this.$router.replace({
                    name: 'laboran-bap'
                });
            }
            else{
                return true;
            }
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'This ID is invalid!',
                footer: 'You will be redirected to Schedule Menu',
                timer: 4000
            })
            this.$router.replace({
                name: 'laboran-bap'
            });
        }
    },

    asprak_onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.asprak_totalRows = filteredItems.length;
      this.asprak_currentPage = 1;
    },

    student_onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.student_totalRows = filteredItems.length;
      this.student_currentPage = 1;
    },

    async print () {
      await this.$htmlToPaper('print_page');
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

  },
};

</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div id="loading" style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
      <b-spinner style="width: 3rem; height: 3rem;" class="m-2" variant="warning" role="status"></b-spinner>
    </div>
    <div>
        <div id="print_page">
            <div class="card">
                <div class="card-body">
                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Kelas"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.schedule.class_course.classes.name"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Mata Kuliah"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.schedule.class_course.courses.name"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Dosen"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.schedule.class_course.staffs.name"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Modul"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="String(bap_data.schedule.module.index)"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Tanggal"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.schedule.date"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Jam Mulai"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.schedule.time_start"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Jam Terakhir"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.schedule.time_end"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Ruangan"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.schedule.room.name"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Jenis Interaksi"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.bap[0].jenis"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Materi Praktikum"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.bap[0].materi"
                        >
                        </b-form-group>
                    </b-form-group>

                    <b-form-group
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Evaluasi Praktikum"
                    >
                        <b-form-group
                            label-cols-sm="12"
                            label-cols-lg="12"
                            :label="bap_data.bap[0].evaluasi"
                        >
                        </b-form-group>
                    </b-form-group>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-12 col-md-6 d-inline-flex align-items-center">
                            <h4 class="card-title">Kehadiran Asisten Praktikum</h4>
                        </div>
                        <!-- Search -->
                        <div class="col-sm-12 col-md-6">
                            <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                            <label class="d-inline-flex align-items-center">
                                Search:
                                <b-form-input
                                v-model="asprak_filter"
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
                        :items="bap_data.asprak_presence"
                        :fields="asprak_fields"
                        responsive="sm"
                        :per-page="asprak_perPage"
                        :current-page="asprak_currentPage"
                        :sort-by="asprak_sortBy"
                        :sort-desc="asprak_sortDesc"
                        :filter="asprak_filter"
                        :filter-included-fields="asprak_filterOn"
                        @filtered="asprak_onFiltered"
                    >
                    </b-table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-12 col-md-6 d-inline-flex align-items-center">
                            <h4 class="card-title">Kehadiran Praktikan</h4>
                        </div>
                        <!-- Search -->
                        <div class="col-sm-12 col-md-6">
                            <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                            <label class="d-inline-flex align-items-center">
                                Search:
                                <b-form-input
                                v-model="student_filter"
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
                        :items="bap_data.student_presence"
                        :fields="student_fields"
                        responsive="sm"
                        :per-page="student_perPage"
                        :current-page="student_currentPage"
                        :sort-by="student_sortBy"
                        :sort-desc="student_sortDesc"
                        :filter="student_filter"
                        :filter-included-fields="student_filterOn"
                        @filtered="student_onFiltered"
                    >
                    </b-table>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-center m-4">
            <b-button variant="success" style="min-width: 350px;" @click="print">Print</b-button>
        </div>
    </div>
  </Layout>
</template>