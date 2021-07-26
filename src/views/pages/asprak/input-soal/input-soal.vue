<script>
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

/**
 * Form-element component
 */
export default {
  page: {
    title: "Lihat Feedback",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Input Soal",
      items: [
        {
          text: "Input Soal",
          active: true
        }
      ],
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.tableData.length;
    }
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    /**
     * Search the table data with search input
     */
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title"></h4>
            <div class="row">
              <div class="col-12">
                 <form class="form-horizontal" role="form">
                  <div class="form-group row">
                    <label class="col-md-2 col-form-label">Mata Kuliah</label>
                    <div class="col-md-10">
                      <select class="form-control">
                        <option>Select</option>
                        <option>Large select</option>
                        <option>Small select</option>
                      </select>
                    </div>
                  </div>
                </form>
                <form class="form-horizontal" role="form">
                  <div class="form-group row">
                    <label class="col-md-2 col-form-label">Modul</label>
                    <div class="col-md-10">
                      <select class="form-control">
                        <option>Select</option>
                        <option>Large select</option>
                        <option>Small select</option>
                      </select>
                    </div>
                  </div>
                </form>
                <form class="form-horizontal" role="form">
                  <div class="form-group row">
                    <label class="col-md-2 col-form-label">Kelas</label>
                    <div class="col-md-10">
                      <select class="form-control">
                        <option>Select</option>
                        <option>Large select</option>
                        <option>Small select</option>
                      </select>
                    </div>
                  </div>
                </form>
                <div class="text-center">
                  <b-button type="submit" variant="success"><router-link
                                    to="/input-soal/create-test"
                                    class="font-weight-medium"
                                    style="color: white;"
                                  >Input soal</router-link>
                  </b-button>
                </div>
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
    <!-- end row -->
  </Layout>
</template>