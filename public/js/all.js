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

// =================== DOWNLOAD ALBUMS TITLE IMG -USER PAGE- START ============================
// The function download the img from server for title photo
// Загрузка обложек альбомов с сервера

var downloadIMGUserPage = (function () {
    if (!document.querySelector('.user__main__albums')) { return };
    let listOfImg = [
        {
            'title': 'Поход в горы',
            'src': '../img/user/user_mountain.png'
        },
        {
            'title': 'Животные',
            'src': '../img/user/user_dog.png'
        },
        {
            'title': 'Прогулки на лодке',
            'src': '../img/user/user_boat.png'
        },
        {
            'title': 'Море и серфинг',
            'src': '../img/user/user_sea.png'
        },
        {
            'title': 'Ущелья и горные хребты',
            'src': '../img/user/user_caves.png'
        },
        {
            'title': 'Лесной выезд',
            'src': '../img/user/user_forest.png'
        }
    ]
    return {
        'init': function () {
            // downloadIMGUserPage.ajax();
            downloadIMGUserPage.renderPage();

        },
        'ajax': function () {
            let xhr = XMLHttpRequest();
            xhr.open('GET', '/getTitleImg');
            xhr.send();
        },
        'renderPage': function () {
            for(let i = 0; i <listOfImg.length; i++) {
                //Create container for Img and title
                //Создание конейтнера для обложки и наименования
                let div = document.createElement('div');
                div.classList.add('user__main__albums__item');
                document.querySelector('.user__main__albums').appendChild(div);
                //Create Img
                //Создание обложки
                let img = new Image;
                img.src = listOfImg[i].src;
                img.classList.add('user__main__albums__item__img');
                //Create Title
                //Создание наименования для альбомов
                let title = document.createElement('div');
                title.classList.add('user__main__albums__item__name');
                title.innerHTML = listOfImg[i].title;
                div.appendChild(img);
                div.appendChild(title);
            }
        }
    }
})();
downloadIMGUserPage.init();
// =================== DOWNLOAD ALBUMS TITLE IMG -USER PAGE- END ==============================
