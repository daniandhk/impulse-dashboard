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
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Username</h4>
            <p class="card-title-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. In, maxime?
            </p>
            <div class>
              <img src="@/assets/images/small/img-2.jpg" class="img-fluid" alt="Responsive image" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Username</h4>
            <p class="card-title-desc">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. In, maxime?
            </p>
            <div class>
              <form class="form-horizontal" role="form">
                  <b-form-group
                    id="example text"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Text"
                    label-for="text"
                  >
                    <b-form-input for="text" value="Artisanal kale"></b-form-input>
                  </b-form-group>

                  <b-form-group
                    id="example-search"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Search"
                    label-for="search"
                  >
                    <b-form-input
                      id="search"
                      value="How do I shoot web"
                      type="search"
                      name="search"
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
                    id="example-url"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="URL"
                    label-for="url"
                  >
                    <b-form-input id="url" value="https://getbootstrap.com" type="url" name="url"></b-form-input>
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

                  <b-form-group
                    id="example-password"
                    label-cols-sm="2"
                    label-cols-lg="2"
                    label="Password"
                    label-for="pwd"
                  >
                    <b-form-input id="pwd" type="password" value="hunter2"></b-form-input>
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