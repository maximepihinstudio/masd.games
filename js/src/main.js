
/**
 * Component for working with Cookies
 */
let Cookies = (function() {
	const CookiesNames = {
		cookieAgreement: 'masdCookieAgreement',
		lang: 'masdGameLang',
	};
	
	const Selectors = {
		acceptCookiesBtn: '.accept-cookies-btn',
		cancellCookiesBtn: '.cancell-cookies-btn',
		cookiesAgreementSection: '.cookie-argreement',
		displayNone: 'd-none',
	};
	
	let $cookiesAgreementSection = undefined;

	/**
	 * Init cookies component
	 * 
	 * @return {void}
	 */
	let init = function() {
		$cookiesAgreementSection = $(Selectors.cookiesAgreementSection);
	
		if (getCookieAgreementState()) {
			return;
		}
	
		$cookiesAgreementSection.removeClass(Selectors.displayNone);
	
		$(document).on('click', Selectors.acceptCookiesBtn, function(event) {
			$cookiesAgreementSection.addClass(Selectors.displayNone);
			setCookie(CookiesNames.cookieAgreement, 'true', 30);
		});
	
		$(document).on('click', Selectors.cancellCookiesBtn, function(event) {
			$cookiesAgreementSection.addClass(Selectors.displayNone);
		});
	};
	
	/**
	 * Set cookie
	 * 
	 * @param {string} name 
	 * @param {string} value 
	 * @param {number} days
	 */
	let setCookie = function(name, value, days) {
		var expires = "";
	
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
	
		document.cookie = name + "=" + (value || "")  + expires + "; path=/";
	};
	
	/**
	 * Get cookie value
	 * 
	 * @param {string}} name 
	 * @return {string|null} - cookie value or null if cookie wasn't set
	 */
	let getCookie = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
	
		for (var i=0; i < ca.length; i++) {
			var c = ca[i];
	
			while (c.charAt(0)==' ') {
				c = c.substring(1,c.length);
			}
	
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length,c.length);
			}
		}
		return null;
	};
	
	/**
	 * Return user cookie aggrement
	 * 
	 * @return {boolean}
	 */
	let getCookieAgreementState = function() {
		let cookiesAgreement = getCookie(CookiesNames.cookieAgreement);
	
		if (cookiesAgreement === 'true') {
			return true;
		}
	
		$(Selectors.cookiesAgreementSection).show();
		return false;
	};

	return {
		init: init,
		getCookieAgreementState: getCookieAgreementState,
		getCookie: getCookie,
		setCookie: setCookie,
	}
})();

/**
 * Contact Us Form component
 */
let ContactUsForm = (function() {
	const Selectors = {
		contactUsForm: '#contactUsForm',
	};

	const ACTION = "scripts/send-contact-us-form.php";

	/**
	 * Init component
	 * 
	 * @return {void} 
	 */
	let init = function() {		
		if ($(Selectors.contactUsForm).length > 0) {
			$(document).on('submit', Selectors.contactUsForm, (event) => {
				let $contactUsForm = $(event.target);
				let contactUsForm = document.querySelector(Selectors.contactUsForm);

				event.preventDefault();
				event.stopPropagation();

				if (!contactUsForm.checkValidity()) {
					$contactUsForm.addClass('was-validated');

					return false;
				} else {
					$.ajax({
						url: ACTION,
						method: 'POST',
						data: $contactUsForm.serialize(),
						success: function(response) {
							$contactUsForm.removeClass('was-validated');
							$contactUsForm.trigger('reset');
							showModal('<span class="text-primary">Success!</span>');
						},
						error: function(err) {
							console.log(`Error: Cant send 'Contact Us Form Data'. Code: ${err}`);
							showModal('<span class="text-danger">Error!</span>');
						}
					});
				}
			});
		}
	};

	/**
 * Отображает alert
 * 
 * @param {string} message Сообщение alert-а
 * 
 * @return {void}
 */
	let showModal = function(message) {
		let modalId = '#contactUsFormStatusModal';
		let alertElement = document.querySelector(modalId);
		let modal = new bootstrap.Modal(alertElement); 
		
		alertElement.querySelector(`${modalId} h5`).innerHTML = message;
		modal.show();
		
		setTimeout(function() {
			modal.hide();
		}, 2000);
	}

	return {
		init: init,
	}
})();


if (jQuery) {
	$(document).ready(function () {
		if ($('.slider.owl-carousel').length !== 0) {
			$('.slider.owl-carousel').owlCarousel({
				items: 1,
				loop: true,
				margin: 24,
				nav: true,
				dots: true,
				autoplay: true,
				autoplayTimeout: 4000,
				smartSpeed: 1800,
				responsive: {
					768: {
						items: 2
					},
					992: {
						items: 3
					},
					1400: {
						items: 4
					}
				}
			})
		}
	});
};

const button = document.querySelector('.navbar__toggle');
const navbar = document.querySelector('.navbar');

button.addEventListener('click', function () {
	navbar.classList.toggle('active');
});


/**
 * Tilt Parallax on image in MASD GAMES section on main page
 */
const TILTED_IMAGES_SELECTORS = {
	titledImage: '.tilted-image',
}

if ($(TILTED_IMAGES_SELECTORS.titledImage).length > 0) {
	$(TILTED_IMAGES_SELECTORS.titledImage).each((_, image) => {
		$(image).tilt({
			scale: 1.11
		});

		let tilt = $(image).tilt();
		tilt.on('change', function(e, transforms){});
	});
}

new WOW().init();


$(document).ready(() => {
	Cookies.init();
	ContactUsForm.init();
});