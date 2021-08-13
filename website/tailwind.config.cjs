module.exports = {
	purge: [
		'./src/**/*.svelte',
		'./src/**/*.ts',
		'./index.html',
	],
	darkMode: false,
	theme: {
		extend: {
			colors: {
				primary: {
					100: "#f0f7f7",
					200: "#d8e8e4",
					300: "#002626",
				}
			}
		},  
	},
	plugins: [],
}

