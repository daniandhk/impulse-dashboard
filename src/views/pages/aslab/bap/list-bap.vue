<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import ListBAP from "../../../pages/bap/list-bap";

import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "List BAP",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    ListBAP,
    PageHeader,
  },
  data() {
    return {
      title: "Berita Acara Praktikum",
      items: [
        {
          text: "Asisten Lab",
          href: "/"
        },
        {
          text: "BAP",
          active: true,
        }
      ],
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    ...notificationMethods,
  },
};

</script>

<template>
  <Layout>
    <PageHeader
      :title="title"
      :items="items"
    />
    <div>
      <ListBAP status="aslab" />
    </div>
  </Layout>
</template>