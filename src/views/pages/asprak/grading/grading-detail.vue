<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import * as api from '@/api';
import Swal from "sweetalert2";

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";

export default {
    page: {
        title: "Penilain",
        meta: [{ name: "description" }],
    },
    components: {
        Layout,
        PageHeader
    },
    validations: {
        test_data: {
            grade: {
                $each: {
                    grade: { required },
                }
            }
        },
    },
    data() {
        return {
            title: "Tes",
            items: [
                {
                    text: "Asisten Praktikum",
                    href: "/"
                },
                // {
                //     text: "Penilaian",
                //     href: "/asprak/schedule-grading/"
                // },
                {
                    text: "Jadwal",
                    href: "/asprak/schedule"
                },
                {
                    text: "List Tes",
                    href: "/asprak/schedule-grading/"
                },
                {
                    text: "Detail Tes",
                    active: true,
                }
            ],

            schedule_id: "",

            test_data: {
                test: {
                    id: "",
                    type: "",
                },
                student: {
                    id: "",
                    nim: "",
                },
                grade: [],
            },
            // grade:{
            //     grade: "",
            //     question: {
            //         question: "",
            //         weight: "",
            //         answers: [],
            //     },
            //     student_answer: [],
            // },

            schedule_test_data: {
                id: "",
            },

            isEssay: false,
            isMultipleChoice: false,
            isFile: false,

            dataInput: {
                grade: [],
            },
            // grade: {
            //     question_id: "",
            //     grade: "",
            // }

            text: {
                bobot: "Bobot :",
                nilai: "Nilai :",
                slash: "/",
                auth: "Auth"
            },

            total_grade: "",

            submitted: false,
            tryingToInputTest: false,
            isInputTestError: false,
            inputTestSuccess: false,
            isInputTestCanceled: false,

            isGradeInvalid: false,

            editorOption: {
                placeholder: "",
                modules: {
                    toolbar: false,
                }
            },

            isKunjawShowed: false,
        }
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
            this.setId();
            this.isIdValid(this.$route.params.id);
            await this.fetchData();
            await this.setAnswers();
            this.setType();
            this.checkType();
            this.countGrade();
        },

        setId(){
            this.schedule_id = this.$route.params.id;
            this.test_data.test.id = this.$route.params.test_id;
            this.test_data.student.id = this.$route.params.student_id;
            this.items[2].href = "/asprak/schedule/" + this.schedule_id + "/grading";
        },

        setType(){
            let nim = this.test_data.student.nim;

            if(this.$route.params.type == 'pretest'){
                this.title = "Tes Awal - " + nim;
                this.items[3].text = "Tes Awal - " + nim;
            }
            else if(this.$route.params.type == 'journal'){
                this.title = "Jurnal - " + nim;
                this.items[3].text = "Jurnal - " + nim;
            }
            else if(this.$route.params.type == 'posttest'){
                this.title = "Tes Akhir - " + nim;
                this.items[3].text = "Tes Akhir - " + nim;
            }
            else{
                this.title = "Tes";
                this.items[3].text = "Tes";
            }
        },

        isIdValid(schedule_id){
            api.showSchedule(schedule_id)
                .then(response => {
                    if(response.data.data){
                        this.schedule_test_data = response.data.data;
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
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Terjadi kesalahan!',
                        footer: 'Anda dialihkan ke menu Jadwal',
                        timer: 4000
                    })
                    this.$router.replace({
                        name: 'asprak-grading'
                    });
                })
        },

        checkType(){
            if(this.test_data.test.type == 'essay'){
                this.isEssay = true;
                this.isMultipleChoice = false;
                this.isFile = false;
            }
            if(this.test_data.test.type == 'multiple_choice'){
                this.isEssay = false;
                this.isMultipleChoice = true;
                this.isFile = false;
            }
            if(this.test_data.test.type == 'file'){
                this.isEssay = false;
                this.isMultipleChoice = false;
                this.isFile = true;
            }
        },

        async fetchData(){
            return (
                api.getSpecificTest(this.test_data.student.id, this.test_data.test.id)
                .then(response => {
                    if(response.data.data){
                        this.test_data = response.data.data;
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
                    this.$router.replace({
                        name: 'asprak-grading-list', 
                        params: { id: this.schedule_id }
                    });
                })
            );
        },

        async setAnswers(){
            if(!this.test_data.grade){
              this.test_data.grade = [];
              this.test_data.test.questions.forEach((element, index, array) => {
                  if(this.test_data.test.type == "essay"){
                      let data = {
                          grade: 0,
                          student_answer: {
                              answer: ""
                          }
                      }
                      this.test_data.grade.push(data);
                  }
                  if(this.test_data.test.type == "multiple_choice"){
                      let data = {
                          grade: 0,
                          student_answer: []
                      }
                      this.test_data.grade.push(data);
                  }
                  if(this.test_data.test.type == "file"){
                      let data = {
                          grade: 0,
                      }
                      this.test_data.grade.push(data);
                  }
              });
            }

            this.test_data.grade.forEach((element, index, array) => {
              if(Array.isArray(element.student_answer)){
                  element.student_answer.forEach((element_answer, index_answer, array_answer) => {
                      element.student_answer[index_answer] = element_answer.answer_id;
                  });
              }
            });
        },

        async setDataInput(){
            this.test_data.grade.forEach((element, index, array) => {
                let data = {
                    question_id: this.test_data.test.questions[index].id,
                    grade: element.grade,
                }
                this.dataInput.grade.push(data);
            });
        },

        onClickSubmit(){
            this.submitted = true;
            this.$v.test_data.$touch();
            if (this.$v.test_data.$invalid) {
                return;
            } 
            this.countGrade();
            if(this.isGradeInvalid){
                return;
            }
            this.tryingToInputTest = true;
            Swal.fire({
                title: "Yakin akan submit nilai?",
                text: "Nilai dapat diubah kembali.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Ya, lanjut submit!"
            }).then(result => {
                if (result.value) {
                    this.loading(true);
                    this.submitAnswers();
                    this.loading(false);
                }
            });
        },

        async submitAnswers(){
            await this.setDataInput();
            return (
                api.updateGrade(this.test_data.student.id, this.dataInput)
                .then(response => {
                    this.tryingToInput = false;
                    this.isInputError = false;
                    this.inputSuccess = true;
                    this.submitted = false;
                    Swal.fire({
                        title: "Berhasil Submit!",
                        text: "Ingin keluar dari halaman ini?",
                        icon: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#34c38f",
                        cancelButtonColor: "#f46a6a",
                        confirmButtonText: "Ya, keluar!"
                    }).then(result => {
                        if (result.value) {
                            this.$router.push({
                                name: 'asprak-grading-list', 
                                params: { id: this.schedule_id }
                            });
                        }
                    });
                })
                .catch(error => {
                    // console.log(error)
                    this.submitted = false;
                    this.tryingToInput = false;
                    this.isInputError = true;
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

        cancelSubmit(){
            this.$router.push({
                name: 'asprak-grading-list', 
                params: { id: this.schedule_id }
            });
            // Swal.fire({
            //     title: "Anda yakin?",
            //     text: "Form yang telah terisi akan dikosongkan!",
            //     icon: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#34c38f",
            //     cancelButtonColor: "#f46a6a",
            //     confirmButtonText: "Ya, batalkan!"
            // }).then(result => {
            //     if (result.value) {
            //         this.loading(true);
            //         this.submitted = false;
            //         this.isInputCanceled = true;

            //         this.test_data.grade.forEach((element, index, array) => {
            //             element.grade = 0;
            //         });
            //         this.countGrade();
            //         this.loading(false);
            //         Swal.fire("Berhasil dibatalkan!", "Form telah dikosongkan.", "success");
            //     }
            // });
        },

        onClickDownload(){
            this.loading(true);
            return (
                api.downloadJournal(this.schedule_test_data.module.id, this.schedule_test_data.module.journal_id)
                .then(response => {
                    let blob = new Blob([response.data])
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = this.test_data.test.questions[0].question
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

        countGrade(){
            let count_grade = 0;
            let count_max = 0;
            this.test_data.grade.forEach((element, index, array) => {
                count_grade = parseInt(count_grade) + parseInt(element.grade);
                count_max = parseInt(count_max) + parseInt(this.test_data.test.questions[index].weight);
            });

            this.total_grade = (String(+count_grade) + " / " + String(+count_max));

            if(count_grade > count_max){
                this.isGradeInvalid = true;
            }
            else{
                this.isGradeInvalid = false;
            }
        },

        onKunjawClick(){
          this.isKunjawShowed = !this.isKunjawShowed
        },

        formatTime(time){
          if(time){
            let hours = time.split(':')[0];
            let minutes = time.split(':')[1];
            let seconds = time.split(':')[2];

            let string_hours = ""
            let string_minutes = ""
            let string_seconds = ""

            if(hours != '00'){
              string_hours = hours + " jam"
            }
            if(minutes != '00'){
              string_minutes = minutes + " menit"
            }
            if(seconds != '00'){
              string_seconds = seconds + " detik"
            }

            return string_hours + " " + string_minutes + " " + string_seconds
          }
          else{
            return ""
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
    <div
      v-if="isEssay || isMultipleChoice || isFile"
      class="text-center"
    >
      <div
        v-if="!test_data.is_late"
        class="m-3"
      >
        <b>Status Submit Jawaban</b><br>
        Lebih cepat <b>{{ formatTime(test_data.submitted_time) }}</b> dari batas waktu.
        <i
          style="color:#179A73;"
          class="ri-check-line mr-2 font-size-18"
        />
      </div>
      <div
        v-if="test_data.is_late"
        class="m-3"
      >
        <b>Status Submit</b><br>
        Terlambat <b>{{ formatTime(test_data.submitted_time) }}</b> dari batas waktu.
        <i
          style="color:#FF3D60;"
          class="ri-close-line mr-2 font-size-18"
        />
      </div>
    </div>
    <div
      v-if="isEssay || isMultipleChoice"
      class="mb-5"
    >
      <div
        v-for="(question, index) in test_data.test.questions"
        :key="index"
        :set="v = $v.test_data.grade.$each[index]"
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
          </div>
          <div class="row col-sm-11">
            <div
              class="card col-sm-11"
              style="margin-bottom:1px!important"
            >
              <div class="card-body">
                <div>
                  <label>Soal</label>
                  <quill-editor
                    ref="myQuillEditor"
                    v-model="question.question"
                    :options="editorOption"
                    :disabled="true"
                  />
                </div>
              </div>
            </div>
            <div
              class="card col-sm-11"
              style="margin-bottom:1px!important"
            >
              <div class="card-body">
                <div class="row">
                  <div class="col-12">
                    <label>Jawaban</label>
                    <div v-if="isEssay">
                      <div>
                        <quill-editor
                          ref="myQuillEditor"
                          v-model="test_data.grade[index].student_answer.answers"
                          :options="editorOption"
                          :disabled="true"
                        />
                      </div>
                    </div>
                    <div v-if="isMultipleChoice">
                      <div
                        v-for="(answer, idx) in question.answers"
                        :key="idx"
                        class="ml-1 form-check"
                      >
                        <input 
                          v-model="test_data.grade[index].student_answer" 
                          class="form-check-input" 
                          type="checkbox"
                          :value="answer.id"
                          :disabled="true"
                        >
                        <quill-editor
                          ref="myQuillEditor"
                          v-model="answer.answer"
                          :options="editorOption"
                          :disabled="true"
                          class="pt-1 mb-4"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <hr
                      style="margin-left: -34px; 
                                                margin-right: -34px; 
                                                height: 2px; 
                                                background-color: #eee; 
                                                border: 0 none; 
                                                color: #eee;"
                    >
                  </div>
                  <div class="col-12">
                    <div class="row text-left ml-1">
                      <input
                        v-model="text.nilai"
                        type="text"
                        class="form-control"
                        :disabled="true"
                        style="border: 0; max-width:80px!important;"
                      >
                      <input
                        v-model="test_data.grade[index].grade"
                        style="max-width:80px!important; text-align:center;"
                        type="number"
                        :max="question.weight"
                        :min="0"
                        class="form-control"
                        :class="{ 'is-invalid': submitted && v.grade.$error }"
                        @input="countGrade"
                      >
                      <input
                        v-model="text.slash"
                        type="text"
                        class="form-control mr-2 ml-2"
                        :disabled="true"
                        style="border: 0; max-width:30px!important; text-align:center;"
                      >
                      <input
                        v-model="question.weight"
                        style="max-width:60px!important; text-align:center; background-color: #F0F4F6;"
                        type="text"
                        class="form-control"
                        :disabled="true"
                      >
                    </div>
                    <div
                      v-if="submitted && !v.grade.$error.required"
                      class="invalid-feedback"
                    >
                      Nilai harus diisi!
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style="width:100%;"
              class="mb-4"
            >
              <div class="mt-1 mb-1">
                <b-button
                  variant="outline-info"
                  style="min-width: 150px;"
                  @click="onKunjawClick"
                >
                  Kunci Jawaban
                </b-button>
              </div>
              <div
                v-if="isKunjawShowed"
                class="card col-sm-11"
              >
                <div class="card-body">
                  <div class="row">
                    <div class="col-12">
                      <label>Kunci Jawaban</label>
                      <div v-if="isEssay">
                        <div>
                          <quill-editor
                            ref="myQuillEditor"
                            v-model="question.answers[0].answer"
                            :options="editorOption"
                            :disabled="true"
                          />
                        </div>
                      </div>
                      <div v-if="isMultipleChoice">
                        <div
                          v-for="(answer, idx) in question.answers"
                          :key="idx"
                          class="ml-1 form-check"
                        >
                          <input 
                            v-model="answer.is_answer" 
                            class="form-check-input" 
                            type="checkbox"
                            :value="answer.is_answer"
                            :disabled="true"
                          >
                          <quill-editor
                            ref="myQuillEditor"
                            v-model="answer.answer"
                            :options="editorOption"
                            :disabled="true"
                            class="pt-1 mb-4"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <label>Total Nilai: {{ total_grade }}</label>
      </div>
      <div
        class="text-center mb-2"
        :class="{'is-invalid': isGradeInvalid}"
      >
        <b-button
          variant="success"
          style="min-width: 250px;"
          @click="onClickSubmit"
        >
          Simpan Nilai
        </b-button>
        <button
          type="button"
          class="ml-2 btn btn-outline-dark waves-effect"
          @click="cancelSubmit"
        >
          Kembali
        </button>
      </div>
      <div
        v-if="isGradeInvalid"
        class="text-center invalid-feedback mb-4"
        style="margin:0!important"
      >
        Nilai melebihi batas Bobot Nilai!
      </div>
    </div>
    <div v-if="isFile">
      <div
        class="card"
        style="margin-bottom:1px!important;"
      >
        <div class="card-body">
          <div class="text-center">
            <label>File Jurnal</label>
          </div>
          <div class="text-center">
            <b-button
              variant="primary"
              style="min-width: 350px;"
              @click="onClickDownload"
            >
              Download
            </b-button>
          </div>
          <!-- <div class="text-center mt-2">
                        <p>{{test_data.test.questions[0].question}}</p>
                    </div> -->
        </div>
      </div>
      <div class="card">
        <div class="card-body mt-4">
          <div class="text-center">
            <label>URL Jawaban Jurnal</label>
          </div>
          <div class="text-center">
            <div class="form-group">
              <input
                v-model="test_data.test.questions[0].answers[0].answer"
                :disabled="true"
                type="text" 
                class="form-control text-center"
                placeholder="Masukkan URL (GDrive, GForms, atau lainnya)"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="text-center">
            <div class="row justify-content-center">
              <input
                v-model="text.nilai"
                type="text"
                class="form-control"
                :disabled="true"
                style="border: 0; max-width:80px!important;"
              >
              <input
                v-model="test_data.grade[0].grade"
                style="max-width:80px!important; text-align:center;"
                type="number"
                :max="test_data.test.questions[0].weight"
                :min="0"
                class="form-control"
                @input="countGrade"
              >
              <input
                v-model="text.slash"
                type="text"
                class="form-control mr-2 ml-2"
                :disabled="true"
                style="border: 0; max-width:30px!important; text-align:center;"
              >
              <input
                v-model="test_data.test.questions[0].weight"
                style="max-width:60px!important; text-align:center; background-color: #F0F4F6;"
                type="text"
                class="form-control"
                :disabled="true"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-4">
        <label>Total Nilai: {{ total_grade }}</label>
      </div>
      <div
        class="text-center mb-2"
        :class="{'is-invalid': isGradeInvalid}"
      >
        <b-button
          variant="success"
          style="min-width: 250px;"
          @click="onClickSubmit"
        >
          Simpan Nilai
        </b-button>
        <button
          type="button"
          class="ml-2 btn btn-outline-dark waves-effect"
          @click="cancelSubmit"
        >
          Kembali
        </button>
      </div>
      <div
        v-if="isGradeInvalid"
        class="text-center invalid-feedback mb-4"
        style="margin:0!important"
      >
        Nilai melebihi batas Bobot Nilai!
      </div>
    </div>
  </Layout>
</template>