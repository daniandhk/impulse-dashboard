<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableAsprak from "./table-asprak-class";
import InputAsprak from "./input-asprak-class";
import ImportAsprak from "./import-asprak-class";

export default {
  page: {
    title: "Kelas Asisten Praktikum",
  },
  components: {
    Layout,
    PageHeader,
    TableAsprak,
    InputAsprak,
    ImportAsprak,
  },
  data() {
    return {
      title: "Kelas Asisten Praktikum",
      items: [
        {
          text: "Asisten Lab"
        },
        {
          text: "Kelas Asisten Praktikum",
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
        this.$refs.TableAsprak.refreshData();
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
            <b-tabs
              nav-class="nav-tabs-custom"
              @input="refreshData"
            >
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Data</a>
                </template>
                <TableAsprak ref="TableAsprak" />
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Input</a>
                </template>
                <InputAsprak />
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Import Excel</a>
                </template>
                <ImportAsprak />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>