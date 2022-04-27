<script>
import Multiselect from "vue-multiselect";
import Layout from "../../../layouts/main";
import PageHeader from "@/components/page-header";
import * as api from '@/api';
import Swal from "sweetalert2";
import moment from 'moment';
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";

/**
 * Advanced-form component
 */
export default {
  page: {
      title: "Input BAP",
      meta: [{ name: "description" }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  validations: {
    dataInput:{
      materi: { required },
      evaluasi: { required },
      jenis: { required },
    },
  },
  data() {
    return {
      title: "Input BAP",
      items: [
        {
          text: "Asisten Praktikum",
          href: "/"
        },
        {
          text: "BAP",
          href: "/asprak/schedule-bap"
        },
        {
          text: "Input",
          active: true,
        }
      ],

      schedule_id: this.$route.params.id,

      bap_data: {
        schedule: {
            name: "",
            time_start: "",
            time_end: "",
            date: "",
            class_course: {
                courses: {
                    code: "",
                    name: "",
                },
                classes: {
                    name: "",
                },
                staffs: {
                    code: "",
                    name: "",
                }
            },
            room: {
                name: "",
            },
            module: {
                index: "",
            },
            academic_year: {
                year: "",
                semester: "",
            }
        },
        asprak: [],
        student: [],
      },

      dataInput:{
        asprak: [],
        student: [],
        materi: "",
        evaluasi: "",
        jenis: ""
      },

      dataJenis: ["online", "offline"],

      submitted: false,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,
      inputError: null,
      isLoading: false,

      asprak_selectedAll: false,
      student_selectedAll: false,

      //list asprak
      asprak_totalRows: 1,
      asprak_currentPage: 1,
      asprak_perPage: 1,
      asprak_filter: "",
      asprak_filterOn: [],
      asprak_sortBy: "nim",
      asprak_sortDesc: false,
      asprak_fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Nama" },
        { key: "action", sortable: false, label: "Hadir", thClass: 'text-center', tdClass: 'text-center', }
      ],

      //list student
      student_totalRows: 1,
      student_currentPage: 1,
      student_perPage: 1,
      student_filter: "",
      student_filterOn: [],
      student_sortBy: "nim",
      student_sortDesc: false,
      student_fields: [
        { key: "nim", sortable: true, label: "NIM" },
        { key: "name", sortable: true, label: "Nama" },
        { key: "action", sortable: false, label: "Hadir", thClass: 'text-center', tdClass: 'text-center', }
      ],

      max: 255,

    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  watch: {
    $route: async function() {
      this.loading(true);
      await this.loadData();
      this.loading(false);
    }
  },
  mounted: async function() {
    this.loading(true);
    await this.loadData();
    this.loading(false);
  },
  methods: {
    ...notificationMethods,

    async loadData(){
      await this.fetchData();
      this.setTime();

      this.asprak_totalRows = this.bap_data.asprak.length;
      this.asprak_perPage = this.bap_data.asprak.length;

      this.student_totalRows = this.bap_data.student.length;
      this.student_perPage = this.bap_data.student.length;
    },

    async fetchData(){
      return (
        api.infoBap(this.schedule_id)
          .then(response => {
            this.isIdValid(response.data);
            if(response.data){
              this.bap_data = response.data;
              if(!this.bap_data.asprak){
                  this.bap_data.asprak = [];
              }
              if(!this.bap_data.student){
                  this.bap_data.student = [];
              }
            }
          })
          .catch(error => {
              if(error.response.status == 401){
                this.$router.replace({
                    name: 'login', params: { tokenExpired: true }
                });
              }
              else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Terjadi kesalahan!',
                    footer: error.response.data.message
                })
              }
          })
      );
    },

    isIdValid(data){
      if(data){
        api.showBap(this.schedule_id)
            .then(response => {
                if(response.data.bap.length){
                    this.$router.replace({
                        name: 'asprak-bap-detail', 
                        params: { id: this.schedule_id }
                    });
                }
                else{
                    return true;
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'ID tidak valid!',
                    footer: 'Anda dialihkan ke menu Jadwal',
                    timer: 4000
                })
                this.$router.replace({
                    name: 'asprak-bap'
                });
            })
      }
      else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'ID tidak valid!',
            footer: 'Anda dialihkan ke menu Jadwal',
            timer: 4000
        })
        this.$router.replace({
          name: 'asprak-bap'
        });
      }
    },

    cancelSubmit(){
      Swal.fire({
          title: "Anda yakin?",
          text: "Form yang telah terisi akan dikosongkan!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a",
          confirmButtonText: "Ya, batalkan!"
      }).then(result => {
          if (result.value) {
              this.loading(true);
              this.submitted = false;
              this.isInputCanceled = true;

              this.dataInput.asprak = [];
              this.dataInput.student = [];
              this.dataInput.materi = "";
              this.dataInput.evaluasi = "";
              this.dataInput.jenis = "";

              this.loadData();
              this.loading(false);
              Swal.fire("Berhasil dibatalkan!", "Form telah dikosongkan.", "success");
          }
      });
    },

    onClickSubmit(){
      this.submitted = true;
      this.$v.$touch();
      if (this.$v.$invalid) {
        return;
      } else {
        this.tryingToInput = true;

        Swal.fire({
            title: "Yakin BAP akan di submit?",
            text: "BAP yang ter-submit tidak dapat diubah!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: "Ya, lanjut submit!"
        }).then(result => {
            if (result.value) {
                this.inputBap(this.schedule_id, this.dataInput);
            }
        });
      }
    },

    inputBap(id, data){
      return (
        api.inputBap(id, data)
          .then(response => {
            this.tryingToInput = false;
            this.isInputError = false;
            this.inputSuccess = true;
            this.submitted = false;
            Swal.fire("Berhasil submit!", "BAP has been submitted.", "success");
            this.$router.replace({
                name: 'asprak-bap-detail', 
                params: { id: this.schedule_id }
            });
          })
          .catch(error => {
            this.submitted = false;
            this.tryingToInput = false;
            this.isInputError = true;
            this.inputError = error;
            
            if(error.response.status == 401){
              this.$router.replace({
                  name: 'login', params: { tokenExpired: true }
              });
            }
            else{
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Terjadi kesalahan!',
                  footer: error.response.data.message
              })
            }
          })
      );
    },

    asprak_onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.asprak_totalRows = filteredItems.length;
      this.asprak_currentPage = 1;
    },

    student_onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.student_totalRows = filteredItems.length;
      this.student_currentPage = 1;
    },

    asprak_onSelectAll() {
        this.dataInput.asprak = [];
        if(this.asprak_selectedAll == false){
            let data = this.dataInput;
            this.bap_data.asprak.forEach(function (element) {
                data.asprak.push(element.id);
            });
            this.dataInput = data;
        }
        this.asprak_selectedAll = !this.asprak_selectedAll;
    },

    student_onSelectAll() {
        this.dataInput.student = [];
        if(this.student_selectedAll == false){
            let data = this.dataInput;
            this.bap_data.student.forEach(function (element) {
                data.student.push(element.id);
            });
            this.dataInput = data;
        }
        this.student_selectedAll = !this.student_selectedAll;
    },

    setTime(){
      this.bap_data.schedule.date = this.dateFormatted(this.bap_data.schedule.date);
      this.bap_data.schedule.time_start = this.timeFormatted(this.bap_data.schedule.time_start);
      this.bap_data.schedule.time_end = this.timeFormatted(this.bap_data.schedule.time_end);
    },

    dateFormatted(date){
      if(date){
        return moment(date).format('LL');
      }
      else{
        return "-";
      }
    },

    timeFormatted(date){
      if(date){
        return moment(date).format('LT');
      }
      else{
        return "-";
      }
    },

    loading(isLoad) {
        var x = document.getElementById("loading");

        if(isLoad){
            this.isLoading = true;
            x.style.display = "block";
        } else{
            this.isLoading = false;
            x.style.display = "none";
        }
    },

  },
};

