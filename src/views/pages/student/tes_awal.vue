<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

/**
 * Form wizard component
 */
export default {
  page: {
    title: "Tes Awal",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      question: [
        {
                id: "05arxfkmv8hvx3vyst30bjpev",
                test_id: "05farxfkmnzfawxmnj9ekberyk",
                question: "Manakah definisi dibawah ini yang tepat dalam menjelaskan forensik komputer",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    {
                        id: "05farxfkmwbknahy6rqj2z13wy",
                        question_id: "05farxfkmv8hvx3vyst30bjpev",
                        answer: "Forensik komputer digunakan untuk menemukan ",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "05farxfkmxwjvzw73v61sa8n7e",
                        question_id: "05farxfkmv8hvx3vyst30bjpev",
                        answer: "Forensik komputer menggunakan barang bukti digital untuk memecahkan kasus kriminal",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "05farxfkmy5dc6nvc9bfc9v167",
                        question_id: "05farxfkmv8hvx3vyst30bjpev",
                        answer: "Forensik komputer digunakan untuk memeriksa laptop dan PC",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmzkfnrpszv3m28n0dy",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: "  Forensik komputer menggunakan barang bukti untuk memecahkan kasus kejahatan yang berhubungan dengan komputer",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         {
                id: "05arxfkmv8hvx3vyst30bjpev",
                test_id: "05farxfkmnzfawxmnj9ekberyk",
                question: "Secara umum, ______________ melibatkan proses investigasi data yang diambil dari hard disk atau media penyimpanan dalam komputer dengan menerapkan kaidah-kaidah ilmiah ketika melakukan pengambilan data",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    {
                        id: "05farxfkmwbknahy6rqj2z13wy",
                        question_id: "05farxfkmv8hvx3vyst30bjpev",
                        answer: "Data recovery",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "05farxfkmxwjvzw73v61sa8n7e",
                        question_id: "05farxfkmv8hvx3vyst30bjpev",
                        answer: "Network forensics",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "05farxfkmy5dc6nvc9bfc9v167",
                        question_id: "05farxfkmv8hvx3vyst30bjpev",
                        answer: "Computer forensic",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmzkfnrpszv3m28n0dy",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: " Disaster recovery",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         
         {
                id: "01farxfkmpe0kdg33jpdq2emkm",
                test_id: "01farxfkmnzfawxmnj9ekberyk",
                question: "Ban ban apa yang ilang?",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    { 
                        id: "01farxfkmq8x2jar2kcyfegec7",
                        question_id: "01farxfkmpe0kdg33jpdq2emkm",
                        answer: "Bantuan sosial yang dikorupsi ",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "01farxfkmrke8r16x1js05p9tr",
                        question_id: "01farxfkmpe0kdg33jpdq2emkm",
                        answer: "Bansos",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "01farxfkmsppcncarfdhc412zn",
                        question_id: "01farxfkmpe0kdg33jpdq2emkm",
                        answer: "Banser",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "01farxfkmtqrj11ygyvex9a4f3",
                        question_id: "01farxfkmpe0kdg33jpdq2emkm",
                        answer: "Banjir",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         {
                id: "01farxfkmv8hvx3vyst30bjpev",
                test_id: "01farxfkmnzfawxmnj9ekberyk",
                question: "Dari 1-4 bagaimana kondisi ekonomi anda ketika masa pandemik COVID-19 mulai mempengaruhi kehidupan anda?",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    {
                        id: "01farxfkmwbknahy6rqj2z13wy",
                        question_id: "01farxfkmv8hvx3vyst30bjpev",
                        answer: "Sangat kurang (1)",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "01farxfkmxwjvzw73v61sa8n7e",
                        question_id: "01farxfkmv8hvx3vyst30bjpev",
                        answer: "Kurang (2)",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "01farxfkmy5dc6nvc9bfc9v167",
                        question_id: "01farxfkmv8hvx3vyst30bjpev",
                        answer: "Cukup (3)",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "01farxfkmzkfnrpszv3m28n0dy",
                        question_id: "01farxfkmv8hvx3vyst30bjpev",
                        answer: "Sangat cukup (4)",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         {
                id: "02farxfkmv8hvx3vyst30bjpev",
                test_id: "02farxfkmnzfawxmnj9ekberyk",
                question: "Apakah anda sudah mendapatkan vaksin?",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    {
                        id: "02farxfkmwbknahy6rqj2z13wy",
                        question_id: "02farxfkmv8hvx3vyst30bjpev",
                        answer: "Sudah",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "02farxfkmxwjvzw73v61sa8n7e",
                        question_id: "02farxfkmv8hvx3vyst30bjpev",
                        answer: "Belum",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "02farxfkmy5dc6nvc9bfc9v167",
                        question_id: "02farxfkmv8hvx3vyst30bjpev",
                        answer: "Tidak ada",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "02farxfkmzkfnrpszv3m28n0dy",
                        question_id: "02farxfkmv8hvx3vyst30bjpev",
                        answer: "Mahal",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         {
                id: "03farxfkmv8hvx3vyst30bjpev",
                test_id: "03farxfkmnzfawxmnj9ekberyk",
                question: "Siapa nama presiden Republik Indonesia saat ini?",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    {
                        id: "03farxfkmwbknahy6rqj2z13wy",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: "Jokowi",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "03farxfkmxwjvzw73v61sa8n7e",
                        question_id: "0farxfkmv8hvx3vyst30bjpev",
                        answer: "Megawati",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "03farxfkmy5dc6nvc9bfc9v167",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: "Soeharto",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "03farxfkmzkfnrpszv3m28n0dy",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: "Habibie",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         {
                id: "04arxfkmv8hvx3vyst30bjpev",
                test_id: "04farxfkmnzfawxmnj9ekberyk",
                question: "Apa nama unversitas yang berada di Bojongsoang?",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    {
                        id: "04farxfkmwbknahy6rqj2z13wy",
                        question_id: "04farxfkmv8hvx3vyst30bjpev",
                        answer: "Institut Teknologi Bandung",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmxwjvzw73v61sa8n7e",
                        question_id: "04farxfkmv8hvx3vyst30bjpev",
                        answer: "Universitas Malang",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmy5dc6nvc9bfc9v167",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: "Telkom University",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmzkfnrpszv3m28n0dy",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: "Universitas Indonesia",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         {
                id: "04arxfkmv8hvx3vyst30bjpev",
                test_id: "04farxfkmnzfawxmnj9ekberyk",
                question: "Tindakan yang anda ambil untuk melindungi informasi anda dari ancaman dan kerentanan adalah?",
                created_at: "2021-07-17T00:22:28.000000Z",
                updated_at: "2021-07-17T00:22:28.000000Z",
                answers: [
                    {
                        id: "04farxfkmwbknahy6rqj2z13wy",
                        question_id: "04farxfkmv8hvx3vyst30bjpev",
                        answer: "Threat",
                        is_answer: true,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmxwjvzw73v61sa8n7e",
                        question_id: "04farxfkmv8hvx3vyst30bjpev",
                        answer: "Attack",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmy5dc6nvc9bfc9v167",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: "Vulnerability",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    },
                    {
                        id: "04farxfkmzkfnrpszv3m28n0dy",
                        question_id: "03farxfkmv8hvx3vyst30bjpev",
                        answer: " Countermeasure",
                        is_answer: false,
                        created_at: "2021-07-17T00:22:28.000000Z",
                        updated_at: "2021-07-17T00:22:28.000000Z"
                    }
                    ]
         },
         
      ],
  
      title: "Tes Awal",
      items: [
        {
          text: "Praktikum",
          href: "/praktikan/praktikum"
        },
        {
          text: "Tes Awal",
          active: true
        }
      ]
    };
    
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="card" :key="index">

    <h3 class="text-center mt-5 ">Modul 1</h3>
                                    <div class="card-body mt-3 ml-5"  v-for="(question, index) in question" :key="index">
                                            <div class="row"> 
                                            <div class="col-12">
                                                <label for="text"> {{index+1}}.  {{question.question}} </label>
                                            </div>
                                            </div>
                                            <div class="mt-2 ml-5 mb-3 text-left" v-for="(answers, index) in question.answers" :key="index">
                                              <input class="form-check-input" type="checkbox" id="defaultCheck1" /> {{answers.answer}}
                                             </div>
                                    </div>
                                    <b-button v-on:click="addAnswer(question)" v-b-modal.modal-backdrop variant="success mt-4" >Selesai</b-button>
                                    <b-modal no-close-on-backdrop
                                      id="modal-backdrop"
                                      title="Tes Awal"
                                      title-class="font-18"     
                                                                     
                                    >
                                      <p>Apa anda sudah yakin ingin mengakhiri tes awal ?</p>
                                    </b-modal>

    </div>
  </Layout>
</template>



