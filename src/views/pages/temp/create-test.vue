<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Multiselect from "vue-multiselect";
import Vue from 'vue';

export default {
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  data() {
    return {
        title: "Create Tes",
        items: [
            {
            text: "Temp"
            },
            {
            text: "Create Tes",
            active: true
            }
        ],
        selected_test: "",
        test_types: ["Tes Awal", "Jurnal", "Tes Akhir"],
        isPretestSelected: false,
        isJurnalSelected: false,
        isPosttestSelected: false,

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
          if (value == "Tes Awal") {
            this.isPretestSelected = true;
            this.isJurnalSelected = false;
            this.isPosttestSelected = false;
          } 
          else if (value == "Jurnal") {
            this.isJurnalSelected = true;
            this.isPretestSelected = false;
            this.isPosttestSelected = false;
          }
          else if (value == "Tes Akhir") {
            this.isPosttestSelected = true;
            this.isPretestSelected = false;
            this.isJurnalSelected = false;
          }
          
      },
      removeType(){
          this.isPretestSelected = false;
          this.isJurnalSelected = false;
          this.isPosttestSelected = false;
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
      removeMultiple: function (questions, index) {
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
                                    placeholder="Tipe Tes"
                                    v-model="selected_test"
                                    :options="test_types"
                                    @select="selectType"
                                    @remove="removeType"
                                    :show-labels="false"
                                ></multiselect>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="isPretestSelected || isPosttestSelected" class="mb-4">
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
            </form>
        </div>
    </Layout>
</template>
