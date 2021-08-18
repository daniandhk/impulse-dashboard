<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import Vue from 'vue';
import vue2Dropzone from "vue2-dropzone";
import appConfig from "@/app.config";

export default {
  components: {
    Layout,
    PageHeader,
    Multiselect,
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
        title: "Create Test",
        meta: [{ name: "description", content: appConfig.description }],
        items: [
            {
            text: "Input Soal"

            },
            {
            text: "Create Test",
            active: true
            }
        ],
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
        }
      
  }
};
</script>

<template>
    <Layout>
        <PageHeader :title="title" :items="items" />
        <div>
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
