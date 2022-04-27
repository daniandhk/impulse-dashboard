<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import vue2Dropzone from "vue2-dropzone";

import * as api from '@/api';
import Swal from "sweetalert2";
import Vue from 'vue';
import store from '@/store';

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";

import Quill from 'quill';
import ImageResize from "../../../modules/image-resize.min";
import { ImageDrop } from 'quill-image-drop-module';

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);
// import theme style
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

/**
 * Advanced-form component
 */
const greaterThanZero = (value) => value > 0

export default {
  page: {
    title: "Edit Jadwal",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    Multiselect,
    PageHeader,
    vueDropzone: vue2Dropzone,
  },
  validations: {
    dataTest: {
        type: { required },
        test_type: { required },
        module_id: { required },
        questions: {
          $each: {
              text: { required },
              weight: { required, maxValue: greaterThanZero },
          }
        }
    },
  },
  data() {
    return {
      title: "Input Soal",
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
          text: "Input Soal",
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
          id: "",
          index: "",
        },
        academic_year: {
          year: "",
          semester: "",
        },
        date: "",
        time_start: "",
        time_end: "",
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

      dataModules: [],

      isLoading: false,

      //input test
      test_id: "",
      tests: ["Tes Awal", "Jurnal", "Tes Akhir"],
      selected_test: "",

      types: ["Pilihan Ganda", "Esai", "Upload File"],
      selected_type: "",

      dataTest: {
          type: "",
          test_type: "",
          module_id: "",
          questions: []
      },

      isLoadedData: false,
      isUnsavedData: false,

      submitted_test: false,
      tryingToInputTest: false,
      isInputTestError: false,
      inputTestSuccess: false,
      isInputTestCanceled: false,
      inputError: null,

      //upload file
      dropzoneOptions: {
        url: process.env.VUE_APP_BACKEND_URL + "/schedule/create-test",
        thumbnailWidth: 150,
        maxFilesize: 50,
        
        headers:{"Authorization":'Bearer ' + store.getters.getLoggedUser.token},
        acceptedFiles: ".pdf,.doc,.docx,.rar,.zip,application/pdf,application/rar,application/zip",
        maxFiles: 1,
        init: function() {
          this.on('addedfile', function(file) {
            if (this.files.length > 1) {
              this.removeFile(this.files[0]);
            }
          });
          this.on('error', function(file, response){
            Swal.fire({
                icon: 'error',
                title: 'Gagal mengunggah file!',
                text: 'Cek kembali kesesuaian deskripsi.',
            })
          });
          this.on('success', function(file, response){
            Swal.fire({
                icon: 'success',
                title: 'Berhasil diunggah!',
                text: 'File telah terunggah.',
            })
          })
        }
      },

      room: {
        name: "",
        desc: "",
        msteam_link: "",
        msteam_code: "",
      },

      isRuanganShowed: false,

      editorPertanyaan: {
        placeholder: "Masukkan pertanyaan disini",
        modules: {
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          },
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ],
        }
      },
      editorJawaban: {
        placeholder: "Masukkan jawaban disini",
        modules: {
          imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          },
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ],
        }
      },

    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    $route: async function() {
      this.loading(true);
      await this.loadData();
      this.loading(false);
    }
  },
  mounted: async function() {
    this.loading(true);
    await this.loadData();
    this.loading(false);
  },
  methods: {
    ...notificationMethods,

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

    isIdValid(data){
      if(data){
        return true;
      }
      else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ID tidak valid!',
            footer: 'Anda dialihkan ke menu Jadwal',
            timer: 4000
        })
        this.$router.replace({
          name: 'asprak-schedule'
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

    getListSchedules(class_course_id){
      return (
        api.showSchedules(class_course_id)
          .then(response => {
            if(response.data.data){
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
      this.loading(true);
      const params = this.getRequestParams(
        value,
      );
      const class_course_id = this.class_course_data.id;
      this.schedule_data.title = "";
      this.time_start = null;
      this.time_end = null;
      this.time_date = null;

      //emptying input test
      this.submitted_test = false;
      this.selected_test = "";
      this.selected_type = "",
      this.dataTest = {
          type: "",
          test_type: "",
          module_id: "",
          questions: []
      };
      this.inputTestSuccess = false;
      this.isUnsavedData = false;
      this.isLoadedData = false;

      api.showSchedules(class_course_id, params)
          .then(response => {
            if(response.data.data){
              let schedule_id = response.data.data[0].id;
              this.$router.push({
                  name: 'asprak-schedule-test', 
                  params: { id: schedule_id }
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

      this.loading(false);
    },

    //input test
    async selectTest(value){
      //emptying data
      this.selected_type = "";
      this.isUnsavedData = false;
      this.inputTestSuccess = false;
      this.isLoadedData = false;
      
      //load data
      if(value == "Jurnal"){
        this.test_id = this.schedule_data.module.journal_id;
        this.dataTest.test_type = "journal";
      }
      else if(value == "Tes Awal"){
        this.test_id = this.schedule_data.module.pretest_id;
        this.dataTest.test_type = "pretest";
      }
      else if(value == "Tes Akhir"){
        this.test_id = this.schedule_data.module.posttest_id;
        this.dataTest.test_type = "posttest";
      }
      if(this.test_id){
        await this.showTest(this.test_id);
      }
      else{
        this.dataTest.type = "";
        this.dataTest.questions = [];
        this.addQuestion(this.dataTest.questions);
      }
    },

    removeTest(){
      this.isUnsavedData = false;
      this.inputTestSuccess = false;
      this.isLoadedData = false;

      this.test_id = "";
      this.dataTest.test_type = "";
    },

    selectType(value){
      this.isUnsavedData = true;
      this.inputTestSuccess = false;
      this.isLoadedData = false;

      if(value == "Esai"){
        this.dataTest.type = "essay"
      }
      else if(value == "Pilihan Ganda"){
        this.dataTest.type = "multiple_choice"
      }
      else if(value == "Upload File"){
        this.dataTest.type = "file"
        if(!this.dataTest.questions.length){
          this.addQuestion(this.dataTest.questions)
        }
      }
    },

    removeType(){
      this.isUnsavedData = false;
      this.inputTestSuccess = false;
      this.isLoadedData = false;

      this.dataTest.type = "";
    },
    async showTest(test_id){
        return (
            api.showTest(test_id)
            .then(response => {
                if(response.data.data){
                  let data = response.data.data
                  this.dataTest.type = data.test.type;
                  this.dataTest.questions = [];

                  if(data.test.type == "multiple_choice"){
                    this.selected_type = "Pilihan Ganda"
                  }
                  else if(data.test.type == "essay"){
                    this.selected_type = "Esai"
                  }
                  else if(data.test.type == "file"){
                    this.selected_type = "Upload File"
                  }

                  data.question.forEach((element, index, array) => {
                      let question = {
                        text: element.question,
                        weight: Number(element.weight),
                        answer: (element.answers.length) ? element.answers[0].answer : "",
                        options: [],
                      }
                      element.answers.forEach((element_answer, index_answer, array_answer) => {
                        let option = {
                          text: element_answer.answer,
                          is_answer: element_answer.is_answer,
                        }
                        question.options.push(option);
                      });
                        
                      this.dataTest.questions.push(question);
                  });

                  this.isLoadedData = true;
                  this.inputTestSuccess = false;
                  this.isUnsavedData = false;
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

    addQuestion: function (questions) {
        this.inputedData();
        let data = {
              text: "",
              weight: 0,
              answer: "",
              options: [
                {
                  text: "",
                  is_answer: false,
                },
                {
                  text: "",
                  is_answer: false,
                },
              ],
            }
        
        questions.push(data)
    },
    removeQuestion: function (questions, index) {
        this.inputedData();

        Vue.delete(questions, index);
    },

    addAnswer: function (question) {
        this.inputedData();

        let data = {
            text: "",
            is_answer: false,
        }
        question.options.push(data)
    },
    removeAnswer: function (question, index) {
        this.inputedData();
        
        Vue.delete(question.options, index);
    },
    correctAnswers(question) {
        let data = [];
        question.options.forEach((element, index, array) => {
            if (element.is_answer){
                data.push(String.fromCharCode(index+1 + 64))
            }
        });
        return data;
    },
    printCorrectAnswers(question) {
        if (this.correctAnswers(question).length){
            return this.correctAnswers(question).toString().replace("[", "").replace("]", "");
        }
        else {
            return "[ CENTANG JAWABAN YANG BENAR ]"
        }
    },

    inputedData(){
      this.isUnsavedData = true;
      this.inputTestSuccess = false;
      this.isLoadedData = false;
    },

    inputTest(){
      return (
          api.inputTest(this.dataTest)
            .then(response => {
                this.tryingToInputTest = false;
                this.isInputTestError = false;
                this.inputTestSuccess = true;
                this.isUnsavedData = false;
                this.isLoadedData = false;
            
                if (this.inputTestSuccess) {
                    this.submitted_test = false;
                    Swal.fire("Berhasil submit!", "Form telah berhasil di submit.", "success");
                }
            })
            .catch(error => {
                //pop up
                this.submitted_test = false;
                this.tryingToInputTest = false;
                this.isInputTestError = true;
                this.inputError = error;

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

    deleteTest(test_id){
      return (
        api.deleteTest(test_id)
          .then(response => {
            //
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

    async submitTest(){
      this.dataTest.module_id = this.schedule_data.module.id;
      this.submitted_test = true;
      this.$v.dataTest.$touch();
      if (this.$v.dataTest.$invalid) {
        return;
      } else {
        this.tryingToInputTest = true;
        Swal.fire({
            title: "Yakin data akan di submit?",
            text: "Jawaban yang kosong akan tetap ter-submit!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, lanjut submit!"
        }).then(result => {
            if (result.value) {
                this.loading(true);
                this.inputTest();
                this.loadData();
                this.loading(false);
            }
        });
      }
    },

    cancelSubmitTest(){
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
              this.loading(true);
              this.submitted_test = false;
              this.isInputTestCanceled = true;

              //emptying input test
              this.selected_test = "";
              this.selected_type = "",
              this.dataTest = {
                  type: "",
                  test_type: "",
                  module_id: "",
                  questions: []
              };
              this.inputTestSuccess = false;
              this.isUnsavedData = false;
              this.isLoadedData = false;

              this.loading(false);
              Swal.fire("Berhasil dibatalkan!", "Form telah dikosongkan.", "success");
          }
      });
    },

    sendingEvent (file, xhr, formData) {
      let questions = [];
      if(this.dataTest.questions[0].weight != "" && this.dataTest.questions[0].answer != ""){
        const data = {
                text: this.dataTest.questions[0].text,
                weight: this.dataTest.questions[0].weight,
                answer: this.dataTest.questions[0].answer,
        }
        questions = [data];
      }
      
      formData.append('module_id', this.schedule_data.module.id);
      formData.append('type', 'file');
      formData.append('test_type', this.dataTest.test_type);
      formData.append('questions', questions);
      formData.append('weight', this.dataTest.questions[0].weight);
      formData.append('answer', this.dataTest.questions[0].answer);
    },

    successEvent (file, response) {
      this.loading(true);
      Swal.fire({
          icon: 'success',
          title: 'Berhasil diunggah!',
          text: 'File telah terunggah.',
      })
      this.loadData().then(result=>{
        this.inputTestSuccess = true;
        this.isUnsavedData = false;
        this.isLoadedData = false;
      });
      this.loading(false);
    },

    onClickDownload(){
        this.loading(true);
        return (
            api.downloadJournal(this.schedule_data.module.id, this.test_id)
            .then(response => {
                let blob = new Blob([response.data])
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = this.dataTest.questions[0].text
                link.click()

                this.loading(false);
                Swal.fire("Berhasil diunduh!", "File telah terunduh.", "success");
            })
            .catch(error => {
                this.loading(false);
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

    onClickRuangan(){
      this.isRuanganShowed = !this.isRuanganShowed;
    },

    selectRoom(value){
      this.room = value;
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
                  :disabled="true"
                  style="background-color: #F0F4F6;"
                >
              </div>
            </div>

            <div class="col-sm-4">
              <div class="form-group">
                <label>Mata Kuliah</label>
                <input
                  v-model="class_course_data.course.name"
                  type="text"
                  class="form-control"
                  :disabled="true"
                  style="background-color: #F0F4F6;"
                >
              </div>
            </div>

            <div class="col-sm-4">
              <div class="form-group">
                <label>Tahun / Semester</label>
                <input
                  v-model="class_course_data.academic_year.name"
                  type="text"
                  class="form-control"
                  :disabled="true"
                  style="background-color: #F0F4F6;"
                >
              </div>
            </div>
          </div>

          <div class="form-group text-center">
            <label>Modul</label>
            <multiselect 
              v-model="schedule_data.module.index"
              class="text-center" 
              :options="dataModules"
              :allow-empty="false"
              :disabled="isLoading"
              select-label=""
              selected-label="x"
              deselect-label="x"
              @select="selectModule"
            />
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body pt-0">
          <div
            id="metadata"
            class="tab-pane pb-2 pt-2 mt-3"
          >
            <p style="color: black; font-size: 14px; margin-bottom: 0 !important;">
              Deskripsi input soal:
            </p>
            <p
              class="card-title-desc"
              style="font-size: 14px; margin: 0 !important;"
            >
              - Input soal <b>pertama kali</b> akan mengisi soal di modul dan <b>seluruh kelas</b> dengan mata kuliah yang sama,<br>
              - Edit soal hanya akan mengubah soal di <b>kelas yang dipilih</b>.
            </p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body pt-0">
          <div class="form-horizontal mt-4">
            <div>
              <div class="row">
                <div class="form-group text-center col-sm-6">
                  <label>Jenis Tes</label>
                  <multiselect 
                    v-model="selected_test"
                    class="text-center" 
                    :options="tests"
                    :disabled="isLoading"
                    select-label=""
                    selected-label="x"
                    deselect-label="x"
                    :class="{ 'is-invalid': submitted_test && $v.dataTest.test_type.$error,}"
                    @select="selectTest"
                    @remove="removeTest"
                  />
                  <div
                    v-if="submitted_test && !$v.dataTest.test_type.required"
                    class="invalid-feedback text-center mt-2"
                  >
                    Tes harus diisi!
                  </div>
                </div>
                <div class="form-group text-center col-sm-6">
                  <label>Tipe Tes</label>
                  <multiselect 
                    v-model="selected_type"
                    class="text-center" 
                    :options="types"
                    :disabled="isLoading"
                    select-label=""
                    selected-label="x"
                    deselect-label="x"
                    :class="{ 'is-invalid': submitted_test && $v.dataTest.type.$error,}"
                    @select="selectType"
                    @remove="removeType"
                  />
                  <div
                    v-if="submitted_test && !$v.dataTest.type.required"
                    class="invalid-feedback text-center mt-2"
                  >
                    Type harus diisi!
                  </div>
                </div>
              </div>
              <div class="mb-4 pb-2">
                <b-alert
                  v-model="inputTestSuccess"
                  class="mt-3"
                  variant="success"
                  dismissible
                >
                  Data berhasil diperbarui!
                </b-alert>

                <b-alert
                  v-model="isInputTestError"
                  class="mt-3"
                  variant="danger"
                  dismissible
                >
                  {{ inputError }}
                </b-alert>

                <b-alert
                  v-model="isInputTestCanceled"
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

                <b-alert
                  v-model="isUnsavedData"
                  class="mt-3"
                  variant="danger"
                  dismissible
                >
                  Data belum disimpan!
                </b-alert>

                <b-alert
                  v-model="isLoadedData"
                  class="mt-3"
                  variant="warning"
                  dismissible
                >
                  Data berhasil dimuat!
                </b-alert>
              </div>
              <div
                v-if="selected_type == 'Pilihan Ganda'"
                class="pt-4 pr-3 pb-4"
                style="background-color:#F1F5F7; margin:-20px;"
              >
                <div
                  v-for="(question, index) in dataTest.questions"
                  :key="index"
                  class="col-sm-12"
                  :set="v = $v.dataTest.questions.$each[index]"
                >
                  <div class="row">
                    <div class="text-center col-sm-1">
                      <b-button 
                        class="m-1"
                        style="width: 85%; text-align: center; vertical-align: middle;" 
                        variant="outline-secondary"
                      >
                        {{ index+1 }}
                      </b-button>
                      <b-button 
                        v-if="dataTest.questions.length > 1"
                        class="m-1" 
                        size="sm" 
                        style="width: 85%; text-align: center; vertical-align: middle;" 
                        variant="danger"
                        @click="removeQuestion(dataTest.questions, index)"
                      >
                        remove
                      </b-button>
                    </div>
                    <div class="card col-sm-11 mt-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-12">
                            <label for="text">Bobot Nilai</label>
                            <div class="form-group">
                              <input 
                                v-model="question.weight"
                                type="number" 
                                class="form-control col-2"
                                :class="{ 'is-invalid': submitted_test && v.weight.$error }"
                                @input="inputedData"
                              >
                              <div
                                v-if="submitted_test && !v.weight.$error.required"
                                class="invalid-feedback"
                              >
                                Bobot Nilai harus diisi dan lebih dari nol!
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
                            <label for="text">Pertanyaan</label>
                            <div class="form-group">
                              <quill-editor
                                ref="myQuillEditor"
                                v-model="question.text"
                                :options="editorPertanyaan"
                                :class="{ 'is-invalid': submitted_test && v.text.$error }"
                                @input="inputedData"
                              />
                              <div
                                v-if="submitted_test && !v.text.$error.required"
                                class="invalid-feedback"
                              >
                                Pertanyaan harus diisi!
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
                            <label for="text">Jawaban Benar: {{ printCorrectAnswers(question) }}</label>
                            <hr class="m-4">
                          </div>
                          <div class="col col-sm-12">
                            <div class="row">
                              <label class="col-9">Pilihan</label>
                              <label class="col-3 text-right">Jawaban</label>
                            </div>
                            <div
                              v-for="(answer, idx) in question.options"
                              :key="idx"
                            >
                              <div class="row mb-2">
                                <div class="col-sm-1 col-md-2 col-lg-1 text-center">
                                  <b-button 
                                    size="sm" 
                                    class="mt-1 mr-1" 
                                    style="width: 100%; text-align: center; vertical-align: middle;"
                                    variant="light"
                                  >
                                    {{ String.fromCharCode(idx+1 + 64) }}
                                  </b-button>
                                  <b-button
                                    v-if="idx != 0 && idx != 1"
                                    size="sm" 
                                    class="mt-1 mr-1" 
                                    style="width: 100%; text-align: center; vertical-align: middle;" 
                                    variant="danger"
                                    @click="removeAnswer(question, idx)"
                                  >
                                    remove
                                  </b-button>
                                </div>
                                <div class="col-sm-10 col-md-9 col-lg-10 mt-1">
                                  <div class="form-group">
                                    <quill-editor
                                      ref="myQuillEditor"
                                      v-model="answer.text"
                                      :options="editorJawaban"
                                      @input="inputedData"
                                    />
                                  </div>
                                </div>
                                <div class="col-sm-1 col-md-1 col-lg-1 mt-1 text-right">
                                  <input
                                    v-model="answer.is_answer"
                                    class="form-check-input"
                                    type="checkbox"
                                  >
                                  <label
                                    for="checkbox"
                                    style="min-width: 35px;"
                                  >{{ answer.is_answer }}</label>
                                </div>
                              </div>
                              <hr>
                            </div>
                            <div
                              v-if="question.options.length < 10"
                              class="text-left"
                            >
                              <b-button
                                size="sm"
                                variant="outline-secondary"
                                @click="addAnswer(question)"
                              >
                                <b-icon icon="plus-circle-fill" /> tambah jawaban
                              </b-button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <b-button
                    variant="secondary"
                    @click="addQuestion(dataTest.questions)"
                  >
                    <b-icon icon="plus-square-fill" />
                    tambah pertanyaan
                  </b-button>
                </div>
              </div>
              <div
                v-if="selected_type == 'Esai'"
                class="pt-4 pr-3 pb-4"
                style="background-color:#F1F5F7; margin:-20px;"
              >
                <div
                  v-for="(question, index) in dataTest.questions"
                  :key="index"
                  class="col-sm-12"
                  :set="v = $v.dataTest.questions.$each[index]"
                >
                  <div class="row">
                    <div class="text-center col-sm-1">
                      <b-button 
                        class="m-1"
                        style="width: 85%; text-align: center; vertical-align: middle;" 
                        variant="outline-secondary"
                      >
                        {{ index+1 }}
                      </b-button>
                      <b-button 
                        v-if="dataTest.questions.length > 1"
                        class="m-1" 
                        size="sm" 
                        style="width: 85%; text-align: center; vertical-align: middle;" 
                        variant="danger"
                        @click="removeQuestion(dataTest.questions, index)"
                      >
                        remove
                      </b-button>
                    </div>
                    <div class="card col-sm-11 mt-1">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-12">
                            <label for="text">Bobot Nilai</label>
                            <div class="form-group">
                              <input 
                                v-model="question.weight"
                                type="number" 
                                class="form-control col-2"
                                :class="{ 'is-invalid': submitted_test && v.weight.$error }"
                                @input="inputedData"
                              >
                              <div
                                v-if="submitted_test && !v.weight.$error.required"
                                class="invalid-feedback"
                              >
                                Bobot Nilai harus diisi!
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
                            <label for="text">Pertanyaan</label>
                            <div class="form-group">
                              <quill-editor
                                ref="myQuillEditor"
                                v-model="question.text"
                                :options="editorPertanyaan"
                                :class="{ 'is-invalid': submitted_test && v.text.$error }"
                                @input="inputedData"
                              />
                              <div
                                v-if="submitted_test && !v.text.$error.required"
                                class="invalid-feedback"
                              >
                                Pertanyaan harus diisi!
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
                            <hr class="m-4">
                          </div>
                          <div class="col-12">
                            <label>Jawaban Benar</label>
                            <div class="form-group">
                              <quill-editor
                                ref="myQuillEditor"
                                v-model="question.answer"
                                :options="editorJawaban"
                                @input="inputedData"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="text-center">
                  <b-button
                    variant="secondary"
                    @click="addQuestion(dataTest.questions)"
                  >
                    <b-icon icon="plus-square-fill" />
                    tambah pertanyaan
                  </b-button>
                </div>
              </div>
              <div
                v-if="selected_type == 'Upload File'"
                class="pr-3 pb-4"
              >
                <hr
                  style="margin-left: -20px; 
                                    margin-right: -36px; 
                                    height: 2px; 
                                    background-color: #eee; 
                                    border: 0 none; 
                                    color: #eee;"
                >
                <div class="row">
                  <div class="col-sm-12 col-md-12">
                    <!-- <div title="Import Excel"> -->
                    <div>
                      <div
                        id="metadata"
                        class="tab-pane pb-2 pt-2"
                      >
                        <p style="color: red; font-size: 12px; margin: 0 !important;">
                          PENTING – HARAP DIBACA DENGAN TELITI
                        </p>
                        <p
                          class="mt-2"
                          style="color: black; font-size: 14px; margin-bottom: 0 !important;"
                        >
                          Deskripsi upload file soal:
                        </p>
                        <p
                          class="card-title-desc"
                          style="font-size: 14px; margin: 0 !important;"
                        >
                          - Pastikan mengisi form <b>Bobot Nilai</b> dan <b>URL Upload Jawaban</b> terlebih dahulu,<br>
                          - Form <b>URL Upload Jawaban</b> digunakan untuk praktikan mengunggah jawaban tes Jurnal,<br>
                          - <b>File Soal</b> yang dapat diunggah bertipe <b>.PDF</b>, <b>.DOC</b>, <b>.DOCX</b>, <b>.RAR</b>, atau <b>.ZIP</b>,<br>
                          - Perkiraan batas ukuran <b>File Soal</b> adalah <b>2 MB</b>. Dapat dicoba lebih,<br>
                          - Data tersimpan setelah <b>Upload File Soal</b> berhasil tanpa error,<br>
                          - Unggah file kembali untuk memperbarui <b>Bobot Nilai</b>, <b>URL Upload Jawaban</b>, dan <b>File Soal</b>.
                          <!-- - Pastikan hanya ada <b>satu sheet</b>,<br>
                                              - Pastikan Header / Row ke 1 dan urutan data di dalam file sama seperti berikut ini:<br> -->
                        </p>
                        <!-- <img src="@/assets/images/staff-excel-example.png" style="box-sizing: border-box; 
                                                                                                                  width: 25%; 
                                                                                                                  margin: auto;"/> -->
                      </div>
                      <hr
                        style="margin-left: -20px; 
                                                  margin-right: -36px; 
                                                  height: 2px; 
                                                  background-color: #eee; 
                                                  border: 0 none; 
                                                  color: #eee;
                                                  padding: 0!important;"
                      >
                      <div>
                        <div class="mb-2 mt-4">
                          <div class="row">
                            <div class="col-4">
                              <label for="text">Bobot Nilai</label>
                              <div class="form-group">
                                <input 
                                  v-model="dataTest.questions[0].weight"
                                  type="number" 
                                  :min="0"
                                  class="form-control"
                                  @input="inputedData"
                                >
                              </div>
                            </div>
                            <div class="col-4">
                              <label for="text">URL Upload Jawaban</label>
                              <div class="form-group">
                                <input
                                  v-model="dataTest.questions[0].answer"
                                  type="text" 
                                  class="form-control"
                                  placeholder="Masukkan URL (GDrive, GForms, atau lainnya)"
                                  @input="inputedData"
                                >
                              </div>
                            </div>
                            <div
                              v-if="dataTest.questions[0].text"
                              class="col-4"
                            >
                              <label>File Soal</label>
                              <div class="form-group">
                                <input 
                                  v-model="dataTest.questions[0].text"
                                  type="text" 
                                  class="form-control"
                                  :disabled="true"
                                >
                              </div>
                              <div class="form-group">
                                <b-button
                                  variant="primary"
                                  @click="onClickDownload"
                                >
                                  Download
                                </b-button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- file upload -->
                        <label for="text">Upload File Soal</label>
                        <vue-dropzone
                          id="dropzone"
                          ref="myVueDropzone"
                          :use-custom-slot="true"
                          :options="dropzoneOptions"
                          @vdropzone-sending="sendingEvent"
                          @vdropzone-success="successEvent"
                        >
                          <div class="dropzone-custom-content">
                            <i class="display-4 text-muted bx bxs-cloud-upload" />
                            <h4>Drop a file here or click to upload.</h4>
                          </div>
                        </vue-dropzone>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="dataTest.type == 'multiple_choice' || dataTest.type == 'essay'"
                class="text-center"
                :class="{ 'is-invalid': submitted_test && $v.dataTest.module_id.$error,}"
              >
                <hr
                  style="margin-left: -20px; 
                                    margin-right: -20px; 
                                    height: 2px; 
                                    background-color: #eee; 
                                    border: 0 none; 
                                    color: #eee;"
                >
                <button
                  type="button"
                  class="btn btn-primary mr-2 waves-effect waves-light"
                  @click="submitTest"
                >
                  Simpan
                </button>
                <button 
                  type="button" 
                  class="btn btn-light waves-effect" 
                  @click="cancelSubmitTest"
                >
                  Batalkan
                </button>
              </div>
              <div
                v-if="submitted_test && !$v.dataTest.module_id.required"
                class="invalid-feedback text-center mt-2"
              >
                Module ID harus diisi!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" scoped>
  .example {
    display: flex;
    flex-direction: column;
    .editor {
      height: 40rem;
      overflow: hidden;
    }
    .output {
      width: 100%;
      height: 20rem;
      margin: 0;
      border: 1px solid #ccc;
      overflow-y: auto;
      resize: vertical;
      &.code {
        padding: 1rem;
        height: 16rem;
      }
      &.ql-snow {
        border-top: none;
        height: 24rem;
      }
    }
  }
</style>