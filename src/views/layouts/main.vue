<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./vertical";

export default {
  components: { Vertical},
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
    <vertical
      v-if="layoutType === 'vertical'"
      :time-end="timeEnd"
      :is-done="isDone"
      :layout="layoutType"
    >
      <slot />
    </vertical>
  </div>
</template>
