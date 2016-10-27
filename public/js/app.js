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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuXHQkKCcucG9wdXBfX2xpbmtfcmVnaXN0cicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdCBcdGUucHJldmVudERlZmF1bHQoKTtcclxuIFx0XHQkKCcuZmxpcHBlci1jb250YWluZXInKS5hZGRDbGFzcygnZmxpcHAnKTtcclxuIFx0fSk7XHJcblxyXG5cclxuXHQkKCcucG9wdXBfX2xpbmtfZW50ZXInKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHQgXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbiBcdFx0JCgnLmZsaXBwZXItY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2ZsaXBwJyk7XHJcbiB9KTtcclxuXHJcbi8vINCf0L7QttCw0LvRg9C50YHRgtCwINCw0LTQsNC/0YLQuNGA0YPQudGC0LUg0Y3RgtGDINGE0YPQvdC60YbQuNGOINC/0L7QtCDQv9Cw0YLRgtC10YDQvSDQvNC+0LTRg9C70YwuXHJcbi8vINCc0L7QttC10YLQtSDQvdC1INC/0LjRgdCw0YLRjCBhamF4INC30LDQv9GA0L7RgdGLINCyINGB0LLQvtC40YUg0YHQutGA0LjQv9GC0LDRhSwg0L/RgNC+0YHRgtC+INC/0L7RgdGC0LDQstGM0YLQtSDQutC+0LzQvNC10L3RgtGA0LDQuSDRgtCw0LwsXHJcbi8vINCz0LTQtSDQsdGD0LTRg9GCINC+0YLQv9GA0LDQstC60LAg0L3QsCDRgdC10YDQstC10YAuXHJcbi8vINCf0YDQuNC80LXRgDpcclxuXHJcbi8qIFx0JGJ1dHRvbi5vbignY2xpY2snICwgZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0Ly8g0J7RgtC/0YDQsNCy0LrQsCDQvdCwINGB0LXRgNCy0LXRgCBcclxuXHRcdH0pXHJcblxyXG4qL1xyXG5cclxuLy8g0JLRgdC1IGFqYXgg0LfQsNC/0YDQvtGB0Ysg0Y8g0LHQtdGA0YMg0L3QsCDRgdC10LHRjywg0YfRgtC+0LHRiyDQvdC1INCx0YvQu9C+INC/0YPRgtCw0L3QuNGG0YsuXHJcbi8vINCa0L7QvNC80LXQvdGC0LDRgNC40Lgg0YHQvNC10LvQviDRg9C00LDQu9GP0LnRgtC1LiBcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHR2YXIgcmVnQWpheCA9IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgJGZvcm0gPSAkKFwiLnBvcHVwX19mb3JtLXJlZ2lzdHJhdGlvblwiKTtcclxuXHRcdHZhciAkYnV0dG9uID0gJGZvcm0uZmluZCgnLnBvcHVwX19zdWJtaXQnKTtcclxuXHJcblx0XHQkYnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFxyXG5cdFx0XHQkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdCR0aGlzRm9ybSA9ICR0aGlzLmNsb3Nlc3QoJy5wb3B1cF9fZm9ybS1yZWdpc3RyYXRpb24nKTtcclxuXHRcdFx0JGlucHV0c1dyYXAgPSAkdGhpc0Zvcm0uZmluZCgnLnBvcHVwX19pbnB1dC1jb250YWluZXInKTtcclxuXHRcdFx0JHVzZXIgPSAkaW5wdXRzV3JhcC5maW5kKCdpbnB1dFtuYW1lPXVzZXJdJyk7XHJcblx0XHRcdCRtYWlsID0gJGlucHV0c1dyYXAuZmluZCgnaW5wdXRbbmFtZT1tYWlsXScpO1xyXG5cdFx0XHQkcGFzc3dvcmQgPSAkaW5wdXRzV3JhcC5maW5kKCdpbnB1dFtuYW1lPXBhc3N3b3JkXScpO1xyXG5cdFx0XHQkaW5wdXRzID0gJGlucHV0c1dyYXAuZmluZCgnaW5wdXQnKTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBzZW5kT2JnID0ge1xyXG5cdFx0XHRcdGxvZ2luIDogJHVzZXIudmFsKCksXHJcblx0XHRcdFx0ZW1haWwgOiAkbWFpbC52YWwoKSxcclxuXHRcdFx0XHRwYXNzIDogJHBhc3N3b3JkLnZhbCgpXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0XHR4aHIub3BlbignUE9TVCcsICcvcmVnLycpO1xyXG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LXR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJyk7XHJcblx0XHRcdFx0eGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoc2VuZE9iZykpO1xyXG5cdCAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHQgICAgICBcdGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblx0ICAgICAgXHRpZiAoeGhyLnN0YXR1cyA9PSAyMDApe1xyXG5cdCAgICAgIFx0XHR2YXIgbWVzc2FnZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkubWVzc2FnZTtcclxuXHQgICAgICBcdFx0dmFyIHN0YXR1cyA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkuc3RhdHVzO1xyXG5cclxuXHQgICAgICBcdFx0aWYoIXN0YXR1cyl7XHJcblx0ICAgICAgXHRcdFx0JGlucHV0cy52YWwoJycpO1xyXG5cdCAgICAgIFx0XHR9XHJcblx0ICAgICAgXHRcdC8vINCS0LzQtdGB0YLQviBhbGVydCDQvNC+0LbQvdC+INC/0L7RgdGC0LDQstC40YLRjCDRhNGD0L3QutGG0LjRjiDQstGL0LfQvtCy0LAgcG9wINC+0LrQvdCwLlxyXG5cdCAgICAgIFx0XHRhbGVydChtZXNzYWdlKTtcclxuXHJcblx0ICAgICAgfVxyXG5cdCAgICAgfVxyXG5cclxuXHRcdH0pXHJcblxyXG5cdH1cclxuXHJcblx0cmVnQWpheCgpO1xyXG5cdFxyXG5cclxuXHJcblxyXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
