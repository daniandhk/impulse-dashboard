<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";

import * as api from '@/api';
import Swal from "sweetalert2";

import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import store from '@/store';

export default {
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
                    text: "Student",
                    href: "/"
                },
                {
                    text: "Schedule",
                    href: "/praktikan/schedule/calendar"
                },
                {
                    text: "Detail",
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

            dataInput: {
                test_id: "",
                answers: [],
            },
            answer: {
                question_id: "",
                answer_id: "",
                answer: "",
            }
            //
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
            this.user_id = store.getters.getLoggedUser.user_id;
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
            }
            if(this.test_data.test.type == 'multiple_choice'){
                this.isEssay = false;
                this.isMultipleChoice = true;
            }
        },

        setInputData(){
            this.dataInput.test_id = this.test_data.test.id;
            this.test_data.question.forEach((element, index, array) => {
                let data = {};
                if(this.test_data.test.type == 'essay'){
                    data = {
                        question_id: element.id,
                        answers: "",
                    }
                }
                if(this.test_data.test.type == 'multiple_choice'){
                    data = {
                        question_id: element.id,
                        answer_id: "",
                    }
                }
                this.dataInput.answers.push(data);
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
            if(this.isEssay){
                return (
                    api.getEssayAnswer(this.test_data.test.id, this.user_id)
                    .then(response => {
                        console.log(response)
                        if(response.data.data){
                            console.log(response.data.data)
                            if(response.data.data.answer){
                                console.log(response.data.data.answer)
                                let answers = response.data.data.answer;
                                answers.forEach((element, index, array) => {
                                    this.dataInput.answers[index].answers = element.answers;
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
                            if(response.data.data.answer){
                                let answers = response.data.data.answer;
                                answers.forEach((element, index, array) => {
                                    this.dataInput.answers[index].answer_id = element.answer.id;
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

        setAnswer(answer, index){
            this.dataInput.answers[index].answer_id = answer.id;
        },

        onClickSubmit(){
            Swal.fire({
                title: "Yakin akan menyelesaikan test?",
                text: "Jawaban yang kosong akan tetap ter-submit!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: "Yes, submit it!"
            }).then(result => {
                if (result.value) {
                    this.submitAnswers();
                }
            });
        },

        submitAnswers(){
            if(this.isEssay){
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
            else if(this.isMultipleChoice){
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
        <div>
            <div v-for="(question, index) in test_data.question" :key="index">
                <div class="row">
                    <div class="text-center col-sm-1">
                        <b-button 
                        class="m-1"
                        style="min-width: 75px;" 
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
                                            />
                                        </div>
                                    </div>
                                    <div v-if="isMultipleChoice">
                                        <div class="mt-2 ml-1 form-check" v-for="(answer, idx) in question.answers" :key="idx">
                                            <input 
                                                class="form-check-input" 
                                                type="radio" 
                                                v-model="dataInput.answers[index].answer_id"
                                                :value="answer.id"
                                                @click="setAnswer(answer, index)"
                                            />{{answer.answer}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center m-4">
                <b-button variant="success" @click="onClickSubmit" style="min-width: 250px;">Submit</b-button>
            </div>
        </div>
    </Layout>
</template>
