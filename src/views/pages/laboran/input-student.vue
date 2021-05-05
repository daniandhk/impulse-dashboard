<script>
import Multiselect from "vue-multiselect";
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import Swal from "sweetalert2";
import vue2Dropzone from "vue2-dropzone";
import store from '@/store';

/**
 * Orders Component
 */
export default {
  components: {
    Multiselect,
    vueDropzone: vue2Dropzone,
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
      title: "Student Data",
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

      //dropdown list data
      religionData: ['islam', 'protestan', 'katolik', 'buddha', 'hindu', 'khonghucu', 'kristen'],
      genderData: ['male', 'female'],
      dosenData: [],
      totalRowsStaff: 0,
      courseData: [],
      kelasData: [],

      //v-model dropdown value = array of objects
      staff_data: null,
      course_data: null,
      class_data: null,

      //dropzone
      seen: false,
      dropzoneOptions: {
        url: process.env.VUE_APP_BACKEND_URL + "/laboran/student/import",
        thumbnailWidth: 150,
        maxFilesize: 5,
        
        headers:{"Authorization":'Bearer ' + store.getters.getLoggedUser.token},
        acceptedFiles: "text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        maxFiles: 1,
        init: function() {
          this.on('addedfile', function(file) {
            console.log(file)
            if (this.files.length > 1) {
            this.removeFile(this.files[0]);
            }
          });
          this.on('error', function(file, response){
            console.log(response)
            Swal.fire("Failed to upload your file!", "Cek kembali kesesuaian file dengan deskripsi.", "error");
          });
          this.on('success', function(file, response){
            console.log(response)
            Swal.fire("Uploaded!", "Your file has been uploaded.", "success");
          })
        }
      }
    };
  },
  mounted() {
      this.loadDataDropdown();
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
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
              api.inputStudent(this.dataStudent)
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
                    console.log(error.response)
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;
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

        this.staff_data = null,
        this.course_data = null,
        this.class_data = null
    },

    getDataStaffs(params){
        return (
            api.getAllStaffs(params)
            .then(response => {
                this.totalRowsStaff = response.data.meta.pagination.total;
                this.dosenData = response.data.data;
            })
            .catch(error => {
                console.log(error)
            })
        )
    },

    getDataClassrooms(){
        return (
            api.getListClassrooms()
            .then(response => {
                this.kelasData = response.data.classes;
            })
            .catch(error => {
                console.log(error)
            })
        )
    },

    getDataCourses(){
        return (
            api.getListCourses()
            .then(response => {
                this.courseData = response.data.courses;
            })
            .catch(error => {
                console.log(error)
            })
        )
    },

    loadDataDropdown(){
        //list staff
        const params = {};
        this.getDataStaffs(params);
        params["per_page"] = this.totalRowsStaff;
        this.getDataStaffs(params);

        //list course
        this.getDataCourses();

        //list classroom
        this.getDataClassrooms();
    },

    //get value inside object in array of objects
    setStaff(value){
        this.dataStudent.staff_code = value.code;
    },

    setCourse(value){
        this.dataStudent.course_name = value.name;
        this.dataStudent.course_code = value.code;
    },

    setKelas(value){
        this.dataStudent.class_name = value.name;
        this.dataStudent.academic_year = value.academic_year;
        this.dataStudent.semester = value.semester;
    },

    removeStaff(){
        this.dataStudent.staff_code = "";
    },

    removeCourse(){
        this.dataStudent.course_name = "";
        this.dataStudent.course_code = "";
    },

    removeKelas(){
        this.dataStudent.class_name = "";
        this.dataStudent.academic_year = "";
        this.dataStudent.semester = "";
    },
  }
};
</script>

<template>
    <div div class="row mt-4">
        <div class="col-sm-12 col-md-12">
            <!-- <div title="Import Excel"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <center>
                    <b-button variant="success" @click="seen = !seen">Import Excel</b-button>
                    </center>
                    <div class="card mt-2" v-if="seen">
                        <div class="card-body">
                            <p style="color: red; font-size: 12px; margin: 0 !important;">IMPORTANT – PLEASE READ CAREFULLY</p>
                            <p class="mt-2" style="color: black; font-size: 14px; margin-bottom: 0 !important;">Deskripsi upload file Excel:</p>
                            <p class="card-title-desc" style="font-size: 14px; margin: 0 !important;">
                                - Pastikan kode dosen yang digunakan tersedia di <b>Staff Data</b>,<br>
                                - Pastikan file bertipe <b>.CSV</b> atau <b>.XSLX</b>,<br>
                                - Pastikan Header / Row ke 1 dan urutan data di dalam file sama seperti berikut ini:<br>
                            </p>
                            <img src="@/assets/images/student-excel-example.png" class="mb-4" style="box-sizing: border-box; width: 100%;"/>
                            <!-- file upload -->
                            <vue-dropzone
                                id="dropzone"
                                ref="myVueDropzone"
                                :use-custom-slot="true"
                                :options="dropzoneOptions"
                            >
                                <div class="dropzone-custom-content">
                                <i class="display-4 text-muted bx bxs-cloud-upload"></i>
                                <h4>Drop a file here or click to upload.</h4>
                                </div>
                            </vue-dropzone>
                        </div>
                    </div>
                    <center class="mt-4">
                        <p>Or</p>
                    </center>
                </div>
            </div>
        </div>
        <form class="form-horizontal col-sm-12 col-md-12 mt-4" @submit.prevent="inputStudent">
            <!-- <div title="Student Data"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <h4 class="card-title">Add Student</h4>
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
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="nim">NIM</label>
                                <input
                                    v-model="dataStudent.nim"
                                    id="nim"
                                    name="nim"
                                    type="number"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataStudent.nim.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataStudent.nim.required"
                                class="invalid-feedback"
                                >NIM is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="fullname">Nama Mahasiswa</label>
                                <input 
                                v-model="dataStudent.name"
                                id="fullname" 
                                name="fullname" 
                                type="text" 
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.name.$error }" />

                                <div
                                v-if="submitted && !$v.dataStudent.name.required"
                                class="invalid-feedback"
                                >Nama Mahasiswa is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Jenis Kelamin</label>
                            <multiselect
                                v-model="dataStudent.gender"
                                :options="genderData"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.gender.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataStudent.gender.required"
                                class="invalid-feedback"
                                >Jenis Kelamin is required.</div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Agama</label>
                            <multiselect
                                v-model="dataStudent.religion"
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
                                :options="kelasData"
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
                                :options="courseData"
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
                            <label class="control-label">Kode Dosen Mata Kuliah</label>
                            <multiselect
                                v-model="staff_data"
                                :options="dosenData"
                                label="code"
                                track-by="code"
                                @select="setStaff"
                                @remove="removeStaff"
                                :class="{ 'is-invalid': submitted && $v.dataStudent.staff_code.$error }" 
                            ></multiselect>
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