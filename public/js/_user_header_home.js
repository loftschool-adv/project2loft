// =================== USER HEADER BUTTON HOME START===========================================
// The function change the form and the color of background if the mouse over upon the button Home at User page
// Анимация конпки Домой на странице user
"use strict";
var buttonHomeAnimate = (function () {
    let button = document.querySelector('.user__header__top__button-home');
    let hoverElem = document.querySelector('.user__header__top__button-home__hover');
    let homeSVG = document.querySelector('.user__header__top__button-home__inner__path');
    return {
        'init': function () {
            button.addEventListener('mouseenter', function (e) {
                homeSVG.style.fill = '#ffffff';
                hoverElem.style.opacity = '1';
            });
            button.addEventListener('mouseleave', function (e) {
                hoverElem.style.opacity = '0';
                homeSVG.style.fill = '#a0a09f';
            });
        }
    }
})();
buttonHomeAnimate.init();
// =================== USER HEADER BUTTON HOME END===========================================
