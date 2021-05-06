<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableCourse from "./table-course";
import InputCourse from "./input-course";

export default {
  components: {
    Layout,
    PageHeader,
    TableCourse,
    InputCourse,
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  data() {
    return {
      title: "Course Data",
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Course Data",
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
        this.$refs.TableCourse.refreshData();
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
                  <a class="font-weight-bold active">All Courses</a>
                </template>
                <TableCourse ref='TableCourse'/>
              </b-tab>
              <b-tab title-link-class="p-3">
                  <template v-slot:title>
                      <a class="font-weight-bold active">Input Course</a>
                  </template>
                  <InputCourse/>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>