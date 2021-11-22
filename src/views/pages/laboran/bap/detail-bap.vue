<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import DetailBAP from "../../../pages/bap/detail-bap";

import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Detail BAP",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    DetailBAP,
    PageHeader,
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  data() {
    return {
      title: "Detail BAP",
      items: [
        {
          text: "Laboran",
          href: "/"
        },
        {
          text: "BAP",
          href: "/laboran/bap"
        },
        {
          text: "Detail",
          active: true,
        }
      ],
    };
  },
  methods: {
    ...notificationMethods,
  },
};

</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div>
      <DetailBAP/>
    </div>
  </Layout>
</template>