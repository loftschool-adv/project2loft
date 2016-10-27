(function(){


	$('.popup__link_registr').click(function(e){
	 	e.preventDefault();
 		$('.flipper-container').addClass('flipp');
 	});


	$('.popup__link_enter').click(function(e){
	 	e.preventDefault();
 		$('.flipper-container').removeClass('flipp');
 });

// Пожалуйста адаптируйте эту функцию под паттерн модуль.
// Можете не писать ajax запросы в своих скриптах, просто поставьте комментрай там,
// где будут отправка на сервер.
// Пример:

/* 	$button.on('click' , function(e){
			e.preventDefault();
			// Отправка на сервер 
		})

*/

// Все ajax запросы я беру на себя, чтобы не было путаницы.
// Комментарии смело удаляйте. 






	var regAjax = function(){
		var $form = $(".popup__form-registration");
		var $button = $form.find('.popup__submit');

		$button.on('click', function(e){
			e.preventDefault();
			
			$this = $(this);
			$thisForm = $this.closest('.popup__form-registration');
			$inputsWrap = $thisForm.find('.popup__input-container');
			$user = $inputsWrap.find('input[name=user]');
			$mail = $inputsWrap.find('input[name=mail]');
			$password = $inputsWrap.find('input[name=password]');
			$inputs = $inputsWrap.find('input');
			
			var sendObg = {
				login : $user.val(),
				email : $mail.val(),
				pass : $password.val()
			}

			var xhr = new XMLHttpRequest();
				xhr.open('POST', '/reg/');
				xhr.setRequestHeader('Content-type','application/json');
				xhr.send(JSON.stringify(sendObg));
	      xhr.onreadystatechange = function() {
	      	if (xhr.readyState != 4) return;
	      	if (xhr.status == 200){
	      		var message = JSON.parse(xhr.responseText).message;
	      		var status = JSON.parse(xhr.responseText).status;

	      		if(!status){
	      			$inputs.val('');
	      		}
	      		// Вместо alert можно поставить функцию вызова pop окна.
	      		alert(message);

	      }
	     }

		})

	}

	regAjax();
	



})();