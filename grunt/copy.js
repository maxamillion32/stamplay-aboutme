module.exports = {

	img: {
		expand: true,
		flatten: true,
		src: ['./app/images/**'],
		dest: './dist/assets',
		filter: 'isFile'
	},

	baseLibs: {
		flatten: true,
		expand: true,
		src: [
			'./app/bower_components/jquery/jquery.min.js',
			'./app/bower_components/requirejs/require.js'
		],
		dest: './dist/assets',
		filter: 'isFile'
	},


	baseCss: {
		flatten: true,
		expand: true,
		src: [
			'./app/bower_components/bootstrap/dist/css/bootstrap.min.css',
		],
		dest: './dist/assets',
		filter: 'isFile'
	},

	baseFonts: {
		flatten: true,
		expand: true,
		src: [
			'./app/fonts/profile/**',
			'./app/bower_components/bootstrap/fonts/**'
		],
		dest: './dist/assets',
		filter: 'isFile'
	}

};