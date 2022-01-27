
#Masd.games

Website for MASD GAMES
MASD is a multiplayer 3D game with blockchain technology. Be the first to create your base and play to earn a MASD token, buy or rent virtual plots of land, houses, items for survival in the game. Create your own clans and communities around the world in the game to participate in competitions for valuable items and MASD tokens together.

Being inspired by successful games like CS:GO and RUST, MASD-GAMES combines the best of both worlds and also allows players to earn money playing their favorite game and own limited resources purchased in the form of NFT.

- Стек: HTML, CSS, JS, jQuery, Bootstrap 5, Gulp, PHP
- Срок выполнения: 1 недели
- Ссылка: [masd.games](https://masd.games/)

- Требовалось сделать сайт для игры MASD GAMES.
- На сайте должно было поддерживаться 5 языков.
- Сайт должен был быть адаптивным и кроссбраузерным.
- Требовалось произвести оптимизацию, поскольку была долгая загрузка.

Заказчиком были предоставлены файлы исходников, матекы и техническое задание.

- В результате была переписана вся верстка и стили. На сайте уже использовался jQuery и Bootstrap 5, поэтому адаптивность была реализована с использованием Bootstrap.
Части html-кода, повторяющиеся много раз (например меню) были вынесены в отдельные html-компоненты, которые можно легко править подключать на страницу.

- Сборка проекта осуществляется с помощью сборщика Gulp.
Производится подключение компоненотов в html файлы. И все js/css/html файлы минифицируются.
- Команда для сборки
> gulp build

- Команда для разработки
> gulp watch

- Перевод сайта был сделан с помощью npm библиотеки `i18n`
На страницы был добавлен селектор выбора языка. Все переводы храняться в json объекте и при смене языка не происходит перезагрузка страницы.
При первом заходе на сайт язык пользователя определяется автоматически исходя из места положения пользователя. По умолчанию устанавливается английский.
Пользователь может в любой момент сменить язык на другой, его выбор сохраниться.

- Также для удобства работы с переводами был написан отдельный скрипт на nodeJs, который позволит админу удобно добавлять и изменять переводы


- Сборка прод-версии 
> php -f create_prod.php
