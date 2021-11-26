<script>
import Multiselect from "vue-multiselect";

import * as api from '@/api';
import Swal from "sweetalert2";
import { required } from "vuelidate/lib/validators";

import { notificationMethods } from "@/state/helpers";
import moment from 'moment';

/**
 * Advanced-form component
 */
export default {
  page: {
    title: "Detail BAP",
    meta: [{ name: "description" }],
  },
  components: {
    Multiselect,
  },
  validations: {
    recap_course: { required },
  },
  data() {
    return {
      schedule_id: this.$route.params.id,

      bap_data: {
        bap: [{
            materi: "",
            evaluasi: "",
            jenias: "",
        }],
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
        asprak_presence: [],
        student_presence: [],
      },

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
      ],

      coursesData: [],
      recap_course: "",
      course_id: "",
      submitted_recap: false,

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
      await this.getDataCourses();
      this.setTime();

      this.asprak_totalRows = this.bap_data.asprak_presence.length;
      this.asprak_perPage = this.bap_data.asprak_presence.length;

      this.student_totalRows = this.bap_data.student_presence.length;
      this.student_perPage = this.bap_data.student_presence.length;
    },

    async fetchData(){
      return (
        api.showBap(this.schedule_id)
          .then(response => {
            this.isIdValid(response.data);
            if(response.data){
              this.bap_data = response.data;
              if(!this.bap_data.asprak_presence){
                  this.bap_data.asprak_presence = [];
              }
              if(!this.bap_data.student_presence){
                  this.bap_data.student_presence = [];
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
            if(!data.bap.length){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'ID tidak valid!',
                    footer: 'Anda dialihkan ke menu Jadwal',
                    timer: 4000
                })
                this.$router.replace({
                    name: 'laboran-bap'
                });
            }
            else{
                return true;
            }
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
                name: 'laboran-bap'
            });
        }
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

    async getDataCourses(){
        return (
            api.getListCourses()
            .then(response => {
                if(response.data.courses){
                    this.coursesData = response.data.courses;
                    
                    let course_data = this.coursesData.find(data => data.name === this.bap_data.schedule.class_course.courses.name);
                    if(course_data){
                      this.recap_course = course_data;
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
        )
    },

    selectRecapCourse(value){
        this.course_id = value.id;
    },

    removeRecapCourse(){
        this.course_id = "";
    },

    downloadRecap(){
        this.submitted_recap = true;
        this.$v.recap_course.$touch();
        if (this.$v.recap_course.$invalid) {
            return;
        } else {
            this.loading(true);
            return (
                api.downloadRekapNilai(this.course_id)
                .then(response => {
                    let blob = new Blob([response.data])
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = this.recap_course.name + ".xlsx"
                    link.click()

                    this.loading(false);
                    Swal.fire("Berhasil diunduh!", "File telah terunduh.", "success");
                })
                .catch(error => {
                    this.loading(false);
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
        }
    },

    setTime(){
      this.bap_data.schedule.date = this.dateFormatted(this.bap_data.schedule.date);
      this.bap_data.schedule.time_start = this.timeFormatted(this.bap_data.schedule.time_start);
      this.bap_data.schedule.time_end = this.timeFormatted(this.bap_data.schedule.time_end);
    },

    dateFormatted(date){
      if(date){
        return moment(date).locale('id').format('LL');
      }
      else{
        return "-";
      }
    },

    timeFormatted(date){
      if(date){
        return moment(date).locale('id').format('LT');
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
  <div>
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
    <div id="print_page">
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
            label="Jam Terakhir"
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
            <b-form-input 
              v-model="bap_data.bap[0].jenis" 
              for="text" 
              :disabled="true" 
              style="border: none;"
            />
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label-cols-lg="2"
            label="Materi Praktikum"
          >
            <b-form-input 
              v-model="bap_data.bap[0].materi" 
              for="text" 
              :disabled="true" 
              style="border: none;"
            />
          </b-form-group>

          <b-form-group
            label-cols-sm="2"
            label-cols-lg="2"
            label="Evaluasi Praktikum"
          >
            <b-form-input 
              v-model="bap_data.bap[0].evaluasi" 
              for="text" 
              :disabled="true" 
              style="border: none;"
            />
          </b-form-group>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-sm-12 col-md-6 d-inline-flex align-items-center">
              <h4 class="card-title">
                Kehadiran Asisten Praktikum
              </h4>
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
              :items="bap_data.asprak_presence"
              :fields="asprak_fields"
              responsive="sm"
              :per-page="asprak_perPage"
              :current-page="asprak_currentPage"
              :sort-by="asprak_sortBy"
              :sort-desc="asprak_sortDesc"
              :filter="asprak_filter"
              :filter-included-fields="asprak_filterOn"
              @filtered="asprak_onFiltered"
            />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-sm-12 col-md-6 d-inline-flex align-items-center">
              <h4 class="card-title">
                Kehadiran Praktikan
              </h4>
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
              :items="bap_data.student_presence"
              :fields="student_fields"
              responsive="sm"
              :per-page="student_perPage"
              :current-page="student_currentPage"
              :sort-by="student_sortBy"
              :sort-desc="student_sortDesc"
              :filter="student_filter"
              :filter-included-fields="student_filterOn"
              @filtered="student_onFiltered"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="text-center form-group mb-0">
          <h5 class="text-center font-size-15 text-uppercase">
            Unduh Rekap Nilai / Presensi
          </h5>
          <hr
            style="margin-left: -20px; 
                        margin-right: -20px; 
                        height: 2px; 
                        background-color: #eee; 
                        border: 0 none; 
                        color: #eee;"
          >
          <div class="row row-no-gutters justify-content-center text-center mt-3">
            <div class="form-group m-2">
              <multiselect
                v-model="recap_course"
                placeholder="Mata Kuliah"
                :options="coursesData"
                style="min-width: 325px;" 
                label="name"
                track-by="name"
                :show-labels="false"
                :class="{ 'is-invalid': submitted_recap && $v.recap_course.$error }"
                @select="selectRecapCourse"
                @remove="removeRecapCourse" 
              />
              <div
                v-if="submitted_recap && !$v.recap_course.required"
                class="invalid-feedback"
              >
                Mata Kuliah harus dipilih!
              </div>
            </div>
            <div class="m-2">
              <button 
                type="button" 
                class="btn btn-primary waves-effect" 
                @click="downloadRecap"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>