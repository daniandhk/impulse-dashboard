<script>
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';
import Swal from "sweetalert2";
import store from '@/store';
import Multiselect from "vue-multiselect";

/**
 * Orders Component
 */
export default {
  components: {
    Multiselect,
  },
  validations: {
    dataClassroom: {
      name: { required },
      staff_id: { required },
      course_id: { required },
      academic_year: { required },
      semester: { required },
    },
  },
  data() {
    return {
      //input course
      title: "Classroom Data",
      dataClassroom: { 
          name: "", 
          staff_id: "",
          course_id: "",
          academic_year: "",
          semester: "",
          },
      dataDetail: {
          staff_name: "",
          course_name: "",
      },
      submitted: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,

      //dropdown list data
      staffData: [],
      courseData: [],

      //v-model dropdown value = array of objects
      staff_data: "",
      course_data: "",
    };
  },
  mounted() {
      this.loadDataDropdown();
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    loadStaffData() {
        return this.staffData;
    },
    loadCourseData() {
        return this.courseData;
    },
  },
  methods: {
    ...notificationMethods,
    
    inputClassroom() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputClassroom(this.dataClassroom)
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
                    console.log(error.response)
                    this.tryingToInput = false;
                    this.inputError = error;
                    this.isInputError = true;

                    Swal.fire({
                        type: 'error',
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
        this.dataClassroom.name = "";
        this.dataClassroom.staff_id = "";
        this.dataClassroom.course_id = "";
        this.dataClassroom.academic_year = "";
        this.dataClassroom.semester = "";

        this.dataDetail.staff_name = "";
        this.dataDetail.course_name = "";

        this.course_data = "";
        this.staff_data = "";
    },

    getStaffDatas(){
        return (
            api.getListStaffs()
            .then(response => {
                if(response.data.staffs){
                    this.staffData = response.data.staffs;
                }
            })
            .catch(error => {
                console.log(error)
            })
        )
    },

    getCourseDatas(){
        return (
            api.getListCourses()
            .then(response => {
                if(response.data.courses){
                    this.courseData = response.data.courses;
                }
            })
            .catch(error => {
                console.log(error)
            })
        )
    },

    loadDataDropdown(){
        this.getStaffDatas();
        this.getCourseDatas();
    },

    setStaff(value){
        this.dataClassroom.staff_id = value.id;
        this.dataDetail.staff_name = value.name;
    },

    removeStaff(){
        this.dataClassroom.staff_id = "";
        this.dataDetail.staff_name = "";
        this.staff_data = "";
    },

    setCourse(value){
        this.dataClassroom.course_id = value.id;
        this.dataDetail.course_name = value.name;
    },

    removeCourse(){
        this.dataClassroom.course_id = "";
        this.dataDetail.course_name = "";
        this.course_data = "";
    },
  }
};
</script>

<template>
    <div div class="row mt-4">
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="inputClassroom">
            <!-- <div title="Course Data"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <h4 class="card-title">Add Classroom</h4>
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
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="nama">Nama Kelas</label>
                                <input
                                    v-model="dataClassroom.name"
                                    v-mask="'AA-##-##'"
                                    id="nama"
                                    name="nama"
                                    type="text"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataClassroom.name.$error }"
                                />
                                <span class="text-muted">e.g IF-42-03</span>
                                <div
                                v-if="submitted && !$v.dataClassroom.name.required"
                                class="invalid-feedback"
                                >Nama Kelas is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="semester">Semester</label>
                                <input 
                                v-model="dataClassroom.semester"
                                id="semester" 
                                name="semester" 
                                type="number"
                                min="0"
                                class="form-control"
                                :class="{ 'is-invalid': submitted && $v.dataClassroom.semester.$error }" />

                                <div
                                v-if="submitted && !$v.dataClassroom.semester.required"
                                class="invalid-feedback"
                                >Semester is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="academic_year">Tahun Akademik</label>
                                <input
                                    v-model="dataClassroom.academic_year"
                                    id="academic_year"
                                    name="academic_year"
                                    type="text"
                                    class="form-control"
                                    :class="{ 'is-invalid': submitted && $v.dataClassroom.academic_year.$error }"
                                />
                                <div
                                v-if="submitted && !$v.dataClassroom.academic_year.required"
                                class="invalid-feedback"
                                >Tahun Akademik is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label class="control-label">Mata Kuliah</label>
                                <multiselect
                                    v-model="course_data"
                                    :options="courseData"
                                    label="code"
                                    track-by="id"
                                    @select="setCourse"
                                    @remove="removeCourse"
                                    :class="{ 'is-invalid': submitted && $v.dataClassroom.course_id.$error }" 
                                ></multiselect>
                                <div
                                v-if="submitted && !$v.dataClassroom.course_id.required"
                                class="invalid-feedback"
                                >Mata Kuliah is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="course_name">Nama Mata Kuliah</label>
                                <input 
                                :disabled="true"
                                style="background-color: #F0F4F6;"
                                v-model="dataDetail.course_name"
                                id="course_name" 
                                name="course_name" 
                                type="text"
                                class="form-control"/>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label class="control-label">Dosen</label>
                                <multiselect
                                    v-model="staff_data"
                                    :options="staffData"
                                    label="code"
                                    track-by="id"
                                    @select="setStaff"
                                    @remove="removeStaff"
                                    :class="{ 'is-invalid': submitted && $v.dataClassroom.staff_id.$error }" 
                                ></multiselect>
                                <div
                                v-if="submitted && !$v.dataClassroom.staff_id.required"
                                class="invalid-feedback"
                                >Dosen is required.</div>
                            </div>
                        </div>

                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="staff_name">Nama Dosen</label>
                                <input 
                                :disabled="true"
                                style="background-color: #F0F4F6;"
                                v-model="dataDetail.staff_name"
                                id="staff_name" 
                                name="staff_name" 
                                type="text"
                                class="form-control"/>
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