export const apiUrl =
	process.env.NODE_ENV !== 'production'
		? 'http://localhost:5000/api'
		: 'https://server-render-2.onrender.com'

export const clientUrl = process.env.NODE_ENV !== 'production'
		? 'http://localhost:3000'
		: 'someClientUrl'
