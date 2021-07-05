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
    
  </Layout>
</template>



