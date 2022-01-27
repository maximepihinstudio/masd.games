const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const minifyCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglifyJs = require('gulp-uglify');
const tap = require('gulp-tap');
const clean = require('gulp-clean');

/** Версия, которая будет дописываться к файлам */
const FILES_VERSION = `.${Date.now()}`;

/**
 * Удаляет css и js файлы с прошлыми версиями
 */
function cleanFiles() {
    return gulp.src(['css/dist/', 'js/dist/'], {read: false, allowEmpty: true})
        .pipe(clean())
}

/**
 * Сборка css
 */
function buildCss() {
    return gulp.src('css/src/**/*.css')
        .pipe(minifyCss())
        .pipe(rename({suffix: FILES_VERSION}))// Дописывание префикса с версией
        .pipe(gulp.dest('css/dist/'));
}

/**
 * Сборка html
 */
function buildHtml() {
    function replaceDynamicVariables(file) {
        file.contents = Buffer.from(String(file.contents)
            .replace(/{{FILES_VERSION}}/g, FILES_VERSION));
    }

    return gulp.src('html_src/*.html')
        .pipe(tap(replaceDynamicVariables)) // Подстановка префикса в html к css и js файлам
        .pipe(fileinclude({ // Подключение html-компонентов к html файлам 
            prefix: '@@',
            basepath: 'html_components',
        }))
        .pipe(htmlmin({ // Минификация html
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./'));
}

/**
 * Сборка js
 */
function buildJs() {
    return gulp.src('js/src/**/*.js')
        .pipe(uglifyJs())
        .pipe(rename({suffix: FILES_VERSION})) // Дописывание префикса с версией
        .pipe(gulp.dest('js/dist/'));
}

/**
 * Watch-ер - отслеживает изменение файлов и пересобирает их
 */
function watch() {
    gulp.watch(['html_src/*.html', 'html_components/*.html', 'css/src/*.css', 'js/src/**/*.js'], gulp.series(cleanFiles, gulp.parallel(buildHtml, buildCss, buildJs)));
}

exports.build = gulp.series(cleanFiles, gulp.parallel(buildHtml, buildCss, buildJs));
exports.watch = watch;