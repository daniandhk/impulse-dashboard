<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableClassCourse from "./table-class-course";
import InputClassCourse from "./input-class-course";

export default {
  page: {
    title: "Kelas Mata Kuliah",
  },
  components: {
    Layout,
    PageHeader,
    TableClassCourse,
    InputClassCourse,
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      title: "Kelas Mata Kuliah",
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Kelas Mata Kuliah",
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
        this.$refs.TableClassCourse.refreshData();
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
                <TableClassCourse ref='TableClassCourse'/>
              </b-tab>
              <b-tab title-link-class="p-3">
                  <template v-slot:title>
                      <a class="font-weight-bold active">Input</a>
                  </template>
                  <InputClassCourse/>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>