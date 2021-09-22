<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import * as api from '@/api';
import Swal from "sweetalert2";

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import store from '@/store';

export default {
    page: {
        title: "Test",
        meta: [{ name: "description" }],
    },
    components: {
        Layout,
        PageHeader
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
            title: "Test",
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
                    text: "Test",
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
        }
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
            //         footer: 'You are redirected to Schedule Menu',
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
                    text: 'This test currently not actived!',
                    footer: 'You are redirected to Schedule Menu',
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: error
                    })
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
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        footer: error
                    })
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
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            footer: error
                        })
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
                this.$router.back();
            }
        },

        onClickSubmit(){
            let text = "Jawaban yang kosong akan tetap ter-submit!";
            let confirm = "Yes, submit it!";
            if(this.isFile){
                text = "Pastikan jawaban diunggah ke URL yang telah disediakan!"
                confirm = "Yes, end this test!"
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
                    //         Swal.fire("Submitted!", "Anda telah menyelesaikan test ini!", "success");
                    //         this.$router.push({
                    //             name: 'praktikan-schedule-detail', 
                    //             params: { id: this.schedule_test_data.schedule.id }
                    //         });
                    //     })
                    //     .catch(error => {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Oops...',
                    //             text: 'Something went wrong!',
                    //             footer: error
                    //         })
                    //     })
                    // );
                }
                else{
                    return (
                        api.storeEssay(this.dataInput)
                        .then(response => {
                            Swal.fire("Submitted!", "Anda telah menyelesaikan test ini!", "success");
                            this.$router.push({
                                name: 'praktikan-schedule-detail', 
                                params: { id: this.schedule_test_data.schedule.id }
                            });
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
                }
            }
            else if(this.isMultipleChoice){
                if(this.isMCAnswersAvailable){
                    // return (
                    //     api.updateMultipleChoice(this.dataInput)
                    //     .then(response => {
                    //         Swal.fire("Submitted!", "Anda telah menyelesaikan test ini!", "success");
                    //         this.$router.push({
                    //             name: 'praktikan-schedule-detail', 
                    //             params: { id: this.schedule_test_data.schedule.id }
                    //         });
                    //     })
                    //     .catch(error => {
                    //         Swal.fire({
                    //             icon: 'error',
                    //             title: 'Oops...',
                    //             text: 'Something went wrong!',
                    //             footer: error
                    //         })
                    //     })
                    // );
                }
                else{
                    return (
                        api.storeMultipleChoice(this.dataInput)
                        .then(response => {
                            Swal.fire("Submitted!", "Anda telah menyelesaikan test ini!", "success");
                            this.$router.push({
                                name: 'praktikan-schedule-detail', 
                                params: { id: this.schedule_test_data.schedule.id }
                            });
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
                }
            }
            else if(this.isFile){
                this.dataInput.answers.forEach((element, index, array) => {
                    element.answers = "uploaded";
                });
                return (
                    api.storeEssay(this.dataInput)
                    .then(response => {
                        Swal.fire("Submitted!", "Anda telah menyelesaikan test ini!", "success");
                        this.$router.push({
                            name: 'praktikan-schedule-detail', 
                            params: { id: this.schedule_test_data.schedule.id }
                        });
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
            }
        },

        onClickDownload(){
            this.loading();
            return (
                api.downloadJournal(this.schedule_test_data.schedule.module_id, this.schedule_test_data.test.id)
                .then(response => {
                    let blob = new Blob([response.data])
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = this.test_data.question[0].question
                    link.click()
                    
                    this.loading();
                    Swal.fire("Downloaded!", "The file has been downloaded.", "success");
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
        <div v-if="isEssay || isMultipleChoice">
            <div v-for="(question, index) in test_data.question" :key="index">
                <div class="row">
                    <div class="text-center col-sm-1">
                        <b-button 
                        class="m-1"
                        style="width: 85%; text-align: center; vertical-align: middle;" 
                        variant="outline-secondary"
                        >{{index+1}}
                        </b-button>
                    </div>
                    <div class="card col-sm-11">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12">
                                    <label>{{question.question}}</label>
                                </div>
                                <div class="col-12">
                                    <div v-if="isEssay">
                                        <div class="mt-2">
                                            <textarea
                                                rows=4 
                                                v-model="dataInput.answers[index].answers"
                                                id="text" 
                                                name="text" 
                                                type="text" 
                                                class="form-control"
                                                placeholder="Masukkan jawaban disini"
                                                :disabled="isEssayAnswersAvailable"
                                            />
                                        </div>
                                    </div>
                                    <div v-if="isMultipleChoice">
                                        <div class="mt-2 ml-1 form-check" v-for="(answer, idx) in question.answers" :key="idx">
                                            <input 
                                                class="form-check-input" 
                                                type="checkbox" 
                                                v-model="dataInput.questions[index].answers"
                                                :value="answer.id"
                                                :disabled="isMCAnswersAvailable"
                                            />{{answer.answer}}
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
                    <b-button variant="success" @click="onClickSubmit" style="min-width: 250px;">Submit</b-button>
                </div>
            </div>
            <div v-if="isEssayAnswersAvailable || isMCAnswersAvailable">
                <div class="text-center m-4">
                    <b-button variant="secondary" :disabled="true" style="min-width: 250px;">Anda telah menyelesaikan tes ini!</b-button>
                </div>
            </div>
        </div>
        <div v-if="isFile">
            <div class="card">
                <div class="card-body">
                    <div class="text-center">
                        <label>File Journal</label>
                    </div>
                    <div class="text-center">
                        <b-button variant="primary" @click="onClickDownload" style="min-width: 350px;">Download</b-button>
                    </div>
                    <!-- <div class="text-center mt-2">
                        <p>{{test_data.question[0].question}}</p>
                    </div> -->
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="text-center">
                        <label>URL Upload Jawaban Journal</label>
                    </div>
                    <div class="text-center">
                        <div class="form-group">
                            <input
                                v-model="test_data.question[0].answers[0].answer"
                                disabled="true"
                                type="text" 
                                class="form-control text-center"
                                placeholder="https://drive.google.com/drive/folders/xxx"
                            />
                        </div>
                    </div>
                    <div v-if="!isFileAnswersAvailable">
                        <div class="text-center m-4">
                            <b-button variant="success" @click="onClickSubmit" style="min-width: 350px;">Konfirmasi Telah Upload</b-button>
                        </div>
                    </div>
                    <div v-if="isFileAnswersAvailable">
                        <div class="text-center m-4">
                            <b-button variant="secondary" :disabled="true" style="min-width: 350px;">Upload Terkonfirmasi</b-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
