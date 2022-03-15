<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import * as api from '@/api';
import Swal from "sweetalert2";
import { notificationMethods } from "@/state/helpers";
import store from '@/store';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

import Quill from 'quill';
import ImageResize from "../../../modules/image-resize.min";
import { ImageDrop } from 'quill-image-drop-module';

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageDrop);
// import theme style
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

export default {
    page: {
        title: "Tes",
        meta: [{ name: "description" }],
    },
    components: {
        Layout,
        PageHeader
    },
    data() {
        return {
            title: "Tes",
            items: [
                {
                    text: "Praktikan",
                    href: "/"
                },
                {
                    text: "Jadwal",
                    href: "/praktikan/schedule/calendar"
                },
                {
                    text: "Praktikum",
                    href: "/praktikan/schedule/calendar"
                },
                {
                    text: "Tes",
                    active: true,
                }
            ],

            user_id:"",

            test_data: {
                test: {
                    id: "",
                },
                question: [],
            },
            schedule_test_data: {
                id: "",
            },

            isEssay: false,
            isMultipleChoice: false,
            isFile: false,

            dataInput: {
                schedule_test_id: "",
                answers: [],
                questions: [],
            },
            answer: {
                question_id: "",
                answer_id: "",
                answer: "",
            },
            isMCAnswersAvailable: false,
            isEssayAnswersAvailable: false,
            isFileAnswersAvailable: false,

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

            editorOption: {
                placeholder: "",
                modules: {
                    toolbar: false,
                }
            },
            //
        }
    },
    computed: {
        notification() {
            return this.$store ? this.$store.state.notification : null;
        },
        editor() {
            return this.$refs.myQuillEditor.quill
        },
        timeEnd() {
            return this.schedule_test_data.time_end
        }
    },
    watch: {
        $route: async function() {
            this.loading(true);
            await this.loadData();
            this.loading(false);
        }
    },
    // mounted: async function() {
    //     this.loading(true);
    //     await this.loadData();
    //     this.loading(false);
    // },
    beforeDestroy() {
        // prevent memory leak
        clearInterval(this.interval)
    },
    created: async function() {
        // this.loading(true);
        await this.loadData();
        // this.loading(false);

        // update the time every second
        this.interval = setInterval(() => {
            // Concise way to format time according to system locale.
            this.setTimeEnd()
        }, 1000)
    },
    methods: {
        ...notificationMethods,

        async loadData(){
            this.setId();
            this.setType();
            await this.fetchData();
            await this.getScheduleTest();
            this.checkAuth();
            this.checkType();
            this.setInputData();
        },

        setId(){
            this.schedule_test_data.id = this.$route.params.schedule_test_id;
            this.test_data.test.id = this.$route.params.id;
            this.user_id = store.getters.getLoggedUser.id;
        },

        setType(){
            if(this.$route.params.type == 'pretest'){
                this.title = "Tes Awal";
                this.items[3].text = "Tes Awal";
            }
            else if(this.$route.params.type == 'journal'){
                this.title = "Jurnal";
                this.items[3].text = "Jurnal";
            }
            else if(this.$route.params.type == 'posttest'){
                this.title = "Tes Akhir";
                this.items[3].text = "Tes Akhir";
            }
            else{
                this.title = "Tes";
                this.items[3].text = "Tes";
            }
        },

        checkAuth(){
            // if(this.$route.params.auth){
            //     return true;
            // }
            // else{
            //     Swal.fire({
            //         icon: 'error',
            //         title: 'Oops...',
            //         text: 'You need input Auth first!',
            //         footer: 'Anda dialihkan ke menu Jadwal',
            //     })
            //     this.$router.replace({
            //         name: 'praktikan-schedule-detail', 
            //         params: { id: this.schedule_test_data.schedule.id }
            //     });
            // }

            if(this.schedule_test_data.is_active){
                return true;
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Tes saat ini belum dimulai!',
                    footer: 'Anda dialihkan ke menu Jadwal',
                })
                this.$router.replace({
                    name: 'praktikan-schedule-detail', 
                    params: { id: this.schedule_test_data.schedule.id }
                });
            }
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

        setInputData(){
            this.isMCAnswersAvailable = false;
            this.isEssayAnswersAvailable = false;
            this.isFileAnswersAvailable = false;

            this.dataInput.schedule_test_id = this.schedule_test_data.id;
            this.test_data.question.forEach((element, index, array) => {
                let data = {};
                if(this.test_data.test.type == 'essay' || this.test_data.test.type == 'file'){
                    data = {
                        question_id: element.id,
                        answers: "",
                    }
                    this.dataInput.answers.push(data);
                }
                if(this.test_data.test.type == 'multiple_choice'){
                    data = {
                        id: element.id,
                        answers: [],
                    }
                    this.dataInput.questions.push(data);
                }
            });

            this.getAnswers();
        },

        async fetchData(){
            return (
                api.showTest(this.test_data.test.id)
                .then(response => {
                    this.isIdValid(response.data.data);
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
                })
            );
        },

        async getScheduleTest(){
            return (
                api.showTestSchedule(this.schedule_test_data.id)
                .then(response => {
                    this.isIdValid(response.data.data);
                    if(response.data.data){
                        this.schedule_test_data = response.data.data;
                        this.items[2].href = "/praktikan/schedule/detail/" + this.schedule_test_data.schedule.id;
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

        async getAnswers(){
            if(this.isEssay || this.isFile){
                return (
                    api.getEssayAnswer(this.test_data.test.id, this.user_id)
                    .then(response => {
                        if(response.data.data){
                            if(response.data.data.student_answer){
                                if(this.isEssay){
                                    this.isEssayAnswersAvailable = true;
                                }
                                if(this.isFile){
                                    this.isFileAnswersAvailable = true;
                                }

                                let answers = response.data.data.student_answer;
                                this.dataInput.answers.forEach((element, index, array) => {
                                    answers.forEach((element_answer, index_answer, array_answer) => {
                                        if(element_answer.question.id == element.question_id){
                                            element.answers = element_answer.answer;
                                        }
                                    });
                                });
                            }
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
            }
            else if(this.isMultipleChoice){
                return (
                    api.getMultipleChoiceAnswer(this.test_data.test.id, this.user_id)
                    .then(response => {
                        if(response.data.data){
                            if(response.data.data.student_answer){
                                this.isMCAnswersAvailable = true;

                                let answers = response.data.data.student_answer;
                                this.dataInput.questions.forEach((element, index, array) => {
                                    answers.forEach((element_answer, index_answer, array_answer) => {
                                        if(element_answer.question.id == element.id){
                                            element.answers.push(element_answer.answer.id);
                                        }
                                    });
                                });
                            }
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
            }
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
                this.$router.back();
            }
        },

        onClickSubmit(){
            let text = "Jawaban yang kosong akan tetap disimpan!";
            let confirm = "Ya, lanjut submit!";
            if(this.isFile){
                text = "Pastikan jawaban diunggah ke URL yang telah disediakan!"
                confirm = "Ya, akhiri tes sekarang!"
            }
            Swal.fire({
                title: "Yakin akan menyelesaikan test ini?",
                text: text,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: confirm,
            }).then(result => {
                if (result.value) {
                    this.submitAnswers();
                }
            });
        },

        submitAnswers(){
            this.dataInput.questions.forEach((element, index, array) => {
                if(!element.answers.length){
                    element.answers = [];
                    element.answers.push('');
                }
            });
            if(this.isEssay){
                if(this.isEssayAnswersAvailable){
                    // return (
                    //     api.updateEssay(this.dataInput)
                    //     .then(response => {
                    //         Swal.fire("Berhasil submit!", "Anda telah menyelesaikan test ini!", "success");
                    //         this.$router.push({
                    //             name: 'praktikan-schedule-detail', 
                    //             params: { id: this.schedule_test_data.schedule.id }
                    //         });
                    //     })
                    //     .catch(error => {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Oops...',
                    //             text: 'Terjadi kesalahan!',
                    //             footer: error
                    //         })
                    //     })
                    // );
                }
                else{
                    return (
                        api.storeEssay(this.dataInput)
                        .then(response => {
                            Swal.fire("Berhasil submit!", "Anda telah menyelesaikan test ini!", "success");
                            this.$router.push({
                                name: 'praktikan-schedule-detail', 
                                params: { id: this.schedule_test_data.schedule.id }
                            });
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
                }
            }
            else if(this.isMultipleChoice){
                if(this.isMCAnswersAvailable){
                    // return (
                    //     api.updateMultipleChoice(this.dataInput)
                    //     .then(response => {
                    //         Swal.fire("Berhasil submit!", "Anda telah menyelesaikan test ini!", "success");
                    //         this.$router.push({
                    //             name: 'praktikan-schedule-detail', 
                    //             params: { id: this.schedule_test_data.schedule.id }
                    //         });
                    //     })
                    //     .catch(error => {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Oops...',
                    //             text: 'Terjadi kesalahan!',
                    //             footer: error
                    //         })
                    //     })
                    // );
                }
                else{
                    return (
                        api.storeMultipleChoice(this.dataInput)
                        .then(response => {
                            Swal.fire("Berhasil submit!", "Anda telah menyelesaikan test ini!", "success");
                            this.$router.push({
                                name: 'praktikan-schedule-detail', 
                                params: { id: this.schedule_test_data.schedule.id }
                            });
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
                }
            }
            else if(this.isFile){
                this.dataInput.answers.forEach((element, index, array) => {
                    element.answers = "uploaded";
                });
                return (
                    api.storeEssay(this.dataInput)
                    .then(response => {
                        Swal.fire("Berhasil submit!", "Anda telah menyelesaikan test ini!", "success");
                        this.$router.push({
                            name: 'praktikan-schedule-detail', 
                            params: { id: this.schedule_test_data.schedule.id }
                        });
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
            }
        },

        onClickDownload(){
            this.loading(true);
            return (
                api.downloadJournal(this.schedule_test_data.schedule.module_id, this.schedule_test_data.test.id)
                .then(response => {
                    let blob = new Blob([response.data])
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = this.test_data.question[0].question
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

        setTimeEnd(){
            let now = moment().locale('id')
            let date_now = moment().locale('id').format('MM/DD/YYYY')
            let schedule_time_end = moment(date_now + ' ' + moment(this.timeEnd).format('HH:mm:ss'), 'MM/DD/YYYY HH:mm:ss')

            let range = moment().range(now, schedule_time_end)
            let time_diff = range.diff()

            if(time_diff >= 0){
                let time_end = moment.utc(time_diff).locale('id');
                
                if(time_end.second() == 0 && (time_end.minute() == 5 || time_end.minute() == 2 || time_end.minute() == 1)){
                    this.onTimeWarningPopup(time_end.minute())
                }
            }
            // else{
            //     range = moment().range(schedule_time_end, now)
            //     time_diff = range.diff()
            //     let time_end = moment.utc(time_diff).locale('id').format('HH:mm:ss');
            // }
        },

        onTimeWarningPopup(minute){
            let text = "Harap submit jawaban sebelum waktu berakhir."
            if(this.isMultipleChoice || this.isEssay){
                text = "Harap submit jawaban sebelum waktu berakhir."
            }
            if(this.isFile){
                text = "Harap konfirmasi upload jawaban sebelum waktu berakhir."
            }
            Swal.fire({
                icon: 'info',
                title: 'Waktu pengerjaan tersisa ' + minute + " menit lagi!",
                text: text,
            })
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
  <Layout
    v-if="timeEnd"
    :time-end="timeEnd"
    :is-done="isEssayAnswersAvailable || isMCAnswersAvailable || isFileAnswersAvailable"
  >
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
    <div v-if="isEssay || isMultipleChoice">
      <div
        v-for="(question, index) in test_data.question"
        :key="index"
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
              class="card col-12"
              style="margin-bottom:1px!important"
            >
              <div class="card-body">
                <div class="col-12">
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
            <div class="card col-12">
              <div class="card-body">
                <div class="col-12">
                  <label>Jawaban</label>
                  <div v-if="isEssay">
                    <div>
                      <quill-editor
                        v-if="!isEssayAnswersAvailable"
                        ref="myQuillEditor"
                        v-model="dataInput.answers[index].answers"
                        :options="editorJawaban"
                      />
                      <quill-editor
                        v-if="isEssayAnswersAvailable"
                        ref="myQuillEditor"
                        v-model="dataInput.answers[index].answers"
                        :options="editorOption"
                        :disabled="true"
                      />
                    </div>
                  </div>
                  <div v-if="isMultipleChoice">
                    <div
                      v-for="(answer_data, idx) in question.answers"
                      :key="idx"
                      class="ml-1 form-check"
                    >
                      <input 
                        v-model="dataInput.questions[index].answers"
                        class="form-check-input" 
                        type="checkbox"
                        :value="answer_data.id"
                        :disabled="isMCAnswersAvailable"
                      >
                      <quill-editor
                        ref="myQuillEditor"
                        v-model="answer_data.answer"
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
      <div v-if="!isEssayAnswersAvailable && !isMCAnswersAvailable">
        <div class="text-center m-4">
          <b-button
            variant="success"
            style="min-width: 250px;"
            @click="onClickSubmit"
          >
            Submit Jawaban
          </b-button>
        </div>
      </div>
      <div v-if="isEssayAnswersAvailable || isMCAnswersAvailable">
        <div class="text-center m-4">
          <b-button
            variant="secondary"
            :disabled="true"
            style="min-width: 250px;"
          >
            Jawaban tes sudah tersimpan!
          </b-button>
        </div>
      </div>
    </div>
    <div v-if="isFile">
      <div class="card">
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
                        <p>{{test_data.question[0].question}}</p>
                    </div> -->
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="text-center">
            <label>URL Upload Jawaban Jurnal</label>
          </div>
          <div class="text-center">
            <div class="form-group">
              <input
                v-model="test_data.question[0].answers[0].answer"
                :disabled="true"
                type="text" 
                class="form-control text-center"
                placeholder="Masukkan URL (GDrive, GForms, atau lainnya)"
              >
            </div>
          </div>
          <div v-if="!isFileAnswersAvailable">
            <div class="text-center m-4">
              <b-button
                variant="success"
                style="min-width: 350px;"
                @click="onClickSubmit"
              >
                Konfirmasi Upload Jawaban
              </b-button>
            </div>
          </div>
          <div v-if="isFileAnswersAvailable">
            <div class="text-center m-4">
              <b-button
                variant="secondary"
                :disabled="true"
                style="min-width: 350px;"
              >
                Upload jawaban sudah terkonfirmasi!
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
