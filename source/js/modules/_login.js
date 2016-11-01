// =========== Login module ===========
// Этот модуль содержит в себе все что связанно с формой авторизации и регистрации.


var loginModule = (function() {

	// Глобальные переменные модуля.
  var base = new BaseModule;
  
  var toSendRequest = function(){
  	var $form = $('.popup__form');
  	var $formLogin = $form.filter('.popup__form-login');
  	var $formReg = $form.filter('.popup__form-registration');
  	var $formRecover = $form.filter('.popup__form-recover');
    var $formAddAlbum = $form.filter('.popup__form-add-album');
  	var button = 'input[type = submit]';
  	var popupTime = 5000;

    // Отправляем ajax на addalbum
    $formAddAlbum.find(button).on('click', function(e){
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
        servAns = base.ajax($thisForm,'/album/add/');
        servAns.done(function(ans){
          if(!ans.status){
            base.showError(ans.message,$errorContainer, popupTime);
          }else{
            window.location.reload(true);
          }
        });
      }

    })

  	// Отправляем ajax на login
  	$formLogin.find(button).on('click', function(e){
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
	  			servAns = base.ajax($thisForm,'/login/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					window.location.reload(true);
	  				}
	  			});
	  		}
  		
  	})

  	// Отправляем ajax на reg
  	$formReg.find(button).on('click', function(e){
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
	  			servAns = base.ajax($thisForm,'/reg/');
	  			servAns.done(function(ans){
	  				if(!ans.status){
	  					base.showError(ans.message,$errorContainer, popupTime);
	  				}else{
	  					window.location.reload(true);
	  				}
	  			});
	  		}
  		
  	})

  	// Отправляем ajax на recover

  	$formRecover.find(button).on('click', function(e){
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
  		
  	})

  }

 

  var popupWindowAnimate = function(){
  	// анимация popup
		// при нажатии на "зарегистрироваться"
		var flipp 	= 'flipp';
		var hide 		= 'hide';
		var $flipContainer = $('.flipper-container');
		var $backPass = $('.back-pass');
		var $backReg = $('.back-reg');

		$('.popup__link_registr').click(function(e){
			e.preventDefault();
			$backPass.addClass(hide);
			$backReg.removeClass(hide);
		 	$flipContainer.addClass(flipp);
	 });


		// при нажатии на "войти"
		$('.popup__link_enter').click(function(e){
		 	e.preventDefault();
	 		$flipContainer.removeClass(flipp);
	 });


		// при нажатии на "забыли пароль"
		$('.popup__link_forget-pass').click(function(e){
			e.preventDefault();
			$backPass.removeClass(hide);
			$backReg.addClass(hide);
		 	$flipContainer.addClass(flipp);
	 });
  };


 



  return {
      init: function () {
      	popupWindowAnimate();
      	toSendRequest();
      }

  };
})();