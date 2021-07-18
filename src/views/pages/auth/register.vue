<script>
import { required, email } from "vuelidate/lib/validators";
//import httpAxios from '@/httpAxios.js';
import { notificationMethods } from "@/state/helpers";
import { api } from '@/api';

export default {
  data() {
    return {
      user: { name: "", email: "", password: "" },
      submitted: false,
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      registerSuccess: false,
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    }
  },
  validations: {
    user: {
      name: { required },
      email: { required, email },
      password: { required }
    }
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  methods: {
    ...notificationMethods,
    // Try to register the user in with the email, username
    // and password they provided.
    tryToRegisterIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        this.tryingToRegister = true;
        // Reset the regError if it existed.
        this.regError = null;
        return (
          api.register(this.user)
            // eslint-disable-next-line no-unused-vars
            .then(response => {
              this.tryingToRegister = false;
              this.isRegisterError = false;
              this.registerSuccess = true;
              
              if (this.registerSuccess) {
                  this.$router.push(this.$route.query.redirectFrom || { name: "login", params: { registerSuccess: true } });
              }
            })
            .catch(error => {
              console.log(error.response)
              this.tryingToRegister = false;
              this.regError = error.response.data.data.message;
              this.isRegisterError = true;
            })
        );
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <a href="/">
        <i class="mdi mdi-home-variant h2 text-white"></i>
      </a>
    </div>
    <div>
      <div class="container-fluid p-0">
        <div class="row no-gutters">
          <div class="col-lg-4">
            <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100">
              <div class="w-100">
                <div class="row justify-content-center">
                  <div class="col-lg-9">
                    <div>
                      <div class="text-center">
                        <div>
                          <a href="/" class="logo">
                            <img src="@/assets/logo-lab.png" height="80" alt="logo" />
                          </a>
                        </div>

                        <h4 class="font-size-18 mt-4">Register account</h4>
                        <p class="text-muted">Create your new Impulse account now.</p>
                      </div>

                      <div class="p-2 mt-5">
                        <b-alert
                          v-model="registerSuccess"
                          class="mt-3"
                          variant="success"
                          dismissible
                        >Register completed successfully!</b-alert>

                        <b-alert
                          v-model="isRegisterError"
                          class="mt-3"
                          variant="danger"
                          dismissible
                        >{{regError}}</b-alert>

                        <b-alert
                          variant="danger"
                          class="mt-3"
                          v-if="notification.message"
                          show
                          dismissible
                        >{{notification.message}}</b-alert>
                        
                        <form class="form-horizontal" @submit.prevent="tryToRegisterIn">
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-user-3-line auti-custom-input-icon"></i>
                            <label for="username">NIM/NIP</label>
                            <input
                              v-model="user.name"
                              type="text"
                              class="form-control"
                              id="username"
                              :class="{ 'is-invalid': submitted && $v.user.name.$error }"
                              placeholder="Enter NIM/NIP"
                            />
                            <div
                              v-if="submitted && !$v.user.name.required"
                              class="invalid-feedback"
                            > NIM/NIP is required.</div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-mail-line auti-custom-input-icon"></i>
                            <label for="useremail">Email SSO</label>
                            <input
                              v-model="user.email"
                              type="email"
                              class="form-control"
                              id="useremail"
                              placeholder="Enter email SSO"
                              :class="{ 'is-invalid': submitted && $v.user.email.$error }"
                            />
                            <div v-if="submitted && $v.user.email.$error" class="invalid-feedback">
                              <span v-if="!$v.user.email.required">Email SSO is required.</span>
                              <span v-if="!$v.user.email.email">Please enter valid email.</span>
                            </div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-lock-2-line auti-custom-input-icon"></i>
                            <label for="userpassword">Password</label>
                            <input
                              v-model="user.password"
                              type="password"
                              class="form-control"
                              id="userpassword"
                              placeholder="Enter password"
                              :class="{ 'is-invalid': submitted && $v.user.password.$error }"
                            />
                            <div
                              v-if="submitted && !$v.user.password.required"
                              class="invalid-feedback"
                            >Password is required.</div>
                          </div>

                          <div class="text-center">
                            <button
                              class="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >Register</button>
                          </div>
                        </form>
                      </div>

                      <div class="mt-5 text-center">
                        <p>
                          Already have an account ?
                          <router-link
                            to="/login"
                            class="font-weight-medium text-primary"
                          >Login</router-link>
                        </p>
                        <p>
                          © 2021 Informatics Lab.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="item authentication-bg"><div class="bg-overlay"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>