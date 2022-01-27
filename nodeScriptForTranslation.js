///////////////////////////////////////////////////////////////////////////////////////////
// Node function for work with translation file

const fs = require('fs');
const { rawListeners } = require('process');
const readline = require('readline');

const TRANSLATION_FILE_NAME = 'js/src/i18n/translations.js';
const TRANSLATION_FILE_START = 'let translations = ';

/**
 * Read file and return JSON-object with translations
 * 
 * @return {object} - Return JSON-object with translations
 */
let getTranslationFileData = function() {
    let translations = fs.readFileSync(TRANSLATION_FILE_NAME, (error, data) => {
        if (error) {
            console.log('Cant open translations file!!!');
            process.exit();
        } else {
            console.log('data', data);
        }
    });


    let translationsString = translations.toString();
    let translationJson = JSON.parse(translationsString.split(TRANSLATION_FILE_START)[1]);

    return translationJson;
};

/**
 * Save data to translations file
 * 
 * @param {object} - JSON-object with changed translations
 * 
 * @return {void}
 */
let saveDataToTranslationsFile = function(jsonObject) {
    let translationsString = TRANSLATION_FILE_START + JSON.stringify(jsonObject);

    fs.writeFileSync(TRANSLATION_FILE_NAME, translationsString, (error) => {
        if (error) {
            console.log(`Cant write new translations to file!!! Error: ${error}`);
        }
    });
};

/**
 * Add or update new item to translation.js file
 * 
 * @param {string} translationDataAtributeName - name of data-translations-id atribute which added in html. Example ``<h1 data-translation-id="masdGamesSectionTitle">Masd <span>Games</span></h1>``
 * @param {object} translationsObject - object with translations on languages {'en': '...', 'ru': '...', 'de': '...', 'cn': '...', 'kr': '...'}
 * 
 * @return {void}
 */
let addOrUpdateNewItemToTranslations = function(translationDataAtributeName, translationsObject) {
    let languages = ['en', 'ru', 'de', 'cn', 'kr'];
    let translationFileData = getTranslationFileData();

    for (let language of languages) {
        translationFileData[language]['translation'][translationDataAtributeName] = translationsObject[language];
    }

    saveDataToTranslationsFile(translationFileData);
};

/**
 * Return object with translations on all languages by attribute name
 * 
 * @param {string} dataAttributeName
 * 
 * @return {object} - return object with translations on all languages for requested attribute name. Return empty object if translations for attribute not exist.
 */
let getTranslationByDataAttributeName = function(translationDataAtributeName) {
    let languages = ['en', 'ru', 'de', 'cn', 'kr'];
    let translationsForAttribute = {};

    for (let language of languages) {
        if (translationFileData[language]['translation'][translationDataAtributeName] === undefined) {
            return {};
        }

        translationsForAttribute[language] = translationFileData[language]['translation'][translationDataAtributeName];
    }

    return translationsForAttribute;
};

/**
 * Add translation for data-attribute
 * 
 * @param {} rl 
 * @param {string} message - The message that will be displayed to the user
 * 
 * @return {string} - Return data-attribute name
 */
//  function add(rl, message) {
//     rl.resume();
//     rl.question(message, function(answer) {
//         if (answer !== '') {
//             rl.pause();
//             console.log(answer);
            


//             askUser(rl);
//         } else {
//             get(rl, `Повторите ввод названия атрибута: `);
//         }
//     });
// }

/**
 * Get data via data-attribute value
 * 
 * @param {} rl 
 * @param {string} message - The message that will be displayed to the user
 * 
 * @return {string} - Return data-attribute name
 */
// function get(rl, message) {
//     rl.resume();
//     rl.question(message, function(answer) {
//         if (answer !== '') {
//             rl.pause();
//             // console.log(answer);
            
//             console.log(getTranslationByDataAttributeName(answer));
//             askUser(rl);
//         } else {
//             get(rl, `Повторите ввод названия атрибута: `);
//         }
//     });
// }

/**
 * 
 * @param {*} rl 
 */
// let askUser = function(rl) {
//     let insertMessage = `Введите название data-атрибута (data-translation-id) из разметки\n> `;

//     rl.question(`Введите действие: add, get, delete, exit\n> `, async function(answer) {
//         if (answer === 'exit') {
//             console.log("Пока)");
//             rl.close();
//             process.exit(-1);
//         } else if (answer === 'add') {
//             add(rl, insertMessage);
//         } else if (answer === 'get') {
//             get(rl, insertMessage)
//         } else if (answer === 'delete') {

//             askUser(rl);
//         }
//     });
// }

// let translationFileData = undefined;

/**
 * Start sript
 * 
 * @return {void}
 */
// let start = async function() {
//     console.log('### Добро пожаловать в интернационализацию сайта ###');
//     translationFileData = getTranslationFileData();

//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     askUser(rl);
// }

// start();


const stdin = process.stdin;

let welcomeMessage = '### Добро пожаловать в интернационализацию сайта ###';
let operationMessage = `Введите действие: add, get, delete, ctrl-c - для завершения: `;
let attributeMessage = `Введите название data-атрибута (data-translation-id) из разметки\n> `;


let stdinData = '';

let get = function() {

}



let listenStdin = function() {
    stdin.setRawMode( true );
    stdin.setEncoding( 'utf-8' );
    stdin.resume();

    stdin.on( 'data', function( char ) {
        // ctrl-c ( end of text )
        if ( char === '\u0003') {
            process.exit();
        }
        
        process.stdout.write(char);

        if ( char.charCodeAt() === 13 ) {
            console.log(stdinData);
            stdinData = '';
        }
    
        stdinData += char;
    });
}

let start = function() {
    console.log(welcomeMessage);
    console.log(operationMessage);

    listenStdin();


}

start();


// addOrUpdateNewItemToTranslations('', {
//     'en': 'Audit',
//     'ru': 'Аудит',
//     'de': 'Prüfung',
//     'cn': '审计',
//     'kr': '심사'
// })
