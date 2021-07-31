<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./vertical";

export default {
  components: { Vertical},
  data() {
    return {};
  },
  computed: {
    ...layoutComputed
  },
  methods: {}
};
</script>

<template>
  <div>
    <vertical v-if="layoutType === 'vertical'" :layout="layoutType">
      <slot />
    </vertical>
  </div>
</template>
