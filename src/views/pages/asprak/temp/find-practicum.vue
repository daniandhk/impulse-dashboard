<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";

import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Cari Jadwal",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    Multiselect,
    PageHeader
  },
  validations: {
    course_data: { required },
    class_data: { required },
    academic_year_data: { required },
    module_index: { required },
    staff_name: { required },
    staff_code: { required },

  },
  data() {
    return {
      title: "Cari Jadwal",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "Jadwal",
          href: "/asprak/schedule"
        },
        {
          text: "Cari",
          active: true,
        }
      ],

      asprak_id: store.getters.getLoggedUser.id,
      class_name: "",
      course_name: "",
      course_code: "",
      academic_year_id: "",

      submitted: false,
      isFetchingData: false,
      isKelasNotSelected: true,
      isCourseNotSelected: true,

      courseData: [],
      academicYearData: [],
      scheduleData: [],
      namaKelasData: [],
      moduleData: [],

      course_data: "",
      class_data: "",
      academic_year_data: "",
      staff_code: "",
      staff_name: "",
      module_index: "",
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    loadCourseData() {
        return this.courseData;
    },
    loadAcademicYearData() {
        return this.academicYearData;
    },
  },
  watch: {
    $route: async function() {
        this.loading(true);
        await this.loadDataDropdown();
        this.loading(false);
    }
  },
  mounted: async function() {
    await this.loadDataDropdown();
  },
  methods: {
    ...notificationMethods,

    getRequestParams(class_name, course_name, academic_year_id, asprak_id) {
      let params = {};

      if (class_name) {
        params["class_name"] = class_name;
      }

      if (course_name) {
        params["course_name"] = course_name;
      }

      if (academic_year_id) {
        params["academic_year_id"] = academic_year_id;
      }

      if (asprak_id) {
        params["asprak_id"] = asprak_id;
      }

      return params;
    },

    getClassroomNames(){
        return (
            api.getByNameClassrooms()
            .then(response => {
                if(response.data.classes){
                    this.namaKelasData = response.data.classes;
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

    async getDataCourses(){
        const params = this.getRequestParams(
                this.class_name,
                null,
                null,
                this.asprak_id,
        );
        return api.getAllClassCourses(params)
            .then(response => {
                if (response.data.data){
                    this.courseData = response.data.data;
                    this.courseData.forEach(function (element) {
                        element.name = element.course.name;
                        element.code = element.course.code;
                    });
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
    },

    async getDataAcademicYear(){
        const params = this.getRequestParams(
                this.class_name,
                this.course_name,
                null,
                this.asprak_id,
        );
        return api.getAllClassCourses(params)
            .then(response => {
                if (response.data.data){
                    this.academicYearData = response.data.data;
                    this.academicYearData.forEach(function (element) {
                        element.name = String(element.academic_year.name) + " (" + String(element.academic_year.semester) + ")";
                    });
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
    },

    async getDataSchedule(){
        const params = this.getRequestParams(
                this.class_name,
                this.course_name,
                this.academic_year_id,
                this.asprak_id,
        );
        return api.getAllSchedules(params)
            .then(response => {
                if (response.data.data){
                    this.scheduleData = response.data.data;
                    this.generateModule(response.data.data.length);
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
    },

    generateModule(sum){
      this.moduleData = Array.from({length: sum}, (_, i) => i + 1)
    },

    loadDataDropdown(){
        this.getClassroomNames();
    },

    async setKelas(value){
        this.isFetchingData = true;

        this.removeCourse();
        this.class_name = value.name;
        await this.getDataCourses();

        this.isKelasNotSelected = false;
        this.isFetchingData = false;
    },

    async setCourse(value){
        this.isFetchingData = true;

        this.removeAcademicYear();
        this.course_name = value.course.name;
        this.course_code = value.course.code;
        await this.getDataAcademicYear();

        this.isCourseNotSelected = false;
        this.isFetchingData = false;
    },

    async setAcademicYear(value){
        this.loading(true);
        this.isFetchingData = true;

        this.academic_year_id = value.academic_year.id;
        this.staff_code = value.staff.code;
        this.staff_name = value.staff.name;

        await this.getDataSchedule();

        this.isFetchingData = false;
        this.loading(false);
    },

    selectModule(value){
        let schedule = this.scheduleData.find(data => data.module.index === value);
        this.schedule_id = schedule.id;
    },

    removeKelas(){
        this.courseData = [];

        this.isKelasNotSelected = true;

        this.class_data = "";
        this.class_name = "";
        this.removeCourse();
    },

    removeCourse(){
        this.academicYearData = [];

        this.isCourseNotSelected = true;

        this.course_data = "";
        this.course_name = "";
        this.course_code = "";
        this.academic_year_id = "";
        this.removeAcademicYear();
    },

    removeAcademicYear(){
        this.scheduleData = "";

        this.academic_year_data = "";
        this.staff_code = "";
        this.staff_name = "";
    },

    removeModule(){
        this.schedule_id = "";
    },

    findSchedule(){
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
            return;
        } else {
            this.$router.push({
                name: 'asprak-practicum-detail', 
                params: { id: this.schedule_id }
            });
        }
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

  },
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
    <div class="card">
      <div class="card-body">
        <form
          class="form-horizontal col-sm-12 col-md-12"
          @submit.prevent="findSchedule"
        >
          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label class="control-label">Kelas Mata Kuliah</label>
                <multiselect
                  v-model="class_data"
                  :options="namaKelasData"
                  label="name"
                  track-by="name"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.class_data.$error }"
                  @select="setKelas"
                  @remove="removeKelas" 
                />
                <div
                  v-if="submitted && !$v.class_data.required"
                  class="invalid-feedback"
                >
                  Kelas Mata Kuliah harus diisi!
                </div>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="form-group">
                <label class="control-label">Nama Mata Kuliah</label>
                <multiselect
                  v-model="course_data"
                  :options="loadCourseData"
                  :disabled="isKelasNotSelected"
                  label="name"
                  track-by="name"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.course_data.$error }"
                  @select="setCourse"
                  @remove="removeCourse" 
                />
                <div
                  v-if="submitted && !$v.course_data.required"
                  class="invalid-feedback"
                >
                  Nama Mata Kuliah harus diisi!
                </div>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="form-group">
                <label class="control-label">Kode Mata Kuliah</label>
                <multiselect
                  v-model="course_data"
                  :options="loadCourseData"
                  :disabled="isKelasNotSelected"
                  label="code"
                  track-by="code"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.course_data.$error }"
                  @select="setCourse"
                  @remove="removeCourse" 
                />
                <div
                  v-if="submitted && !$v.course_data.required"
                  class="invalid-feedback"
                >
                  Kode Mata Kuliah harus diisi!
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label class="control-label">Tahun Akademik (Semester)</label>
                <multiselect
                  v-model="academic_year_data"
                  :options="loadAcademicYearData"
                  :disabled="isCourseNotSelected"
                  label="name"
                  track-by="name"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.academic_year_data.$error }"
                  @select="setAcademicYear"
                  @remove="removeAcademicYear" 
                />
                <div
                  v-if="submitted && !$v.academic_year_data.required"
                  class="invalid-feedback"
                >
                  Tahun Akademik (Semester) harus diisi!
                </div>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="form-group">
                <label for="staff_code">Nama Dosen Mata Kuliah</label>
                <input
                  id="staff_name"
                  v-model="staff_name"
                  :disabled="true"
                  name="staff_name"
                  type="text"
                  style="background-color: #F0F4F6;"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.staff_name.$error }"
                >
                <div
                  v-if="submitted && !$v.staff_name.required"
                  class="invalid-feedback"
                >
                  Nama Dosen Mata Kuliah harus diisi!
                </div>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="form-group">
                <label for="staff_code">Kode Dosen Mata Kuliah</label>
                <input
                  id="staff_code"
                  v-model="staff_code"
                  :disabled="true"
                  name="staff_code"
                  type="text"
                  style="background-color: #F0F4F6;"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.staff_code.$error }"
                >
                <div
                  v-if="submitted && !$v.staff_code.required"
                  class="invalid-feedback"
                >
                  Kode Dosen Mata Kuliah harus diisi!
                </div>
              </div>
            </div>
          </div>

          <div class="form-group text-center">
            <label>Modul</label>
            <multiselect 
              v-model="module_index"
              class="text-center" 
              :options="moduleData"
              select-label=""
                  selected-label="x"
                  deselect-label="x"
              :class="{ 'is-invalid': submitted && $v.module_index.$error }"
              @select="selectModule"
              @remove="removeModule" 
            />
            <div
              v-if="submitted && !$v.module_index.required"
              class="invalid-feedback"
            >
              Modul harus diisi!
            </div>
          </div>

          <div class="text-center mt-4">
            <button
              type="submit"
              class="btn btn-success waves-effect waves-light"
              style="min-width: 150px;"
            >
              Find
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>