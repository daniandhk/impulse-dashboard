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
          text: "Laboran",
          href: "/"
        },
        {
          text: "BAP",
          href: "/laboran/bap"
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
        <div class="card">
            <div class="card-body">
                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Kelas"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.class_course.classes.name" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Mata Kuliah"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.class_course.courses.name" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Dosen"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.class_course.staffs.name" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Modul"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.module.index" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Tanggal"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.date" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Jam Mulai"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.time_start" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Jam Terakhir"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.time_end" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Ruangan"
                >
                    <b-form-input 
                        for="text" 
                        v-model="bap_data.schedule.room.name" 
                        :disabled="true" 
                        style="border: none;"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Jenis Interaksi"
                >
                    <input
                        v-model="bap_data.bap[0].jenis"
                        type="text"
                        class="form-control"
                        :disabled="true"
                    />
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Materi Praktikum"
                >
                    <input
                        v-model="bap_data.bap[0].materi"
                        type="text"
                        class="form-control"
                        :disabled="true"
                    />
                </b-form-group>

                <b-form-group
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Evaluasi Praktikum"
                >
                    <input
                        v-model="bap_data.bap[0].evaluasi"
                        type="text"
                        class="form-control"
                        :disabled="true"
                    />
                </b-form-group>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Kehadiran Asisten Praktikum</h4>
                <hr style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 2px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                >
                <div class="row mt-4">
                    <!-- Search -->
                    <div class="col-sm-12 col-md-12">
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
                    :headVariant="'dark'"
                >
                </b-table>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Kehadiran Praktikan</h4>
                <hr style="margin-left: -28px; 
                            margin-right: -28px; 
                            height: 2px; 
                            background-color: #eee; 
                            border: 0 none; 
                            color: #eee;"
                >
                <div class="row mt-4">
                    <!-- Search -->
                    <div class="col-sm-12 col-md-12">
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
                    :headVariant="'dark'"
                >
                </b-table>
                </div>
            </div>
        </div>
    </div>
  </Layout>
</template>