<script>
import pdf from 'vue-pdf'
/**
 * Dashboard component
 */
export default {
  components: {
    pdf
  },
  data() {
    return {
      currentPage: 0,
      pageCount: 0,
      page: 1,
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
  <div>
    <input type="number" v-model.number="page"> / {{pageCount}}
		<pdf
			src="pdf/SoalJurnal.pdf"
      @num-pages="pageCount = $event"
			@page-loaded="currentPage = $event"
      :page="page"
      style="height: 100%"
		></pdf>
	</div>
</template>
