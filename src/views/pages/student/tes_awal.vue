<script>

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

/**
 * Form wizard component
 */
export default {
  page: {
    title: "Tes Awal",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Tes Awal",
      items: [
        {
          text: "Praktikum",
          href: "/praktikan/praktikum"
        },
        {
          text: "Tes Awal",
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
    <div class="card col-sm-11 mt-1" :key="index">
                                    <div class="card-body">
                                            <div class="row">
                                            <div class="col-12">
                                                <label for="text"> 1. Pertanyaan </label>
                                                <div class="form-group">
                                                    <textarea
                                                    rows=2 
                                                    id="text" 
                                                    name="text" 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Masukkan pertanyaan disini"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-sm-1 col-md-1 col-lg-1 mt-1 text-right">
                                                            <input class="form-check-input" type="checkbox" id="defaultCheck1" />
                                                            <!-- <label for="checkbox" style="min-width: 35px;">{{answer.is_answer}}</label> -->
                                        </div>
                                    </div>

                                    <div class="card-body">
                                            <div class="row">
                                            <div class="col-12">
                                                <label for="text">Pertanyaan</label>
                                                <div class="form-group">
                                                    <textarea
                                                    rows=2 
                                                    id="text" 
                                                    name="text" 
                                                    type="text" 
                                                    class="form-control"
                                                    placeholder="Masukkan pertanyaan disini"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
    </div>
  </Layout>
</template>



