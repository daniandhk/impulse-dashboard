<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableStudent from "./table-student-class";
import InputStudent from "./input-student-class";
import ImportStudent from "./import-student-class";

export default {
  page: {
    title: "Kelas Praktikan",
  },
  components: {
    Layout,
    PageHeader,
    TableStudent,
    InputStudent,
    ImportStudent
  },
  data() {
    return {
      title: "Kelas Praktikan",
      items: [
        {
          text: "Asisten Lab"
        },
        {
          text: "Kelas Praktikan",
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
        this.$refs.TableStudent.refreshData();
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
                <TableStudent ref="TableStudent" />
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Input</a>
                </template>
                <InputStudent />
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Import Excel</a>
                </template>
                <ImportStudent />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>