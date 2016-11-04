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
  var $headerEdidBg = $headerEdit.find('.header__part--zip_main');
  var $headerEditData = $headerEdit.find('.user-block--edit');
  var $userBlockMain = $headerEditData.find('.user-block__main');
  var $formRow = $userBlockMain.find('.form__row');
  
  // Кнопки формы редактирования
  var fileUpload = $headerEdidBg.find('input[name="bg"]');
  var btnReset = $('#cancel_edit_header');


	//======= Функции

	var validateImg = function(photo){
		var maxSize = 2 * 1024 * 1024;
		if(!photo.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
      return alert('Фотография должна быть в формате jpg, png или gif');
    }
		if(photo.size > maxSize){
			return alert("Фотография больше 2мб");
		}
	}

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

  var resetUserData = function(){
  	$header.removeAttr('style').attr('style',headerBg);
  	$footer.removeAttr('style').attr('style',footerBg);
  }


  var _setUplistner = function(){
  	fileUpload.on('change',previeUserBackGround);
  	btnReset.on('click',resetUserData);
  }
  

  var _editUserData = function(){
  	var $buttonSave = $header.find('.btn--save');
  	$buttonSave.on('click', function(e){
  		e.preventDefault();

  		var userName = $userBlockFront.find('.user-block__name');
  		var userAbout = $userBlockFront.find('.user-block__desc');
  		var inputName = $formRow.find('input[name = "name"]');
  		var inputAbout = $formRow.find('textarea[name = "desc"]');
  		var id = window.location.pathname;
  		var photo = fileUpload[0].files[0];

  		// Обновляем данные на странице(еще без базы)
  		userName.text(inputName.val());
  		userAbout.text(inputAbout.val());

  		
  		// Формируем ajax объект для отправки на сервер
  			var formData = new FormData();
  			formData.append("userBackGround",photo)
        formData.append("userName",inputName.val());
        formData.append("userAbout",inputAbout.val());
  			/*var objUserData = {
  				name: inputName.val(),
  				about: inputAbout.val()
  			}*/

  			var xhr = new XMLHttpRequest;
        xhr.open('POST', id + 'editUserData/',true);
        xhr.send(formData);
        xhr.onreadystatechange = function() {
          if (xhr.readyState != 4) return;

          if (xhr.status == 200) {
            //alert("Пришел ответ от сервера")
          }

        }


  			
  			//base.ajaxDataObj(objUserData,id + 'editUserData/');
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