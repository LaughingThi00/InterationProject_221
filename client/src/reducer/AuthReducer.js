export const authReducer = (state, action) => {


	switch (action.type) {
		case 'SET_AUTH':
			return {
				...state,
				isAuthenticated:action.payload.isAuthenticated,
				account:action.payload.account,
				actor:action.payload.actor,
			}

		default:
			return state
	}
}
