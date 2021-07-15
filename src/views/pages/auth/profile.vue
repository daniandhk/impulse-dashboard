<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

/**
 * Images component
 */
export default {
  page: {
    title: "Images",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Profile",
      items: [
        {
          text: "UI Elements",
          href: "/"
        },
        {
          text: "Images",
          active: true
        }
      ]
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Foto Profil</h4>
            <div class>
              <img src="@/assets/images/small/img-2.jpg" class="img-fluid" alt="Responsive image" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-8">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Data Profil</h4>
            <div class>
              <form class="form-horizontal" role="form">
                  <b-form-group
                    id="Nama"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Nama"
                    label-for="Nama"
                  >
                    <b-form-input for="Nama" value="Artisanal kale"></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="nim"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Nim"
                    label-for="nim"
                  >
                    <b-form-input
                      id="nim"
                      value="1301112112"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="example-email"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Email"
                    label-for="email"
                  >
                    <b-form-input id="email" value="bootstrap@example.com"></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="example-tel"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Telephone"
                    label-for="tele"
                  >
                    <b-form-input id="tele" value="1-(555)-555-5555" type="tel" name="tel"></b-form-input>
                  </b-form-group>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>