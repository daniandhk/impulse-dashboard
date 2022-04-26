<script>
import Layout from "../../../../layouts/main";
import PageHeader from "@/components/page-header";
import { notificationMethods } from "@/state/helpers";
import ListRemotepc from "../../../../pages/ticketing/remotepc/list-remotepc";
import InputRemotepc from "./input-remotepc";
import i18n from '@/i18n'

export default {
  page: {
    title: i18n.t('student.ticketing.remotepc.text'),
  },
  components: {
    Layout,
    PageHeader,
    ListRemotepc,
    InputRemotepc,
  },
  data() {
    return {
      title: i18n.t('student.ticketing.remotepc.text'),
      items: [
        {
          text: i18n.t('student.text')
        },
        {
          text: i18n.t('student.ticketing.remotepc.text'),
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
        this.$refs.ListRemotepc.refreshData();
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
                  <a class="font-weight-bold active">Input</a>
                </template>
                <InputRemotepc />
              </b-tab>
              <b-tab title-link-class="p-3">
                <template v-slot:title>
                  <a class="font-weight-bold active">{{ $t('student.ticketing.remotepc.title-list.text') }}</a>
                </template>
                <ListRemotepc
                  ref="ListRemotepc"
                  status="student"
                />
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>