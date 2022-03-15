<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';

/**
 * Orders Component
 */
export default {
  page: {
    title: "Nilai / Presensi",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Nilai / Presensi",
      items: [
        {
          text: "Praktikan",
          href: "/"
        },
        {
          text: "Nilai / Presensi",
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "index",
      sortDesc: false,
      dataPresences: [],
      fields: [
        { key: "grade.index", sortable: true, label: "Modul", thClass: 'text-center', tdClass: 'text-center' },
        { key: "grade.pretest.grade", label: "Nilai Tes Awal", thClass: 'text-center', tdClass: 'text-center', },
        { key: "grade.journal.grade", label: "Nilai Jurnal", thClass: 'text-center', tdClass: 'text-center', },
        { key: "grade.posttest.grade", label: "Nilai Tes Akhir", thClass: 'text-center', tdClass: 'text-center', },
        { key: "grade.total_grade", label: "Nilai Total", thClass: 'text-center', tdClass: 'text-center', },
        { key: "presence", label: "Kehadiran", thClass: 'text-center', tdClass: 'text-center' },
      ],

      student_id: store.getters.getLoggedUser.id,

      dataClassCourses: [],
      class_course_data: {
          class_name: "",
          course_code: "",
          course_name: "",
          staff_code: "",
          staff_name: "",
          academic_year: "",
      },

      isFetchingData: false,
      isLoading: false,

    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.dataPresences.length;
    },
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  mounted: async function() {
    // Set the initial number of items
    this.totalRows = this.dataPresences.length;
    this.perPage = this.dataPresences.length;
    
    this.loading(true);
    await this.getStudentCourses();
    await this.refreshData(0);
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
    
    async getStudentCourses(){
        return (
            api.getStudentCourses(this.student_id)
            .then(response => {
                if(response.data.data){
                    this.dataClassCourses = response.data.data;
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
        );
    },

    getRequestParams(class_course_id) {
      let params = {};

      if (class_course_id) {
        params["class_course_id"] = class_course_id;
      }

      return params;
    },

    async getPresences(class_course_id){
        const params = this.getRequestParams(
            class_course_id
        );
        return (
            api.getPresence(params)
            .then(response => {
                if(response.data){
                    if(response.data.class_course.length){
                        this.dataPresences = response.data.class_course[0].modules;
                        console.log(this.dataPresences)
                    }
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
        );
    },

    async refreshData(index){
        this.loading(true);
        this.isFetchingData = true;
        if(this.dataClassCourses.length){
            
            this.class_course_data = this.dataClassCourses[index];
            let class_course_id = this.class_course_data.class_course_id;
            await this.getPresences(class_course_id);
        }
        this.isFetchingData = false;
        this.loading(false);
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
  <Layout>
    <PageHeader
      :title="title"
      :items="items"
    />
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
    <div
      v-if="dataClassCourses.length"
      class="row"
    >
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs
              nav-class="nav-tabs-custom"
              @input="refreshData"
            >
              <b-tab
                v-for="(course, index) in dataClassCourses"
                :key="index"
                title-link-class="p-3"
              >
                <template v-slot:title> 
                  <a class="font-weight-bold active ml-sm-5 mr-lg-5">{{ course.course_name }}</a>
                </template>
                <div class="row" />
                <div class="row mt-4">
                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>Kelas</label>
                      <input
                        v-model="class_course_data.class_name"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>

                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>Mata Kuliah</label>
                      <input
                        v-model="class_course_data.course_name"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>

                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>Kode Dosen</label>
                      <input
                        v-model="class_course_data.staff_code"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>

                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>Tahun / Semester</label>
                      <input
                        v-model="class_course_data.academic_year"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="background-color: #F0F4F6;"
                      >
                    </div>
                  </div>
                </div>
                <!-- <div class="row mt-4">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label>
                    </div>
                  </div>
                  Search 
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
                  End search
                </div> -->
                <div class="table-responsive mt-2">
                  <b-table
                    class="table-centered"
                    :items="dataPresences"
                    :fields="fields"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by="sortBy"
                    :sort-desc="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :busy.sync="isFetchingData"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(presence)="data">
                      <b-button
                        v-if="data.item.presence"
                        variant="outline-success"
                        :disabled="true"
                        size="sm" 
                        style="min-width: 125px;"
                      >
                        Hadir
                      </b-button>
                      <b-button
                        v-if="!data.item.presence"
                        variant="outline-danger"
                        :disabled="true"
                        size="sm" 
                        style="min-width: 125px;"
                      >
                        Tidak Hadir
                      </b-button>
                    </template>
                  </b-table>
                </div>
                <!-- <div class="row">
                  <div class="col">
                    <div class="paging_simple_numbers float-right">
                      <ul class="pagination pagination-rounded mb-0">
                        pagination
                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div> -->
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!dataClassCourses.length"
      class="row"
    />
  </Layout>
</template>