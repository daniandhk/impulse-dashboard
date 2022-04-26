<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';
import i18n from '@/i18n';

/**
 * Orders Component
 */
export default {
  page: {
    title: "Nilai",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      title: "Nilai",
      items: [
        {
          text: i18n.t('student.text'),
          href: "/"
        },
        {
          text: "Nilai",
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
      dataModules: [],
      fields: [
        { key: "index", sortable: true, label: "Modul", thClass: 'text-center', tdClass: 'text-center', },
        { key: "pretest_grade", label: "Nilai Tes Awal", thClass: 'text-center', tdClass: 'text-center', },
        { key: "journal_grade", label: "Nilai Jurnal", thClass: 'text-center', tdClass: 'text-center', },
        { key: "posttest_grade", label: "Nilai Tes Akhir", thClass: 'text-center', tdClass: 'text-center', },
        { key: "total_grade", label: "Nilai Total", thClass: 'text-center', tdClass: 'text-center', },
      ],

      student_id: store.getters.getLoggedUser.id,

      dataClassCourses: [],
      class_course_data: {
          course: "",
          class: "",
          staff: "",
          year: "",
          semester: "",
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
      return this.dataModules.length;
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
    this.totalRows = this.dataModules.length;
    this.perPage = this.dataModules.length;
    
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
            api.getStudentCourseScore(this.student_id)
            .then(response => {
                if(response.data.data){
                    this.dataClassCourses = response.data.data.result;
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

    async getModules(index){
        this.dataModules = this.dataClassCourses[index].modules;
        return true;
    },

    async refreshData(index){
        this.isFetchingData = true;
        if(this.dataClassCourses.length){
            this.loading(true);
            this.class_course_data = this.dataClassCourses[index];
            this.class_course_data.academic_year = this.class_course_data.year + " / " + this.class_course_data.semester
            await this.getModules(index);
            this.loading(false);
        }
        this.isFetchingData = false;
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
                  <a class="font-weight-bold active">{{ course.course }}</a>
                </template>
                <div class="row mt-4">
                  <div class="col-sm-3">
                    <div class="form-group">
                      <label>Kelas</label>
                      <input
                        v-model="class_course_data.class"
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
                        v-model="class_course_data.course"
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
                        v-model="class_course_data.staff"
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
                    :items="dataModules"
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
                  />
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