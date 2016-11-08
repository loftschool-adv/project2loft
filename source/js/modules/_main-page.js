// =========== Main-page module ===========
// Этот модуль содержит в себе скрипты которые используються только на главной странице
// авторизованного пользователя (main-page)

var mainPageModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  //Общие переменные
 


  var $header = $('.header-main');
  var $footer = $('.footer');
  var headerBg = $('.header-main').attr('style');
  var footerBg = $('.footer').attr('style');


  var $headerFront = $header.find('.header__section_main-front');
  var $headrBack = $header.find('.header__section_main-back');

  var $avatarFront = $headerFront.find('.user-block__photo');
  var $avatarBack = $headrBack.find('.user-block__photo');
  var avatarFrontVal = $avatarFront.attr('style');
  var avatarBackVal = $avatarBack.attr('style');


  var $userBlockFront = $headerFront.find('.user-block');
  // Окно редактирования
  var $headerEdit = $header.find('.header__section_main-back');
  var $headerEditAvatar = $header.find('.user-block__photo-edit');
  var $headerEdidBg = $headerEdit.find('.header__part--zip_main');
  var $headerEditData = $headerEdit.find('.user-block--edit');
  var $userBlockMain = $headerEditData.find('.user-block__main');
  var $formRow = $userBlockMain.find('.form__row');
  var $avatarEdit = $headerEditData.find('.user-block__photo');
  var avatarBg = $avatarEdit.attr('style');
  var frontAvatar = $headerFront.find('.user-block__photo');
  var frontAvatarBg = frontAvatar.attr('style');
  
  // Кнопки формы редактирования
  var fileUploadBg = $headerEdidBg.find('input[name="bg"]');
  var fileUploadAvtar = $headerEditAvatar.find('input[name="photo"]')
  var btnReset = $('#cancel_edit_header');
  var btnSave = $header.find('.btn--save');





  // Валидация изображения(Перенести в base)
	var validateImg = function(photo){
		var maxSize = 2 * 1024 * 1024;
    var flag = true;
		if(!photo.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
      flag = false;

      return alert('Фотография должна быть в формате jpg, png или gif');
    }
		if(photo.size > maxSize){
      flag = false;
			return alert("Фотография больше 2мб");
		}
    return flag;
	}

  // Показываем новый бекраунд, еще без отправки на сервер
  var previeUserBackGround = function(){
  	
  	var photo = $(this)[0].files[0];
  	if(!validateImg(photo)){
      return
    }

		var reader = new FileReader();
		reader.readAsDataURL(photo);
		
		reader.onload = (function (photo) {
      return function (e) {
          $header.removeAttr('style').attr('style','background-image : url('+ e.target.result +')')
          $footer.removeAttr('style').attr('style','background-image : url('+ e.target.result +')')
      }
      }) (photo);
  };

  // Показываем новую аватарку , еще без отправки на сервер
  var previeUserAvatar = function(){
    var photo = $(this)[0].files[0];
    if(!validateImg(photo)){
      return
    }

    var reader = new FileReader();
    reader.readAsDataURL(photo);

    reader.onload = (function (photo) {
    return function (e) {
      $avatarFront.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
      $avatarBack.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
    }
    }) (photo);

   

  };

  // Скидываем параметры при отмене
  var resetUserData = function(){
  	$header.removeAttr('style').attr('style',headerBg);
  	$footer.removeAttr('style').attr('style',footerBg);
    $avatarFront.removeAttr('style').attr('style',avatarFrontVal);
    $avatarBack.removeAttr('style').attr('style',avatarBackVal);

  };

  // Получаем новый бекраунд
  var setUserBackGround = function(){
    headerBg = $header.attr('style');
    footerBg = $footer.attr('style');
  }

  var setAvatar = function(){
    avatarBg = $avatarEdit.attr('style');
    frontAvatar = $avatarEdit.attr('style');
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
      setAvatar();
  		var userName = $userBlockFront.find('.user-block__name');
  		var userAbout = $userBlockFront.find('.user-block__desc');
  		var inputName = $formRow.find('input[name = "name"]');
  		var inputAbout = $formRow.find('textarea[name = "desc"]');
  		var id = window.location.pathname;
  		var photo = fileUploadBg[0].files[0];
      var avatar = fileUploadAvtar[0].files[0];


  		// Обновляем текстовые данные на странице(еще без базы)
  		userName.text(inputName.val());
  		userAbout.text(inputAbout.val());

  		
  		// Формируем ajax объект для отправки на сервер
  			var formData = new FormData();
        formData.append("userAvatar",avatar);
  			formData.append("userBackGround",photo);
        formData.append("userName",inputName.val());
        formData.append("userAbout",inputAbout.val());


  			var xhr = new XMLHttpRequest;
        xhr.open('POST', id + 'editUserData/',true);
        xhr.send(formData);
        xhr.onreadystatechange = function() {
          if (xhr.readyState != 4) return;

          if (xhr.status == 200) {
            //$avatarFront.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
            //$avatarBack.removeAttr('style').attr('style','background-image : url('+ e.target.result +')');
            //alert("Пришел ответ от сервера")
          }

        }
  	})
  }
  // Прослушка событий

  return {
    init: function () {
    	//_editUserData();
    	//_setUplistner();
    },
    
  };
})();