/*global define, Backbone, $, document, Raven, console, require*/
// 'use strict';
define(['backbone', 'user', 'cobj'],
	function (Backbone, User, CObj) {


		function _resetViews() {
			if (this.activesView) {
				this.activesView.destroy();
				this.activesView = null;
			}
		}

		function _isAuthenticated() {
			return (this.user.get('_id')) ? true : false;
		}

		// and the function that parses the query string can be something like : 
		function _parseQueryString(queryString) {
			var params = {};
			if (queryString) {
				_.each(
					_.map(decodeURI(queryString).split(/&/g), function (el, i) {
						var aux = el.split('='),
							o = {};
						if (aux.length >= 1) {
							var val;
							if (aux.length == 2)
								val = aux[1];
							o[aux[0]] = val;
						}
						return o;
					}),
					function (o) {
						_.extend(params, o);
					}
				);
			}
			return params;
		}

		var router = Backbone.Router.extend({
			routes: {
				'?*queryString': 'showProfile',
				'': 'editProfile',
			},

			initialize: function () {
				this.user = new User({
					isLogged: false
				});

			},

			start: function () {
				$.ajax({
					url: '/api/user/v0/getStatus',
					dataType: 'json',
					context: this,
					success: function (response) {
						if (response.user) {
							this.user = new User(response.user);
							this.user.set('isLogged', true);
						}
						Backbone.history.start({
							pushState: true,
							root: "/profile"
						});
					},
					error: function () {
						cb('FAIL getUserStatus');
					}
				});
			},

			showProfile: function (queryString) {
				_resetViews.call(this);
				var params = _parseQueryString(queryString);
				if (params.of) {
					var _this = this;

					require(['profile_view'], function (ProfileView) {
						$.ajax({
							method: 'GET',
							url: '/api/cobject/v0/aboutpage?profileId=' + params.of,
							context: _this,
							success: function (response) {
								if (response.data && response.data[0]) {
									this.profileCobj = new CObj(response.data[0]);
									var profileView = new ProfileView({
										model: this.user,
										profileCobj: this.profileCobj
									});
									this.activesView = profileView;
								} else {
									//No user matching that profile id, redirecting to landing page
									document.location.href = '/';
								}
							},
							error: function (err) {

							}
						});
					});

				} else {
					//"of" user parameter missing, redirecting to landing page
					document.location.href = '/';
				}

			},

			editProfile: function () {
				_resetViews.call(this);
				if (_isAuthenticated.call(this)) {
					//User is authenticated
					var _this = this;
					window.scroll(0, 0);
					require(['edit_view'], function (EditView) {

						$.ajax({
							method: 'GET',
							url: '/api/cobject/v0/aboutpage?user=' + _this.user.get('_id'),
							context: _this,
							success: function (response) {
								if (response.data.length !== 0) {
									_this.cobject = new CObj(response.data[0]);
								} else {
									_this.cobject = new CObj({
										isNew: true
									});
								}
								var editView = new EditView({
									model: _this.user,
									cobj: _this.cobject
								});
								_this.activesView = editView;
							},
							error: function (err) {},
							complete: function () {}
						});

					});

				} else {
					//Not authenticated
					document.location.href = '/';
				}
			}

		});

		return router;

	});