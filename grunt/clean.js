module.exports = {

	cssmin: {
		src: ['dist/assets/*.min.css']
	},

	baseLibs: {
		src: ['dist/assets/jquery.min.js', 'dist/assets/require.js']
	},

	lib: {
		src: ['dist/assets/libs.min.js']
	},

	app: {
		src: ['dist/assets/app.min.js']
	},

	img: {
		src: ['dist/assets/**.png', 'dist/assets/**.jpg', 'dist/assets/**.gif']
	}

};