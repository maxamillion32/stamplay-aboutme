/*global define, Backbone, $, document, _*/
define(['hbs!templates/edit/main', 'async'],
	function (Template, async) {
		'use strict';

		function _parseViewFields(fields, coinstance) {
			var key;
			var outValue;
			fields.each(function (index, value) {
				key = $(value).data('name');
				switch ($(value).data('type')) {
				case 'array_string':
					try {
						var currentValue = $(value).val();
						if (currentValue === '') {
							outValue = null;
						} else {
							outValue = $(value).val().split(',');
						}
					} catch (exp) {
						outValue = null;
					}
					break;
				case 'file':
					try {
						outValue = $('input[data-name="' + key + '"]')[0].files[0];
						// outValue = $(value).val();
					} catch (exp) {

						outValue = null;
					}
					break;
				default:
					outValue = $(value).val().trim();
				}

				if (outValue) {
					coinstance.append(key, outValue);
				}
			});
		}

		function _startColorPicker() {

		}

		var mainView = Backbone.View.extend({
			//instead of generating a new elemtn, bind the existing skeletong of the app to existing HTML
			el: '#container',

			events: {
				'click #save-profile': 'saveProfile',
				'click #show-profile': 'showProfile',
				'click .logout': 'logOut'
			},

			initialize: function (options) {
				this.cobj = options.cobj;
				this.render();
			},

			render: function () {
				var _this = this;

				this.$el.html(Template({ //jshint ignore:line
					user: this.model.toJSON(),
					cobj: this.cobj.toJSON(),
				}));

				_startColorPicker.call(this);
				$('.colorpicker.profile-info').colorpicker({

				});

				$(":file").filestyle({
					buttonName: 'btn-primary fileinput-flat',
					iconName: 'glyphicon-upload'
				});

				$(':file').each(function (i, fileInput) {
					var dataName = $(fileInput).attr('data-name');
					if (dataName && _this.cobj && _this.cobj.get(dataName)) {
						var fileName = _this.cobj.get(dataName).substring(_this.cobj.get(dataName).lastIndexOf('/') + 1);
						$('input[data-name="' + dataName + '"]').siblings('.bootstrap-filestyle').children('input').val(fileName);
					}
				});

				this.$el.show();
			},

			saveProfile: function (e) {
				e.preventDefault();
				var _this = this;

				$('.error').remove();
				var hasError = false;
				$('.requiredField').each(function () {
					var labelText;
					if ($.trim($(this).val()) === '') {
						labelText = $(this).prev('label').text();
						$(this).parent().siblings('.st-error-container').html('<span class="error">Required</span>');
						$(this).addClass('inputError');
						hasError = true;
					}
				});

				if (hasError) {
					window.scroll(0, 0);
					return;
				}

				$.ajax({
					url: '/api/cobject/v0/aboutpage?profileId=' + $('#profileId').val(),
					method: 'GET',
					context: this,
					async: false,
					success: function (response) {
						if (response.data.length > 0) {
							response.data.forEach(function (cinstance) {
								if (cinstance.user !== this.model.get('_id')) {
									hasError = true;
									$('#profileId').parent().siblings('.st-error-container').html('<span class="error">Used</span>');
									return;
								}
							}, this);
						}
					},
					error: function () {
						return;
					}
				});

				if (hasError) {
					window.scroll(0, 0);
					return;
				}

				var fields = $('.profile-info');
				var coinstance = new FormData();
				_parseViewFields(fields, coinstance);

				var method = (this.cobj.get('isNew')) ? 'POST' : 'PATCH';
				var url = '/api/cobject/v0/aboutpage';
				if (method === 'PATCH') {
					url = url + '/' + this.cobj.get('_id');
				} else {
					coinstance.append('user', this.model.get('_id'));
					coinstance.append('email', this.model.get('email'))
				}

				$.ajax({
					method: method,
					url: url,
					context: this,
					data: coinstance,
					processData: false, //so that jquery doesn't alter the data
					contentType: false, //so that jquery doesn't alter the headers
					success: function (response) {
						if (method === 'POST') {
							$('#call-successfull .call-text').html('Profile created successfully');
							$('#show-profile').removeAttr('disabled');
						} else {
							$('#call-successfull .call-text').html('Profile updated successfully');
						}
						var keys = Object.keys(response);
						for (var k in response) {
							this.cobj.set(k, response[k]);
						}

						$('#call-successfull').show();
						setTimeout(function () {
							$('#call-successfull').fadeOut();
						}, 1000)

					},
					error: function (err) {},
					complete: function () {

					}
				});

			},

			showProfile: function (e) {
				e.preventDefault();
				this.goTo('?of=' + this.cobj.get('profileId'));
			},

			logOut: function (e) {
				e.preventDefault();
				document.location.href = '/auth/v0/logout';
			},


			clear: function () {}
		});

		return mainView;
	});