<script>
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: "",
      submitted: false,
      error: null,
      tryingToReset: false,
      isResetError: false,
    };
  },
  validations: {
    email: { required, email }
  },
  created() {
    document.body.classList.add("auth-body-bg");
  },
  methods: {
    // Try to register the user in with the email, fullname
    // and password they provided.
    tryToReset() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        this.tryingToReset = true;
        // Reset the authError if it existed.
        this.error = null;
        return (
          this.resetPassword({
            email: this.email
          })
            // eslint-disable-next-line no-unused-vars
            .then(token => {
              this.tryingToReset = false;
              this.isResetError = false;
            })
            .catch(error => {
              this.tryingToReset = false;
              this.error = error ? error : "";
              this.isResetError = true;
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
        <i class="mdi mdi-home-variant h2 text-white" />
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
                          Reset Password
                        </h4>
                        <p class="text-muted">
                          Reset your password to Impulse.
                        </p>
                      </div>

                      <div class="p-2 mt-5">
                        <b-alert
                          v-model="isResetError"
                          class="mb-4"
                          variant="danger"
                          dismissible
                        >
                          {{ error }}
                        </b-alert>

                        <form
                          class="form-horizontal"
                          @submit.prevent="tryToReset"
                        >
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-mail-line auti-custom-input-icon" />
                            <label for="useremail">Email SSO</label>
                            <input
                              id="useremail"
                              v-model="email"
                              type="email"
                              class="form-control"
                              placeholder="Enter email SSO"
                              :class="{ 'is-invalid': submitted && $v.email.$error }"
                            >
                            <div
                              v-if="submitted && $v.email.$error"
                              class="invalid-feedback"
                            >
                              <span v-if="!$v.email.required">Email SSO harus diisi!</span>
                              <span v-if="!$v.email.email">Please enter valid email.</span>
                            </div>
                          </div>

                          <div class="mt-4 text-center">
                            <button
                              class="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >
                              Reset
                            </button>
                          </div>
                        </form>
                      </div>

                      <div class="mt-5 text-center">
                        <p>
                          Don't have an account ?
                          <router-link
                            to="/register"
                            class="font-weight-medium text-primary"
                          >
                            Register
                          </router-link>
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
            <div class="item authentication-bg">
              <div class="bg-overlay" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>