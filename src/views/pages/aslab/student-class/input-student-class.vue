<script>
import Multiselect from "vue-multiselect";
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';

/**
 * Orders Component
 */
export default {
  components: {
    Multiselect,
  },
  validations: {
    dataStudent: {
      name: { required },
      nim: { required },
      gender: { required },
      religion: { required },
      class_name: { required },
      course_code: { required },
      course_name: { required },
      staff_code: { required },
      staff_name: { required },
      academic_year: { required },
      semester: { required },
    },
  },
  data() {
    return {
      //input student
      title: "Kelas Praktikan",
      dataStudent: { 
          name: "", 
          nim: "", 
          gender: "", 
          religion: "", 
          class_name: "", 
          course_code: "", 
          course_name: "", 
          staff_code: "",
          staff_name: "",  
          academic_year: "", 
          semester: "",
          academic_year_id: "",
          },
      submitted: false,
      submitted_nim: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      isFetchingData: false,
      isKelasNotSelected: true,
      isCourseNotSelected: true,

      //mahasiswa
      isNimNotAvailable: true,
      isNimFound: false,
      disabled_bg: {
			backgroundColor: "#F0F4F6",
		},

      //dropdown list data
      religionData: ['islam', 'protestan', 'katolik', 'buddha', 'hindu', 'khonghucu', 'kristen'],
      genderData: ['male', 'female'],
      courseData: [],
      academicYearData: [],
      classCourseData: "",
      namaKelasData: [],

      //v-model dropdown value = array of objects
      course_data: "",
      class_data: "",
      academic_year_data: "",

      dataInput: {
          student_id: "",
          class_course_id: "",
      },
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
    }
  },
  mounted() {
      this.loadDataDropdown();
  },
  methods: {
    ...notificationMethods,
    
    inputStudent() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputStudentClass(this.dataStudent)
                .then(response => {
                    this.tryingToInput = false;
                    this.isInputError = false;
                    this.inputSuccess = true;
                
                    if (this.inputSuccess) {
                        this.clearForm();
                        this.submitted = false;
                        Swal.fire("Berhasil submit!", "Form telah berhasil di submit.", "success");
                    }
                })
                .catch(error => {
                    //pop up
                    this.submitted = false;
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;

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
      }
    },

    cancelSubmit(){
        Swal.fire({
            title: "Anda yakin?",
            text: "Form yang telah terisi akan dikosongkan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, batalkan!"
        }).then(result => {
            if (result.value) {
                this.clearForm();
                this.submitted = false;
                this.submitted_nim = false;
                this.isInputCanceled = true;
                Swal.fire("Berhasil dibatalkan!", "Form telah dikosongkan.", "success");
            }
        });
    },

    clearForm(){
        this.dataStudent.name = "";
        this.dataStudent.nim = "";
        this.dataStudent.gender = "";
        this.dataStudent.religion = "";
        this.dataStudent.class_name = "";
        this.dataStudent.course_code = "";
        this.dataStudent.course_name = "";
        this.dataStudent.staff_code = "";
        this.dataStudent.staff_name = "";
        this.dataStudent.academic_year = "";
        this.dataStudent.semester = "";
        this.dataStudent.academic_year_id = "";

        this.courseData = [];
        this.course_data = "";
        this.class_data = "";
        this.submitted = false;
        this.submitted_nim = false;
        this.nimChanged();
        this.isNimNotAvailable = true;
    },

    getRequestParams(class_name, course_name, academic_year_id) {
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
                this.dataStudent.class_name,
                null,
                null,
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
                this.dataStudent.class_name,
                this.dataStudent.course_name,
                null,
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

    async getDataClassCourse(){
        const params = this.getRequestParams(
                this.dataStudent.class_name,
                this.dataStudent.course_name,
                this.dataStudent.academic_year_id,
        );
        return api.getAllClassCourses(params)
            .then(response => {
                if (response.data.data){
                    this.classCourseData = response.data.data[0];
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

    loadDataDropdown(){
        this.getClassroomNames();
    },

    async setKelas(value){
        this.isFetchingData = true;

        this.removeCourse();
        this.dataStudent.class_name = value.name;
        await this.getDataCourses();

        this.isKelasNotSelected = false;
        this.isFetchingData = false;
    },

    async setCourse(value){
        this.isFetchingData = true;

        this.removeAcademicYear();
        this.dataStudent.course_name = value.course.name;
        this.dataStudent.course_code = value.course.code;
        
        await this.getDataAcademicYear();

        this.isCourseNotSelected = false;
        this.isFetchingData = false;
    },

    async setAcademicYear(value){
        this.isFetchingData = true;

        this.dataStudent.academic_year_id = value.academic_year.id;
        this.dataStudent.academic_year = value.academic_year.name;
        this.dataStudent.semester = value.academic_year.semester;
        this.dataStudent.staff_code = value.staff.code;
        this.dataStudent.staff_name = value.staff.name;
        await this.getDataClassCourse();

        this.dataInput.class_course_id = this.classCourseData.id;

        this.isFetchingData = false;
    },

    removeKelas(){
        this.courseData = [];

        this.isKelasNotSelected = true;

        this.class_data = "";
        this.dataStudent.class_name = "";
        this.removeCourse();
    },

    removeCourse(){
        this.academicYearData = [];

        this.isCourseNotSelected = true;

        this.course_data = "";
        this.dataStudent.course_name = "";
        this.dataStudent.course_code = "";
        this.dataStudent.academic_year_id = "";
        this.removeAcademicYear();
    },

    removeAcademicYear(){
        this.classCourseData = "";

        this.academic_year_data = "";
        this.dataStudent.academic_year = "";
        this.dataStudent.semester = "";
        this.dataStudent.staff_code = "";
        this.dataStudent.staff_name = "";
        
        this.dataInput.class_course_id = "";
    },

    checkNim(){
        this.submitted_nim = true;
        this.$v.dataStudent.nim.$touch();
        if (this.$v.dataStudent.nim.$invalid) {
            return;
        }
        return api.showStudent(this.dataStudent.nim)
            .then(response => {
                if (response.data.data){
                    this.isNimFound = true;
                    this.setMahasiswa(response.data.data)
                }
                else{
                    this.isNimFound = false;
                    this.disabled_bg.backgroundColor = "";
                    this.isNimNotAvailable = false;
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
            });
    },

    nimChanged(){
        this.disabled_bg.backgroundColor = "#F0F4F6";
        this.isNimNotAvailable = true;
        this.submitted_nim = false;
        this.removeMahasiswa();
    },

    setMahasiswa(data){
        this.dataStudent.name = data.name;
        this.dataStudent.gender = data.gender;
        this.dataStudent.religion = data.religion;

        this.dataInput.student_id = data.id;
    },

    removeMahasiswa(){
        this.dataStudent.name = "";
        this.dataStudent.gender = "";
        this.dataStudent.religion = "";

        this.dataInput.student_id = "";
    }
  }
};
</script>

<template>
  <div
    div
    class="row mt-4"
  >
    <form
      class="form-horizontal col-sm-12 col-md-12"
      @submit.prevent="inputStudent"
    >
      <!-- <div title="Student Data"> -->
      <div>
        <div
          id="metadata"
          class="tab-pane"
        >
          <h4 class="card-title">
            Tambah Kelas Praktikan
          </h4>
          <p class="card-title-desc">
            Isi semua informasi dibawah ini
          </p>
                    
          <div>
            <b-alert
              v-model="inputSuccess"
              class="mt-3"
              variant="success"
              dismissible
            >
              Input data telah berhasil!
            </b-alert>

            <b-alert
              v-model="isInputError"
              class="mt-3"
              variant="danger"
              dismissible
            >
              {{ inputError }}
            </b-alert>

            <b-alert
              v-model="isInputCanceled"
              class="mt-3"
              variant="success"
              dismissible
            >
              Berhasil dibatalkan!
            </b-alert>

            <b-alert
              v-if="notification.message"
              variant="danger"
              class="mt-3"
              show
              dismissible
            >
              {{ notification.message }}
            </b-alert>
          </div>

          <div class="row">
            <div class="col-sm-8">
              <div class="form-group">
                <label for="nim">NIM</label>
                <div class="row">
                  <div class="col-sm-8">
                    <input
                      id="nim"
                      v-model="dataStudent.nim"
                      name="nim"
                      type="number"
                      class="form-control"
                      :class="{ 'is-invalid': submitted_nim && $v.dataStudent.nim.$error }"
                      @input="nimChanged"
                    >
                    <div
                      v-if="submitted_nim && !$v.dataStudent.nim.required"
                      class="invalid-feedback"
                    >
                      NIM harus diisi!
                    </div>
                  </div>
                  <div class="col-sm-4">
                    <b-button
                      variant="success"
                      :class="{ 
                        'is-invalid': submitted_nim && !isNimFound,
                        'is-valid': submitted_nim && isNimFound }"
                      @click="checkNim"
                    >
                      Cek NIM
                    </b-button>
                    <div
                      v-if="!isNimFound"
                      class="invalid-feedback"
                    >
                      NIM is not available,<br>please input Name, Gender, and Religion.
                    </div>
                    <div
                      v-if="isNimFound"
                      class="valid-feedback"
                    >
                      NIM tersedia.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-4">
              <div class="form-group">
                <label for="nama">Nama Mahasiswa</label>
                <input 
                  id="nama"
                  v-model="dataStudent.name" 
                  name="nama" 
                  type="text" 
                  class="form-control"
                  :disabled="isNimNotAvailable"
                  :style="disabled_bg"
                  :class="{ 'is-invalid': submitted && $v.dataStudent.name.$error }"
                >

                <div
                  v-if="submitted && !$v.dataStudent.name.required"
                  class="invalid-feedback"
                >
                  Nama Mahasiswa harus diisi!
                </div>
              </div>
            </div>

            <div
              v-if="isNimNotAvailable"
              class="col-md-4"
            >
              <div class="form-group">
                <label class="control-label">Jenis Kelamin</label>
                <input
                  v-model="dataStudent.gender"
                  :disabled="isNimNotAvailable"
                  type="text" 
                  class="form-control"
                  :style="disabled_bg"
                  :class="{ 'is-invalid': submitted && $v.dataStudent.gender.$error }" 
                >
                <div
                  v-if="submitted && !$v.dataStudent.gender.required"
                  class="invalid-feedback"
                >
                  Jenis Kelamin harus diisi!
                </div>
              </div>
            </div>

            <div
              v-if="isNimNotAvailable"
              class="col-md-4"
            >
              <div class="form-group">
                <label class="control-label">Agama</label>
                <input
                  v-model="dataStudent.religion"
                  :disabled="isNimNotAvailable"
                  type="text" 
                  class="form-control"
                  :style="disabled_bg"
                  :class="{ 'is-invalid': submitted && $v.dataStudent.religion.$error }" 
                >
                <div
                  v-if="submitted && !$v.dataStudent.religion.required"
                  class="invalid-feedback"
                >
                  Agama harus diisi!
                </div>
              </div>
            </div>

            <div
              v-if="!isNimNotAvailable"
              class="col-md-4"
            >
              <div class="form-group">
                <label class="control-label">Jenis Kelamin</label>
                <multiselect
                  v-model="dataStudent.gender"
                  :disabled="isNimNotAvailable"
                  :options="genderData"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.dataStudent.gender.$error }" 
                />
                <div
                  v-if="submitted && !$v.dataStudent.gender.required"
                  class="invalid-feedback"
                >
                  Jenis Kelamin harus diisi!
                </div>
              </div>
            </div>

            <div
              v-if="!isNimNotAvailable"
              class="col-md-4"
            >
              <div class="form-group">
                <label class="control-label">Agama</label>
                <multiselect
                  v-model="dataStudent.religion"
                  :disabled="isNimNotAvailable"
                  :options="religionData"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.dataStudent.religion.$error }" 
                />
                <div
                  v-if="submitted && !$v.dataStudent.religion.required"
                  class="invalid-feedback"
                >
                  Agama harus diisi!
                </div>
              </div>
            </div>
          </div>

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
                  :class="{ 'is-invalid': submitted && $v.dataStudent.class_name.$error }"
                  @select="setKelas"
                  @remove="removeKelas" 
                />
                <div
                  v-if="submitted && !$v.dataStudent.class_name.required"
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
                  :class="{ 'is-invalid': submitted && $v.dataStudent.course_name.$error }"
                  @select="setCourse"
                  @remove="removeCourse" 
                />
                <div
                  v-if="submitted && !$v.dataStudent.course_name.required"
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
                  :class="{ 'is-invalid': submitted && $v.dataStudent.course_code.$error }"
                  @select="setCourse"
                  @remove="removeCourse" 
                />
                <div
                  v-if="submitted && !$v.dataStudent.course_code.required"
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
                  :class="{ 'is-invalid': submitted && $v.dataStudent.academic_year.$error }"
                  @select="setAcademicYear"
                  @remove="removeAcademicYear" 
                />
                <div
                  v-if="submitted && !$v.dataStudent.academic_year.required"
                  class="invalid-feedback"
                >
                  Tahun Akademik (Semester) harus diisi!
                </div>
              </div>
            </div>

            <div class="col-sm-4">
              <div class="form-group">
                <label for="staff_name">Nama Dosen Mata Kuliah</label>
                <input
                  id="staff_name"
                  v-model="dataStudent.staff_name"
                  :disabled="true"
                  name="staff_name"
                  type="text"
                  style="background-color: #F0F4F6;"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataStudent.staff_name.$error }"
                >
                <div
                  v-if="submitted && !$v.dataStudent.staff_name.required"
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
                  v-model="dataStudent.staff_code"
                  :disabled="true"
                  name="staff_code"
                  type="text"
                  style="background-color: #F0F4F6;"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataStudent.staff_code.$error }"
                >
                <div
                  v-if="submitted && !$v.dataStudent.staff_code.required"
                  class="invalid-feedback"
                >
                  Kode Dosen Mata Kuliah harus diisi!
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <button
              type="submit"
              class="btn btn-primary mr-2 waves-effect waves-light"
            >
              Simpan
            </button>
            <button
              type="button"
              class="btn btn-light waves-effect"
              @click="cancelSubmit"
            >
              Batalkan
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>