"use strict";
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
