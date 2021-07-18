<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import pdf from 'vue-pdf'
var loadingTask = pdf.createLoadingTask('./pdf/SoalJurnal.pdf');
/**
 * Form wizard component
 */
export default {
  page: {
    title: "Jurnal",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader,pdf },
  data() {
    return {
    src: loadingTask,
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
      ]
    }
    },
  mounted() {
  this.src.promise.then(pdf => {

        this.numPages = pdf.numPages;
  });
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
      <div class="wrapper">
      <pdf
        v-for="i in numPages"
        :key="i"
        :src="src"
        :page="i"
        style="height: 100%"
      ></pdf>
      </div>
  </Layout>
</template>



