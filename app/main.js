/*global define, Backbone, log, $, document, app, requirejs*/
require.config({

	//	Define vs Require rule of thumb:
	//	 - Define: If you want to declare a module other parts of your application will depend on.
	//	 - Require: If you just want to load and use stuff.
	waitSeconds: 60,

	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'async': {
			exports: 'async'
		}
	},

	// default plugin settings, listing here just as a reference
	hbs: {
		templateExtension: 'hbs.html',

		helperPathCallback: function (name) {
			return '/templates/helpers/' + name + '.hbs.js';
		},

		// if disableI18n is `true` it won't load locales and the i18n helper
		// won't work as well.
		disableI18n: true
	},

	paths: {
		/* ************************************************** */
		/*                   BASE LIBRARY                     */
		/* ************************************************** */
		underscore: 'bower_components/underscore/underscore',
		backbone: 'bower_components/backbone/backbone',
		handlebars: 'bower_components/require-handlebars-plugin/Handlebars',
		hbs: 'bower_components/require-handlebars-plugin/hbs',
		async: 'bower_components/async/lib/async',
		i18nprecompile: 'bower_components/require-handlebars-plugin/hbs/i18nprecompile',
		json2: 'bower_components/require-handlebars-plugin/hbs/json2',
		require: 'bower_components/require/require',



		/* ************************************************** */
		/*                     VIEWS                          */
		/* ************************************************** */
		profile_view: './views/profile/MainView',
		edit_view: './views/edit/MainView',

		/* ************************************************** */
		/*                     MODELS                         */
		/* ************************************************** */
		user: './models/User',
		cobj: './models/CObj'
	}
});

if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}

var app = app || {};

requirejs(['backbone', 'router'], function (Backbone, Router) {
	requirejs(['handlebars'], function (Handlebars) {
		app = new Router();

		// Extend the View class to include a navigation method goTo
		Backbone.View.prototype.goTo = function (loc) {
			app.navigate(loc, {
				trigger: true
			});
		};

		// assign is basically just setElement which calls delegateEvents
		// for you—but with a nicer API and an automatic call to rende
		Backbone.View.prototype.assign = function (view, selector) {
			view.setElement(this.$(selector)).render();
			if (!this.subViews) {
				this.subViews = [];
			}

			this.subViews.push(view);
		};

		Backbone.View.prototype.destroy = function () {

			//COMPLETELY UNBIND THE VIEW
			this.undelegateEvents();

			this.$el.removeData().unbind();

			if (this.clear) {
				this.clear();
			}
			//Delete DOM node content
			//NOT NEEDED EACH MAIN VIEW OVERWRITE THE PREVIOUS
			// this.$el.html('<!-- UNRENDERED -->');
			var subViews = this.subViews;
			if (subViews) {
				for (var i = 0, j = subViews.length; i < j; i++) {
					subViews[i].destroy();
				}
			}

			this.subViews = [];
		};

		Backbone.View.prototype.destroySubViews = function () {

			//Delete DOM node content
			//NOT NEEDED EACH MAIN VIEW OVERWRITE THE PREVIOUS
			// this.$el.html('<!-- UNRENDERED -->');
			if (this.subViews) {
				this.subViews.forEach(function (subView) {
					subView.destroy();
				});
			}

			this.subViews = [];
		};
		app.start();
	});
});