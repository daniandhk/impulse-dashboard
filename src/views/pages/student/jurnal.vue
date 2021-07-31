<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import pdf from 'vue-pdf'
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

/**
 * Form wizard component
 */
export default {
  page: {
    title: "Jurnal",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader,pdf, ckeditor: CKEditor.component },
  data() {
    return {
    currentPage: 0,
    pageCount: 0,
    page: 1,
    src:"",
		numPages: undefined,
    title: "Jurnal",
    items: [
        {
          text: "Praktikum",
          href: "/praktikan/praktikum"
        },
        {
          text: "Jurnal",
          active: true
        }
      ],
    editor: ClassicEditor,
    editorData:
        "<h3>Form Jawaban!</h3><h5><b>Masukkan jawaban pengerjaan jurnal anda disini.</b></h5>"
    }
    },
  mounted() {
  this.src = pdf.createLoadingTask('../pdf/SoalJurnal.pdf');
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
		<pdf
			:src="src"
      @num-pages="pageCount = $event"
			@page-loaded="currentPage = $event"
      :page="page"
      style="height: 100%"
      hidden
		></pdf>
    <pdf
			:src="src"
      v-for="i in pageCount"
      :key="i"
      :page="i"
      style="height: 100%"
		></pdf>
    <b-alert show variant="success" class="text-center"></b-alert>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
                        <!-- Editor -->
            <ckeditor v-model="editorData" :editor="editor"></ckeditor>
          </div>
        </div>
      </div>
    </div>
    <div class="card" :key="index">
      <b-button v-on:click="addAnswer(question)" v-b-modal.modal-backdrop variant="success mt-4" >Selesai</b-button>
    </div>
  </Layout>
</template>



