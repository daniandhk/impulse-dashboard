<script>
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
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
    dataInput: {
      staff_id: { required },
      class_id: { required },
      course_id: { required },
      academic_year_id: { required },
    },
  },
  data() {
    return {
      //input course
      title: "Course Class Data",
      dataInput: { 
          staff_id: "", 
          class_id: "",
          course_id: "", 
          academic_year_id: "",
          },
      dataDropdown:{
          classes: [],
          courses: [],
          staffs: [],
          academic_year: [],
      },
      dataDetail: {
          course_data: "",
          class_data: "",
          staff_data: "",
          academic_year_data: "",
      },
      submitted: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  mounted() {
      this.loadDataDropdown();
  },
  methods: {
    ...notificationMethods,
    
    inputData() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          return (
              api.inputClassCourse(this.dataInput)
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
        this.removeKelas();
        this.removeYear();
        this.removeCourse();
        this.removeStaff();

        this.dataDetail.class_data = "";
        this.dataDetail.course_data = "";
        this.dataDetail.staff_data = "";
        this.dataDetail.academic_year_data = "";
    },

    loadDataDropdown(){
        this.getDataDropdown();
    },

    getDataDropdown(){
        return (
            api.getClassCourseStaffYear()
            .then(response => {
                if(response.data.data){
                    this.setDataDropdown(response.data.data);
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

    setDataDropdown(data){
        data.academic_year.forEach((element, index, array) => {
            element.year = String(element.year) + " (" + String(element.semester) + ")"
        });
        this.dataDropdown = data;
    },

    selectKelas(value){
        this.dataInput.class_id = value.id;
    },

    removeKelas(){
        this.dataInput.class_id = "";
    },

    selectYear(value){
        this.dataInput.academic_year_id = value.id;
    },

    removeYear(){
        this.dataInput.academic_year_id = "";
    },

    selectCourse(value){
        this.dataInput.course_id = value.id;
    },

    removeCourse(){
        this.dataInput.course_id = "";
    },

    selectStaff(value){
        this.dataInput.staff_id = value.id;
    },

    removeStaff(){
        this.dataInput.staff_id = "";
    },
  }
};
</script>

<template>
    <div div class="row mt-4">
        <form class="form-horizontal col-sm-12 col-md-12" @submit.prevent="inputData">
            <!-- <div title="Data Data"> -->
            <div>
                <div class="tab-pane" id="metadata">
                    <h4 class="card-title">Add Class Course</h4>
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
                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Nama Kelas</label>
                            <multiselect
                                v-model="dataDetail.class_data"
                                :options="dataDropdown.classes"
                                label="name"
                                track-by="name"
                                @select="selectKelas"
                                @remove="removeKelas"
                                :class="{ 'is-invalid': submitted && $v.dataInput.class_id.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataInput.class_id.required"
                                class="invalid-feedback"
                                >Nama Kelas is required.</div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Tahun Akademik (Semester)</label>
                            <multiselect
                                v-model="dataDetail.academic_year_data"
                                :options="dataDropdown.academic_year"
                                label="year"
                                track-by="year"
                                @select="selectYear"
                                @remove="removeYear"
                                :class="{ 'is-invalid': submitted && $v.dataInput.academic_year_id.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataInput.academic_year_id.required"
                                class="invalid-feedback"
                                >Tahun Akademik (Semester) is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Kode Mata Kuliah</label>
                            <multiselect
                                v-model="dataDetail.course_data"
                                :options="dataDropdown.courses"
                                label="code"
                                track-by="code"
                                @select="selectCourse"
                                @remove="removeCourse"
                                :class="{ 'is-invalid': submitted && $v.dataInput.course_id.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataInput.course_id.required"
                                class="invalid-feedback"
                                >Mata Kuliah is required.</div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Nama Mata Kuliah</label>
                            <multiselect
                                v-model="dataDetail.course_data"
                                :options="dataDropdown.courses"
                                label="name"
                                track-by="name"
                                @select="selectCourse"
                                @remove="removeCourse"
                                :class="{ 'is-invalid': submitted && $v.dataInput.course_id.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataInput.course_id.required"
                                class="invalid-feedback"
                                >Mata Kuliah is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Kode Dosen</label>
                            <multiselect
                                v-model="dataDetail.staff_data"
                                :options="dataDropdown.staffs"
                                label="code"
                                track-by="code"
                                @select="selectStaff"
                                @remove="removeStaff"
                                :class="{ 'is-invalid': submitted && $v.dataInput.staff_id.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataInput.staff_id.required"
                                class="invalid-feedback"
                                >Dosen is required.</div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-group">
                            <label class="control-label">Nama Dosen</label>
                            <multiselect
                                v-model="dataDetail.staff_data"
                                :options="dataDropdown.staffs"
                                label="name"
                                track-by="name"
                                @select="selectStaff"
                                @remove="removeStaff"
                                :class="{ 'is-invalid': submitted && $v.dataInput.staff_id.$error }" 
                            ></multiselect>
                                <div
                                v-if="submitted && !$v.dataInput.staff_id.required"
                                class="invalid-feedback"
                                >Dosen is required.</div>
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