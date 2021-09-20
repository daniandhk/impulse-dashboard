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
  methods: {
    setRole(role){
      switch(role) {
        case "staff":
          return "Staff"
        case "aslab":
          return "Asisten Lab"
        case "asprak":
          return "Asisten Praktikum"
        case "student":
          return "Praktikan"
        case "laboran":
          return "Laboran"
        default:
          return role
      }
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div>
      <LaboranDashboard v-if="isLaboran"/>
      <StaffDashboard v-if="isStaff"/>
      <AslabDashboard v-if="isAslab"/>
      <StudentDashboard v-if="isStudent"/>
      <AsprakDashboard v-if="isAsprak"/>
    </div>
  </Layout>
</template>