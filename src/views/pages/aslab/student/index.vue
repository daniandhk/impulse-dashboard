<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import StudentData from "../../../pages/student-data/index";

import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Data Praktikan",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    StudentData,
    PageHeader,
  },
  data() {
    return {
      title: "Data Praktikan",
      items: [
        {
          text: "Laboran",
          href: "/"
        },
        {
          text: "Data Praktikan",
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
      <StudentData status="laboran" />
    </div>
  </Layout>
</template>