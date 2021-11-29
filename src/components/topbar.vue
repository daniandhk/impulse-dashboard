<script>
import simplebar from "simplebar-vue";
import i18n from "../i18n";
import store from '@/store';

export default {
  components: {  },
  data() {
    return {
      current_language: "en",
      getRole: store.getters.getRoleUser,
      user: store.getters.getLoggedUser
    };
  },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale) {
      i18n.locale = locale;
      this.current_language = i18n.locale;
    },
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
    },
    changeRole(role){
      if(role != this.getRole){
        store.commit('ROLE_USER', role)

        if(this.$route.name != 'home'){
          this.$router.push(
            this.$route.query.redirectFrom || { name: "home" }
          );
        } else{
          location.reload()
        }  
      }
      this.$refs.dropdown.visible = false
    }
  }
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <a
            href="/"
            class="logo logo-dark"
          >
            <span class="logo-sm">
              <img
                src="@/assets/images/logo-sm-dark.png"
                alt
                height="22"
              >
            </span>
            <span class="logo-lg">
              <img
                src="@/assets/images/logo-dark.png"
                alt
                height="20"
              >
            </span>
          </a>

          <a
            href="/"
            class="logo logo-light"
          >
            <span class="logo-sm">
              <img
                src="@/assets/images/logo-sm-light.png"
                alt
                height="22"
              >
            </span>
            <span class="logo-lg">
              <img
                src="@/assets/images/logo-light.png"
                alt
                height="20"
              >
            </span>
          </a>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-24 header-item waves-effect"
          @click="toggleMenu"
        >
          <i class="ri-menu-2-line align-middle" />
        </button>

        <b-dropdown
          ref="dropdown"
          variant="black"
          toggle-class="header-item"
        >
          <template v-slot:button-content>
            {{ setRole(getRole) }}
            <i class="mdi mdi-chevron-down" />
          </template>
          <div class="col-md-12">
            <h5 class="font-size-14 mt-0">
              {{ $t('navbar.dropdown.roles.text') }}
            </h5>
            <ul class="list-unstyled megamenu-list">
              <li
                v-for="(role, index) in user.roles"
                :key="index"
              >
                <a
                  href="javascript:void(0);"
                  @click="changeRole(role)"
                >{{ setRole(role) }}</a>
              </li>
            </ul>
          </div>
        </b-dropdown>
      </div>

      <div class="d-flex">
        <!-- <div class="dropdown d-none d-lg-inline-block ml-1">
          <button
            type="button"
            class="btn header-item noti-icon waves-effect"
            @click="initFullScreen"
          >
            <i class="ri-fullscreen-line"></i>
          </button>
        </div> -->

        <b-dropdown
          right
          variant="black"
          toggle-class="header-item"
          class="d-inline-block user-dropdown"
        >
          <template v-slot:button-content>
            <img
              class="rounded-circle header-profile-user"
              src="@/assets/images/users/default-avatar.png"
              alt="Header Avatar"
            >
            <span class="d-none d-xl-inline-block ml-1">{{ user.name }}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </template>
          <!-- item-->
          <a class="dropdown-item">
            <i class="ri-user-line align-middle mr-1" />
            {{ user.username }}
          </a>
          <a
            class="dropdown-item d-block"
            href="/settings/change-password"
          >
            <i class="ri-settings-2-line align-middle mr-1" />
            Pengaturan
          </a>
          <div class="dropdown-divider" />
          <a
            class="dropdown-item text-danger"
            href="/logout"
          >
            <i class="ri-shut-down-line align-middle mr-1 text-danger" />
            Logout
          </a>
        </b-dropdown>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.notify-item {
  .active {
    color: #16181b;
    background-color: #f8f9fa;
  }
}
</style>