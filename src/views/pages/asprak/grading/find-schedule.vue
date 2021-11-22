<script>
import Layout from "../../../layouts/main";
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
    title: "Penilaian",
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
    recap_course: { required },

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
  mounted: async function() {
    await this.loadDataDropdown();
  },
  watch: {
    $route: async function() {
      await this.loadDataDropdown().then(result=>{
        this.loading();
      });
    }
  },
  data() {
    return {
      title: "Cari Modul",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "Penilaian",
          active: true,
        }
      ],

      asprak_id: store.getters.getLoggedUser.id,

      submitted: false,
      isFetchingData: false,
      isKelasNotSelected: true,
      isCourseNotSelected: true,

      courseData: [],
      academicYearData: [],
      scheduleData: [],
      namaKelasData: [],
      moduleData: [],
      coursesData: [],

      course_data: "",
      class_data: "",
      academic_year_data: "",
      staff_code: "",
      staff_name: "",
      module_index: "",
      recap_course: "",
      course_id: "",
      submitted_recap: false,
    };
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan!',
                    footer: error
                })
            })
        )
    },

    async getDataClassCourses(){
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan!',
                    footer: error
                })
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan!',
                    footer: error
                })
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan!',
                    footer: error
                })
            })
    },

    generateModule(sum){
      this.moduleData = Array.from({length: sum}, (_, i) => i + 1)
    },

    loadDataDropdown(){
        this.getClassroomNames();
        this.getDataCourses();
    },

    async setKelas(value){
        this.isFetchingData = true;

        this.removeCourse();
        this.class_name = value.name;
        await this.getDataClassCourses();

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
        this.isFetchingData = true;

        this.academic_year_id = value.academic_year.id;
        this.staff_code = value.staff.code;
        this.staff_name = value.staff.name;

        this.loading();
        await this.getDataSchedule().then(result=>{
            this.loading();
        });

        this.isFetchingData = false;
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
                name: 'asprak-grading-list', 
                params: { id: this.schedule_id }
            });
        }
    },

    async getDataCourses(){
        return (
            api.getListCourses()
            .then(response => {
                if(response.data.courses){
                    this.coursesData = response.data.courses;
                }
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

    selectRecapCourse(value){
        this.course_id = value.id;
    },

    removeRecapCourse(){
        this.course_id = "";
    },

    downloadRecap(){
        this.submitted_recap = true;
        this.$v.recap_course.$touch();
        if (this.$v.recap_course.$invalid) {
            return;
        } else {
            this.loading();
            return (
                api.downloadRekapNilai(this.course_id)
                .then(response => {
                    let blob = new Blob([response.data])
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = this.recap_course.name + ".xlsx"
                    link.click()

                    this.loading();
                    Swal.fire("Berhasil diunduh!", "File telah terunduh.", "success");
                })
                .catch(error => {
                    this.loading();
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Terjadi kesalahan!',
                        footer: error
                    })
                })
            );
        }
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
    <div class="card">
        <div class="card-body">
            <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="findSchedule">
                <div class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                        <label class="control-label">Kelas Mata Kuliah</label>
                        <multiselect
                            v-model="class_data"
                            :options="namaKelasData"
                            label="name"
                            track-by="name"
                            @select="setKelas"
                            @remove="removeKelas"
                            :show-labels="false"
                            :class="{ 'is-invalid': submitted && $v.class_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.class_data.required"
                            class="invalid-feedback"
                            >Kelas Mata Kuliah harus diisi!</div>
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
                            @select="setCourse"
                            @remove="removeCourse"
                            :show-labels="false"
                            :class="{ 'is-invalid': submitted && $v.course_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.course_data.required"
                            class="invalid-feedback"
                            >Nama Mata Kuliah harus diisi!</div>
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
                            @select="setCourse"
                            @remove="removeCourse"
                            :show-labels="false"
                            :class="{ 'is-invalid': submitted && $v.course_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.course_data.required"
                            class="invalid-feedback"
                            >Kode Mata Kuliah harus diisi!</div>
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
                            @select="setAcademicYear"
                            @remove="removeAcademicYear"
                            :show-labels="false"
                            :class="{ 'is-invalid': submitted && $v.academic_year_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.academic_year_data.required"
                            class="invalid-feedback"
                            >Tahun Akademik (Semester) harus diisi!</div>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <div class="form-group">
                            <label for="staff_code">Nama Dosen Mata Kuliah</label>
                            <input
                                v-model="staff_name"
                                :disabled="true"
                                id="staff_name"
                                name="staff_name"
                                type="text"
                                style="background-color: #F0F4F6;"
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.staff_name.$error }"
                            />
                            <div
                            v-if="submitted && !$v.staff_name.required"
                            class="invalid-feedback"
                            >Nama Dosen Mata Kuliah harus diisi!</div>
                        </div>
                    </div>

                    <div class="col-sm-4">
                        <div class="form-group">
                            <label for="staff_code">Kode Dosen Mata Kuliah</label>
                            <input
                                v-model="staff_code"
                                :disabled="true"
                                id="staff_code"
                                name="staff_code"
                                type="text"
                                style="background-color: #F0F4F6;"
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.staff_code.$error }"
                            />
                            <div
                            v-if="submitted && !$v.staff_code.required"
                            class="invalid-feedback"
                            >Kode Dosen Mata Kuliah harus diisi!</div>
                        </div>
                    </div>
                </div>

                <div class="form-group text-center">
                    <label>Modul</label>
                    <multiselect 
                        class="text-center"
                        v-model="module_index" 
                        :options="moduleData"
                        @select="selectModule"
                        @remove="removeModule"
                        :show-labels="false"
                        :class="{ 'is-invalid': submitted && $v.module_index.$error }" 
                    ></multiselect>
                    <div
                    v-if="submitted && !$v.module_index.required"
                    class="invalid-feedback"
                    >Modul harus diisi!</div>
                </div>

                <div class="text-center mt-4">
                    <button
                    type="submit"
                    class="btn btn-success waves-effect waves-light"
                    style="min-width: 150px;"
                    >Find</button>
                </div>
            </form>
        </div>
    </div>
    <div class="card">
        <div class="card-body">
            <div class="text-center form-group mb-0">
                <h5 class="text-center font-size-15 text-uppercase">Unduh Rekap Nilai / Presensi</h5>
                <div class="row row-no-gutters justify-content-center text-center mt-3">
                    <div class="form-group m-2">
                        <multiselect
                            v-model="recap_course"
                            placeholder="Mata Kuliah"
                            :options="coursesData"
                            style="min-width: 325px;" 
                            label="name"
                            track-by="name"
                            @select="selectRecapCourse"
                            @remove="removeRecapCourse"
                            :show-labels="false"
                            :class="{ 'is-invalid': submitted_recap && $v.recap_course.$error }" 
                        ></multiselect>
                        <div
                        v-if="submitted_recap && !$v.recap_course.required"
                        class="invalid-feedback"
                        >Mata Kuliah harus dipilih!</div>
                    </div>
                    <div class="m-2">
                        <button 
                            type="button" 
                            @click="downloadRecap" 
                            class="btn btn-primary waves-effect"
                        >Download</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </Layout>
</template>