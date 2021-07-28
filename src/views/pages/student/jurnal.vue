<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import pdf from 'vue-pdf'

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
      ]
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
  </Layout>
</template>



