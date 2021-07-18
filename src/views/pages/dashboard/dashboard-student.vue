<script>
import pdf from 'vue-pdf'
var loadingTask = pdf.createLoadingTask('./pdf/SoalJurnal.pdf');
/**
 * Dashboard component
 */
export default {
  components: {
    pdf     
  },
  data() {
    return {
    src: loadingTask,
		numPages: undefined,
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
	</div>
</template>
