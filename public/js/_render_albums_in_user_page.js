// =================== DOWNLOAD ALBUMS TITLE IMG -USER PAGE- START ============================
// The function download the img from server for title photo
// Загрузка обложек альбомов с сервера

var downloadIMGUserPage = (function () {
    if (!document.querySelector('.user__main__albums')) { return };
    let listOfImg = [
        {
            'title': 'Поход в горы',
            'src': '../img/user/user_mountain.png',
            'comment': 'Фотографии гор и солнца',
            'countPhoto': '10 фотографий'
        },
        {
            'title': 'Животные',
            'src': '../img/user/user_dog.png',
            'comment': 'Фотографии животных и собаки',
            'countPhoto': '11 фотографий'
        },
        {
            'title': 'Прогулки на лодке',
            'src': '../img/user/user_boat.png',
            'comment': 'Фотографии лодок, озер и природы',
            'countPhoto': '12 фотографий'
        },
        {
            'title': 'Море и серфинг',
            'src': '../img/user/user_sea.png',
            'comment': 'Фотогарфии моря, серфинга и волн',
            'countPhoto': '13 фотографий'
        },
        {
            'title': 'Ущелья и горные хребты',
            'src': '../img/user/user_caves.png',
            'comment': 'Ущелья, горы и пещеры',
            'countPhoto': '14 фотографий'
        },
        {
            'title': 'Лесной выезд',
            'src': '../img/user/user_forest.png',
            'comment': 'Фотографии природы, леса, енотов и оленей',
            'countPhoto': '15 фотографий'
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
                let comment = `<p class="user__main__albums__item__hover__comment">${listOfImg[i].comment}</p>`;
                let count = `<p class="user__main__albums__item__hover__count">${listOfImg[i].countPhoto}</p>`;
                //Create container for Img and title
                //Создание конейтнера для обложки и наименования
                let div = document.createElement('div');
                div.classList.add('user__main__albums__item');
                document.querySelector('.user__main__albums').appendChild(div);
                //Create div for hover effect
                //Создание и вставка hover эффекта
                let hover = document.createElement('div');
                hover.classList.add('user__main__albums__item__hover');
                hover.innerHTML = `${comment}${count}`;
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

                div.appendChild(title);
                div.appendChild(hover);
                div.appendChild(img);

            }
        }
    }
})();
downloadIMGUserPage.init();
// =================== DOWNLOAD ALBUMS TITLE IMG -USER PAGE- END ==============================