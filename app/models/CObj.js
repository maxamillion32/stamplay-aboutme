define(["backbone"], function (Backbone) {

	var cobj = Backbone.Model.extend({

		idAttribute: '_id',

		defaults: {
			biopic: false,
			bg: false,
			isNew: false,
			birthplace: false,
			bg_color1: '#0875bd',
			bg_color2: '#097ecb',
			header_color: '#ffffff'
		},

		initialize: function (options) {
			this.stamplayCobject = new Stamplay.Cobject('aboutpage').Model;
			if (options._id) {
				this.stamplayCobject.set('_id', options._id);
			}
		},

		saveOrUpdate: function (user, method, coinstanceData, options) {
			var url = '/api/cobject/v0/aboutpage';
			if (method === 'PATCH') {
				url = url + '/' + this.get('_id');
			} else {
				coinstanceData.append('user', user.get('_id'));
				coinstanceData.append('email', user.get('email'))
			}

			$.ajax({
				method: method,
				url: url,
				context: this,
				data: coinstanceData,
				processData: false, //so that jquery doesn't alter the data
				contentType: false, //so that jquery doesn't alter the headers
				success: function (response) {
					var keys = Object.keys(response);
					for (var k in response) {
						this.set(k, response[k]);
					}
					if (options.success) {
						options.success();
					}
				},
				error: function (err) {
					if (options.error) {
						options.error(err);
					}
					console.log('error', err);
				},
			});
		},

		vote: function (options) {
			this.stamplayCobject.upVote().then(function () {
				if (options.success) {
					options.success();
				}
			}).catch(function (err) {
				if (options.error) {
					options.error();
				}
			});
		}

	});

	return cobj;

});