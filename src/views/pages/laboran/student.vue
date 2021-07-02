<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import TableStudent from "./table-student";
import InputStudent from "./input-student";

export default {
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
      title: "Student Data",
      items: [
        {
          text: "Laboran"
        },
        {
          text: "Student Data",
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
                  <a class="font-weight-bold active">All Students</a>
                </template>
                <TableStudent ref='TableStudent'/>
              </b-tab>
              <b-tab title-link-class="p-3">
                  <template v-slot:title>
                      <a class="font-weight-bold active">Input Student(s)</a>
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