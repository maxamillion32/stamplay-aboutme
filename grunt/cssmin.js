module.exports = {

	minify: {
		keepSpecialComments: 0,
		expand: true,
		src: ['./dist/css/lib.min.css'],
		dest: './',
		ext: '.min.css'
	},

	minifyLogin: {
		keepSpecialComments: 0,
		expand: false,
		src: [
			'./app/stylesheets/cover.css',
			'./app/stylesheets/home.css'],
		dest: './dist/css/cover.min.css'
	}

};