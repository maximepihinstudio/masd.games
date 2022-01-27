
/**
 * Internationalization Componet
 * 
 * @return {void}
 */
let SiteInternationalization = (function() {

    /**
     * Init Site Internationalization component
     * 
     * @return {void}
     */
    let init = function() {
        i18next.init({
            lng: LanguageSelect.detectUserLanguage(),
            debug: true,
            resources: translations
        }).then(function() {
            for (let translationItem of Object.keys(translations.en.translation)) {
                $(`[data-translation-id="${translationItem}"]`).html(i18next.t(translationItem));
            }
        });
    };

    return {
        init: init,
    };
})();

$(document).ready(() => {
    SiteInternationalization.init();
});