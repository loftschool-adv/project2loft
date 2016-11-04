// =========== Main-page module ===========
// Этот модуль содержит в себе скрипты которые используються только на главной странице
// авторизованного пользователя (main-page)

var mainPageModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  //Общие переменные
  var $header = $('.header-main');
  // Шапка пользователя
  var $headerFront = $header.find('.header__section_main-front');
  var $userBlockFront = $headerFront.find('.user-block');
  // Окно редактирования
  var $headerEdit = $header.find('.header__section_main-back');
  var $headerEdidBg = $headerEdit.find('.header__part--zip_main');
  var $headerEditData = $headerEdit.find('.user-block--edit');
  var $userBlockMain = $headerEditData.find('.user-block__main');
  var $formRow = $userBlockMain.find('.form__row');
  

  var _editUserData = function(){
  	var $buttonSave = $header.find('.btn--save');
  	$buttonSave.on('click', function(e){
  		e.preventDefault();

  		var userName = $userBlockFront.find('.user-block__name');
  		var userAbout = $userBlockFront.find('.user-block__desc');
  		var inputName = $formRow.find('input[name = "name"]');
  		var inputAbout = $formRow.find('textarea[name = "desc"]');

  		// Обновляем данные на странице(еще без базы)
  		userName.text(inputName.val());
  		userAbout.text(inputAbout.val());

  		
  			
  		// Формируем ajax объект для отправки на сервер
  			var objUserData = {
  				name: inputName.val(),
  				about: inputAbout.val()
  			}
  			var site = window.location.protocol+ '//' + window.location.host + '/';
  			var id = window.location.pathname;
  			base.ajaxDataObj(objUserData,id + 'editUserData/')
  	})
  }
  // Прослушка событий

  return {
    init: function () {
    	_editUserData();
    },
    
  };
})();