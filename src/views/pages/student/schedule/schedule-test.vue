<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import * as api from '@/api';
import Swal from "sweetalert2";
import { notificationMethods } from "@/state/helpers";
import store from '@/store';
import i18n from '@/i18n';
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
        title: i18n.t('student.schedule.practicum.test.text'),
        meta: [{ name: "description" }],
    },
    components: {
        Layout,
        PageHeader
    },
    data() {
        return {
            title: i18n.t('student.schedule.practicum.test.text'),
            items: [
                {
                    text: i18n.t('student.text'),
                    href: "/"
                },
                {
                    text: i18n.t('student.schedule.text'),
                    href: "/student/schedule/calendar"
                },
                {
                    text: i18n.t('student.schedule.practicum.text'),
                    href: "/student/schedule/calendar"
                },
                {
                    text: i18n.t('student.schedule.practicum.test.text'),
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
                placeholder: i18n.t('student.schedule.practicum.test.placeholder-answer'),
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
                this.title = i18n.t('student.schedule.practicum.pretest.text');
                this.items[3].text = i18n.t('student.schedule.practicum.pretest.text');
            }
            else if(this.$route.params.type == 'journal'){
                this.title = i18n.t('student.schedule.practicum.journal.text');
                this.items[3].text = i18n.t('student.schedule.practicum.journal.text');
            }
            else if(this.$route.params.type == 'posttest'){
                this.title = i18n.t('student.schedule.practicum.posttest.text');
                this.items[3].text = i18n.t('student.schedule.practicum.posttest.text');
            }
            else{
                this.title = i18n.t('student.schedule.practicum.test.text');
                this.items[3].text = i18n.t('student.schedule.practicum.test.text');
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
            //         footer: i18n.t('component.swal.redirect-schedule'),
            //     })
            //     this.$router.replace({
            //         name: 'student-schedule-detail', 
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
                    text: i18n.t('student.schedule.practicum.error.test-notstarted'),
                    footer: i18n.t('component.swal.redirect-schedule'),
                })
                this.$router.replace({
                    name: 'student-schedule-detail', 
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
                          text: i18n.t('component.swal.error.text'),
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
                        this.items[2].href = "/student/schedule/detail/" + this.schedule_test_data.schedule.id;
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
                          text: i18n.t('component.swal.error.text'),
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
                                text: i18n.t('component.swal.error.text'),
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
                                text: i18n.t('component.swal.error.text'),
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
                    text: i18n.t('component.swal.error.invalid-id'),
                    footer: i18n.t('component.swal.redirect-schedule'),
                    timer: 4000
                })
                this.$router.back();
            }
        },

        onClickSubmit(){
            let text = i18n.t('student.schedule.practicum.test.submit.check-text');
            let confirm = i18n.t('student.schedule.practicum.test.submit.confirm-text');
            if(this.isFile){
                text = i18n.t('student.schedule.practicum.test.submit.check-upload');
                confirm = i18n.t('student.schedule.practicum.test.submit.confirm-upload');
            }
            Swal.fire({
                title: i18n.t('student.schedule.practicum.test.submit.confirm-swal'),
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
                    //         Swal.fire(i18n.t('student.schedule.practicum.test.submit.success'), i18n.t('student.schedule.practicum.test.submit.success-desc'), "success");
                    //         this.$router.push({
                    //             name: 'student-schedule-detail', 
                    //             params: { id: this.schedule_test_data.schedule.id }
                    //         });
                    //     })
                    //     .catch(error => {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Oops...',
                    //             text: i18n.t('component.swal.error.text'),
                    //             footer: error
                    //         })
                    //     })
                    // );
                }
                else{
                    return (
                        api.storeEssay(this.dataInput)
                        .then(response => {
                            Swal.fire(i18n.t('student.schedule.practicum.test.submit.success'), i18n.t('student.schedule.practicum.test.submit.success-desc'), "success");
                            this.$router.push({
                                name: 'student-schedule-detail', 
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
                                    text: i18n.t('component.swal.error.text'),
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
                    //         Swal.fire(i18n.t('student.schedule.practicum.test.submit.success'), i18n.t('student.schedule.practicum.test.submit.success-desc'), "success");
                    //         this.$router.push({
                    //             name: 'student-schedule-detail', 
                    //             params: { id: this.schedule_test_data.schedule.id }
                    //         });
                    //     })
                    //     .catch(error => {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Oops...',
                    //             text: i18n.t('component.swal.error.text'),
                    //             footer: error
                    //         })
                    //     })
                    // );
                }
                else{
                    return (
                        api.storeMultipleChoice(this.dataInput)
                        .then(response => {
                            Swal.fire(i18n.t('student.schedule.practicum.test.submit.success'), i18n.t('student.schedule.practicum.test.submit.success-desc'), "success");
                            this.$router.push({
                                name: 'student-schedule-detail', 
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
                                    text: i18n.t('component.swal.error.text'),
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
                        Swal.fire(i18n.t('student.schedule.practicum.test.submit.success'), i18n.t('student.schedule.practicum.test.submit.success-desc'), "success");
                        this.$router.push({
                            name: 'student-schedule-detail', 
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
                                text: i18n.t('component.swal.error.text'),
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
                    Swal.fire(i18n.t('student.schedule.practicum.test.submit.uploaded'), i18n.t('student.schedule.practicum.test.submit.uploaded-desc'), "success");
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
                          text: i18n.t('component.swal.error.text'),
                          footer: error.response.data.message
                      })
                    }
                })
            );
        },

        setTimeEnd(){
            let now = moment()
            let date_now = moment().format('MM/DD/YYYY')
            let schedule_time_end = moment(date_now + ' ' + moment(this.timeEnd).format('HH:mm:ss'), 'MM/DD/YYYY HH:mm:ss')

            let range = moment().range(now, schedule_time_end)
            let time_diff = range.diff()

            if(time_diff >= 0){
                let time_end = moment.utc(time_diff);
                
                if(time_end.second() == 0 && (time_end.minute() == 5 || time_end.minute() == 2 || time_end.minute() == 1)){
                    this.onTimeWarningPopup(time_end.minute())
                }
            }
            // else{
            //     range = moment().range(schedule_time_end, now)
            //     time_diff = range.diff()
            //     let time_end = moment.utc(time_diff).format('HH:mm:ss');
            // }
        },

        onTimeWarningPopup(minute){
            let text = i18n.t('student.schedule.practicum.test.warning.submit')
            if(this.isMultipleChoice || this.isEssay){
                text = i18n.t('student.schedule.practicum.test.warning.submit')
            }
            if(this.isFile){
                text = i18n.t('student.schedule.practicum.test.warning.upload')
            }
            Swal.fire({
                icon: 'info',
                title: i18n.t('student.schedule.practicum.test.warning.swal-desc') + minute + i18n.t('student.schedule.practicum.test.warning.swal-minute'),
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
                  <label>{{ $t('student.schedule.practicum.test.question') }}</label>
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
                  <label>{{ $t('student.schedule.practicum.test.answer') }}</label>
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
            {{ $t('student.schedule.practicum.button.submit-answer') }}
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
            {{ $t('student.schedule.practicum.button.submitted-answer') }}
          </b-button>
        </div>
      </div>
    </div>
    <div v-if="isFile">
      <div class="card">
        <div class="card-body">
          <div class="text-center">
            <label>{{ $t('student.schedule.practicum.test.file-journal') }}</label>
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
            <label>{{ $t('student.schedule.practicum.test.url-upload') }}</label>
          </div>
          <div class="text-center">
            <div class="form-group">
              <input
                v-model="test_data.question[0].answers[0].answer"
                :disabled="true"
                type="text" 
                class="form-control text-center"
                :placeholder="$t('student.schedule.practicum.test.placeholder-upload')"
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
                {{ $t('student.schedule.practicum.button.upload-answer') }}
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
                {{ $t('student.schedule.practicum.button.uploaded-answer') }}
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
