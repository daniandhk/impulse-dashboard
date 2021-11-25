<script>
import { notificationMethods } from "@/state/helpers";
import Swal from "sweetalert2";
import vue2Dropzone from "vue2-dropzone";
import store from '@/store';

/**
 * Orders Component
 */
export default {
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      //dropzone
      seen: false,
      dropzoneOptions: {
        url: process.env.VUE_APP_BACKEND_URL + "/staff/import",
        thumbnailWidth: 150,
        maxFilesize: 5,
        
        headers:{"Authorization":'Bearer ' + store.getters.getLoggedUser.token},
        acceptedFiles: "text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        maxFiles: 1,
        init: function() {
          this.on('addedfile', function(file) {
            if (this.files.length > 1) {
              this.removeFile(this.files[0]);
            }
          });
          this.on('error', function(file, response){
            Swal.fire({
                icon: 'error',
                title: 'Gagal mengunggah file!',
                text: 'Cek kembali kesesuaian file dengan deskripsi.',
            })
          });
          this.on('success', function(file, response){
            Swal.fire({
                icon: 'success',
                title: 'Berhasil diunggah!',
                text: 'File telah terunggah.',
            })
          })
        }
      }
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    //
  },
  mounted() {
      //
  },
  methods: {
    ...notificationMethods,
    //
  }
};
</script>

<template>
  <div
    div
    class="row mt-4"
  >
    <div class="col-sm-12 col-md-12">
      <!-- <div title="Import Excel"> -->
      <div>
        <div
          id="metadata"
          class="tab-pane"
        >
          <p style="color: red; font-size: 12px; margin: 0 !important;">
            PENTING – HARAP DIBACA DENGAN TELITI
          </p>
          <p
            class="mt-2"
            style="color: black; font-size: 14px; margin-bottom: 0 !important;"
          >
            Deskripsi upload file Excel :
          </p>
          <p
            class="card-title-desc"
            style="font-size: 14px; margin: 0 !important;"
          >
            - Pastikan file bertipe <b>.CSV</b> atau <b>.XSLX</b>,<br>
            - Pastikan hanya ada <b>satu sheet</b>,<br>
            - Pastikan Header / Row ke 1 dan urutan data di dalam file sama seperti berikut ini:<br>
          </p>
          <img
            src="@/assets/images/staff-excel-example.png"
            style="box-sizing: border-box; width: 25%; margin: auto;"
          >
          <div class="mb-4 mt-2">
            <p
              class="card-title-desc"
              style="font-size: 14px; margin: 0 !important;"
            >
              Contoh file Excel: <a
                href="/files/staffdummy.xlsx"
                download
              >staffdummy.xlsx</a><br>
            </p>
          </div>
          <!-- file upload -->
          <vue-dropzone
            id="dropzone"
            ref="myVueDropzone"
            :use-custom-slot="true"
            :options="dropzoneOptions"
          >
            <div class="dropzone-custom-content">
              <i class="display-4 text-muted bx bxs-cloud-upload" />
              <h4>Drop a file here or click to upload.</h4>
            </div>
          </vue-dropzone>
        </div>
      </div>
    </div>
  </div>
</template>