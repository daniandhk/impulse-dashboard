// Import
import axios from 'axios'
import store from './store'
import Vue from 'vue'

// Create
const service = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_URL
})

// Token
if (store.getters.getLoggedUser) {
    service.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters.getLoggedUser.token
}

// Request Interceptor
service.interceptors.request.use(config => {
    store.dispatch('displayLoader', true)

    // Set Token
    if (store.getters.getLoggedUser) {
        config.headers["Authorization"] = 'Bearer ' + store.getters.getLoggedUser.token;
    }

    return config
}, error => {
    store.dispatch('displayLoader', false)

    return Promise.reject(error)
})

// Response Interceptor
service.interceptors.response.use(response => {
    store.dispatch('displayLoader', false)

    return response
}, error => {
    store.dispatch('displayLoader', false)

    var errors = error

    if (error.response) {
        // Session Expired
        if (401 === error.response.status) {
            errors = error.response.data.message
            store.dispatch('logOut')
        }

        // Errors from backend
        if (error.response.status == 422) {
            errors = ''

            for(var errorKey in error.response.data.errors) {
                for(var i = 0; i < error.response.data.errors[errorKey].length; i++) {
                    errors += (String(error.response.data.errors[errorKey][i])) + '<br>'
                }
            }
        }

        // Backend error
        if (500 === error.response.status) {
            errors = error.response.data.message
        }

        // 404
        if (error.response.status == 404) {
            errors = 'Error 404 Not Found'
        }

        if (error.response.status == 406) {
            errors = 'Error 406 Not Acceptable'
        }
    }

    Vue.notify({
        group: 'notify',
        icon: 'error',
        title: 'Error',
        text: String(errors),
    })

    return Promise.reject(error)
})

// Export axios
export default service