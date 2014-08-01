module.exports = {

	minify: {
		keepSpecialComments: 0,
		expand: true,
		src: ['./dist/assets/stamplay-aboutme.min.css'],
		dest: './',
		ext: '.min.css'
	},

	minifyLogin: {
		keepSpecialComments: 0,
		expand: false,
		src: ['./app/stylesheets/cover.css'],
		dest: './dist/assets/cover.min.css'
	}

};