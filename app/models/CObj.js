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

		validateProfileId: function (profileId, userId) {
			var isValid = false;
			$.ajax({
				url: '/api/cobject/v0/aboutpage?profileId=' + profileId,
				method: 'GET',
				context: this,
				async: false,
				success: function (response) {
					if (response.data.length > 0) {
						response.data.forEach(function (cinstance) {
							if (cinstance.user !== userId) {
								isValid = true;
								return;
							}
						}, this);
					}
				},
				error: function () {}
			});
			return isValid;
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
				error: function (err) {},
				complete: function () {}
			});
		},

		vote: function (options) {
			$.ajax({
				url: '/api/cobject/v0/aboutpage/' + this.get('_id') + '/vote',
				method: 'PUT',
				success: function (response) {
					if (options.success) {
						options.success(response);
					}
				},
				error: function (err) {
					if (options.error) {
						options.error();
					}
				}
			});
		}

	});

	return cobj;

});