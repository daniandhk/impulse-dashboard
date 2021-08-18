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
      academic_year: { required },
      semester: { required },
    },
  },
  data() {
    return {
      //input student
      title: "Student Class Data",
      dataStudent: { 
          name: "", 
          nim: "", 
          gender: "", 
          religion: "", 
          class_name: "", 
          course_code: "", 
          course_name: "", 
          staff_code: "", 
          academic_year: "", 
          semester: "",
          },
      submitted: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      isFetchingData: false,
      isKelasNotSelected: true,

      //mahasiswa
      isNimNotAvailable: true,
      isNimFound: false,
      disabled_bg: {
			backgroundColor: "#F0F4F6",
		},

      //dropdown list data
      religionData: ['islam', 'protestan', 'katolik', 'buddha', 'hindu', 'khonghucu', 'kristen'],
      genderData: ['male', 'female'],
      dosenData: [],
      courseData: [],
      kelasData: [],
      namaKelasData: [],

      //v-model dropdown value = array of objects
      course_data: "",
      class_data: "",
    };
  },
  mounted() {
      this.loadDataDropdown();
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    loadDosenData() {
        return this.dosenData;
    },
    loadKelasData() {
        return this.kelasData;
    },
    loadCourseData() {
        return this.courseData;
    }
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
                        Swal.fire("Submitted!", "The form submitted successfully.", "success");
                    }
                })
                .catch(error => {
                    //pop up
                    this.submitted = false;
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;

                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: error
                    })
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
                this.clearForm();
                this.submitted = false;
                this.isInputCanceled = true;
                Swal.fire("Canceled!", "The form has been left blank.", "success");
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
        this.dataStudent.academic_year = "";
        this.dataStudent.semester = "";

        this.courseData = [];
        this.course_data = "";
        this.class_data = "";
    },

    getRequestParams(search) {
      let params = {};

      if (search) {
        params["search"] = search;
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

    async getDataClassrooms(namaKelasData){
        const params = this.getRequestParams(
                namaKelasData.name
        );
        return api.getListClassrooms(params)
            .then(response => {
                if (response.data.classes){
                    this.kelasData = response.data.classes;
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

    async getDataCourses(kelasData){
        return new Promise((resolve, reject) => {
            kelasData.forEach((element, index, array) => {
                const params = this.getRequestParams(
                    element.course_id
                );
                api.getListCourses(params)
                    .then(response => {
                        if (response.data.courses){
                            this.courseData = response.data.courses
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
                if (index === array.length -1) resolve();
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error
            })
        });
    },

    async setDataClassroom(kelasData, course_id){
        let data = kelasData.find(data => data.course_id === course_id);
        this.dataStudent.academic_year = data.academic_year;
        this.dataStudent.semester = data.semester;

        const params = this.getRequestParams(
                data.staff_id
        );
        return api.getListStaffs(params)
            .then(response => {
                if (response.data.staffs){
                    let staffs = response.data.staffs;
                    let staff = staffs.find(item => item.id === data.staff_id);
                    this.dataStudent.staff_code = staff.code;
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                })
            });
    },

    loadDataDropdown(){
        this.getClassroomNames();
    },

    async setKelas(value){
        this.isFetchingData = true;

        this.removeCourse();
        this.dataStudent.class_name = value.name;
        await this.getDataClassrooms(value);
        await this.getDataCourses(this.kelasData);

        this.isKelasNotSelected = false;
        this.isFetchingData = false;
    },

    async setCourse(value){
        this.isFetchingData = true;

        this.dataStudent.course_name = value.name;
        this.dataStudent.course_code = value.code;
        await this.setDataClassroom(this.kelasData, value.id);

        this.isFetchingData = false;
    },

    removeKelas(){
        this.isKelasNotSelected = true;
        this.class_data = "";
        this.dataStudent.class_name = "";
        this.courseData = [];
        this.removeCourse();
    },

    removeCourse(){
        this.course_data = "";
        this.dataStudent.course_name = "";
        this.dataStudent.course_code = "";
        this.dataStudent.academic_year = "";
        this.dataStudent.semester = "";
        this.dataStudent.staff_code = "";
    },

    checkNim(){
        this.submitted = true;
        this.$v.dataStudent.nim.$touch();
        if (this.$v.dataStudent.nim.$invalid) {
            this.submitted = false;
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: error
                })
            });
    },

    isNimChanged(){
        this.disabled_bg.backgroundColor = "#F0F4F6";
        this.isNimNotAvailable = true;
        this.submitted = false;
        this.removeMahasiswa();
    },

    setMahasiswa(data){
        this.dataStudent.name = data.name
        this.dataStudent.gender = data.gender
        this.dataStudent.religion = data.religion
    },

    removeMahasiswa(){
        this.dataStudent.name = "";
        this.dataStudent.gender = "";
        this.dataStudent.religion = "";
    }
  }
};
</script>

<template>
    <div div class="row mt-4">
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="inputStudent">
            <!-- <div title="Student Data"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <h4 class="card-title">Add Student Class</h4>
                    <p class="card-title-desc">Fill all information below</p>
                    
                    <div>
                        <b-alert
                        v-model="inputSuccess"
                        class="mt-3"
                        variant="success"
                        dismissible
                        >Input data completed successfully!</b-alert>

                        <b-alert
                        v-model="isInputError"
                        class="mt-3"
                        variant="danger"
                        dismissible
                        >{{inputError}}</b-alert>

                        <b-alert
                        v-model="isInputCanceled"
                        class="mt-3"
                        variant="success"
                        dismissible
                        >Canceled!</b-alert>

                        <b-alert
                        variant="danger"
                        class="mt-3"
                        v-if="notification.message"
                        show
                        dismissible
                        >{{notification.message}}</b-alert>
                    </div>

                    <div class="row">
                        <div class="col-sm-8">
                            <div class="form-group">
                                <label for="nim">NIM</label>
                                <div class="row">
                                    <div class="col-sm-8">
                                        <input
                                            v-model="dataStudent.nim"
                                            id="nim"
                                            name="nim"
                                            type="number"
                                            class="form-control"
                                            @input="isNimChanged"
                                            :class="{ 'is-invalid': submitted && $v.dataStudent.nim.$error }"
                                        />
                                        <div
                                        v-if="submitted && !$v.dataStudent.nim.required"
                                        class="invalid-feedback"
                                        >NIM is required.</div>
                                    </div>
                                    <div class="col-sm-4">
                                        <b-button variant="success" @click="checkNim"
                                        :class="{ 
                                            'is-invalid': submitted && !isNimFound,
                                            'is-valid': submitted && isNimFound }">Check NIM</b-button>
                                        <div
                                        v-if="!isNimFound"
                                        class="invalid-feedback"
                                        >NIM is not available, please input Name, Gender, and Religion.</div>
                                        <div
                                        v-if="isNimFound"
                                        class="valid-feedback"
                                        >NIM is available.</div>
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
                                v-model="dataStudent.name"
                                id="nama" 
                                name="nama" 
                                type="text" 
                                class="form-control"
                                :disabled="isNimNotAvailable"
                                v-bind:style="disabled_bg"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.name.$error }" />

                                <div
                                v-if="submitted && !$v.dataStudent.name.required"
                                class="invalid-feedback"
                                >Nama Mahasiswa is required.</div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="form-group">
                            <label class="control-label">Jenis Kelamin</label>
                            <multiselect
                                v-model="dataStudent.gender"
                                :disabled="isNimNotAvailable"
                                :options="genderData"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.gender.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataStudent.gender.required"
                                class="invalid-feedback"
                                >Jenis Kelamin is required.</div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="form-group">
                            <label class="control-label">Agama</label>
                            <multiselect
                                v-model="dataStudent.religion"
                                :disabled="isNimNotAvailable"
                                :options="religionData"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.religion.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataStudent.religion.required"
                                class="invalid-feedback"
                                >Agama is required.</div>
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
                                @select="setKelas"
                                @remove="removeKelas"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.class_name.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataStudent.class_name.required"
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
                                :class="{ 'is-invalid': submitted && $v.dataStudent.course_name.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataStudent.course_name.required"
                                class="invalid-feedback"
                                >Nama Mata Kuliah is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="course_code">Kode Mata Kuliah</label>
                                <input
                                    v-model="dataStudent.course_code"
                                    :disabled="true"
                                    id="course_code"
                                    name="course_code"
                                    type="text"
                                    style="background-color: #F0F4F6;"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataStudent.course_code.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataStudent.course_code.required"
                                class="invalid-feedback"
                                >Kode Mata Kuliah is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="staff_code">Kode Dosen Mata Kuliah</label>
                                <input
                                    v-model="dataStudent.staff_code"
                                    :disabled="true"
                                    id="staff_code"
                                    name="staff_code"
                                    type="text"
                                    style="background-color: #F0F4F6;"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataStudent.staff_code.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataStudent.staff_code.required"
                                class="invalid-feedback"
                                >Kode Dosen Mata Kuliah is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="academic_year">Tahun Akademik</label>
                                <input
                                    v-model="dataStudent.academic_year"
                                    :disabled="true"
                                    id="academic_year"
                                    name="academic_year"
                                    type="text"
                                    style="background-color: #F0F4F6;"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataStudent.academic_year.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataStudent.academic_year.required"
                                class="invalid-feedback"
                                >Tahun Akademik is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="semester">Semester</label>
                                <input
                                    v-model="dataStudent.semester"
                                    :disabled="true"
                                    id="semester"
                                    name="semester"
                                    type="number"
                                    style="background-color: #F0F4F6;"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataStudent.semester.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataStudent.semester.required"
                                class="invalid-feedback"
                                >Semester is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="text-center mt-4">
                        <button
                        type="submit"
                        class="btn btn-primary mr-2 waves-effect waves-light"
                        >Save Changes</button>
                        <button type="button" @click="cancelSubmit" class="btn btn-light waves-effect">Cancel</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>