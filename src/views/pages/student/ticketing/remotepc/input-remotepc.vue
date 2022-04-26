<script>
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import Swal from "sweetalert2";
import store from '@/store';
import Multiselect from "vue-multiselect";
import i18n from '@/i18n';

/**
 * Orders Component
 */
export default {
  components: {
    Multiselect,
  },
  validations: {
    dataInput: {
      name: { required },
      nim: { required },
      course: { required },
      class: { required },
      day: { required },
      session: { required },
      username: { required },
      password: { required },
      file: { required }
    },
  },
  data() {
    return {
      //input course
      title: i18n.t('student.ticketing.remotepc.text'),
      dataInput: {
        name: store.getters.getLoggedUser.name,
        nim: store.getters.getLoggedUser.nim,
        course: "",
        class: "",
        day: "",
        session: "",
        username: "",
        password: "",
        file: null
      },
      submitted: false,
      inputError: null,
      tryingToInput: false,
      isInputError: false,
      inputSuccess: false,
      isInputCanceled: false,

      dataSession: ["06:30 - 09:30", "07:30 - 10:30", "08:30 - 11:30", "09:30 - 12:30", "10:30 - 13:30", 
                    "11:30 - 14:30", "12:30 - 15:30", "13:30 - 16:30", "14:30 - 17:30", "15:30 - 18:30", 
                    "16:30 - 19:30", "17:30 - 20:30", "18:30 - 21:30"
      ],

      //
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  mounted() {
      //
  },
  methods: {
    ...notificationMethods,
    
    inputRemotepc() {
        this.submitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
        return;
      } else {
          this.tryingToInput = true;
          this.inputError = null;
          let formData = this.getFormData(this.dataInput)
          // return (
          //     api.inputRemotepc(formData)
          //       .then(response => {
          //           this.tryingToInput = false;
          //           this.isInputError = false;
          //           this.inputSuccess = true;
                
          //           if (this.inputSuccess) {
          //               this.clearForm();
          //               this.submitted = false;
          //               Swal.fire("Berhasil submit!", "Form telah berhasil di submit.", "success");
          //           }
          //       })
          //       .catch(error => {
          //           //pop up
          //           this.submitted = false;
          //           this.tryingToInput = false;
          //           this.inputError = error;
          //           this.isInputError = true;

          //           if(error.response.status == 401){
          //             this.$router.replace({
          //                 name: 'login', params: { tokenExpired: true }
          //             });
          //           }
          //           else{
          //             Swal.fire({
          //                 icon: 'error',
          //                 title: 'Oops...',
          //                 text: 'Terjadi kesalahan!',
          //                 footer: error.response.data.message
          //             })
          //           }
          //       })
          // );
      }
    },

    getFormData(data){
        const formData = new FormData()
        formData.append('file', data.file, data.file.name)
        formData.append('name', data.name)
        formData.append('nim', data.nim)
        formData.append('course', data.course)
        formData.append('class', data.class)
        formData.append('day', data.day)
        formData.append('session', data.session)
        formData.append('username', data.username)
        formData.append('password', data.password)

        return formData
    },

    onFileUpload (event) {
        this.dataInput.file = event.target.files[0]
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
                this.clearForm();
                this.submitted = false;
                this.isInputCanceled = true;
                Swal.fire("Berhasil dibatalkan!", "Form telah dikosongkan.", "success");
            }
        });
    },

    clearForm(){
        this.dataInput.name = "";
        this.dataInput.nim = "";
        this.dataInput.course = "";
        this.dataInput.class = "";
        this.dataInput.day = "";
        this.dataInput.session = "";
        this.dataInput.username = "";
        this.dataInput.password = "";
        this.dataInput.file = null;
    },
  }
};
</script>

