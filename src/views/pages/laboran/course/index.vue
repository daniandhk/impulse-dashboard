<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableCourse from "./table-course";
import InputCourse from "./input-course";

export default {
  page: {
    title: "Data Mata Kuliah",
  },
  components: {
    Layout,
    PageHeader,
    TableCourse,
    InputCourse,
  },
  data() {
    return {
      title: "Data Mata Kuliah",
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Data Mata Kuliah",
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
        this.$refs.TableCourse.refreshData();
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
                <TableCourse ref="TableCourse" />
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Input</a>
                </template>
                <InputCourse />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>