</script>

<template>
  <Layout>
    <PageHeader
      :title="title"
      :items="items"
    />
    <div
      id="loading"
      style="display:none; z-index:100; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
    >
      <b-spinner
        style="width: 3rem; height: 3rem;"
        class="m-2"
        variant="warning"
        role="status"
      />
    </div>
    <div>
      <div class="card">
        <div class="card-body">
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
              Deskripsi input BAP :
            </p>
            <p
              class="card-title-desc"
              style="font-size: 14px; margin: 0 !important;"
            >
              - BAP yang berhasil disimpan tidak akan bisa diubah,<br>
              - Pastikan setiap data yang diisi telah sesuai dan benar!
            </p>
          </div>
        </div>
      </div>
      <form
        class="form-horizontal mt-2"
        @submit.prevent="onClickSubmit"
      >
        <div class="card">
          <div class="card-body">
            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Kelas"
            >
              <b-form-input 
                v-model="bap_data.schedule.class_course.classes.name" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Mata Kuliah"
            >
              <b-form-input 
                v-model="bap_data.schedule.class_course.courses.name" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Dosen"
            >
              <b-form-input 
                v-model="bap_data.schedule.class_course.staffs.name" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Modul"
            >
              <b-form-input 
                v-model="bap_data.schedule.module.index" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Tanggal"
            >
              <b-form-input 
                v-model="bap_data.schedule.date" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Jam Mulai"
            >
              <b-form-input 
                v-model="bap_data.schedule.time_start" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Jam Berakhir"
            >
              <b-form-input 
                v-model="bap_data.schedule.time_end" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Ruangan"
            >
              <b-form-input 
                v-model="bap_data.schedule.room.name" 
                for="text" 
                :disabled="true" 
                style="border: none;"
              />
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Jenis Interaksi"
            >
              <multiselect
                v-model="dataInput.jenis"
                :options="dataJenis"
                select-label=""
                selected-label="x"
                deselect-label="x"
                :class="{ 'is-invalid': submitted && $v.dataInput.jenis.$error }" 
              />
              <div
                v-if="submitted && !$v.dataInput.jenis.required"
                class="invalid-feedback"
              >
                Jenis Interaksi harus diisi!
              </div>
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Materi Praktikum"
            >
              <div class="input-group">
                <input
                  v-model="dataInput.materi"
                  type="text"
                  class="form-control"
                  :maxlength="max"
                  :class="{ 'is-invalid': submitted && $v.dataInput.materi.$error }"
                >
                <div class="input-group-append">
                  <span
                    id="basic-addon2"
                    class="input-group-text"
                  >{{ max - dataInput.materi.length }}</span>
                </div>
              </div>
              <div
                v-if="submitted && !$v.dataInput.materi.required"
                class="invalid-feedback"
              >
                Materi Praktikum harus diisi!
              </div>
            </b-form-group>

            <b-form-group
              label-cols-sm="2"
              label-cols-lg="2"
              label="Evaluasi Praktikum"
            >
              <div class="input-group">
                <input
                  v-model="dataInput.evaluasi"
                  type="text"
                  class="form-control"
                  :maxlength="max"
                  :class="{ 'is-invalid': submitted && $v.dataInput.evaluasi.$error }"
                >
                <div class="input-group-append">
                  <span
                    id="basic-addon2"
                    class="input-group-text"
                  >{{ max - dataInput.evaluasi.length }}</span>
                </div>
              </div>
              <div
                v-if="submitted && !$v.dataInput.evaluasi.required"
                class="invalid-feedback"
              >
                Evaluasi Praktikum harus diisi!
              </div>
            </b-form-group>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title">
              Kehadiran Asisten Praktikum
            </h4>
            <hr
              style="margin-left: -28px; 
                                margin-right: -28px; 
                                height: 2px; 
                                background-color: #eee; 
                                border: 0 none; 
                                color: #eee;"
            >
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <b-button
                  v-if="!asprak_selectedAll"
                  variant="success"
                  style="min-width: 120px;"
                  size="sm" 
                  @click="asprak_onSelectAll()"
                >
                  Select All
                </b-button>
                <b-button
                  v-if="asprak_selectedAll"
                  variant="danger"
                  style="min-width: 120px;"
                  size="sm" 
                  @click="asprak_onSelectAll()"
                >
                  Deselect All
                </b-button>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div
                  id="tickets-table_filter"
                  class="dataTables_filter text-md-right"
                >
                  <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input
                      v-model="asprak_filter"
                      type="search"
                      class="form-control form-control-sm ml-2"
                    />
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <div class="table-responsive">
              <b-table
                ref="table"
                class="table-centered"
                :items="bap_data.asprak"
                :fields="asprak_fields"
                responsive="sm"
                :per-page="asprak_perPage"
                :current-page="asprak_currentPage"
                :sort-by="asprak_sortBy"
                :sort-desc="asprak_sortDesc"
                :filter="asprak_filter"
                :filter-included-fields="asprak_filterOn"
                :head-variant="'dark'"
                @filtered="asprak_onFiltered"
              >
                <template v-slot:cell(action)="data">
                  <input 
                    v-model="dataInput.asprak"
                    type="checkbox"
                    :value="data.item.id"
                  >
                </template>
              </b-table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h4 class="card-title">
              Kehadiran Praktikan
            </h4>
            <hr
              style="margin-left: -28px; 
                                margin-right: -28px; 
                                height: 2px; 
                                background-color: #eee; 
                                border: 0 none; 
                                color: #eee;"
            >
            <div class="row mt-4">
              <div class="col-sm-12 col-md-6">
                <b-button
                  v-if="!student_selectedAll"
                  variant="success"
                  style="min-width: 120px;"
                  size="sm" 
                  @click="student_onSelectAll()"
                >
                  Select All
                </b-button>
                <b-button
                  v-if="student_selectedAll"
                  variant="danger"
                  style="min-width: 120px;"
                  size="sm" 
                  @click="student_onSelectAll()"
                >
                  Deselect All
                </b-button>
              </div>
              <!-- Search -->
              <div class="col-sm-12 col-md-6">
                <div
                  id="tickets-table_filter"
                  class="dataTables_filter text-md-right"
                >
                  <label class="d-inline-flex align-items-center">
                    Search:
                    <b-form-input
                      v-model="student_filter"
                      type="search"
                      class="form-control form-control-sm ml-2"
                    />
                  </label>
                </div>
              </div>
              <!-- End search -->
            </div>
            <div class="table-responsive">
              <b-table
                ref="table"
                class="table-centered"
                :items="bap_data.student"
                :fields="student_fields"
                responsive="sm"
                :per-page="student_perPage"
                :current-page="student_currentPage"
                :sort-by="student_sortBy"
                :sort-desc="student_sortDesc"
                :filter="student_filter"
                :filter-included-fields="student_filterOn"
                :head-variant="'dark'"
                @filtered="student_onFiltered"
              >
                <template v-slot:cell(action)="data">
                  <input 
                    v-model="dataInput.student"
                    type="checkbox"
                    :value="data.item.id"
                  >
                </template>
              </b-table>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body text-center">
            <button
              type="submit"
              class="btn btn-primary mr-2 waves-effect waves-light"
            >
              Simpan
            </button>
            <button
              type="button"
              class="btn btn-light waves-effect"
              @click="cancelSubmit"
            >
              Batalkan
            </button>
          </div>
        </div>
      </form>
    </div>
  </Layout>
</template>