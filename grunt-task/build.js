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
		'concat:css',
		'cssmin:minify'
	]);

	//Builds external libraries minified js 
	grunt.registerTask('buildlib', 'Create lib.min.js asset', [
		'clean:baseLibs',
		'concat:lib',
		'uglify:lib'
	]);

	//Builds complete app
	grunt.registerTask('buildapp', 'Create app.min.js asset', [
		'requirejs:app',
		'uglify:app',
		'uglify:requirejs'
	]);

	//Builds everything
	grunt.registerTask('build', 'Create Stamplay production ready project in /dist', function () {
		grunt.task.run(['buildCss', 'buildLoginCss', 'buildlib', 'buildapp']);
	});

}