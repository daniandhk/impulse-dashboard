<script>
import router from "@/router";
import { layoutComputed } from "@/state/helpers";

import Topbar from "@/components/topbar";
import SideBar from "@/components/side-bar";
import Footer from "@/components/footer";

export default {
  components: { Topbar, SideBar, Footer },
  props: {
    timeEnd: {
      type: String,
      default: null,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMenuCondensed: false,
    };
  },
  computed: {
    ...layoutComputed,
  },
  created: () => {
    document.body.removeAttribute("data-layout", "horizontal");
    document.body.removeAttribute("data-topbar", "dark");
    document.body.setAttribute("data-sidebar", "dark");
  },
  mounted() {
    document.body.classList.remove("auth-body-bg");
    if (this.loader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  },
  methods: {
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");

      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
          document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
      } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
  },
};
</script>

<template>
  <div>
    <div id="preloader">
      <div id="status">
        <div class="spinner">
          <i class="ri-loader-line spin-icon" />
        </div>
      </div>
    </div>

    <!-- Begin page -->
    <div id="layout-wrapper">
      <Topbar
        :time-end="timeEnd"
        :is-done="isDone"
      />
      <SideBar
        :is-condensed="isMenuCondensed"
        :type="leftSidebarType"
        :width="layoutWidth"
      />
      <!-- ============================================================== -->
      <!-- Start right Content here -->
      <!-- ============================================================== -->
      <div class="main-content">
        <div class="page-content">
          <div class="container-fluid">
            <slot />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>