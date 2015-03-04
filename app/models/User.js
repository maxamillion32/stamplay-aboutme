define(["backbone"], function (Backbone) {

	var stamplayUser = Backbone.Model.extend({
		defaults: {},

		initialize: function () {
			this.stamplayUser = new Stamplay.User().Model;
		},

		currentUser: function (options) {
			var _this = this;
			this.stamplayUser.currentUser().then(function () {

				if (_this.stamplayUser.get('_id')) {
					_this.set(_this.stamplayUser.instance);
					_this.set('isLogged', true);
				}
				if (options.success) {
					options.success(_this.stamplayUser.instance);
				}

			}).catch(function (err) {
				if (options.error) {
					options.error(err);
				}
			});
		}

	});

	return stamplayUser;

});