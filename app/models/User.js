define(["backbone"], function (Backbone) {

	var user = Backbone.Model.extend({

		idAttribute: 'email',

		defaults: {},


	});

	return user;

});