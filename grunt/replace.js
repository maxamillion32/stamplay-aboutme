module.exports = {

	/*
		Replacing relative paths of the fontello-prod.css with ./ path because all files are in /assets for now
	*/
	css_fonts: {
		src: ['app/stylesheets/profile/fontello.css'],
		dest: 'dist/assets/fontello-prod.css',
		replacements: [{
			from: '../../fonts/profile/',
			to: '',
		}]
	}

};