<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

/**
 * Form-element component
 */
export default {
  page: {
    title: "Ganti Password",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Ganti Password",
    };
  },
 
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-12">
                <form class="form-horizontal" role="form">
                  <b-form-group
                    id="example text"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Password Baru"
                  >
                    <b-form-input for="text" value=""></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="example text"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Konfirmasi Password"
                  >
                    <b-form-input for="text" value=""></b-form-input>
                  </b-form-group>
                  <div class="text-center mt-4">
                        <button
                        type="submit"
                        class="btn btn-success waves-effect waves-light"
                        style="min-width: 150px;"
                        >Ganti Password</button>
                    </div>
                </form>
              
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