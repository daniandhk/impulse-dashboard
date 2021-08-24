<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import vue2Dropzone from "vue2-dropzone";
import Vue from 'vue';

import * as api from '@/api';
import Swal from "sweetalert2";
import moment from 'moment';

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  components: {
    Layout,
    Multiselect,
    PageHeader,
    vueDropzone: vue2Dropzone
  },
    dropzoneOptions: {
    url: "https://httpbin.org/post",
    thumbnailWidth: 150,
    maxFilesize: 0.5,
    headers: { "My-Awesome-Header": "header value" }
    },

    selected_test: "",
    test_types: ["Pretest", "Jurnal", "Posttest"],
    isPretestSelected: false,
    isJurnalSelected: false,
    isPosttestSelected: false,

    selected_soal: "",
    soal_types: ["Mutiple Choice", "Essay"],
    isMutiplechoiceSelected: false,
    isEssaySelected: false,
    dataTest: {
            test: {
                time_start: "",
                time_end: "",
            },
            question: []
        },
        questions: [],


  validations: {
    schedule_data:{
      date: { required },
      title: { required },
      room: {
        id: { required },
      },
    },
    time_start: { required },
    time_end: { required },
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  mounted: async function() {
    this.loading();
    await this.loadData().then(result=>{
      this.loading();
    });
  },
  watch: {
    $route: async function() {
      await this.loadData().then(result=>{
        this.loading();
      });
    }
  },
  data() {
    return {
      title: "Edit Schedule",
      items: [
        {
          text: "Asisten Lab",
          href: "/"
        },
        {
          text: "Schedule",
          href: "/aslab/schedule"
        },
        {
          text: "Edit",
          active: true,
        }
      ],
      schedule_data: {
        id: "",
        title: "",
        start: "",
        end: "",
        room: {
          name: "",
        },
        class_course: {
          id: "",
        },
        module: {
          index: "",
        },
        academic_year: {
          year: "",
          semester: "",
        },
        date: ""
      },
      class_course_data: {
        class: {
          name: "",
        },
        course: {
          name: "",
        },
        academic_year: {
          name: "",
        }
      },

      dataRooms: [],
      time_date: "",
      time_start: "",
      time_end: "",
      dataModules: [],

      isLoading: false,

      dataEdit:{
        time_start: null,
        time_end: null,
        name: "",
        room_id: "",
        class_course_id: "",
        academic_year_id: "",
        module_id: "",
        date: null,
      },
      submitted: false,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      inputError: null,

    dropzoneOptions: {
    url: "https://httpbin.org/post",
    thumbnailWidth: 150,
    maxFilesize: 0.5,
    headers: { "My-Awesome-Header": "header value" }
    },

    selected_test: "",
    test_types: ["Pretest", "Jurnal", "Posttest"],
    isPretestSelected: false,
    isJurnalSelected: false,
    isPosttestSelected: false,

    selected_soal: "",
    soal_types: ["Mutiple Choice", "Essay"],
    isMutiplechoiceSelected: false,
    isEssaySelected: false,
    dataTest: {
            test: {
                time_start: "",
                time_end: "",
            },
            question: []
        },
        questions: [],
        

    };
  },
  
  methods: {
    ...notificationMethods,

    selectType(value){
            if (value == "Pretest") {
                this.isPretestSelected = true;
                this.isJurnalSelected = false;
                this.isPosttestSelected = false;
            } 
            else if (value == "Jurnal") {
                this.isJurnalSelected = true;
                this.isPretestSelected = false;
                this.isPosttestSelected = false;
            }
            else if (value == "Posttest") {
                this.isPosttestSelected = true;
                this.isPretestSelected = false;
                this.isJurnalSelected = false;
            }
            
        },

        selectTypeSoal(value){
            if (value == "Mutiple Choice") {
                this.isMutiplechoiceSelected = true;
                this.isEssaySelected = false;
            } 
            else if (value == "Essay") {
                this.isEssaySelected = true;
                this.isMutiplechoiceSelected = false;
            }
            
        },

        removeType(){
            this.isPretestSelected = false;
            this.isJurnalSelected = false;
            this.isPosttestSelected = false;
        },

        removeTypeSoal(){
            this.isEssaySelected = false;
            this.isMutiplechoiceSelected = false;
        },

        addMultiple: function (questions) {
            let data = {
                text: "",
                type: "multiple_choice",
                answers: [
                    {
                        answer: "",
                        is_answer: false,
                    },
                    {
                        answer: "",
                        is_answer: false,
                    }
                ],
            }
            questions.push(data)
        },

        addEssay: function (questions) {
            let data = {
                text: "",
                type: "essay",
            }
            questions.push(data)
        }, 

        removeMultiple: function (questions, index) {
            Vue.delete(questions, index);
        },

        removeEssay: function (questions, index) {
            Vue.delete(questions, index);
        },

        addAnswer: function (question) {
            let data = {
                answer: "",
                is_answer: false,
            }
            question.answers.push(data)
        },

        removeAnswer: function (question, index) {
            Vue.delete(question.answers, index);
        },

        correctAnswers(question) {
            let data = [];
            question.answers.forEach((element, index, array) => {
                if (element.is_answer){
                    data.push(String.fromCharCode(index+1 + 64))
                }
            });
            return data;
        },

        printCorrectAnswers(question) {
            if (this.correctAnswers(question).length){
                return this.correctAnswers(question).toString().replace("[", "").replace("]", "").replace(",", ", ");
            }
            else {
                return "( harap centang jawaban yang benar )"
            }
        },

    async loadData(){
      this.setId(this.$route.params.id);
      await this.fetchData();
    },

    setId(id){
      this.schedule_data.id = id;
    },

    async fetchData(){
      return (
        api.showSchedule(this.schedule_data.id)
          .then(response => {
            this.isIdValid(response.data.data);
            if(response.data.data){
              this.schedule_data = response.data.data;
              this.getClassCourse(this.schedule_data.class_course.id);
              this.getListSchedules(this.schedule_data.class_course.id);
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
      );
    },

    isIdValid(data){
      if(data){
        return true;
      }
      else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This ID is invalid!',
            footer: 'You will be redirected to Schedule Menu',
            timer: 4000
        })
        this.$router.replace({
          name: 'aslab-schedule'
        });
      }
    },

    async getClassCourse(id){
      return (
        api.showClassCourse(id)
          .then(response => {
            if(response.data.data){
              this.class_course_data = response.data.data;
              this.class_course_data.academic_year.name = String(this.class_course_data.academic_year.name) + " / " + String(this.class_course_data.academic_year.semester);
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
      );
    },

    getListSchedules(class_course_id){
      return (
        api.showSchedules(class_course_id)
          .then(response => {
            if(response.data.data){
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
      );
    },

    generateModule(sum){
      this.dataModules = Array.from({length: sum}, (_, i) => i + 1)
    },

    getRequestParams(module) {
      let params = {};

      if (module) {
        params["module"] = module;
      }

      return params;
    },

    selectModule(value){
      this.loading();
      const params = this.getRequestParams(
        value,
      );
      const class_course_id = this.class_course_data.id;
      this.schedule_data.title = "";
      this.time_start = null;
      this.time_end = null;
      this.time_date = null;

      api.showSchedules(class_course_id, params)
          .then(response => {
            if(response.data.data){
              let schedule_id = response.data.data.id;
              this.$router.push({
                  name: 'aslab-schedule-input', 
                  params: { id: schedule_id }
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


    cancelSubmit(){
      Swal.fire({
          title: "Are you sure?",
          text: "the form that you have filled in will be reset!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Yes, cancel it!"
      }).then(result => {
          if (result.value) {
              this.loading();
              this.submitted = false;
              this.isInputCanceled = true;
              this.loadData().then(result=>{
                this.loading();
              });
              Swal.fire("Canceled!", "The form has been reset.", "success");
          }
      });
    },

    

    // selectJenisTest(value){
    //   if(value=="pretest"){
    //     let id = this.schedule_data.module.pretest_id
    //     api.getTest(id).then(response.data.data)
    //     this.test_data = response.data.data
    //   }
    // },

    // checkTestData(){
    //   if(this.test_data != null){
    //     this.isEdit =  true;
    //     if(this.test_data.test.type == 'multiple_coise')
    //     this.type_data = 
    //     this.dataTest.question = this.test_data.question
    //   } else{
    //     this.isEdit = false;
    //   }
    // },

    // submitSoal(){
    //   if(this.isEdit = true){
    //     //manggil api edit test
    //   }
    //   else{
    //     //manggil api create test, edit schedule: ganti module.
    //   }
    // },

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
    <div>
      <div class="card">
        <div class="card-body">
          <div class="row">
              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Kelas</label>
                      <input
                          v-model="class_course_data.class.name"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>

              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Mata Kuliah</label>
                      <input
                          v-model="class_course_data.course.name"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>

              <div class="col-sm-4">
                  <div class="form-group">
                      <label>Tahun / Semester</label>
                      <input
                          v-model="class_course_data.academic_year.name"
                          type="text"
                          class="form-control"
                          disabled="true"
                          style="background-color: #F0F4F6;"
                      />
                  </div>
              </div>
          </div>

          <div class="form-group text-center">
              <label>Module</label>
              <multiselect 
                class="text-center"
                v-model="schedule_data.module.index" 
                :options="dataModules"
                @select="selectModule"
                :allow-empty="false"
                :disabled="isLoading"
              ></multiselect>
          </div>
        </div>
      </div>
      <form>
                <div class="card">
                    <div class="card-body">
                        <div class="col-sm-12">
                            <div class="form-group mt-3">
                                <multiselect
                                    class="text-center"
                                    placeholder="Test Type"
                                    v-model="selected_test"
                                    :options="test_types"
                                    @select="selectType"
                                    @remove="removeType"
                                ></multiselect>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isPretestSelected || isPosttestSelected" class="mb-4">
                    <div class="card">
                        <div class="card-body">
                            <div class="col-sm-12">
                                <div class="form-group mt-3">
                                    <multiselect
                                        class="text-center"
                                        placeholder="Question's Type"
                                        v-model="selected_soal"
                                        :options="soal_types"
                                        @select="selectTypeSoal"
                                        @remove="removeTypeSoal"
                                    ></multiselect>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="isMutiplechoiceSelected" class="mb-4">
                        <h4 class="card-title">Multiple Choices</h4>
                        <div class="col-sm-12" v-for="(question, index) in dataTest.question" :key="index">
                            <div class="row">
                                <div class="text-center col-sm-1">
                                    <b-button 
                                    class="m-1"
                                    style="min-width: 75px;" 
                                    variant="outline-secondary"
                                    >{{index+1}}
                                    </b-button>
                                    <b-button 
                                    class="m-1" 
                                    size="sm" 
                                    style="min-width: 75px;" 
                                    variant="danger"
                                    v-on:click="removeMultiple(dataTest.question, index)"
                                    >remove
                                    </b-button>
                                </div>
                                <div class="card col-sm-11 mt-1">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-12">
                                                <label for="text">Pertanyaan</label>
                                                <div class="form-group">
                                                    <textarea
                                                    rows=2 
                                                    v-model="question.text"
                                                    id="text" 
                                                    name="text" 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Masukkan pertanyaan disini"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-12">
                                                <label for="text">Jawaban Benar: {{printCorrectAnswers(question)}}</label>
                                                <hr class="m-4">
                                            </div>
                                            <div class="col col-sm-12">
                                                <div class="row">
                                                    <label class="col-9">Pilihan</label>
                                                    <label class="col-3 text-right">Jawaban</label>
                                                </div>
                                                <div v-for="(answer, index) in question.answers" :key="index">
                                                    <div class="row mb-2">
                                                        <div class="col-sm-1 col-md-2 col-lg-1 text-center">
                                                            <b-button 
                                                            size="sm" 
                                                            class="mt-1 mr-1" 
                                                            style="min-width: 75px;" 
                                                            variant="light"
                                                            >{{String.fromCharCode(index+1 + 64)}}
                                                            </b-button>
                                                            <b-button
                                                            v-if="index != 0 && index != 1"
                                                            size="sm" 
                                                            class="mt-1 mr-1" 
                                                            style="min-width: 75px;" 
                                                            variant="danger"
                                                            v-on:click="removeAnswer(question, index)"
                                                            >remove
                                                            </b-button>
                                                        </div>
                                                        <div class="col-sm-10 col-md-9 col-lg-10 mt-1">
                                                            <div class="form-group">
                                                                <textarea
                                                                rows=2 
                                                                v-model="answer.answer"
                                                                id="text" 
                                                                name="text" 
                                                                type="text" 
                                                                class="form-control"
                                                                placeholder="Masukkan jawaban disini"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-1 col-md-1 col-lg-1 mt-1 text-right">
                                                            <input class="form-check-input" type="checkbox" v-model="answer.is_answer" id="defaultCheck1" />
                                                            <label for="checkbox" style="min-width: 35px;">{{answer.is_answer}}</label>
                                                        </div>
                                                    </div>
                                                    <hr>
                                                </div>
                                                <div class="text-left">
                                                    <b-button v-on:click="addAnswer(question)" size=sm variant="secondary">Tambah Pilihan</b-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <b-button v-on:click="addMultiple(dataTest.question)" variant="secondary">Tambah Soal</b-button>
                        </div>
                    </div>
                    <div v-if="isEssaySelected" class="mb-4">
                        <h4 class="card-title">Essay</h4>
                        <div class="col-sm-12" v-for="(question, index) in dataTest.question" :key="index">
                            <div class="row">
                                <div class="text-center col-sm-1">
                                    <b-button 
                                    class="m-1"
                                    style="min-width: 75px;" 
                                    variant="outline-secondary"
                                    >{{index+1}}
                                    </b-button>
                                    <b-button 
                                    class="m-1" 
                                    size="sm" 
                                    style="min-width: 75px;" 
                                    variant="danger"
                                    v-on:click="removeEssay(dataTest.question, index)"
                                    >remove
                                    </b-button>
                                </div>
                                <div class="card col-sm-11 mt-1">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-12">
                                                <label for="text">Pertanyaan</label>
                                                <div class="form-group">
                                                    <textarea
                                                    rows=2 
                                                    v-model="question.text"
                                                    id="text" 
                                                    name="text" 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Masukkan pertanyaan disini"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <b-button v-on:click="addEssay(dataTest.question)" variant="secondary">Tambah Soal</b-button>
                        </div>

                    </div>
                </div>
                <div v-if="isJurnalSelected" class="mb-4">
                        <h4 class="card-title">Upload Soal Jurnal</h4>
                        <div class="col-sm-12">
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <h4 class="card-title">Dropzone</h4>
                                            <p
                                            class="card-title-desc"
                                            >DropzoneJS is an open source library that provides drag’n’drop file uploads with image previews.</p>
                                            <!-- file upload -->
                                            <vue-dropzone
                                            id="dropzone"
                                            ref="myVueDropzone"
                                            :use-custom-slot="true"
                                            :options="dropzoneOptions"
                                            >
                                            <div class="dropzone-custom-content">
                                                <i class="display-4 text-muted bx bxs-cloud-upload"></i>
                                                <h4>Drop files here or click to upload.</h4>
                                            </div>
                                            </vue-dropzone>
                                            <div class="text-center mt-4">
                                            <button type="button" class="btn btn-primary">Send Files</button>
                                            </div>
                                        </div>
                                        <!-- end card-body -->
                                    </div>
                                    <!-- end card -->
                                </div>
                                <!-- end col -->
                            </div>
                            <!-- end row -->
                        </div>
                    </div>
            </form>
    </div>
  </Layout>
</template>