<template>
  <div
    div
    class="row mt-4"
  >
    <form
      class="form-horizontal col-sm-12 col-md-12"
      @submit.prevent="inputRemotepc"
    >
      <div>
        <div
          id="metadata"
          class="tab-pane"
        >
          <h4 class="card-title">
            {{ $t('student.ticketing.remotepc.text') }}
          </h4>
          <p class="card-title-desc">
            {{ $t('student.ticketing.remotepc.desc') }}<br>
            Line : <a href="http://line.me/ti/p/~@FIFLAB">@FIFLAB</a><br>
            Instagram : <a href="https://www.instagram.com/informaticslab_telu/">informaticslab_telu</a><br>
            Website : <a href="https://informatics.labs.telkomuniversity.ac.id/">https://informatics.labs.telkomuniversity.ac.id/</a><br>
          </p>
                    
          <div>
            <b-alert
              v-model="inputSuccess"
              class="mt-3"
              variant="success"
              dismissible
            >
              Input data telah berhasil!
            </b-alert>

            <b-alert
              v-model="isInputError"
              class="mt-3"
              variant="danger"
              dismissible
            >
              {{ inputError }}
            </b-alert>

            <b-alert
              v-model="isInputCanceled"
              class="mt-3"
              variant="success"
              dismissible
            >
              Berhasil dibatalkan!
            </b-alert>

            <b-alert
              v-if="notification.message"
              variant="danger"
              class="mt-3"
              show
              dismissible
            >
              {{ notification.message }}
            </b-alert>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="nama">{{ $t('student.ticketing.remotepc.name.text') }}</label>
                <input
                  id="nama"
                  v-model="dataInput.name"
                  name="nama"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataInput.name.$error }"
                >
                <div
                  v-if="submitted && !$v.dataInput.name.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.name.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="nim">{{ $t('student.ticketing.remotepc.nim.text') }}</label>
                <input
                  id="nim"
                  v-model="dataInput.nim"
                  name="nim"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': submitted && $v.dataInput.nim.$error }"
                >
                <div
                  v-if="submitted && !$v.dataInput.nim.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.nim.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label
                  style="margin-bottom:0!important;"
                  for="class"
                >{{ $t('student.ticketing.remotepc.course.text') }}</label>
                <br>
                <span class="text-muted font-size-13">{{ $t('student.ticketing.remotepc.course.desc') }}</span>
                <input
                  id="course"
                  v-model="dataInput.course"
                  name="course"
                  type="text"
                  class="form-control mt-2"
                  :class="{ 'is-invalid': submitted && $v.dataInput.course.$error }"
                >
                <div
                  v-if="submitted && !$v.dataInput.course.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.course.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label
                  style="margin-bottom:0!important;"
                  for="class"
                >{{ $t('student.ticketing.remotepc.class.text') }}</label>
                <br>
                <span class="text-muted font-size-13">{{ $t('student.ticketing.remotepc.class.desc') }}</span>
                <input
                  id="class"
                  v-model="dataInput.class"
                  name="class"
                  type="text"
                  class="form-control mt-2"
                  :class="{ 'is-invalid': submitted && $v.dataInput.class.$error }"
                >
                <div
                  v-if="submitted && !$v.dataInput.class.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.class.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="day">{{ $t('student.ticketing.remotepc.schedule-day.text') }}</label>
                <multiselect
                  v-model="dataInput.day"
                  :options="$t('student.ticketing.remotepc.data-day')"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.dataInput.day.$error }" 
                />
                <div
                  v-if="submitted && !$v.dataInput.day.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.schedule-day.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label for="semester">{{ $t('student.ticketing.remotepc.schedule-session.text') }}</label>
                <multiselect
                  v-model="dataInput.session"
                  :options="dataSession"
                  select-label=""
                  selected-label="x"
                  deselect-label="x"
                  :class="{ 'is-invalid': submitted && $v.dataInput.session.$error }" 
                />
                <div
                  v-if="submitted && !$v.dataInput.session.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.schedule-session.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label
                  style="margin-bottom:0!important;"
                  for="class"
                >{{ $t('student.ticketing.remotepc.username.text') }}</label>
                <br>
                <span class="text-muted font-size-13">{{ $t('student.ticketing.remotepc.username.desc') }}</span>
                <input
                  id="username"
                  v-model="dataInput.username"
                  name="username"
                  type="text"
                  class="form-control mt-2"
                  :class="{ 'is-invalid': submitted && $v.dataInput.username.$error }"
                >
                <div
                  v-if="submitted && !$v.dataInput.username.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.username.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group">
                <label
                  style="margin-bottom:0!important;"
                  for="class"
                >{{ $t('student.ticketing.remotepc.password.text') }}</label>
                <br>
                <span class="text-muted font-size-13">{{ $t('student.ticketing.remotepc.password.desc') }}</span>
                <input
                  id="password"
                  v-model="dataInput.password"
                  name="password"
                  type="text"
                  class="form-control mt-2"
                  :class="{ 'is-invalid': submitted && $v.dataInput.password.$error }"
                >
                <div
                  v-if="submitted && !$v.dataInput.password.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.password.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label
                  style="margin-bottom:0!important;"
                  for="class"
                >{{ $t('student.ticketing.remotepc.problem.text') }}</label>
                <br>
                <span class="text-muted font-size-13">{{ $t('student.ticketing.remotepc.problem.desc') }}</span>
                <br>
                <input
                  id="file"
                  name="file"
                  type="file"
                  class="mt-3"
                  accept=".pdf, application/pdf"
                  :class="{ 'is-invalid': submitted && $v.dataInput.file.$error }"
                  @change="onFileUpload"
                >
                <div
                  v-if="submitted && !$v.dataInput.file.required"
                  class="invalid-feedback"
                >
                  {{ $t('student.ticketing.remotepc.problem.text') }} {{ $t('component.form.blank-notification') }}
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-4">
            <button
              type="submit"
              class="btn btn-primary mr-2 waves-effect waves-light"
            >
              {{ $t('component.button.submit') }}
            </button>
            <button
              type="button"
              class="btn btn-light waves-effect"
              @click="cancelSubmit"
            >
              {{ $t('component.button.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>