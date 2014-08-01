define(["backbone"], function (Backbone) {

	var cobj = Backbone.Model.extend({

		idAttribute: 'user',

		defaults: {
			biopic: false,
			bg: false,
			isNew: false,
			birthplace: false,
			bg_color1: '#0875bd',
			bg_color2: '#097ecb',
			header_color: '#ffffff'
		},


	});

	return cobj;

});