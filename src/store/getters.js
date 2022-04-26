const getDisplayLoader = (state) => {
	return state.displayLoader
}

const getLoggedUser = (state) => {
    let user = state.loggedUser
    if(user) {
        user = JSON.parse(user)
    }
	return user
}

const getRoleUser = (state) => {
    let role = state.roleUser
    if(role) {
        role = JSON.parse(role)
    }
	return role
}

const getAppLanguage = (state) => {
    let appLanguage = state.appLanguage
    if(appLanguage) {
        appLanguage = JSON.parse(appLanguage)
    }
	return appLanguage
}

export default {
    getDisplayLoader,
    getLoggedUser,
    getRoleUser,
    getAppLanguage
}