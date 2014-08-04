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

				$('.colorpicker.profile-info').colorpicker({});

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

				var profileId = $('#profileId').val();
				hasError = this.cobj.validateProfileId(profileId, this.model.get('_id'));
				if (hasError) {
					$('#profileId').parent().siblings('.st-error-container').html('<span class="error">Used</span>');
					window.scroll(0, 0);
					return;
				}

				var fields = $('.profile-info');
				var coinstance = new FormData();
				_parseViewFields(fields, coinstance);

				var method = (this.cobj.get('isNew')) ? 'POST' : 'PATCH';

				this.cobj.saveOrUpdate(this.model, method, coinstance, {
					success: function () {
						if (method === 'POST') {
							$('#call-successfull .call-text').html('Profile created successfully');
							$('#show-profile').removeAttr('disabled');
						} else {
							$('#call-successfull .call-text').html('Profile updated successfully');
						}

						$('#call-successfull').show();
						setTimeout(function () {
							$('#call-successfull').fadeOut();
						}, 1000);
					},
					error: function () {

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