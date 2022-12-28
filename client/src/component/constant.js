export const apiUrl =
	process.env.NODE_ENV !== 'production'
		? 'http://localhost:5000/api'
		: 'https://interation-project-221.vercel.app'

export const clientUrl = process.env.NODE_ENV !== 'production'
		? 'http://localhost:3000'
		: 'someClientUrl'
