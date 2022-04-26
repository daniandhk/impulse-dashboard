const DISPLAY_LOADER = (state, display) => {
	state.displayLoader = display
}

const LOGGED_USER = (state, user) => {
    //let now = new Date()
    //let expiryDate = new Date()
    //user.expiryDate = expiryDate.setTime(now.getTime() + user.expired_at * 1000)

    localStorage.setItem('loggedUser', JSON.stringify(user))
    state.loggedUser = JSON.stringify(user)
}

const ROLE_USER = (state, role) => {
    localStorage.setItem('roleUser', JSON.stringify(role))
    state.roleUser = JSON.stringify(role)
}

const REMOVE_LOGGED_USER = (state) => {
    state.loggedUser = null
    localStorage.removeItem('loggedUser')
    
    state.roleUser = null
    localStorage.removeItem('roleUser')
}

const APP_LANGUAGE = (state, language) => {
    localStorage.setItem('appLanguage', JSON.stringify(language))
    state.appLanguage = JSON.stringify(language)
}

export default {
    DISPLAY_LOADER,
    LOGGED_USER,
    REMOVE_LOGGED_USER,
    ROLE_USER,
    APP_LANGUAGE
}