'use strict';

let LanguageSelect = (function() {
    const MASD_GAME_LANG_COOKIE = 'masdGameLang';
    const SUPPORTED_LANGUAGES = ['en', 'ru', 'de', 'kr', 'cn'];

    const Selectors = {
        languagesSelector: 'select#languages-dropdown',
    }

    /**
     * Init languageSelect
     * 
     * @return {void}
     */
    let init = function() {
        let language = detectUserLanguage();

        $(Selectors.languagesSelector).select2({
            minimumResultsForSearch: Infinity,
            width: '80px',
            templateResult: (state) => {
                if (!state.hasOwnProperty('element')) {
                    return state.text;
                }

                let countryFlagName = state.element.dataset.langId;
                return $(`<span class="languages-dropdown__county">
                        <img src="images/country-flags/${countryFlagName}.svg" class="languages-dropdown__county-flag"/>
                        <div>${state.text}</div>
                    </span>`);
            },
            templateSelection: (state) => {
                let countryFlagName = state.element.dataset.langId;
                return $(`<span class="languages-dropdown__county">
                        <img src="images/country-flags/${countryFlagName}.svg" class="languages-dropdown__county-flag"/>
                        <div>${state.text}</div>
                    </span>`);
            }
        });

        $(Selectors.languagesSelector).val(language);
        $(Selectors.languagesSelector).trigger('change');
        $('html').attr('lang', language);

        /** Change language */
        $(Selectors.languagesSelector).on('change', function (event) {
            let languageCode = $(this).val();
            $('html').attr('lang', languageCode);

            if (Cookies.getCookieAgreementState()) {
                Cookies.setCookie(MASD_GAME_LANG_COOKIE, languageCode, 30);
            }

            i18next.changeLanguage(languageCode, function() {
                for (let translationItem of Object.keys(translations.en.translation)) {
                    $(`[data-translation-id="${translationItem}"]`).html(i18next.t(translationItem));
                }
            });
        });
    };

    /** 
     * Detect user language 
     * 
     * @return {srting} user language
     */
    let detectUserLanguage = function() {
        let language = Cookies.getCookie(MASD_GAME_LANG_COOKIE);

        if (language !== null && SUPPORTED_LANGUAGES.indexOf(language) !== -1) {
            return language;
        }

        language = window.navigator ? (window.navigator.language ||
            window.navigator.systemLanguage ||
            window.navigator.userLanguage) : "en";
        
        language = language.substr(0, 2).toLowerCase();
        language = SUPPORTED_LANGUAGES.indexOf(language) !== -1 ? language : 'en';

        if (Cookies.getCookieAgreementState()) {
            Cookies.setCookie(MASD_GAME_LANG_COOKIE, language, 30);
        }

        return language;
    };



    return {
        init: init,
        detectUserLanguage: detectUserLanguage,
    }
})();

$(document).ready(() => {
    LanguageSelect.init();
});