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
            if ( !button ) { return }
            button.addEventListener('mouseenter', function () {
                homeSVG.style.fill = '#ffffff';
                hoverElem.style.opacity = '1';
            });
            button.addEventListener('mouseleave', function () {
                hoverElem.style.opacity = '0';
                homeSVG.style.fill = '#a0a09f';
            });
        }
    }
})();
buttonHomeAnimate.init();
// =================== SCROLL TO UP START ===========================================
// The function animate scroll to top of the page
// Анимация скролла вверх при нажатии кнопки UP
var scrollTop = (function() {
    return {
        'init' : function () {
            if (!document.querySelector('.user__footer__wrap__arrow')) { return };
            $(document).on('click', '.user__footer__wrap__arrow', function(e) {
                e.preventDefault();
                $("body,html").animate({
                    scrollTop:0
                }, 1200);
                return false;
            });
        }
    }
})();
scrollTop.init();
// =================== SCROLL TO UP END ===========================================