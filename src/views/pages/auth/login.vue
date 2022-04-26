<script>
import { required } from "vuelidate/lib/validators";
import { notificationMethods } from "@/state/helpers";
import * as api from '@/api';
import $ from 'jquery';
import store from '@/store';

export default {
  data() {
    return {
      loginData: {
				username: "",
        password: "",
        user_agent: "",
			},
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
      loginSuccess: false,
      tokenExpired: this.$route.params.tokenExpired
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  mounted: function() {
    var rand = Math.floor(Math.random()*4);
    var visibleDiv = $('.background')[rand];
    $(visibleDiv).show();
  },
  validations: {
    loginData: {
      username: { required },
      password: { required },
      user_agent: { required },
    }
  },
  methods: {
    ...notificationMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      loading();
      this.loginData.user_agent = navigator.userAgent;
      this.submitted = true;
      this.tokenExpired = false;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        loading();
        return;
      } else {
        this.tryingToLogIn = true;
        // Reset the authError if it existed.
        this.authError = null;
        return (
          api.login(this.loginData)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              this.tryingToLogIn = false;
              this.isAuthError = false;
              this.loginSuccess = true;

              this.$store.commit('LOGGED_USER', response.data.data);
              loading();
              // Redirect to the originally requested page, or to the home page
              this.$router.push(
                this.$route.query.redirectFrom || { name: "home" }
              );
            })
            .catch(error => {
              loading();
              this.tryingToLogIn = false;
              this.authError = error.response ? error.response.data.message : error;
              this.isAuthError = true;
            })
        );
      }
    },
  }
};
function loading() {
  var x = document.getElementById("loading");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <a href="https://informatics.labs.telkomuniversity.ac.id/">
        <i class="mdi mdi-home-variant h2 text-white" />
      </a>
    </div>
    <div>
      <div class="container-fluid p-0">
        <div class="row no-gutters">
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
          <div class="col-lg-4">
            <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100">
              <div class="w-100">
                <div class="row justify-content-center">
                  <div class="col-lg-9">
                    <div>
                      <div class="text-center">
                        <div>
                          <a
                            href="/"
                            class="logo"
                          >
                            <img
                              src="@/assets/logo-lab.png"
                              height="80"
                              alt="logo"
                            >
                          </a>
                        </div>

                        <h4 class="font-size-18 mt-4">
                          Selamat Datang !
                        </h4>
                        <p class="text-muted">
                          Login untuk masuk ke Impulse.
                        </p>
                      </div>

                      <div class="p-2 mt-5">
                        <b-alert
                          v-model="tokenExpired"
                          class="mt-3"
                          variant="danger"
                          dismissible
                        >
                          Sesi login anda telah berakhir.
                        </b-alert>

                        <b-alert
                          v-model="isAuthError"
                          class="mt-3"
                          variant="danger"
                          dismissible
                        >
                          {{ authError }}
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

                        <form
                          class="form-horizontal"
                          @submit.prevent="tryToLogIn"
                        >
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-user-3-line auti-custom-input-icon" />
                            <label for="username">NIM/NIP</label>
                            <input
                              id="username"
                              v-model="loginData.username"
                              type="text"
                              class="form-control"
                              placeholder="Masukkan NIM/NIP"
                              :class="{ 'is-invalid': submitted && $v.loginData.username.$error }"
                            >
                            <div 
                              v-if="submitted && !$v.loginData.username.required" 
                              class="invalid-feedback"
                            >
                              NIM/NIP harus diisi!
                            </div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-lock-2-line auti-custom-input-icon" />
                            <label for="userpassword">Password</label>
                            <input
                              id="userpassword"
                              v-model="loginData.password"
                              type="password"
                              class="form-control"
                              placeholder="Masukkan password"
                              :class="{ 'is-invalid': submitted && $v.loginData.password.$error }"
                            >
                            <div
                              v-if="submitted && !$v.loginData.password.required"
                              class="invalid-feedback"
                            >
                              Password harus diisi!
                            </div>
                          </div>

                          <div class="mt-4 text-center">
                            <button
                              class="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >
                              Log In
                            </button>
                          </div>
                        </form>
                      </div>

                      <div class="mt-5 text-center">
                        <a
                          href="/about-us"
                          style="text-decoration: none; color: inherit;"
                        >
                          <p>
                            © 2021 Informatics Lab.
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div
              style="display:none;"
              class="background item authentication-bg"
            >
              <div class="bg-overlay" />
            </div>
            <div
              style="display:none;"
              class="background item authentication-bg-1"
            >
              <div class="bg-overlay" />
            </div>
            <div
              style="display:none;"
              class="background item authentication-bg-2"
            >
              <div class="bg-overlay" />
            </div>
            <div
              style="display:none;"
              class="background item authentication-bg-3"
            >
              <div class="bg-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>