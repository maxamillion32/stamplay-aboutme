module.exports = function (grunt) {
	/**
	 * Assets creation and minification
	 */

	//Builds all in one css login file 
	grunt.registerTask('buildLoginCss', 'Minify All login css', [
		'cssmin:minifyLogin'
	]);

	//Builds all in one css app file 
	grunt.registerTask('buildCss', 'Minify All css', [
		'clean:cssmin',
		'replace:css_fonts',
		'concat:css',
		'cssmin:minify'
	]);

	//Copies all images in /assets
	grunt.registerTask('buildImg', 'Copy all imgs in /assets', [
		'clean:img',
		'copy:img'
	]);

	//Copies jquery and require js in /assets
	grunt.registerTask('copyBaseLibs', 'Copy jquery and requirejs assets', [
		'clean:baseLibs',
		'copy:baseLibs'
	]);

	//Copies bootstrap css in /assets
	grunt.registerTask('copyBaseCss', 'Copy bootstrap', [
		'copy:baseCss'
	]);

	grunt.registerTask('copyBaseFonts', 'Copy fonts', [
		'copy:baseFonts'
	]);


	//Builds external libraries minified js 
	grunt.registerTask('buildlib', 'Create lib.min.js asset', [
		'clean:lib',
		'concat:lib',
		'uglify:lib'
	]);

	//Builds complete app
	grunt.registerTask('buildapp', 'Create app.min.js asset', [
		'clean:app',
		'requirejs:app',
		'uglify:app'
	]);

	//Builds everything
	grunt.registerTask('build', 'Create Stamplay production ready project in /dist', function () {
		grunt.task.run(['buildCss', 'buildLoginCss', 'buildImg', 'copyBaseLibs', 'copyBaseCss', 'copyBaseFonts', 'buildlib', 'buildapp']);
	});

}