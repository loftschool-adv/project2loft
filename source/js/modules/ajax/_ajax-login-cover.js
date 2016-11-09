// =========== ajax-Login-cover module ===========
// Этот модуль содержит в себе анимацию для блока авторизаци.


var ajaxLoginCoverModule = (function() {

	// Глобальные переменные модуля.
  var base = new BaseModule;
  // Переменные 
  var $form = $('.popup__form');
	var $formLogin = $form.filter('.popup__form-login');
	var $formReg = $form.filter('.popup__form-registration');
	var $formRecover = $form.filter('.popup__form-recover');
	var button = 'input[type = submit]';
	var popupTime = 5000;

	// Кнопки

	var loginBtn = $formLogin.find(button);
	var regBtn = $formReg.find(button);
	var recoverBtn = $formRecover.find(button);



	 	// Отправляем ajax на login
	var login = function(e){
		e.preventDefault();
		var $thisForm = $(this).closest('form');
		var $errorContainer = $thisForm.find('.popup__error');
		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
			if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
  			errorArray.forEach(function(index){
  				base.showError(index,$errorContainer, popupTime);
  			});
  			}else{ // Если массив пустой, выполняем дальше
  			servAns = base.ajax($thisForm,'/login/');
  			servAns.done(function(ans){
  				if(!ans.status){
  					base.showError(ans.message,$errorContainer, popupTime);
  				}else{
  					window.location.reload(true);
  				}
  			});
  		}
  }

  // Отправляем ajax на reg

  var registration = function(e){
		e.preventDefault();
		var $thisForm = $(this).closest('form');
		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
		var $errorContainer = $thisForm.find('.popup__error');
		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
			errorArray.forEach(function(index){
				base.showError(index,$errorContainer, popupTime);
			});
		}else{ // Если массив пустой, выполняем дальше
			servAns = base.ajax($thisForm,'/reg/');
			servAns.done(function(ans){
				if(!ans.status){
					base.showError(ans.message,$errorContainer, popupTime);
				}else{
					window.location.reload(true);
				}
			});
		}
  }

  // Отправляем ajax на recover

  var recover = function(e){
  	e.preventDefault();
	  		var $thisForm = $(this).closest('form');
	  		// Параметры для popup
	  		var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
	  		var $errorContainer = $thisForm.find('.popup__error');
	  		if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
	  			errorArray.forEach(function(index){
	  				base.showError(index,$errorContainer, popupTime);
	  			});
	  		}else{ // Если массив пустой, выполняем дальше
	  			servAns = base.ajax($thisForm,'/recover/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					return base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					base.clearInputs($thisForm);
	  					return base.showError(ans.message,$errorContainer, popupTime);
	  					
	  				}
	  			});
	  		}
  }

  	

  	
  		



 
  var _setUpListners = function(){
  	loginBtn.on('click',login);
  	regBtn.on('click',registration);
  	recoverBtn.on('click',recover)
  }
 



  return {
      init: function () {
      	_setUpListners();
      }

  };
})();