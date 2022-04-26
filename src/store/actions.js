const displayLoader = (context, display) => {
	context.commit('DISPLAY_LOADER', display)
}

const loggedUser = (context, user) => {
	context.commit('LOGGED_USER', user)
}

const logOut = context => {
	context.commit('REMOVE_LOGGED_USER')
}

const roleUser = (context, role) => {
	context.commit('ROLE_USER', role)
}

const appLanguage = (context, language) => {
	context.commit('APP_LANGUAGE', language)
}

export default {
	displayLoader,
	loggedUser,
	logOut,
	roleUser,
	appLanguage
}