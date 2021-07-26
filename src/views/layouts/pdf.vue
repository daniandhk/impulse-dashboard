<script>
import { layoutComputed } from "@/state/helpers";
import Vertical from "./vertical";
import Horizontal from "./horizontal";
import pdf from 'vue-pdf'
var loadingTask = pdf.createLoadingTask('./pdf/SoalJurnal.pdf');

export default {
  components: { Vertical, Horizontal, pdf },
  data() {
    return {
    src: loadingTask,
	numPages: undefined,
    title: "Jurnal",
    computed: {
    ...layoutComputed
    },
    items: [
        {
          text: "Praktikum",
          href: "/praktikan/praktikum"
        },
        {
          text: "Jurnal",
          active: true
        }
      ]
    }
    },
  mounted() {
  this.src.promise.then(pdf => {

        this.numPages = pdf.numPages;
    });
    }
};
</script>

<template>
  <div class="wrapper">
    <pdf
			v-for="i in numPages"
			:key="i"
			:src="src"
			:page="i"
			style="height: 100%"
	></pdf>  

    <vertical v-if="layoutType === 'vertical'" :layout="layoutType">
      <slot />
    </vertical>

    <Horizontal v-if="layoutType === 'horizontal'" :layout="layoutType">
      <slot />
    </Horizontal>
  </div>
  
</template>
