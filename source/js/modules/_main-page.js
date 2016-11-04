// =========== Main-page module ===========
// Этот модуль содержит в себе скрипты которые используються только на главной странице
// авторизованного пользователя (main-page)

var mainPageModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  //Общие переменные
  var $header = $('.header-main');
  var $footer = $('.footer');
  var headerBg = $header.attr('style');
  var footerBg = $footer.attr('style');
  // Шапка пользователя
  var $headerFront = $header.find('.header__section_main-front');
  var $userBlockFront = $headerFront.find('.user-block');
  // Окно редактирования
  var $headerEdit = $header.find('.header__section_main-back');
  var $headerEditAvatar = $header.find('.user-block__photo-edit');
  var $headerEdidBg = $headerEdit.find('.header__part--zip_main');
  var $headerEditData = $headerEdit.find('.user-block--edit');
  var $userBlockMain = $headerEditData.find('.user-block__main');
  var $formRow = $userBlockMain.find('.form__row');
  var $avatarEdit = $headerEditData.find('.user-block__photo');
  
  // Кнопки формы редактирования
  var fileUploadBg = $headerEdidBg.find('input[name="bg"]');
  var fileUploadAvtar = $headerEditAvatar.find('input[name="photo"]')
  var btnReset = $('#cancel_edit_header');
  var btnSave = $header.find('.btn--save');

  


	//======= Функции


  // Валидация изображения
	var validateImg = function(photo){
		var maxSize = 2 * 1024 * 1024;
		if(!photo.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
      return alert('Фотография должна быть в формате jpg, png или gif');
    }
		if(photo.size > maxSize){
			return alert("Фотография больше 2мб");
		}
	}

  // Показываем новый бекраунд, еще без отправки на сервер
  var previeUserBackGround = function(){
  	
  	var photo = $(this)[0].files[0];
  	validateImg(photo);

		var reader = new FileReader();
		reader.readAsDataURL(photo);
		
		reader.onload = (function (photo) {
      return function (e) {
          $header.removeAttr('style').attr('style','background-image : url('+ e.target.result +')')
          $footer.removeAttr('style').attr('style','background-image : url('+ e.target.result +')')
      }
      }) (photo);
  }

  // Показываем новую аватарку , еще без отправки на сервер
  var previeUserAvatar = function(){
    var photo = $(this)[0].files[0];
    validateImg(photo);

    var reader = new FileReader();
    reader.readAsDataURL(photo);

    reader.onload = (function (photo) {
    return function (e) {
         $avatarEdit.removeAttr('style').attr('style','background-image : url('+ e.target.result +')')
    }
    }) (photo);

   

  }

  // Скидываем бекарунт при отмене
  var resetUserData = function(){
  	$header.removeAttr('style').attr('style',headerBg);
  	$footer.removeAttr('style').attr('style',footerBg);
  }

  var setUserBackGround = function(){
    headerBg = $header.attr('style');
    footerBg = $footer.attr('style');
  }




  // Проуслушка
  var _setUplistner = function(){
  	fileUploadBg.on('change',previeUserBackGround);
    fileUploadAvtar.on('change',previeUserAvatar);
  	btnReset.on('click',resetUserData);
  }
  

  // Отправляем данные на сервер
  var _editUserData = function(){
  	
  	btnSave.on('click', function(e){
  		e.preventDefault();
      setUserBackGround();
  		var userName = $userBlockFront.find('.user-block__name');
  		var userAbout = $userBlockFront.find('.user-block__desc');
  		var inputName = $formRow.find('input[name = "name"]');
  		var inputAbout = $formRow.find('textarea[name = "desc"]');
  		var id = window.location.pathname;
  		var photo = fileUploadBg[0].files[0];

  		// Обновляем текстовые данные на странице(еще без базы)
  		userName.text(inputName.val());
  		userAbout.text(inputAbout.val());

  		
  		// Формируем ajax объект для отправки на сервер
  			var formData = new FormData();
  			formData.append("userBackGround",photo);
        formData.append("userName",inputName.val());
        formData.append("userAbout",inputAbout.val());


  			var xhr = new XMLHttpRequest;
        xhr.open('POST', id + 'editUserData/',true);
        xhr.send(formData);
        xhr.onreadystatechange = function() {
          if (xhr.readyState != 4) return;

          if (xhr.status == 200) {
            //alert("Пришел ответ от сервера")
          }

        }
  	})
  }
  // Прослушка событий

  return {
    init: function () {
    	_editUserData();
    	_setUplistner();
    },
    
  };
})();