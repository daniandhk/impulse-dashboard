<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
/**
 * Dashboard component
 */
import LaboranDashboard from "./dashboard-laboran";
import StaffDashboard from "./dashboard-staff";
import AslabDashboard from "./dashboard-aslab";
import StudentDashboard from "./dashboard-student";
import AsprakDashboard from "./dashboard-asprak";
import store from '@/store';
import i18n from '@/i18n';

export default {
  page: {
    title: "Dashboard",
    meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
    LaboranDashboard,
    StaffDashboard,
    AslabDashboard,
    StudentDashboard,
    AsprakDashboard
  },
  data() {
    return {
      getRole: store.getters.getRoleUser,
      isLaboran: false,
      isStaff: false,
      isAsprak: false,
      isAslab: false,
      isStudent: false,
      title: "Dashboard",
      items: [
        {
          text: "Impulse"
        },
        {
          text: "Dashboard",
          active: true
        }
      ]
    };
  },
  beforeMount: function(){
    this.items[0].text = this.setRole(this.getRole)
    switch(this.getRole) {
      case "staff":
        this.isLaboran = false;
        this.isStaff = true;
        this.isAsprak = false;
        this.isAslab = false;
        this.isStudent = false;
        break;
      case "aslab":
        this.isLaboran = false;
        this.isStaff = false;
        this.isAsprak = false;
        this.isAslab = true;
        this.isStudent = false;
        break;
      case "asprak":
        this.isLaboran = false;
        this.isStaff = false;
        this.isAsprak = true;
        this.isAslab = false;
        this.isStudent = false;
        break;
      case "laboran":
        this.isLaboran = true;
        this.isStaff = false;
        this.isAsprak = false;
        this.isAslab = false;
        this.isStudent = false;
        break;
      case "student":
        this.isLaboran = false;
        this.isStaff = false;
        this.isAsprak = false;
        this.isAslab = false;
        this.isStudent = true;
        break;
      default:
        this.isLaboran = false;
        this.isStaff = false;
        this.isAsprak = false;
        this.isAslab = false;
        this.isStudent = false;
    }
  },
  methods: {
    setRole(role){
      switch(role) {
        case "staff":
          return i18n.t('staff.text')
        case "aslab":
          return i18n.t('aslab.text')
        case "asprak":
          return i18n.t('asprak.text')
        case "student":
          return i18n.t('student.text')
        case "laboran":
          return i18n.t('laboran.text')
        default:
          return role
      }
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
    <div>
      <LaboranDashboard v-if="isLaboran" />
      <StaffDashboard v-if="isStaff" />
      <AslabDashboard v-if="isAslab" />
      <StudentDashboard v-if="isStudent" />
      <AsprakDashboard v-if="isAsprak" />
    </div>
  </Layout>
</template>