<script>
import simplebar from "simplebar-vue";
import { layoutComputed } from "@/state/helpers";

import MetisMenu from "metismenujs/dist/metismenujs";

import { menuItems, laboranItems, staffItems, aslabItems, asprakItems, praktikanItems } from "./menu";
import store from '@/store';

export default {
  components: {
    simplebar,
  },
  props: {
    isCondensed: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      menuItems: menuItems,
      getRole: store.getters.getRoleUser,
    };
  },
  computed: {
    ...layoutComputed,
  },
  watch: {
    $route: {
      handler: "onRoutechange",
      immediate: true,
      deep: true,
    },
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-sidebar", "dark");
              document.body.removeAttribute("data-topbar");
              document.body.removeAttribute("data-sidebar-size");
              break;
            case "light":
              document.body.setAttribute("data-topbar", "dark");
              document.body.removeAttribute("data-sidebar");
              document.body.removeAttribute("data-sidebar-size");
              document.body.classList.remove("vertical-collpsed");
              break;
            case "compact":
              document.body.setAttribute("data-sidebar-size", "small");
              document.body.setAttribute("data-sidebar", "dark");
              document.body.classList.remove("vertical-collpsed");
              document.body.removeAttribute("data-topbar", "dark");
              break;
            case "icon":
              document.body.setAttribute("data-keep-enlarged", "true");
              document.body.classList.add("vertical-collpsed");
              document.body.setAttribute("data-sidebar", "dark");
              document.body.removeAttribute("data-topbar", "dark");
              break;
            case "colored":
              document.body.setAttribute("data-sidebar", "colored");
              document.body.removeAttribute("data-keep-enlarged");
              document.body.classList.remove("vertical-collpsed");
              document.body.removeAttribute("data-sidebar-size");
              break;
            default:
              document.body.setAttribute("data-sidebar", "dark");
              break;
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "boxed":
              document.body.setAttribute("data-layout-size", "boxed");
              break;
            case "fluid":
              document.body.setAttribute("data-layout-mode", "fluid");
              document.body.removeAttribute("data-layout-size");
              break;
            default:
              document.body.setAttribute("data-layout-mode", "fluid");
              break;
          }
        }
      },
    },
  },
  beforeMount: function(){
    switch(this.getRole) {
      case "staff":
        this.menuItems = staffItems
        break;
      case "aslab":
        this.menuItems = aslabItems
        break;
      case "asprak":
        this.menuItems = asprakItems
        break;
      case "laboran":
        this.menuItems = laboranItems
        break;
      case "student":
        this.menuItems = praktikanItems
        break;
      default:
        this.menuItems = menuItems
    }
  },
  mounted: function () {
    // eslint-disable-next-line no-unused-vars
    var menuRef = new MetisMenu("#side-menu");
    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    for (var i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      var parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add("mm-active");
        const parent2 = parent.parentElement.closest("ul");
        if (parent2 && parent2.id !== "side-menu") {
          parent2.classList.add("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add("mm-active");
            var childAnchor = parent3.querySelector(".has-arrow");
            var childDropdown = parent3.querySelector(".has-dropdown");
            if (childAnchor) childAnchor.classList.add("mm-active");
            if (childDropdown) childDropdown.classList.add("mm-active");

            const parent4 = parent3.parentElement;
            if (parent4 && parent4.id !== "side-menu") {
              parent4.classList.add("mm-show");
              const parent5 = parent4.parentElement;
              if (parent5 && parent5.id !== "side-menu") {
                parent5.classList.add("mm-active");
                const childanchor = parent5.querySelector(".is-parent");
                if (childanchor && parent5.id !== "side-menu") {
                  childanchor.classList.add("mm-active");
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    /**
     * Returns true or false if given menu item has child or not
     * @param item menuItem
     */
    hasItems(item) {
      return item.subItems !== undefined ? item.subItems.length > 0 : false;
    },
    onRoutechange() {
      setTimeout(() => {
        if(document.getElementsByClassName("mm-active")[0]){
          const currentPosition = document.getElementsByClassName("mm-active")[0]
            .offsetTop;
          if (currentPosition > 400)
            this.$refs.currentMenu.SimpleBar.getScrollElement().scrollTop =
              currentPosition + 200;
        }
      }, 300);
    },
  },
};
</script>
<template>
  <!-- ========== Left Sidebar Start ========== -->
  <div class="vertical-menu">
    <simplebar
      id="my-element"
      ref="currentMenu"
      class="h-100"
    >
      <!--- Sidemenu -->
      <div id="sidebar-menu">
        <!-- Left Menu Start -->
        <ul
          id="side-menu"
          class="metismenu list-unstyled"
        >
          <template v-for="item in menuItems">
            <li
              v-if="item.isTitle"
              :key="item.id"
              class="menu-title"
            >
              {{ $t(item.label) }}
            </li>

            <!--end Layouts menu -->
            <li
              v-if="!item.isTitle && !item.isLayout"
              :key="item.id"
            >
              <a
                v-if="hasItems(item)"
                href="javascript:void(0);"
                class="is-parent"
                :class="{
                  'has-arrow': !item.badge,
                  'has-dropdown': item.badge,
                }"
              >
                <i
                  v-if="item.icon"
                  :class="`bx ${item.icon}`"
                />
                <span>{{ $t(item.label) }}</span>
                <span
                  v-if="item.badge"
                  :class="`badge badge-pill badge-${item.badge.variant} float-right`"
                >{{ $t(item.badge.text) }}</span>
              </a>

              <router-link
                v-if="item.hasParams && !hasItems(item)"
                :to="{name: item.link, params: {type: item.params}}"
                class="side-nav-link-ref"
              >
                <i
                  v-if="item.icon"
                  :class="`bx ${item.icon}`"
                />
                <span>{{ $t(item.label) }}</span>
                <span
                  v-if="item.badge"
                  :class="`badge badge-pill badge-${item.badge.variant} float-right`"
                >{{ $t(item.badge.text) }}</span>
              </router-link>

              <router-link
                v-else-if="!hasItems(item)"
                :to="{name: item.link}"
                class="side-nav-link-ref"
              >
                <i
                  v-if="item.icon"
                  :class="`bx ${item.icon}`"
                />
                <span>{{ $t(item.label) }}</span>
                <span
                  v-if="item.badge"
                  :class="`badge badge-pill badge-${item.badge.variant} float-right`"
                >{{ $t(item.badge.text) }}</span>
              </router-link>

              <ul
                v-if="hasItems(item)"
                class="sub-menu"
                aria-expanded="false"
              >
                <li
                  v-for="(subitem, index) of item.subItems"
                  :key="index"
                >
                  <router-link
                    v-if="subitem.hasParams && !hasItems(subitem)"
                    :to="{name: subitem.link, params: {type: subitem.params}}"
                    class="side-nav-link-ref"
                  >
                    {{ $t(subitem.label) }}
                  </router-link>
                  <router-link
                    v-else-if="!hasItems(subitem)"
                    :to="{name: subitem.link}"
                    class="side-nav-link-ref"
                  >
                    {{ $t(subitem.label) }}
                  </router-link>
                  <a
                    v-if="hasItems(subitem)"
                    class="side-nav-link-a-ref has-arrow"
                    href="javascript:void(0);"
                  >{{ subitem.label }}</a>
                  <ul
                    v-if="hasItems(subitem)"
                    class="sub-menu mm-collapse"
                    aria-expanded="false"
                  >
                    <li
                      v-for="(subSubitem, subIndex) of subitem.subItems"
                      :key="subIndex"
                    >
                      <router-link
                        v-if="subSubitem.hasParams"
                        :to="{name: subSubitem.link, params: {type: subSubitem.params}}"
                        class="side-nav-link-ref"
                      >
                        {{ $t(subSubitem.label) }}
                      </router-link>
                      <router-link
                        v-else
                        :to="{name: subSubitem.link}"
                        class="side-nav-link-ref"
                      >
                        {{ $t(subSubitem.label) }}
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
      <!-- Sidebar -->
    </simplebar>
  </div>
  <!-- Left Sidebar End -->
</template>