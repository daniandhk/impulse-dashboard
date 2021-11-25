<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableAccount from "./table-account";

export default {
  page: {
    title: "Kelola Akun",
  },
  components: {
    Layout,
    PageHeader,
    TableAccount,
  },
  data() {
    return {
      title: "Kelola Akun",
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Kelola Akun",
          active: true
        }
      ],
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  methods: {
    ...notificationMethods,

    refreshData(){
        this.$refs.TableAccount.refreshData();
    }
  }
};
</script>


<template>
  <Layout>
    <PageHeader
      :title="title"
      :items="items"
    />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <TableAccount ref="TableAccount" />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>