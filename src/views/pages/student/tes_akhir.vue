<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

/**
 * Form wizard component
 */
export default {
  page: {
    title: "Tes Akhir",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Tes Akhir",
      items: [
        {
          text: "Praktikum",
          href: "/praktikan/praktikum"
        },
        {
          text: "Tes Akhir",
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
    
  </Layout>
</template>



