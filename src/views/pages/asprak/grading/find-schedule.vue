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
      title: "Find List Test",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "Grading",
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

      course_data: "",
      class_data: "",
      academic_year_data: "",
      staff_code: "",
      staff_name: "",
      module_index: "",
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
                    text: 'Something went wrong!',
                    footer: error
                })
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
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
                    text: 'Something went wrong!',
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
                    text: 'Something went wrong!',
                    footer: error
                })
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
                            :class="{ 'is-invalid': submitted && $v.class_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.class_data.required"
                            class="invalid-feedback"
                            >Kelas Mata Kuliah is required.</div>
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
                            :class="{ 'is-invalid': submitted && $v.course_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.course_data.required"
                            class="invalid-feedback"
                            >Nama Mata Kuliah is required.</div>
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
                            :class="{ 'is-invalid': submitted && $v.course_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.course_data.required"
                            class="invalid-feedback"
                            >Kode Mata Kuliah is required.</div>
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
                            :class="{ 'is-invalid': submitted && $v.academic_year_data.$error }" 
                        ></multiselect>
                            <div
                            v-if="submitted && !$v.academic_year_data.required"
                            class="invalid-feedback"
                            >Tahun Akademik (Semester) is required.</div>
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
                            >Nama Dosen Mata Kuliah is required.</div>
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
                            >Kode Dosen Mata Kuliah is required.</div>
                        </div>
                    </div>
                </div>

                <div class="form-group text-center">
                    <label>Module</label>
                    <multiselect 
                        class="text-center"
                        v-model="module_index" 
                        :options="moduleData"
                        @select="selectModule"
                        @remove="removeModule"
                        :class="{ 'is-invalid': submitted && $v.module_index.$error }" 
                    ></multiselect>
                    <div
                    v-if="submitted && !$v.module_index.required"
                    class="invalid-feedback"
                    >Module is required.</div>
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
  </Layout>
</template>