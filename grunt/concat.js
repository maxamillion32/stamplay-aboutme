module.exports = {

	options: {
		separator: "\n/* ---- HALLO HALLO ---- */\n",
		stripBanners: {
			block: true
		},
		banner: "/*! Stamplay v<%= pkg.version %> | " + "(c) 2014 The Stamplay Dreamteam */ \n"
	},

	css: {
		src: [
			'./app/stylesheets/stamplay-colorpicker.css',
			'./app/stylesheets/profile.css',
			'./app/stylesheets/profile/main.css',
			'./app/stylesheets/profile/owl.carousel.css',
			'./app/stylesheets/profile/owl.theme.css',
			'./dist/assets/fontello-prod.css',
			'./app/stylesheets/profile/jquery.fancybox8cbb.css?v=2.1.5',
			'./app/stylesheets/profile/jquery.fs.wallpaper.css',
			'./app/stylesheets/profile/animate.css'
    ],
		dest: './dist/assets/stamplay-aboutme.min.css',
	},

	lib: {
		src: [
			'./app/bower_components/jquery/jquery.js',
		  './app/bower_components/bootstrap/dist/js/bootstrap.min.js',
		  './app/bower_components/bootstrap-filestyle/src/bootstrap-filestyle.js',
		  './app/bower_components/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
			'./app/scripts/profile/owl.carousel.js',
			'./app/scripts/profile/jquery.fitvids.js',
			'./app/scripts/profile/jquery.fancybox.pack8cbb.js',
			'./app/scripts/profile/retina.js',
			'./app/scripts/profile/jquery.scrollToTop.min.js',
			'./app/scripts/profile/jquery.fs.wallpaper.js',
			'./app/scripts/profile/jquery.easing.1.3.js',
			'./app/scripts/profile/jquery.plusanchor.js',
			'./app/scripts/profile/jquery.knob.js',
			'./app/scripts/profile/wow.min.js'
		],
		dest: './dist/assets/libs.min.js'
	}

};