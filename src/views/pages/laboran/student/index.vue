<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableStudent from "./table-student";
import InputStudent from "./input-student";

export default {
  page: {
    title: "Data Mahasiswa",
  },
  components: {
    Layout,
    PageHeader,
    TableStudent,
    InputStudent,
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      title: "Data Mahasiswa",
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Data Mahasiswa",
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
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body pt-0">
            <b-tabs nav-class="nav-tabs-custom" @input="refreshData">
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">Data</a>
                </template>
                <TableStudent ref='TableStudent'/>
              </b-tab>
              <b-tab title-link-class="p-3">
                  <template v-slot:title>
                      <a class="font-weight-bold active">Input</a>
                  </template>
                  <InputStudent/>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>