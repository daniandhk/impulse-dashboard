<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

/**
 * Dashboard component
 */
export default {
  components: {
    Layout,
    PageHeader
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "Impulse"
        },
        {
          text: "Dashboard",
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