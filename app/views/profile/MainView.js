/*global define, Backbone, $, document, _*/
define(['hbs!templates/profile/main', ],
	function (Template) {
		'use strict';

		var winWidth, socialHeight;

		function isProd() {
			return (document.location.href.indexOf('https://' + _APP_ID + '.stamplayapp.com') != -1) ? true : false;
		}


		function setWidth() {
			winWidth = $(window).innerWidth(); //This may need to be width()	
			socialHeight = (winWidth > 640) ? 120 : 160;
		}

		var fancyThingsHappensHere = function () {
			setWidth();
			$(window).on('resize', setWidth);

			var didScroll = false,
				icon = $(".huge-title, #godown"),
				$window = $(window);

			$(window).scroll(function () {
				didScroll = true;
			});

			window.setInterval(function () {
				if (didScroll) {
					if (1 - $window.scrollTop() / 200 > -20) {
						icon.css({
							opacity: 1 - $window.scrollTop() / 500
						});
					}
					didScroll = false;
				}
			}, 50);

			$(window).scroll(function () {
				if ($(window).scrollTop() < 300) {
					$('#socialsection').css({
						opacity: "0"
					}, 500);
				} else if ($(window).scrollTop() > 300) {
					$('#socialsection').css({
						opacity: "1"
					}, 500);
				}
			});

			//plusAnchor
			$('body').plusAnchor({
				easing: 'easeInOutExpo',
				offsetTop: -75,
				speed: 800,
				onInit: function (base) {

						if (base.initHash !== '' && $(base.initHash).length > 0) {
							window.location.hash = 'hash_' + base.initHash.substring(1);
							window.scrollTo(0, 0);

							$(window).load(function () {

								timer = setTimeout(function () {
									$(base.scrollEl).animate({
										scrollTop: $(base.initHash).offset().top
									}, base.options.speed, base.options.easing);
								}, 2000); // setTimeout
							}); // window.load
						} // if window.location.hash
					} // onInit
			});

			//Video Wallpaper Settings - alter the URL's to your converted videos		
			if (isProd()) {
				$("#video_element").wallpaper({
					source: this.profileCobj.get('bg') || _LIB_URL + 'background2.jpg'
				});
			} else {
				$("#video_element").wallpaper({
					source: this.profileCobj.get('bg') || _LIB_URL + 'images/profile/background2.jpg'
				});
			}

			//fancybox
			$(".fancybox").fancybox();

			//ScrolltoTop
			$("#toTop").scrollToTop(1000);

			//owlCarousel - these settings are for the testimonials and sub heading under your name title at the top
			$(".testimonials").owlCarousel({

				// Most important owl features
				items: 1,
				itemsCustom: false,
				itemsDesktop: [1199, 1],
				itemsDesktopSmall: [980, 1],
				itemsTablet: [768, 1],
				itemsTabletSmall: false,
				itemsMobile: [479, 1],
				singleItem: false,
				itemsScaleUp: false,

				//Basic Speeds - set your speeds in milliseconds here!
				slideSpeed: 400,
				paginationSpeed: 800,
				rewindSpeed: 1000,

				//Autoplay
				autoPlay: true,
				stopOnHover: true

			});


			new WOW().init();

		};

		function prodUrls() {
			if (!this.profileCobj.get('biopic')) {
				$('.huge-title img').attr('src', _LIB_URL + 'default_portrait.jpg');
			}
			$('#down-img').attr('src', _LIB_URL + 'godown.png');
		}

		var mainView = Backbone.View.extend({
			//instead of generating a new elemtn, bind the existing skeletong of the app to existing HTML
			el: '#container',

			events: {
				'click #submitted': 'submitForm',
				'click #compliment': 'submitCompliment',
				'click #socialsection': 'showSocial',
				'click .menu': 'navigate',
				'click .edit': 'toEdit',
			},

			initialize: function (options) {
				if (options.profileCobj) {
					this.profileCobj = options.profileCobj;
				}
				this.render();
			},

			render: function () {
				window.scroll(0, 0);
				if (this.profileCobj) {
					var hasVoted;
					if (this.profileCobj.get('actions').votes.users.indexOf(this.model.get('_id')) != -1) {
						hasVoted = true;
					} else {
						hasVoted = false;
					}
					var pluralize = false;
					if (this.profileCobj.get('actions').votes.total > 1) {
						pluralize = true;
					}
					this.$el.html(Template({ //jshint ignore:line
						user: this.model.toJSON(),
						profileCobj: this.profileCobj.toJSON(),
						hasVoted: hasVoted,
						assetsUrl: _LIB_URL + 'images/profile',
						fullYear: new Date().getFullYear(),
						currentUrl: location.href,
						pluralize: pluralize
					}));

					if (isProd()) {
						prodUrls.call(this);
					}

				} else {
					//Handle error the cobj is not found
				}
				fancyThingsHappensHere.call(this);
				this.$el.show();

			},

			submitForm: function (e) {
				e.preventDefault();
				if (!this.model.get('isLogged')) {
					$('#please-login').fadeIn();
					return;
				}

				$('form#contact_form .error').remove();
				var hasError = false;
				$('.requiredField').each(function () {
					var labelText;
					if ($.trim($(this).val()) === '') {

						labelText = $(this).prev('label').text();
						$(this).parent().append('<span class="error">Please complete the required fields.</span>');
						$(this).addClass('inputError');
						hasError = true;

					} else if ($(this).hasClass('email')) {

						var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

						if (!emailReg.test($.trim($(this).val()))) {
							labelText = $(this).prev('label').text();
							$(this).parent().append('<span class="error">You entered an invalid email</span>');
							$(this).addClass('inputError');
							hasError = true;
						}

					}

				});

				if (!hasError) {
					var name = $('#name').val();
					var email = $('#email').val();
					var message = $('#message').val();
					var content = {
						name: name,
						email: email,
						message: message,
						to: this.profileCobj.get('email'),
						userId: this.model.get('_id')
					};
					$.ajax({
						url: '/api/form/v0/forms/contact-form/entries',
						method: 'POST',
						data: content,
						success: function (response) {
							$('form#contact_form').slideUp("fast", function () {
								$('form#contact_form').before('<p class="success">Thank you! Your email was successfully sent.</p>');
							});
						},
						error: function (err) {
							$('#error-contact').show();
							setTimeout(function () {
								$('#error-contact').fadeOut();
							}, 1000);
						},
						complete: function () {
							$('#name').val('');
							$('#email').val('');
							$('#message').val('');
						}
					});

				}
			},

			submitCompliment: function (e) {
				e.preventDefault();
				e.stopPropagation();
				if (!this.model.get('isLogged')) {
					$('#please-login').fadeIn();
					setTimeout(function () {
						$('#please-login').fadeOut();
					}, 2000);
					return;
				}

				if (this.model.get('_id') === this.profileCobj.get('user')) {
					//You can’t compliment yourself, but hey, nice shoes.
					$('#no-compliment').fadeIn();
					setTimeout(function () {
						$('#no-compliment').fadeOut();
					}, 2000);
					return;
				}

				this.profileCobj.vote({
					success: function (response) {
						$('#compliment').html('<span class="glyphicon glyphicon-star voted" id="compliment-star" ></span> You have already voted');
						$('#compliment-count').html(response.actions.votes.total);
					},
					error: function () {

					}
				});
			},

			showSocial: function (e) {
				if ($(e.currentTarget).hasClass('hide-social')) {
					$(e.currentTarget).animate({
						height: 40
					}, 200).removeClass('hide-social');
				} else {
					$(e.currentTarget).animate({
						height: socialHeight
					}, 200).addClass('hide-social');
				}
			},

			navigate: function (e) {
				$('.nav').animate({
					height: 'toggle'
				});
			},

			toEdit: function (e) {
				e.preventDefault();
				this.goTo('/');
			},

			clear: function () {
				$(window).off();
			}
		});

		return mainView;
	});