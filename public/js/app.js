// создать подключение
var socket = new WebSocket("ws://85.143.214.16:4001");

// // отправить сообщение из формы publish
// document.forms.publish.onsubmit = function() {
// 	var outgoingMessage = this.message.value;
//
// 	socket.send(outgoingMessage);
// 	return false;
// };

// обработчик входящих сообщений
socket.onmessage = function(event) {

	var src = event.data;
	//src =String(src).replace(/\\/g, "/");
	//src = src.substr(6);
	console.log(src);

	// var li = $('<li/>').addClass('img-item').appendTo($('ul#img-list'));
	// var ImgCont = $('<div/>').addClass('img-cont').appendTo(li);
	// var image =$('<img>', {
	// 	src: '/'+src});

	// Когда картинка загрузится, ставим её на фон
	// image.on("load", function(){
	// 	ImgCont.css('background-image', 'url("/'+src+'")');
	// });
	// $('.modal__load-img').hide();

	// var incomingMessage = event.data;
	// showMessage(incomingMessage);
};

// // показать сообщение в div#subscribe
// function showMessage(message) {
// 	var messageElem = document.createElement('div');
// 	messageElem.appendChild(document.createTextNode(message));
// 	document.getElementById('subscribe').appendChild(messageElem);
// }

// var socket = io.connect();
//
// socket.on('eventClient', function (data) {
//
// 	var src = data.thumb;
// 	src =String(src).replace(/\\/g, "/");
// 	src = src.substr(6);
// 	console.log(src);
//
// 	var li = $('<li/>').addClass('img-item').appendTo($('ul#img-list'));
// 	var ImgCont = $('<div/>').addClass('img-cont').appendTo(li);
// 	var image =$('<img>', {
// 		src: '/'+src});
//
// 	// Когда картинка загрузится, ставим её на фон
// 	image.on("load", function(){
// 		ImgCont.css('background-image', 'url("/'+src+'")');
// 	});
// 	$('.modal__load-img').hide();
//
// });
// socket.emit('eventServer', {data: 'Hello Server'});

// =========== Base module ===========

var BaseModule = function(){

	//====== Объекты,массивы ======
	this.errors = {
  	0 : 'Заполнены не все поля',
  	1 : 'Введите корректный e-mail',
  	2	: 'Длина пароля меньше 8 символов',
  	3 : 'Выберите обложку'
  };

  this.RegPatterns = {
  	email : /^([0-9a-zA-Z_-]+\.)*[0-9a-zA-Z_-]+@[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*\.[a-z]{2,6}$/,
  };

  this.global = {};




  //====== Функции ======


	this.ajaxData = function(form,_type){
		var elem = form.find('input[type != submit],textarea');
		var data = {};
		$.each(elem, function(){
				data[$(this).attr('name')] = $(this).val();
		})
		var format = _type || JSON.stringify(data)
		return format;
	};

	this.ajax = function(form, url, _method){
			var method = _method || 'POST';
			var data = this.ajaxData(form);
			return $.ajax({
				url: url,
				type: method,
				contentType: 'application/json',
				data: data
			});
	}

	this.ajaxDataObj = function(obj,url,method){
		method = method || 'POST'
		var data = JSON.stringify(obj);
		return $.ajax({
			url: url,
			type: method,
			contentType: 'application/json',
			data: data
		});
	}

	this.showError = function(errorIndex,elem,_ms){
		var thisFrom = elem.closest('form');
		var time = _ms || 2000;
		if(typeof(errorIndex) == 'string'){
			elem.text(errorIndex)
		}else{
			elem.text(this.errors[errorIndex]);
		}
		if(thisFrom.find(elem).is(':visible')){
			clearTimeout(this.global.timer);
			this.global.timer = setTimeout(function(){
				elem.text();
				elem.removeClass('show').addClass('hide');
			}, time);
			return;
		}

		
		elem.removeClass('hide').addClass('show');


		this.global.timer = setTimeout(function(){
			elem.text();
			elem.removeClass('show').addClass('hide');
		}, time);

	}

	this.hideError = function(elem){
		elem.removeClass('show').addClass('hide');
	}

	this.validEmail = function(input, patter){
		return patter.test(input.val());
	};

	this.validPass = function(input,length){
		var len = length || 8;
		if(!(input.val().length < len)){
			return true;
		}
	};

	this.validFiles = function(input,length){
		var len = length || 0;
		if(!(input[0].files.length <= len)){
			return true;
		};
	}
	
	this.validateForm = function(form) {
		var thisModule = this;
		var pattern = thisModule.RegPatterns.email;
		var $thisForm = form;
		var elements = $thisForm.find('textarea,input:not(input[type="submit"])');
		var errors = thisModule.errors;
		var output = [];

		$.each(elements, function(){
			if(!$(this).val() && $(this).attr('type') != 'file'){
					output[0] = 0;
			}
		});

		if(output.length == 0){
			$.each(elements, function(){
				var $this = $(this);
				var type = $this.attr('type');
				var nameAttr = $this.attr('name');
				switch(type){
					case 'password' :
						if(!thisModule.validPass($this)){
							output.push(2);
						}
						break;
					case 'email' :
						if(!thisModule.validEmail($this,pattern)){
							output.push(1);
						}
						break;
				};
				switch(nameAttr){
					case 'addAlbumCover' :
						if(!thisModule.validFiles($this)){
							output.push(3);
						}
						break;
				};
			})
		};

		return output;
	};

	this.clearInputs = function(form){
		var elem = form.find('input[type != submit],textarea');
		elem.val('');
	}

	this.scrollToPosition = function(position, duration){
  	var position = position || 0;
		var duration = duration || 1000;


		$("body, html").animate({
				scrollTop: position
		}, duration)
  };

  this.changeClass = function(parent,className,type){
  	if(typeof(parent) == 'string'){
  		var parent = $(parent);
  	}
  	switch(type){
  		case 'add':
  			parent.addClass(className);
  			break;
  		case 'del':
  			parent.removeClass(className);
  			break;

  	}
  };

	

}
// =========== Common module ===========
// Этот модуль содержит в себе общие скрипты, присущие всем страницам сайта.

var commonModule = (function() {

	// Объявление библиотеки
  var base = new BaseModule;



// Прокрутить страницу до ...
	var scrollTo = function(e){
		e.preventDefault();

		var btn        = $(this);
		var target     = btn.attr('data-go');
		var container  = null;

		if (target == 'top') {
			base.scrollToPosition();
		}
	}


// Сворачивание блока с комментариями
	var commentsToggle = function(e){
		e.preventDefault();

		var btn       = $(this);
		var container = btn.closest('.comments');
		var comments  = container.find('.comments__list');

		if(container.hasClass('comments--show')) {
			container.removeClass('comments--show');
			comments.slideUp();
		} else {
			container.addClass('comments--show');
			comments.slideDown();
		}
	}


	// drop - элемент с выпадающим блоком
	var addDrop = function(e) {
		e.preventDefault();

		var trigger     = $(this);
		var container   = trigger.closest('.drop');
		var content     = container.find('.drop__main');
		var classActive = 'drop--open';

		if(container.hasClass('drop--hover')) return;

		container.toggleClass( classActive );
	};


	// Кастомный вид для загрузки файлов
	// Пожалуйста, исправьте эту функцию, не понятно где она используеться и нужно вытащить on click в _setUplistner
	var fileUpload = function(){
		var el = $('.upload');

		if(el.length === 0) return;

		$(document).on('click', '.upload', function(e) {
			var el    = $(this);
			var input = el.children('[type=file]');

			input[0].click();
		});
	}


	// Разлогин пользователя
	// Нужно доработать
	var logoutUser = function(){
		var obj = {
			req: "logout"
		}
		var data = JSON.stringify(obj);

			var xhr = new XMLHttpRequest;
			var id = window.location.pathname;
			xhr.open('POST', id + 'logout/',true);
			xhr.setRequestHeader('Content-type','application/json');
			xhr.send(data);
			xhr.onreadystatechange = function() {
				if (xhr.readyState != 4) return;
				// Перезагрузка страницы
				if(JSON.parse(xhr.responseText).status == "logout"){
					//window.location.reload(true);
					var site = window.location.protocol+ '//' + window.location.host + '/';
					console.log(window.location.pathname);
					window.location.href = site;
				}
			}
}

	var editUserData = function(){
		console.log(12);
	}



	// Прослушка
	var _setUpListners = function() {
			$(document).on('click', '.comments__toggle' , commentsToggle);
			$(document).on('click', '[data-go]' , scrollTo);
			$(document).on('click', '.drop__trigger', addDrop);
			$('.logout').on('click', logoutUser)
	};




  return {
    init: function () {
    	_setUpListners();
    }

  };
})();
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
  	var button = 'input[type = submit]';
  	var popupTime = 5000;

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
//Обрабатывем DragEndDrops
var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
}();
// Читаем разметку и сохраняем форму
var $form = $('#upload');
var $input = $('#file');
var $save = $('#save');

// Если чтото закинули добавляем класс
if (isAdvancedUpload) {

  var droppedFiles = false;

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  })
    .on('dragover dragenter', function() {
      $form.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
      $form.removeClass('is-dragover');
    })
    .on('drop', function(e) {
      droppedFiles = e.originalEvent.dataTransfer.files;
      console.log(droppedFiles);
      $form.trigger('submit');
    });

  $input.on('change', function(e) { // drag & drop НЕ поддерживается
    $form.trigger('submit');
  });

  /////////////////


}


// Ручная отправка
$form.on('submit', function(e) {
  if ($form.hasClass('is-uploading')) return false;

  //alert('Отправляем');

  $form.addClass('is-uploading').removeClass('is-error');

  if (isAdvancedUpload) {
    e.preventDefault();

    var ajaxData = new FormData($form.get(0));

    if (droppedFiles) {
      $.each( droppedFiles, function(i, file) {

        ajaxData.append( $input.attr('name'), file );

      });
    }

    $.ajax({
      url: location.href + '/addImg/',
      type: $form.attr('method'),
      data: ajaxData,
      dataType: 'json',
      cache: false,
      contentType: false,
      processData: false,
      complete: function(ans) {
        $form.removeClass('is-uploading');
        console.log(ans.responseText);

      //socket.emit('eventServer', {data: 'Hello Server'});
      },
      success: function(data) {

        $form.addClass( data.success == true ? 'is-success' : 'is-error' );

        if (!data.success) $errorMsg.text(data.error);
      },
      error: function() {
        // Log the error, show an alert, whatever works for you
      }
    });

    console.log($form.attr('action'));

  } else {

    var iframeName  = 'uploadiframe' + new Date().getTime();
    $iframe   = $('<iframe name="' + iframeName + '" style="display: none;"></iframe>');

    $('body').append($iframe);
    $form.attr('target', iframeName);

    $iframe.one('load', function() {
      var data = JSON.parse($iframe.contents().find('body' ).text());
      $form
        .removeClass('is-uploading')
        .addClass(data.success == true ? 'is-success' : 'is-error')
        .removeAttr('target');
      if (!data.success) $errorMsg.text(data.error);
      $form.removeAttr('target');
      $iframe.remove();
    });
  }
});

$save.on('click', function () {

  $.ajax({
    type: "POST",
    url: location.href + '/saveImg/',
    data: 'ok',
    cache: false,
    contentType: false,
    processData: false,
    success: function(data) {
      $form.addClass( data.success == true ? 'is-success' : 'is-error' );
      if (!data.success) $errorMsg.text(data.error);
    },
    error: function() {
      // Log the error, show an alert, whatever works for you
    }
  });

});
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
  }

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

   

  }

  // Скидываем параметры при отмене
  var resetUserData = function(){
  	$header.removeAttr('style').attr('style',headerBg);
  	$footer.removeAttr('style').attr('style',footerBg);
    $avatarFront.removeAttr('style').attr('style',avatarFrontVal);
    $avatarBack.removeAttr('style').attr('style',avatarBackVal);

  }

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
    	_editUserData();
    	_setUplistner();
    },
    
  };
})();
// =========== Album module ===========
// Этот модуль содержит в себе скрипты которые используються только на странице альбомов.

var albumModule = (function() {
	// Объявление библиотеки
  var base = new BaseModule;

  // Общиие переменные
  var $form = $('.popup__form');
  var $formAddAlbum = $form.filter('.popup__form-add-album');
  var button = 'input[type = submit]';
  var popupTime = 5000;
  var albumCoverInput = $form.find('input[name="addAlbumCover"]');
  var loader = 'loader';

	// Открыть окно для загрузки изображений
	var openUpload = function(){
		base.changeClass('.modal_add-photo, .modal-overlay','hide','del')
	};

	// Закрыть окно для загрузки изображений
	var closeUpload = function(e){
		e.preventDefault();
		var modal = $(this).closest('.modal');
		base.changeClass(modal,'hide','add');
		base.changeClass('.modal-overlay','hide','add');
		$(".img-list").empty();
		$('.modal__load-img').show();
	};

	// Открыть окно для редактирования фото и отправить ajax при сохранении редактирования

	var openEditPhoto = function(){
		// Открыть окно
		base.changeClass('.modal_edit-photo, .modal-overlay','hide','del');

		// Данные для ajax
		var $formEditImg = $('.modal__form-edit');
  	var button = 'input[type = submit]';
  	var popupTime = 5000;
	// Отправляем ajax на ????
    $('.submit-edit').on('click', function(e){
      e.preventDefault();
      // Параметры для popup
      var errorArray = base.validateForm($formEditImg); // Проверяем текущую форму и выдаем массив индексов ошибок
      var $errorContainer = $formEditImg.find('.popup__error');
      if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
        errorArray.forEach(function(index){
          base.showError(index,$errorContainer, popupTime);
        });
      }else{ 
      	// Если массив пустой, выполняем дальше
        var servAns = base.ajax($formEditImg,'/album/???/');
      }    
	});
};

	// Отмена загрузки для одной картинки
	var _cancelLoad = function(e){
		alert("Отменить загрузку?");
		$(this).remove();
		console.log($('.img-list li').length);
		if($('.img-list li').length == 0){
			$('.modal__load-img').show();
		}
		
};
	// Функция при скролле
	var _fixedAdd = function() {
		var $albumContainer = $('.header-album__content');
		var $albumBtn = $('.btn_album-add');
		var $backSide = $('.header-album__about-side_back');
		var $frontSide = $('.header-album__about-side_front');
		var fixed = 'fixed';
		var hide = 'hide';

		if(($('html').scrollTop()>=$albumContainer.height()) || ($('body').scrollTop()>=$albumContainer.height())){

			if (!($albumBtn.hasClass(fixed))){
		    		base.changeClass($albumBtn,fixed,'add');
		    }
		   $backSide.removeClass(hide).addClass('fixedHeader');
		   base.changeClass($frontSide,hide,'add');
	  }
	  else{
	    		if ($albumBtn.hasClass(fixed)){
		    		base.changeClass($albumBtn,fixed,'del');
		    	}
		    	$backSide.addClass(hide).removeClass('fixedHeader');
		    	base.changeClass($frontSide,hide,'del');

	    	}
	};


	// Отправляем ajax на addAlbumCover

	albumCoverInput.on('change',function(){
		var $this = $(this);
		var form = $this.closest('form');
		var veiwCover = form.find('.user-block__photo');
		var id = window.location.pathname;
		var cover = $this[0].files[0];
		var formData = new FormData();
		var xhr = new XMLHttpRequest;

		
		formData.append("albumCover",cover);
		xhr.open('POST', id + 'addAlbumCover/',true);
    xhr.send(formData);
    base.changeClass(veiwCover,loader,'add');
    veiwCover.removeAttr('style');
    if(!cover){
    	base.changeClass(veiwCover,loader,'del');
    	return;
    }
    
    xhr.onreadystatechange = function() {

      if (xhr.readyState != 4) return;

      if (xhr.status == 200) {
      	
      	var data = JSON.parse(xhr.response);
      	veiwCover.css({
      		'background-image' : 'url('+ data.newAlbomCover.replace('./users','') +')'
      	})
      	base.changeClass(veiwCover,loader,'del');
      }
     }

	})

	// Добавление альбома
  // Отправляем ajax на addlbum
  $formAddAlbum.find(button).on('click', function(e){
    e.preventDefault();
    var $thisForm = $(this).closest('form');
    var veiwCover = $thisForm.find('.user-block__photo');
    if(veiwCover.hasClass(loader)){
    	return;
    }
    // Параметры для popup
    var errorArray = base.validateForm($thisForm); // Проверяем текущую форму и выдаем массив индексов ошибок
    var $errorContainer = $thisForm.find('.popup__error');
    if(errorArray.length > 0){	// Если в массиве есть ошибки, значит выдаем окно, с номером ошибки
      errorArray.forEach(function(index){
        //base.showError(index,$errorContainer, popupTime);
        alert(base.errors[index]);
        return false;
      });
    }else{ // Если массив пустой, выполняем дальше
      var id = window.location.pathname;
      //servAns = base.ajax($thisForm, id + 'addAlbum/');
    	var formData = new FormData();
      formData.append("albumName",$thisForm.find('.add-album__name-input').val());
			formData.append("albumText",$thisForm.find('.add-album__textarea').val());
      formData.append("albumCover",$thisForm.find('.btn__upload')[0].files[0]);


			var xhr = new XMLHttpRequest;
      xhr.open('POST', id + 'addAlbum/',true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status == 200) {
        	var data = JSON.parse(xhr.response);
        	alert(data.message);
        	
        }
      }
      
    }

  });






	// Анимация для редактирования хедера
	var editAllHeader = (function() {

		var $this,
				front,
				back,
				headerBottom,
				headerBottomEdit;

		var _setUpListners = function() {
			$('.btn_edit-header').on('click', _editHeader);
			$('#cancel_edit_header').on('click', _returnHeader);
			$('.btn--save').on('click', _returnHeader);
		};

		var _editHeader = function() {

			$this = $(this);
			front = $this.closest('.header__section');
			back = front.next();
			headerBottom = front.parent().siblings().children('.header-bottom-front');
			headerBottomEdit  = headerBottom.prev();

			back.css('top','0');
			headerBottomEdit.css('transform','translateY(0)');
			front.fadeOut(500);
			$('.header-edit-overlay').fadeIn(500);
			headerBottom.fadeOut(500);
		}
		var _returnHeader = function(ev) {
			ev.preventDefault();
			back.css('top','-100%');
			headerBottomEdit.css('transform','translateY(100%)');
			front.fadeIn(500);
			$('.header-edit-overlay').fadeOut(500);
			headerBottom.fadeIn(500);
		}
		return{
			init : function() {
				_setUpListners();
			},
		}
});


	var _setUpListners = function() {
		$('.btn_album-add').on('click', openUpload);
		$('.btn_edit-photo').on('click', openEditPhoto);
		$('.modal__header-close').on('click', closeUpload);
		$(window).on('scroll', _fixedAdd);
		$('body').on('click','.img-item',_cancelLoad);
	};



  return {
  	edit: editAllHeader(),
    init: function () {
    	_setUpListners();
    },

  };
})();
function initPopup () {

	// Функция открытия попапа
	function popup(id, action) {
		var body      = $('body');
		var className = 'hide';

		if(action == 'open') {
			body.addClass('no-scroll');

			$('#' + id)
				.removeClass( className )
				.parent()
					.removeClass( className );
		} else if(action == 'close') {

			body.removeClass('no-scroll');

			if(id == 'all') {
				$('.modal')
					.addClass( className )
					.parent()
						.addClass( className );
			} else {
				$('#' + id)
					.addClass( className )
					.parent()
						.addClass( className );
			}
		}
	}


	// Открытие попапов по клику на элементы с атрибутом data-modal
	$(document).on('click', '[data-modal]', function(e) {
			var $el     = $(this);
			var popupId = $el.attr('data-modal');

			popup('all', 'close');
			popup(popupId, 'open');
	});


	// События при клике элемент с атрибутом data-action="close"
	$(document).on('click', '[data-action="close"]', function(e) {
			var btn   = $(this);
			var modal = btn.closest('.modal');

			popup(modal.attr('id'), 'close');
	});

} // initPopup()



initPopup();
// Слайдер
(function() {
	var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd';

	function Slider(options) {
		var gallery     = options.elem;
		var prev        = gallery.find('.slider__control--prev');
		var next        = gallery.find('.slider__control--next');

		var slides         = gallery.find('.slider__item');
		var activeSlide    = slides.filter('.slider__item--active');
		var slidesCnt      = slides.length;
		var activeSlideIdx = activeSlide.index();

		var isReady    = true;


		function showedSlide(slider, idx) {
			slider
				.eq(idx).addClass('slider__item--active')
				.siblings().removeClass('slider__item--active');
		}

		// function dataChange(direction) {
		// 	activeSlideIdx = (direction === 'next') ? getIdx(activeSlideIdx, 'next') : getIdx(activeSlideIdx, 'prev');
		// }

		function getIdx(currentIdx, dir) {
			if(dir === 'prev') {
				return (currentIdx - 1 < 0) ? slidesCnt - 1 : currentIdx - 1 ;
			}
			if(dir === 'next') {
				return (currentIdx + 1 >= slidesCnt) ? 0 : currentIdx + 1 ;
			}

			return currentIdx;
		}

		function changeSlide(slides, direction, className) {
			var currentSlide    = slides.filter('.slider__item--active');
			var currentSlideIdx = currentSlide.index();
			var newSlideIdx;

			if (direction === 'prev') {
				 newSlideIdx = getIdx(currentSlideIdx, 'prev');
			}
			if (direction === 'next') {
				newSlideIdx = getIdx(currentSlideIdx, 'next');
			}

			slides.eq(newSlideIdx)
				.addClass( className )
				.one(transitionEnd, function() {
					$(this)
						.removeClass( className )
						.addClass('slider__item--active')
						.trigger('changed-slide');
				});

			currentSlide
				.addClass( className )
				.one(transitionEnd, function() {
					$(this).removeClass('slider__item--active ' + className);
				});
		}


		$(document).on('changed-slide', function() {
			isReady = true;
		});




		this.prev = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'prev', 'slider__item--animate-fade');
			// dataChange('prev');
		};


		this.next = function() {
			if( !isReady ) return;
			isReady = false;

			changeSlide(slides, 'next', 'slider__item--animate-fade');
			// dataChange('next');
		};


		prev.on('click', this.prev);
		next.on('click', this.next);
	} // Slider



	var slider = new Slider({
		elem: $('#slider')
	});
})();
// Создание модуля.
// 1) Cоздаем файл с модулем в папке sourse/js/modules
// 2) Желательно называть файлы с нижнего подчеркивания(Что бы не отходить от традиций)
// 3) Копируем структуру из файла _login или любого другово модуля(но не base).
// 4) в return модуля нужно вставить объект с методом init.
// 5) в метод init записываем функции, которые будут вызываться автоматически при инициализации модуля.
// 6) Что бы получить доступ к библиотеке, в начале модуля нужно ее объявить, напирмер так var base = new BaseModule;
// теперь все свойства и методы библиотеки доступны через точку, напирмер так base.ajaxData(form);
// 7) В библиотеку можно дописывать все что угодно, главное чтобы функция начиналась с this, так модуль base является конструктором.
// 8) Для того чтобы модуль собрался в один файл app.js его нужно прописать в в gulpfile.js.
// Документация по фунциям base, будет чуть позже...

//////////////////////////////////////////////////////////

$( document ).ready(function() {
    var base = new BaseModule; // Инициализируем библиотеку. (Пока не нужно)
    commonModule.init();
    loginModule.init();
    mainPageModule.init();
    albumModule.init();
    albumModule.edit.init();
});

	// Кастомный вид для загрузки файлов
	(function() {
		var el = $('.upload');

		if(el.length === 0) return;

		$(document).on('click', '.upload', function(e) {
			var el    = $(this);
			var input = el.children('[type=file]');

			input[0].click();
		});
	})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9iYXNlLmpzIiwiX2NvbW1vbi5qcyIsIl9sb2dpbi5qcyIsInVwbG9hZC5qcyIsIl9tYWluLXBhZ2UuanMiLCJfYWxidW0uanMiLCJtb2RhbC5qcyIsInNsaWRlci5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHNvY2tldCA9IGlvLmNvbm5lY3QoKTtcclxuXHJcbnNvY2tldC5vbignZXZlbnRDbGllbnQnLCBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuXHR2YXIgc3JjID0gZGF0YS50aHVtYjtcclxuXHRzcmMgPVN0cmluZyhzcmMpLnJlcGxhY2UoL1xcXFwvZywgXCIvXCIpO1xyXG5cdHNyYyA9IHNyYy5zdWJzdHIoNik7XHJcblx0Y29uc29sZS5sb2coc3JjKTtcclxuXHJcblx0dmFyIGxpID0gJCgnPGxpLz4nKS5hZGRDbGFzcygnaW1nLWl0ZW0nKS5hcHBlbmRUbygkKCd1bCNpbWctbGlzdCcpKTtcclxuXHR2YXIgSW1nQ29udCA9ICQoJzxkaXYvPicpLmFkZENsYXNzKCdpbWctY29udCcpLmFwcGVuZFRvKGxpKTtcclxuXHR2YXIgaW1hZ2UgPSQoJzxpbWc+Jywge1xyXG5cdFx0c3JjOiAnLycrc3JjfSk7XHJcblxyXG5cdC8vINCa0L7Qs9C00LAg0LrQsNGA0YLQuNC90LrQsCDQt9Cw0LPRgNGD0LfQuNGC0YHRjywg0YHRgtCw0LLQuNC8INC10ZEg0L3QsCDRhNC+0L1cclxuXHRpbWFnZS5vbihcImxvYWRcIiwgZnVuY3Rpb24oKXtcclxuXHRcdEltZ0NvbnQuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJywgJ3VybChcIi8nK3NyYysnXCIpJyk7XHJcblx0fSk7XHJcblx0JCgnLm1vZGFsX19sb2FkLWltZycpLmhpZGUoKTtcclxuXHJcbn0pO1xyXG5zb2NrZXQuZW1pdCgnZXZlbnRTZXJ2ZXInLCB7ZGF0YTogJ0hlbGxvIFNlcnZlcid9KTtcclxuXHJcbi8vID09PT09PT09PT09IEJhc2UgbW9kdWxlID09PT09PT09PT09XHJcblxyXG52YXIgQmFzZU1vZHVsZSA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdC8vPT09PT09INCe0LHRitC10LrRgtGLLNC80LDRgdGB0LjQstGLID09PT09PVxyXG5cdHRoaXMuZXJyb3JzID0ge1xyXG4gIFx0MCA6ICfQl9Cw0L/QvtC70L3QtdC90Ysg0L3QtSDQstGB0LUg0L/QvtC70Y8nLFxyXG4gIFx0MSA6ICfQktCy0LXQtNC40YLQtSDQutC+0YDRgNC10LrRgtC90YvQuSBlLW1haWwnLFxyXG4gIFx0Mlx0OiAn0JTQu9C40L3QsCDQv9Cw0YDQvtC70Y8g0LzQtdC90YzRiNC1IDgg0YHQuNC80LLQvtC70L7QsicsXHJcbiAgXHQzIDogJ9CS0YvQsdC10YDQuNGC0LUg0L7QsdC70L7QttC60YMnXHJcbiAgfTtcclxuXHJcbiAgdGhpcy5SZWdQYXR0ZXJucyA9IHtcclxuICBcdGVtYWlsIDogL14oWzAtOWEtekEtWl8tXStcXC4pKlswLTlhLXpBLVpfLV0rQFswLTlhLXpBLVpfLV0rKFxcLlswLTlhLXpBLVpfLV0rKSpcXC5bYS16XXsyLDZ9JC8sXHJcbiAgfTtcclxuXHJcbiAgdGhpcy5nbG9iYWwgPSB7fTtcclxuXHJcblxyXG5cclxuXHJcbiAgLy89PT09PT0g0KTRg9C90LrRhtC40LggPT09PT09XHJcblxyXG5cclxuXHR0aGlzLmFqYXhEYXRhID0gZnVuY3Rpb24oZm9ybSxfdHlwZSl7XHJcblx0XHR2YXIgZWxlbSA9IGZvcm0uZmluZCgnaW5wdXRbdHlwZSAhPSBzdWJtaXRdLHRleHRhcmVhJyk7XHJcblx0XHR2YXIgZGF0YSA9IHt9O1xyXG5cdFx0JC5lYWNoKGVsZW0sIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0ZGF0YVskKHRoaXMpLmF0dHIoJ25hbWUnKV0gPSAkKHRoaXMpLnZhbCgpO1xyXG5cdFx0fSlcclxuXHRcdHZhciBmb3JtYXQgPSBfdHlwZSB8fCBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG5cdFx0cmV0dXJuIGZvcm1hdDtcclxuXHR9O1xyXG5cclxuXHR0aGlzLmFqYXggPSBmdW5jdGlvbihmb3JtLCB1cmwsIF9tZXRob2Qpe1xyXG5cdFx0XHR2YXIgbWV0aG9kID0gX21ldGhvZCB8fCAnUE9TVCc7XHJcblx0XHRcdHZhciBkYXRhID0gdGhpcy5hamF4RGF0YShmb3JtKTtcclxuXHRcdFx0cmV0dXJuICQuYWpheCh7XHJcblx0XHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdFx0dHlwZTogbWV0aG9kLFxyXG5cdFx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcblx0XHRcdFx0ZGF0YTogZGF0YVxyXG5cdFx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHRoaXMuYWpheERhdGFPYmogPSBmdW5jdGlvbihvYmosdXJsLG1ldGhvZCl7XHJcblx0XHRtZXRob2QgPSBtZXRob2QgfHwgJ1BPU1QnXHJcblx0XHR2YXIgZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9iaik7XHJcblx0XHRyZXR1cm4gJC5hamF4KHtcclxuXHRcdFx0dXJsOiB1cmwsXHJcblx0XHRcdHR5cGU6IG1ldGhvZCxcclxuXHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuXHRcdFx0ZGF0YTogZGF0YVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLnNob3dFcnJvciA9IGZ1bmN0aW9uKGVycm9ySW5kZXgsZWxlbSxfbXMpe1xyXG5cdFx0dmFyIHRoaXNGcm9tID0gZWxlbS5jbG9zZXN0KCdmb3JtJyk7XHJcblx0XHR2YXIgdGltZSA9IF9tcyB8fCAyMDAwO1xyXG5cdFx0aWYodHlwZW9mKGVycm9ySW5kZXgpID09ICdzdHJpbmcnKXtcclxuXHRcdFx0ZWxlbS50ZXh0KGVycm9ySW5kZXgpXHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0ZWxlbS50ZXh0KHRoaXMuZXJyb3JzW2Vycm9ySW5kZXhdKTtcclxuXHRcdH1cclxuXHRcdGlmKHRoaXNGcm9tLmZpbmQoZWxlbSkuaXMoJzp2aXNpYmxlJykpe1xyXG5cdFx0XHRjbGVhclRpbWVvdXQodGhpcy5nbG9iYWwudGltZXIpO1xyXG5cdFx0XHR0aGlzLmdsb2JhbC50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRlbGVtLnRleHQoKTtcclxuXHRcdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCdzaG93JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdFx0fSwgdGltZSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ2hpZGUnKS5hZGRDbGFzcygnc2hvdycpO1xyXG5cclxuXHJcblx0XHR0aGlzLmdsb2JhbC50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0ZWxlbS50ZXh0KCk7XHJcblx0XHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ3Nob3cnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fSwgdGltZSk7XHJcblxyXG5cdH1cclxuXHJcblx0dGhpcy5oaWRlRXJyb3IgPSBmdW5jdGlvbihlbGVtKXtcclxuXHRcdGVsZW0ucmVtb3ZlQ2xhc3MoJ3Nob3cnKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdH1cclxuXHJcblx0dGhpcy52YWxpZEVtYWlsID0gZnVuY3Rpb24oaW5wdXQsIHBhdHRlcil7XHJcblx0XHRyZXR1cm4gcGF0dGVyLnRlc3QoaW5wdXQudmFsKCkpO1xyXG5cdH07XHJcblxyXG5cdHRoaXMudmFsaWRQYXNzID0gZnVuY3Rpb24oaW5wdXQsbGVuZ3RoKXtcclxuXHRcdHZhciBsZW4gPSBsZW5ndGggfHwgODtcclxuXHRcdGlmKCEoaW5wdXQudmFsKCkubGVuZ3RoIDwgbGVuKSl7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHRoaXMudmFsaWRGaWxlcyA9IGZ1bmN0aW9uKGlucHV0LGxlbmd0aCl7XHJcblx0XHR2YXIgbGVuID0gbGVuZ3RoIHx8IDA7XHJcblx0XHRpZighKGlucHV0WzBdLmZpbGVzLmxlbmd0aCA8PSBsZW4pKXtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9O1xyXG5cdH1cclxuXHRcclxuXHR0aGlzLnZhbGlkYXRlRm9ybSA9IGZ1bmN0aW9uKGZvcm0pIHtcclxuXHRcdHZhciB0aGlzTW9kdWxlID0gdGhpcztcclxuXHRcdHZhciBwYXR0ZXJuID0gdGhpc01vZHVsZS5SZWdQYXR0ZXJucy5lbWFpbDtcclxuXHRcdHZhciAkdGhpc0Zvcm0gPSBmb3JtO1xyXG5cdFx0dmFyIGVsZW1lbnRzID0gJHRoaXNGb3JtLmZpbmQoJ3RleHRhcmVhLGlucHV0Om5vdChpbnB1dFt0eXBlPVwic3VibWl0XCJdKScpO1xyXG5cdFx0dmFyIGVycm9ycyA9IHRoaXNNb2R1bGUuZXJyb3JzO1xyXG5cdFx0dmFyIG91dHB1dCA9IFtdO1xyXG5cclxuXHRcdCQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoISQodGhpcykudmFsKCkgJiYgJCh0aGlzKS5hdHRyKCd0eXBlJykgIT0gJ2ZpbGUnKXtcclxuXHRcdFx0XHRcdG91dHB1dFswXSA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmKG91dHB1dC5sZW5ndGggPT0gMCl7XHJcblx0XHRcdCQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdHZhciB0eXBlID0gJHRoaXMuYXR0cigndHlwZScpO1xyXG5cdFx0XHRcdHZhciBuYW1lQXR0ciA9ICR0aGlzLmF0dHIoJ25hbWUnKTtcclxuXHRcdFx0XHRzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0XHRjYXNlICdwYXNzd29yZCcgOlxyXG5cdFx0XHRcdFx0XHRpZighdGhpc01vZHVsZS52YWxpZFBhc3MoJHRoaXMpKXtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQucHVzaCgyKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2VtYWlsJyA6XHJcblx0XHRcdFx0XHRcdGlmKCF0aGlzTW9kdWxlLnZhbGlkRW1haWwoJHRoaXMscGF0dGVybikpe1xyXG5cdFx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKDEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0c3dpdGNoKG5hbWVBdHRyKXtcclxuXHRcdFx0XHRcdGNhc2UgJ2FkZEFsYnVtQ292ZXInIDpcclxuXHRcdFx0XHRcdFx0aWYoIXRoaXNNb2R1bGUudmFsaWRGaWxlcygkdGhpcykpe1xyXG5cdFx0XHRcdFx0XHRcdG91dHB1dC5wdXNoKDMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fTtcclxuXHJcblx0dGhpcy5jbGVhcklucHV0cyA9IGZ1bmN0aW9uKGZvcm0pe1xyXG5cdFx0dmFyIGVsZW0gPSBmb3JtLmZpbmQoJ2lucHV0W3R5cGUgIT0gc3VibWl0XSx0ZXh0YXJlYScpO1xyXG5cdFx0ZWxlbS52YWwoJycpO1xyXG5cdH1cclxuXHJcblx0dGhpcy5zY3JvbGxUb1Bvc2l0aW9uID0gZnVuY3Rpb24ocG9zaXRpb24sIGR1cmF0aW9uKXtcclxuICBcdHZhciBwb3NpdGlvbiA9IHBvc2l0aW9uIHx8IDA7XHJcblx0XHR2YXIgZHVyYXRpb24gPSBkdXJhdGlvbiB8fCAxMDAwO1xyXG5cclxuXHJcblx0XHQkKFwiYm9keSwgaHRtbFwiKS5hbmltYXRlKHtcclxuXHRcdFx0XHRzY3JvbGxUb3A6IHBvc2l0aW9uXHJcblx0XHR9LCBkdXJhdGlvbilcclxuICB9O1xyXG5cclxuICB0aGlzLmNoYW5nZUNsYXNzID0gZnVuY3Rpb24ocGFyZW50LGNsYXNzTmFtZSx0eXBlKXtcclxuICBcdGlmKHR5cGVvZihwYXJlbnQpID09ICdzdHJpbmcnKXtcclxuICBcdFx0dmFyIHBhcmVudCA9ICQocGFyZW50KTtcclxuICBcdH1cclxuICBcdHN3aXRjaCh0eXBlKXtcclxuICBcdFx0Y2FzZSAnYWRkJzpcclxuICBcdFx0XHRwYXJlbnQuYWRkQ2xhc3MoY2xhc3NOYW1lKTtcclxuICBcdFx0XHRicmVhaztcclxuICBcdFx0Y2FzZSAnZGVsJzpcclxuICBcdFx0XHRwYXJlbnQucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICBcdFx0XHRicmVhaztcclxuXHJcbiAgXHR9XHJcbiAgfTtcclxuXHJcblx0XHJcblxyXG59IiwiLy8gPT09PT09PT09PT0gQ29tbW9uIG1vZHVsZSA9PT09PT09PT09PVxyXG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDQvtCx0YnQuNC1INGB0LrRgNC40L/RgtGLLCDQv9GA0LjRgdGD0YnQuNC1INCy0YHQtdC8INGB0YLRgNCw0L3QuNGG0LDQvCDRgdCw0LnRgtCwLlxyXG5cclxudmFyIGNvbW1vbk1vZHVsZSA9IChmdW5jdGlvbigpIHtcclxuXHJcblx0Ly8g0J7QsdGK0Y/QstC70LXQvdC40LUg0LHQuNCx0LvQuNC+0YLQtdC60LhcclxuICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xyXG5cclxuXHJcblxyXG4vLyDQn9GA0L7QutGA0YPRgtC40YLRjCDRgdGC0YDQsNC90LjRhtGDINC00L4gLi4uXHJcblx0dmFyIHNjcm9sbFRvID0gZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIGJ0biAgICAgICAgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIHRhcmdldCAgICAgPSBidG4uYXR0cignZGF0YS1nbycpO1xyXG5cdFx0dmFyIGNvbnRhaW5lciAgPSBudWxsO1xyXG5cclxuXHRcdGlmICh0YXJnZXQgPT0gJ3RvcCcpIHtcclxuXHRcdFx0YmFzZS5zY3JvbGxUb1Bvc2l0aW9uKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcbi8vINCh0LLQvtGA0LDRh9C40LLQsNC90LjQtSDQsdC70L7QutCwINGBINC60L7QvNC80LXQvdGC0LDRgNC40Y/QvNC4XHJcblx0dmFyIGNvbW1lbnRzVG9nZ2xlID0gZnVuY3Rpb24oZSl7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIGJ0biAgICAgICA9ICQodGhpcyk7XHJcblx0XHR2YXIgY29udGFpbmVyID0gYnRuLmNsb3Nlc3QoJy5jb21tZW50cycpO1xyXG5cdFx0dmFyIGNvbW1lbnRzICA9IGNvbnRhaW5lci5maW5kKCcuY29tbWVudHNfX2xpc3QnKTtcclxuXHJcblx0XHRpZihjb250YWluZXIuaGFzQ2xhc3MoJ2NvbW1lbnRzLS1zaG93JykpIHtcclxuXHRcdFx0Y29udGFpbmVyLnJlbW92ZUNsYXNzKCdjb21tZW50cy0tc2hvdycpO1xyXG5cdFx0XHRjb21tZW50cy5zbGlkZVVwKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb250YWluZXIuYWRkQ2xhc3MoJ2NvbW1lbnRzLS1zaG93Jyk7XHJcblx0XHRcdGNvbW1lbnRzLnNsaWRlRG93bigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vIGRyb3AgLSDRjdC70LXQvNC10L3RgiDRgSDQstGL0L/QsNC00LDRjtGJ0LjQvCDQsdC70L7QutC+0LxcclxuXHR2YXIgYWRkRHJvcCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR2YXIgdHJpZ2dlciAgICAgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIGNvbnRhaW5lciAgID0gdHJpZ2dlci5jbG9zZXN0KCcuZHJvcCcpO1xyXG5cdFx0dmFyIGNvbnRlbnQgICAgID0gY29udGFpbmVyLmZpbmQoJy5kcm9wX19tYWluJyk7XHJcblx0XHR2YXIgY2xhc3NBY3RpdmUgPSAnZHJvcC0tb3Blbic7XHJcblxyXG5cdFx0aWYoY29udGFpbmVyLmhhc0NsYXNzKCdkcm9wLS1ob3ZlcicpKSByZXR1cm47XHJcblxyXG5cdFx0Y29udGFpbmVyLnRvZ2dsZUNsYXNzKCBjbGFzc0FjdGl2ZSApO1xyXG5cdH07XHJcblxyXG5cclxuXHQvLyDQmtCw0YHRgtC+0LzQvdGL0Lkg0LLQuNC0INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INGE0LDQudC70L7QslxyXG5cdC8vINCf0L7QttCw0LvRg9C50YHRgtCwLCDQuNGB0L/RgNCw0LLRjNGC0LUg0Y3RgtGDINGE0YPQvdC60YbQuNGOLCDQvdC1INC/0L7QvdGP0YLQvdC+INCz0LTQtSDQvtC90LAg0LjRgdC/0L7Qu9GM0LfRg9C10YLRjNGB0Y8g0Lgg0L3Rg9C20L3QviDQstGL0YLQsNGJ0LjRgtGMIG9uIGNsaWNrINCyIF9zZXRVcGxpc3RuZXJcclxuXHR2YXIgZmlsZVVwbG9hZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZWwgPSAkKCcudXBsb2FkJyk7XHJcblxyXG5cdFx0aWYoZWwubGVuZ3RoID09PSAwKSByZXR1cm47XHJcblxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy51cGxvYWQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHZhciBlbCAgICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBpbnB1dCA9IGVsLmNoaWxkcmVuKCdbdHlwZT1maWxlXScpO1xyXG5cclxuXHRcdFx0aW5wdXRbMF0uY2xpY2soKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vINCg0LDQt9C70L7Qs9C40L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXHJcblx0Ly8g0J3Rg9C20L3QviDQtNC+0YDQsNCx0L7RgtCw0YLRjFxyXG5cdHZhciBsb2dvdXRVc2VyID0gZnVuY3Rpb24oKXtcclxuXHRcdHZhciBvYmogPSB7XHJcblx0XHRcdHJlcTogXCJsb2dvdXRcIlxyXG5cdFx0fVxyXG5cdFx0dmFyIGRhdGEgPSBKU09OLnN0cmluZ2lmeShvYmopO1xyXG5cclxuXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuXHRcdFx0dmFyIGlkID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG5cdFx0XHR4aHIub3BlbignUE9TVCcsIGlkICsgJ2xvZ291dC8nLHRydWUpO1xyXG5cdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywnYXBwbGljYXRpb24vanNvbicpO1xyXG5cdFx0XHR4aHIuc2VuZChkYXRhKTtcclxuXHRcdFx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblx0XHRcdFx0Ly8g0J/QtdGA0LXQt9Cw0LPRgNGD0LfQutCwINGB0YLRgNCw0L3QuNGG0YtcclxuXHRcdFx0XHRpZihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpLnN0YXR1cyA9PSBcImxvZ291dFwiKXtcclxuXHRcdFx0XHRcdC8vd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHRcdFx0XHRcdHZhciBzaXRlID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyAnLyc7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpO1xyXG5cdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBzaXRlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG59XHJcblxyXG5cdHZhciBlZGl0VXNlckRhdGEgPSBmdW5jdGlvbigpe1xyXG5cdFx0Y29uc29sZS5sb2coMTIpO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyDQn9GA0L7RgdC70YPRiNC60LBcclxuXHR2YXIgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5jb21tZW50c19fdG9nZ2xlJyAsIGNvbW1lbnRzVG9nZ2xlKTtcclxuXHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWdvXScgLCBzY3JvbGxUbyk7XHJcblx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuZHJvcF9fdHJpZ2dlcicsIGFkZERyb3ApO1xyXG5cdFx0XHQkKCcubG9nb3V0Jykub24oJ2NsaWNrJywgbG9nb3V0VXNlcilcclxuXHR9O1xyXG5cclxuXHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgXHRfc2V0VXBMaXN0bmVycygpO1xyXG4gICAgfVxyXG5cclxuICB9O1xyXG59KSgpOyIsIi8vID09PT09PT09PT09IExvZ2luIG1vZHVsZSA9PT09PT09PT09PVxyXG4vLyDQrdGC0L7RgiDQvNC+0LTRg9C70Ywg0YHQvtC00LXRgNC20LjRgiDQsiDRgdC10LHQtSDQstGB0LUg0YfRgtC+INGB0LLRj9C30LDQvdC90L4g0YEg0YTQvtGA0LzQvtC5INCw0LLRgtC+0YDQuNC30LDRhtC40Lgg0Lgg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuC5cclxuXHJcblxyXG52YXIgbG9naW5Nb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdC8vINCT0LvQvtCx0LDQu9GM0L3Ri9C1INC/0LXRgNC10LzQtdC90L3Ri9C1INC80L7QtNGD0LvRjy5cclxuICB2YXIgYmFzZSA9IG5ldyBCYXNlTW9kdWxlO1xyXG4gIFxyXG4gIHZhciB0b1NlbmRSZXF1ZXN0ID0gZnVuY3Rpb24oKXtcclxuICBcdHZhciAkZm9ybSA9ICQoJy5wb3B1cF9fZm9ybScpO1xyXG4gIFx0dmFyICRmb3JtTG9naW4gPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1sb2dpbicpO1xyXG4gIFx0dmFyICRmb3JtUmVnID0gJGZvcm0uZmlsdGVyKCcucG9wdXBfX2Zvcm0tcmVnaXN0cmF0aW9uJyk7XHJcbiAgXHR2YXIgJGZvcm1SZWNvdmVyID0gJGZvcm0uZmlsdGVyKCcucG9wdXBfX2Zvcm0tcmVjb3ZlcicpO1xyXG4gIFx0dmFyIGJ1dHRvbiA9ICdpbnB1dFt0eXBlID0gc3VibWl0XSc7XHJcbiAgXHR2YXIgcG9wdXBUaW1lID0gNTAwMDtcclxuXHJcbiAgXHQvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgbG9naW5cclxuICBcdCRmb3JtTG9naW4uZmluZChidXR0b24pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0ICBcdFx0dmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xyXG5cdCAgXHRcdC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQtNC70Y8gcG9wdXBcclxuXHQgIFx0XHR2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCR0aGlzRm9ybSk7IC8vINCf0YDQvtCy0LXRgNGP0LXQvCDRgtC10LrRg9GJ0YPRjiDRhNC+0YDQvNGDINC4INCy0YvQtNCw0LXQvCDQvNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQvtGI0LjQsdC+0LpcclxuXHQgIFx0XHR2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNGb3JtLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuXHQgIFx0XHRpZihlcnJvckFycmF5Lmxlbmd0aCA+IDApe1x0Ly8g0JXRgdC70Lgg0LIg0LzQsNGB0YHQuNCy0LUg0LXRgdGC0Ywg0L7RiNC40LHQutC4LCDQt9C90LDRh9C40YIg0LLRi9C00LDQtdC8INC+0LrQvdC+LCDRgSDQvdC+0LzQtdGA0L7QvCDQvtGI0LjQsdC60LhcclxuXHQgIFx0XHRcdGVycm9yQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XHJcblx0ICBcdFx0XHRcdGJhc2Uuc2hvd0Vycm9yKGluZGV4LCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdH0pO1xyXG5cdCAgXHRcdH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcblx0ICBcdFx0XHRzZXJ2QW5zID0gYmFzZS5hamF4KCR0aGlzRm9ybSwnL2xvZ2luLycpO1xyXG5cdCAgXHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucyl7XHJcblx0ICBcdFx0XHRcdGlmKCFhbnMuc3RhdHVzKXtcclxuXHQgIFx0XHRcdFx0XHRiYXNlLnNob3dFcnJvcihhbnMubWVzc2FnZSwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHRcdH1lbHNle1xyXG5cdCAgXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XHJcblx0ICBcdFx0XHRcdH1cclxuXHQgIFx0XHRcdH0pO1xyXG5cdCAgXHRcdH1cclxuICBcdFx0XHJcbiAgXHR9KVxyXG5cclxuICBcdC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCByZWdcclxuICBcdCRmb3JtUmVnLmZpbmQoYnV0dG9uKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICBcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCAgXHRcdHZhciAkdGhpc0Zvcm0gPSAkKHRoaXMpLmNsb3Nlc3QoJ2Zvcm0nKTtcclxuXHQgIFx0XHQvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0LTQu9GPIHBvcHVwXHJcblx0ICBcdFx0dmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkdGhpc0Zvcm0pOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcblx0ICBcdFx0dmFyICRlcnJvckNvbnRhaW5lciA9ICR0aGlzRm9ybS5maW5kKCcucG9wdXBfX2Vycm9yJyk7XHJcblx0ICBcdFx0aWYoZXJyb3JBcnJheS5sZW5ndGggPiAwKXtcdC8vINCV0YHQu9C4INCyINC80LDRgdGB0LjQstC1INC10YHRgtGMINC+0YjQuNCx0LrQuCwg0LfQvdCw0YfQuNGCINCy0YvQtNCw0LXQvCDQvtC60L3Qviwg0YEg0L3QvtC80LXRgNC+0Lwg0L7RiNC40LHQutC4XHJcblx0ICBcdFx0XHRlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdCAgXHRcdFx0XHRiYXNlLnNob3dFcnJvcihpbmRleCwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHR9KTtcclxuXHQgIFx0XHR9ZWxzZXsgLy8g0JXRgdC70Lgg0LzQsNGB0YHQuNCyINC/0YPRgdGC0L7QuSwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00LDQu9GM0YjQtVxyXG5cdCAgXHRcdFx0c2VydkFucyA9IGJhc2UuYWpheCgkdGhpc0Zvcm0sJy9yZWcvJyk7XHJcblx0ICBcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKXtcclxuXHQgIFx0XHRcdFx0aWYoIWFucy5zdGF0dXMpe1xyXG5cdCAgXHRcdFx0XHRcdGJhc2Uuc2hvd0Vycm9yKGFucy5tZXNzYWdlLCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdFx0fWVsc2V7XHJcblx0ICBcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHQgIFx0XHRcdFx0fVxyXG5cdCAgXHRcdFx0fSk7XHJcblx0ICBcdFx0fVxyXG4gIFx0XHRcclxuICBcdH0pXHJcblxyXG4gIFx0Ly8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIHJlY292ZXJcclxuXHJcbiAgXHQkZm9ybVJlY292ZXIuZmluZChidXR0b24pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0ICBcdFx0dmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xyXG5cdCAgXHRcdC8vINCf0LDRgNCw0LzQtdGC0YDRiyDQtNC70Y8gcG9wdXBcclxuXHQgIFx0XHR2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCR0aGlzRm9ybSk7IC8vINCf0YDQvtCy0LXRgNGP0LXQvCDRgtC10LrRg9GJ0YPRjiDRhNC+0YDQvNGDINC4INCy0YvQtNCw0LXQvCDQvNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQvtGI0LjQsdC+0LpcclxuXHQgIFx0XHR2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNGb3JtLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuXHQgIFx0XHRpZihlcnJvckFycmF5Lmxlbmd0aCA+IDApe1x0Ly8g0JXRgdC70Lgg0LIg0LzQsNGB0YHQuNCy0LUg0LXRgdGC0Ywg0L7RiNC40LHQutC4LCDQt9C90LDRh9C40YIg0LLRi9C00LDQtdC8INC+0LrQvdC+LCDRgSDQvdC+0LzQtdGA0L7QvCDQvtGI0LjQsdC60LhcclxuXHQgIFx0XHRcdGVycm9yQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XHJcblx0ICBcdFx0XHRcdGJhc2Uuc2hvd0Vycm9yKGluZGV4LCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdH0pO1xyXG5cdCAgXHRcdH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcblx0ICBcdFx0XHRzZXJ2QW5zID0gYmFzZS5hamF4KCR0aGlzRm9ybSwnL3JlY292ZXIvJyk7XHJcblx0ICBcdFx0XHRzZXJ2QW5zLmRvbmUoZnVuY3Rpb24oYW5zKXtcclxuXHQgIFx0XHRcdFx0aWYoIWFucy5zdGF0dXMpe1xyXG5cdCAgXHRcdFx0XHRcdHJldHVybiBiYXNlLnNob3dFcnJvcihhbnMubWVzc2FnZSwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHRcdH1lbHNle1xyXG5cdCAgXHRcdFx0XHRcdGJhc2UuY2xlYXJJbnB1dHMoJHRoaXNGb3JtKTtcclxuXHQgIFx0XHRcdFx0XHRyZXR1cm4gYmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0XHRcdFxyXG5cdCAgXHRcdFx0XHR9XHJcblx0ICBcdFx0XHR9KTtcclxuXHQgIFx0XHR9XHJcbiAgXHRcdFxyXG4gIFx0fSlcclxuXHJcbiAgfVxyXG5cclxuIFxyXG5cclxuICB2YXIgcG9wdXBXaW5kb3dBbmltYXRlID0gZnVuY3Rpb24oKXtcclxuICBcdC8vINCw0L3QuNC80LDRhtC40Y8gcG9wdXBcclxuXHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPXCJcclxuXHRcdHZhciBmbGlwcCBcdD0gJ2ZsaXBwJztcclxuXHRcdHZhciBoaWRlIFx0XHQ9ICdoaWRlJztcclxuXHRcdHZhciAkZmxpcENvbnRhaW5lciA9ICQoJy5mbGlwcGVyLWNvbnRhaW5lcicpO1xyXG5cdFx0dmFyICRiYWNrUGFzcyA9ICQoJy5iYWNrLXBhc3MnKTtcclxuXHRcdHZhciAkYmFja1JlZyA9ICQoJy5iYWNrLXJlZycpO1xyXG5cclxuXHRcdCQoJy5wb3B1cF9fbGlua19yZWdpc3RyJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0JGJhY2tQYXNzLmFkZENsYXNzKGhpZGUpO1xyXG5cdFx0XHQkYmFja1JlZy5yZW1vdmVDbGFzcyhoaWRlKTtcclxuXHRcdCBcdCRmbGlwQ29udGFpbmVyLmFkZENsYXNzKGZsaXBwKTtcclxuXHQgfSk7XHJcblxyXG5cclxuXHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LLQvtC50YLQuFwiXHJcblx0XHQkKCcucG9wdXBfX2xpbmtfZW50ZXInKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdCBcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQgXHRcdCRmbGlwQ29udGFpbmVyLnJlbW92ZUNsYXNzKGZsaXBwKTtcclxuXHQgfSk7XHJcblxyXG5cclxuXHRcdC8vINC/0YDQuCDQvdCw0LbQsNGC0LjQuCDQvdCwIFwi0LfQsNCx0YvQu9C4INC/0LDRgNC+0LvRjFwiXHJcblx0XHQkKCcucG9wdXBfX2xpbmtfZm9yZ2V0LXBhc3MnKS5jbGljayhmdW5jdGlvbihlKXtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkYmFja1Bhc3MucmVtb3ZlQ2xhc3MoaGlkZSk7XHJcblx0XHRcdCRiYWNrUmVnLmFkZENsYXNzKGhpZGUpO1xyXG5cdFx0IFx0JGZsaXBDb250YWluZXIuYWRkQ2xhc3MoZmxpcHApO1xyXG5cdCB9KTtcclxuICB9O1xyXG5cclxuXHJcbiBcclxuXHJcblxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIFx0cG9wdXBXaW5kb3dBbmltYXRlKCk7XHJcbiAgICAgIFx0dG9TZW5kUmVxdWVzdCgpO1xyXG4gICAgICB9XHJcblxyXG4gIH07XHJcbn0pKCk7IiwiLy/QntCx0YDQsNCx0LDRgtGL0LLQtdC8IERyYWdFbmREcm9wc1xyXG52YXIgaXNBZHZhbmNlZFVwbG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICByZXR1cm4gKCgnZHJhZ2dhYmxlJyBpbiBkaXYpIHx8ICgnb25kcmFnc3RhcnQnIGluIGRpdiAmJiAnb25kcm9wJyBpbiBkaXYpKSAmJiAnRm9ybURhdGEnIGluIHdpbmRvdyAmJiAnRmlsZVJlYWRlcicgaW4gd2luZG93O1xyXG59KCk7XHJcbi8vINCn0LjRgtCw0LXQvCDRgNCw0LfQvNC10YLQutGDINC4INGB0L7RhdGA0LDQvdGP0LXQvCDRhNC+0YDQvNGDXHJcbnZhciAkZm9ybSA9ICQoJyN1cGxvYWQnKTtcclxudmFyICRpbnB1dCA9ICQoJyNmaWxlJyk7XHJcbnZhciAkc2F2ZSA9ICQoJyNzYXZlJyk7XHJcblxyXG4vLyDQldGB0LvQuCDRh9GC0L7RgtC+INC30LDQutC40L3Rg9C70Lgg0LTQvtCx0LDQstC70Y/QtdC8INC60LvQsNGB0YFcclxuaWYgKGlzQWR2YW5jZWRVcGxvYWQpIHtcclxuXHJcbiAgdmFyIGRyb3BwZWRGaWxlcyA9IGZhbHNlO1xyXG5cclxuICAkZm9ybS5vbignZHJhZyBkcmFnc3RhcnQgZHJhZ2VuZCBkcmFnb3ZlciBkcmFnZW50ZXIgZHJhZ2xlYXZlIGRyb3AnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH0pXHJcbiAgICAub24oJ2RyYWdvdmVyIGRyYWdlbnRlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAkZm9ybS5hZGRDbGFzcygnaXMtZHJhZ292ZXInKTtcclxuICAgIH0pXHJcbiAgICAub24oJ2RyYWdsZWF2ZSBkcmFnZW5kIGRyb3AnLCBmdW5jdGlvbigpIHtcclxuICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ2lzLWRyYWdvdmVyJyk7XHJcbiAgICB9KVxyXG4gICAgLm9uKCdkcm9wJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICBkcm9wcGVkRmlsZXMgPSBlLm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzO1xyXG4gICAgICBjb25zb2xlLmxvZyhkcm9wcGVkRmlsZXMpO1xyXG4gICAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcclxuICAgIH0pO1xyXG5cclxuICAkaW5wdXQub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHsgLy8gZHJhZyAmIGRyb3Ag0J3QlSDQv9C+0LTQtNC10YDQttC40LLQsNC10YLRgdGPXHJcbiAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcclxuICB9KTtcclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG59XHJcblxyXG5cclxuLy8g0KDRg9GH0L3QsNGPINC+0YLQv9GA0LDQstC60LBcclxuJGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICBpZiAoJGZvcm0uaGFzQ2xhc3MoJ2lzLXVwbG9hZGluZycpKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gIC8vYWxlcnQoJ9Ce0YLQv9GA0LDQstC70Y/QtdC8Jyk7XHJcblxyXG4gICRmb3JtLmFkZENsYXNzKCdpcy11cGxvYWRpbmcnKS5yZW1vdmVDbGFzcygnaXMtZXJyb3InKTtcclxuXHJcbiAgaWYgKGlzQWR2YW5jZWRVcGxvYWQpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB2YXIgYWpheERhdGEgPSBuZXcgRm9ybURhdGEoJGZvcm0uZ2V0KDApKTtcclxuXHJcbiAgICBpZiAoZHJvcHBlZEZpbGVzKSB7XHJcbiAgICAgICQuZWFjaCggZHJvcHBlZEZpbGVzLCBmdW5jdGlvbihpLCBmaWxlKSB7XHJcblxyXG4gICAgICAgIGFqYXhEYXRhLmFwcGVuZCggJGlucHV0LmF0dHIoJ25hbWUnKSwgZmlsZSApO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiBsb2NhdGlvbi5ocmVmICsgJy9hZGRJbWcvJyxcclxuICAgICAgdHlwZTogJGZvcm0uYXR0cignbWV0aG9kJyksXHJcbiAgICAgIGRhdGE6IGFqYXhEYXRhLFxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24oYW5zKSB7XHJcbiAgICAgICAgJGZvcm0ucmVtb3ZlQ2xhc3MoJ2lzLXVwbG9hZGluZycpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGFucy5yZXNwb25zZVRleHQpO1xyXG5cclxuICAgICAgLy9zb2NrZXQuZW1pdCgnZXZlbnRTZXJ2ZXInLCB7ZGF0YTogJ0hlbGxvIFNlcnZlcid9KTtcclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAgICAgICAkZm9ybS5hZGRDbGFzcyggZGF0YS5zdWNjZXNzID09IHRydWUgPyAnaXMtc3VjY2VzcycgOiAnaXMtZXJyb3InICk7XHJcblxyXG4gICAgICAgIGlmICghZGF0YS5zdWNjZXNzKSAkZXJyb3JNc2cudGV4dChkYXRhLmVycm9yKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIExvZyB0aGUgZXJyb3IsIHNob3cgYW4gYWxlcnQsIHdoYXRldmVyIHdvcmtzIGZvciB5b3VcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJGZvcm0uYXR0cignYWN0aW9uJykpO1xyXG5cclxuICB9IGVsc2Uge1xyXG5cclxuICAgIHZhciBpZnJhbWVOYW1lICA9ICd1cGxvYWRpZnJhbWUnICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAkaWZyYW1lICAgPSAkKCc8aWZyYW1lIG5hbWU9XCInICsgaWZyYW1lTmFtZSArICdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+PC9pZnJhbWU+Jyk7XHJcblxyXG4gICAgJCgnYm9keScpLmFwcGVuZCgkaWZyYW1lKTtcclxuICAgICRmb3JtLmF0dHIoJ3RhcmdldCcsIGlmcmFtZU5hbWUpO1xyXG5cclxuICAgICRpZnJhbWUub25lKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSgkaWZyYW1lLmNvbnRlbnRzKCkuZmluZCgnYm9keScgKS50ZXh0KCkpO1xyXG4gICAgICAkZm9ybVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnaXMtdXBsb2FkaW5nJylcclxuICAgICAgICAuYWRkQ2xhc3MoZGF0YS5zdWNjZXNzID09IHRydWUgPyAnaXMtc3VjY2VzcycgOiAnaXMtZXJyb3InKVxyXG4gICAgICAgIC5yZW1vdmVBdHRyKCd0YXJnZXQnKTtcclxuICAgICAgaWYgKCFkYXRhLnN1Y2Nlc3MpICRlcnJvck1zZy50ZXh0KGRhdGEuZXJyb3IpO1xyXG4gICAgICAkZm9ybS5yZW1vdmVBdHRyKCd0YXJnZXQnKTtcclxuICAgICAgJGlmcmFtZS5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG4kc2F2ZS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICQuYWpheCh7XHJcbiAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgIHVybDogbG9jYXRpb24uaHJlZiArICcvc2F2ZUltZy8nLFxyXG4gICAgZGF0YTogJ29rJyxcclxuICAgIGNhY2hlOiBmYWxzZSxcclxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgJGZvcm0uYWRkQ2xhc3MoIGRhdGEuc3VjY2VzcyA9PSB0cnVlID8gJ2lzLXN1Y2Nlc3MnIDogJ2lzLWVycm9yJyApO1xyXG4gICAgICBpZiAoIWRhdGEuc3VjY2VzcykgJGVycm9yTXNnLnRleHQoZGF0YS5lcnJvcik7XHJcbiAgICB9LFxyXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBMb2cgdGhlIGVycm9yLCBzaG93IGFuIGFsZXJ0LCB3aGF0ZXZlciB3b3JrcyBmb3IgeW91XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59KTsiLCIvLyA9PT09PT09PT09PSBNYWluLXBhZ2UgbW9kdWxlID09PT09PT09PT09XHJcbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1INGB0LrRgNC40L/RgtGLINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YzRgdGPINGC0L7Qu9GM0LrQviDQvdCwINCz0LvQsNCy0L3QvtC5INGB0YLRgNCw0L3QuNGG0LVcclxuLy8g0LDQstGC0L7RgNC40LfQvtCy0LDQvdC90L7Qs9C+INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyAobWFpbi1wYWdlKVxyXG5cclxudmFyIG1haW5QYWdlTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcbiAgLy/QntCx0YnQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcbiBcclxuXHJcblxyXG4gIHZhciAkaGVhZGVyID0gJCgnLmhlYWRlci1tYWluJyk7XHJcbiAgdmFyICRmb290ZXIgPSAkKCcuZm9vdGVyJyk7XHJcbiAgdmFyIGhlYWRlckJnID0gJCgnLmhlYWRlci1tYWluJykuYXR0cignc3R5bGUnKTtcclxuICB2YXIgZm9vdGVyQmcgPSAkKCcuZm9vdGVyJykuYXR0cignc3R5bGUnKTtcclxuXHJcblxyXG4gIHZhciAkaGVhZGVyRnJvbnQgPSAkaGVhZGVyLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1mcm9udCcpO1xyXG4gIHZhciAkaGVhZHJCYWNrID0gJGhlYWRlci5maW5kKCcuaGVhZGVyX19zZWN0aW9uX21haW4tYmFjaycpO1xyXG5cclxuICB2YXIgJGF2YXRhckZyb250ID0gJGhlYWRlckZyb250LmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIHZhciAkYXZhdGFyQmFjayA9ICRoZWFkckJhY2suZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XHJcbiAgdmFyIGF2YXRhckZyb250VmFsID0gJGF2YXRhckZyb250LmF0dHIoJ3N0eWxlJyk7XHJcbiAgdmFyIGF2YXRhckJhY2tWYWwgPSAkYXZhdGFyQmFjay5hdHRyKCdzdHlsZScpO1xyXG5cclxuXHJcbiAgdmFyICR1c2VyQmxvY2tGcm9udCA9ICRoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9jaycpO1xyXG4gIC8vINCe0LrQvdC+INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICB2YXIgJGhlYWRlckVkaXQgPSAkaGVhZGVyLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1iYWNrJyk7XHJcbiAgdmFyICRoZWFkZXJFZGl0QXZhdGFyID0gJGhlYWRlci5maW5kKCcudXNlci1ibG9ja19fcGhvdG8tZWRpdCcpO1xyXG4gIHZhciAkaGVhZGVyRWRpZEJnID0gJGhlYWRlckVkaXQuZmluZCgnLmhlYWRlcl9fcGFydC0temlwX21haW4nKTtcclxuICB2YXIgJGhlYWRlckVkaXREYXRhID0gJGhlYWRlckVkaXQuZmluZCgnLnVzZXItYmxvY2stLWVkaXQnKTtcclxuICB2YXIgJHVzZXJCbG9ja01haW4gPSAkaGVhZGVyRWRpdERhdGEuZmluZCgnLnVzZXItYmxvY2tfX21haW4nKTtcclxuICB2YXIgJGZvcm1Sb3cgPSAkdXNlckJsb2NrTWFpbi5maW5kKCcuZm9ybV9fcm93Jyk7XHJcbiAgdmFyICRhdmF0YXJFZGl0ID0gJGhlYWRlckVkaXREYXRhLmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIHZhciBhdmF0YXJCZyA9ICRhdmF0YXJFZGl0LmF0dHIoJ3N0eWxlJyk7XHJcbiAgdmFyIGZyb250QXZhdGFyID0gJGhlYWRlckZyb250LmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIHZhciBmcm9udEF2YXRhckJnID0gZnJvbnRBdmF0YXIuYXR0cignc3R5bGUnKTtcclxuICBcclxuICAvLyDQmtC90L7Qv9C60Lgg0YTQvtGA0LzRiyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgdmFyIGZpbGVVcGxvYWRCZyA9ICRoZWFkZXJFZGlkQmcuZmluZCgnaW5wdXRbbmFtZT1cImJnXCJdJyk7XHJcbiAgdmFyIGZpbGVVcGxvYWRBdnRhciA9ICRoZWFkZXJFZGl0QXZhdGFyLmZpbmQoJ2lucHV0W25hbWU9XCJwaG90b1wiXScpXHJcbiAgdmFyIGJ0blJlc2V0ID0gJCgnI2NhbmNlbF9lZGl0X2hlYWRlcicpO1xyXG4gIHZhciBidG5TYXZlID0gJGhlYWRlci5maW5kKCcuYnRuLS1zYXZlJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQktCw0LvQuNC00LDRhtC40Y8g0LjQt9C+0LHRgNCw0LbQtdC90LjRjyjQn9C10YDQtdC90LXRgdGC0Lgg0LIgYmFzZSlcclxuXHR2YXIgdmFsaWRhdGVJbWcgPSBmdW5jdGlvbihwaG90byl7XHJcblx0XHR2YXIgbWF4U2l6ZSA9IDIgKiAxMDI0ICogMTAyNDtcclxuICAgIHZhciBmbGFnID0gdHJ1ZTtcclxuXHRcdGlmKCFwaG90by50eXBlLm1hdGNoKC9pbWFnZVxcLyhqcGVnfGpwZ3xwbmd8Z2lmKS8pICkge1xyXG4gICAgICBmbGFnID0gZmFsc2U7XHJcblxyXG4gICAgICByZXR1cm4gYWxlcnQoJ9Ck0L7RgtC+0LPRgNCw0YTQuNGPINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQsiDRhNC+0YDQvNCw0YLQtSBqcGcsIHBuZyDQuNC70LggZ2lmJyk7XHJcbiAgICB9XHJcblx0XHRpZihwaG90by5zaXplID4gbWF4U2l6ZSl7XHJcbiAgICAgIGZsYWcgPSBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIGFsZXJ0KFwi0KTQvtGC0L7Qs9GA0LDRhNC40Y8g0LHQvtC70YzRiNC1IDLQvNCxXCIpO1xyXG5cdFx0fVxyXG4gICAgcmV0dXJuIGZsYWc7XHJcblx0fVxyXG5cclxuICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQvdC+0LLRi9C5INCx0LXQutGA0LDRg9C90LQsINC10YnQtSDQsdC10Lcg0L7RgtC/0YDQsNCy0LrQuCDQvdCwINGB0LXRgNCy0LXRgFxyXG4gIHZhciBwcmV2aWVVc2VyQmFja0dyb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgXHRcclxuICBcdHZhciBwaG90byA9ICQodGhpcylbMF0uZmlsZXNbMF07XHJcbiAgXHRpZighdmFsaWRhdGVJbWcocGhvdG8pKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG5cdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChwaG90byk7XHJcblx0XHRcclxuXHRcdHJlYWRlci5vbmxvYWQgPSAoZnVuY3Rpb24gKHBob3RvKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJGhlYWRlci5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJywnYmFja2dyb3VuZC1pbWFnZSA6IHVybCgnKyBlLnRhcmdldC5yZXN1bHQgKycpJylcclxuICAgICAgICAgICRmb290ZXIucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpXHJcbiAgICAgIH1cclxuICAgICAgfSkgKHBob3RvKTtcclxuICB9XHJcblxyXG4gIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INC90L7QstGD0Y4g0LDQstCw0YLQsNGA0LrRgyAsINC10YnQtSDQsdC10Lcg0L7RgtC/0YDQsNCy0LrQuCDQvdCwINGB0LXRgNCy0LXRgFxyXG4gIHZhciBwcmV2aWVVc2VyQXZhdGFyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBwaG90byA9ICQodGhpcylbMF0uZmlsZXNbMF07XHJcbiAgICBpZighdmFsaWRhdGVJbWcocGhvdG8pKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChwaG90byk7XHJcblxyXG4gICAgcmVhZGVyLm9ubG9hZCA9IChmdW5jdGlvbiAocGhvdG8pIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAkYXZhdGFyRnJvbnQucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpO1xyXG4gICAgICAkYXZhdGFyQmFjay5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJywnYmFja2dyb3VuZC1pbWFnZSA6IHVybCgnKyBlLnRhcmdldC5yZXN1bHQgKycpJyk7XHJcbiAgICB9XHJcbiAgICB9KSAocGhvdG8pO1xyXG5cclxuICAgXHJcblxyXG4gIH1cclxuXHJcbiAgLy8g0KHQutC40LTRi9Cy0LDQtdC8INC/0LDRgNCw0LzQtdGC0YDRiyDQv9GA0Lgg0L7RgtC80LXQvdC1XHJcbiAgdmFyIHJlc2V0VXNlckRhdGEgPSBmdW5jdGlvbigpe1xyXG4gIFx0JGhlYWRlci5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJyxoZWFkZXJCZyk7XHJcbiAgXHQkZm9vdGVyLnJlbW92ZUF0dHIoJ3N0eWxlJykuYXR0cignc3R5bGUnLGZvb3RlckJnKTtcclxuICAgICRhdmF0YXJGcm9udC5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJyxhdmF0YXJGcm9udFZhbCk7XHJcbiAgICAkYXZhdGFyQmFjay5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJyxhdmF0YXJCYWNrVmFsKTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyDQn9C+0LvRg9GH0LDQtdC8INC90L7QstGL0Lkg0LHQtdC60YDQsNGD0L3QtFxyXG4gIHZhciBzZXRVc2VyQmFja0dyb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBoZWFkZXJCZyA9ICRoZWFkZXIuYXR0cignc3R5bGUnKTtcclxuICAgIGZvb3RlckJnID0gJGZvb3Rlci5hdHRyKCdzdHlsZScpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNldEF2YXRhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICBhdmF0YXJCZyA9ICRhdmF0YXJFZGl0LmF0dHIoJ3N0eWxlJyk7XHJcbiAgICBmcm9udEF2YXRhciA9ICRhdmF0YXJFZGl0LmF0dHIoJ3N0eWxlJyk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQn9GA0L7Rg9GB0LvRg9GI0LrQsFxyXG4gIHZhciBfc2V0VXBsaXN0bmVyID0gZnVuY3Rpb24oKXtcclxuICBcdGZpbGVVcGxvYWRCZy5vbignY2hhbmdlJyxwcmV2aWVVc2VyQmFja0dyb3VuZCk7XHJcbiAgICBmaWxlVXBsb2FkQXZ0YXIub24oJ2NoYW5nZScscHJldmllVXNlckF2YXRhcik7XHJcbiAgXHRidG5SZXNldC5vbignY2xpY2snLHJlc2V0VXNlckRhdGEpO1xyXG4gIH1cclxuICBcclxuXHJcbiAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1INC90LAg0YHQtdGA0LLQtdGAXHJcbiAgdmFyIF9lZGl0VXNlckRhdGEgPSBmdW5jdGlvbigpe1xyXG4gIFx0XHJcbiAgXHRidG5TYXZlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNldFVzZXJCYWNrR3JvdW5kKCk7XHJcbiAgICAgIHNldEF2YXRhcigpO1xyXG4gIFx0XHR2YXIgdXNlck5hbWUgPSAkdXNlckJsb2NrRnJvbnQuZmluZCgnLnVzZXItYmxvY2tfX25hbWUnKTtcclxuICBcdFx0dmFyIHVzZXJBYm91dCA9ICR1c2VyQmxvY2tGcm9udC5maW5kKCcudXNlci1ibG9ja19fZGVzYycpO1xyXG4gIFx0XHR2YXIgaW5wdXROYW1lID0gJGZvcm1Sb3cuZmluZCgnaW5wdXRbbmFtZSA9IFwibmFtZVwiXScpO1xyXG4gIFx0XHR2YXIgaW5wdXRBYm91dCA9ICRmb3JtUm93LmZpbmQoJ3RleHRhcmVhW25hbWUgPSBcImRlc2NcIl0nKTtcclxuICBcdFx0dmFyIGlkID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG4gIFx0XHR2YXIgcGhvdG8gPSBmaWxlVXBsb2FkQmdbMF0uZmlsZXNbMF07XHJcbiAgICAgIHZhciBhdmF0YXIgPSBmaWxlVXBsb2FkQXZ0YXJbMF0uZmlsZXNbMF07XHJcblxyXG5cclxuICBcdFx0Ly8g0J7QsdC90L7QstC70Y/QtdC8INGC0LXQutGB0YLQvtCy0YvQtSDQtNCw0L3QvdGL0LUg0L3QsCDRgdGC0YDQsNC90LjRhtC1KNC10YnQtSDQsdC10Lcg0LHQsNC30YspXHJcbiAgXHRcdHVzZXJOYW1lLnRleHQoaW5wdXROYW1lLnZhbCgpKTtcclxuICBcdFx0dXNlckFib3V0LnRleHQoaW5wdXRBYm91dC52YWwoKSk7XHJcblxyXG4gIFx0XHRcclxuICBcdFx0Ly8g0KTQvtGA0LzQuNGA0YPQtdC8IGFqYXgg0L7QsdGK0LXQutGCINC00LvRjyDQvtGC0L/RgNCw0LLQutC4INC90LAg0YHQtdGA0LLQtdGAXHJcbiAgXHRcdFx0dmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidXNlckF2YXRhclwiLGF2YXRhcik7XHJcbiAgXHRcdFx0Zm9ybURhdGEuYXBwZW5kKFwidXNlckJhY2tHcm91bmRcIixwaG90byk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidXNlck5hbWVcIixpbnB1dE5hbWUudmFsKCkpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVzZXJBYm91dFwiLGlucHV0QWJvdXQudmFsKCkpO1xyXG5cclxuXHJcbiAgXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsIGlkICsgJ2VkaXRVc2VyRGF0YS8nLHRydWUpO1xyXG4gICAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAvLyRhdmF0YXJGcm9udC5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJywnYmFja2dyb3VuZC1pbWFnZSA6IHVybCgnKyBlLnRhcmdldC5yZXN1bHQgKycpJyk7XHJcbiAgICAgICAgICAgIC8vJGF2YXRhckJhY2sucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpO1xyXG4gICAgICAgICAgICAvL2FsZXJ0KFwi0J/RgNC40YjQtdC7INC+0YLQstC10YIg0L7RgiDRgdC10YDQstC10YDQsFwiKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgXHR9KVxyXG4gIH1cclxuICAvLyDQn9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LlcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIFx0X2VkaXRVc2VyRGF0YSgpO1xyXG4gICAgXHRfc2V0VXBsaXN0bmVyKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgfTtcclxufSkoKTsiLCIvLyA9PT09PT09PT09PSBBbGJ1bSBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0YHQutGA0LjQv9GC0Ysg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRjNGB0Y8g0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSDQsNC70YzQsdC+0LzQvtCyLlxyXG5cclxudmFyIGFsYnVtTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcbiAgLy8g0J7QsdGJ0LjQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcbiAgdmFyICRmb3JtID0gJCgnLnBvcHVwX19mb3JtJyk7XHJcbiAgdmFyICRmb3JtQWRkQWxidW0gPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1hZGQtYWxidW0nKTtcclxuICB2YXIgYnV0dG9uID0gJ2lucHV0W3R5cGUgPSBzdWJtaXRdJztcclxuICB2YXIgcG9wdXBUaW1lID0gNTAwMDtcclxuICB2YXIgYWxidW1Db3ZlcklucHV0ID0gJGZvcm0uZmluZCgnaW5wdXRbbmFtZT1cImFkZEFsYnVtQ292ZXJcIl0nKTtcclxuICB2YXIgbG9hZGVyID0gJ2xvYWRlcic7XHJcblxyXG5cdC8vINCe0YLQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INC40LfQvtCx0YDQsNC20LXQvdC40LlcclxuXHR2YXIgb3BlblVwbG9hZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKCcubW9kYWxfYWRkLXBob3RvLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKVxyXG5cdH07XHJcblxyXG5cdC8vINCX0LDQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INC40LfQvtCx0YDQsNC20LXQvdC40LlcclxuXHR2YXIgY2xvc2VVcGxvYWQgPSBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBtb2RhbCA9ICQodGhpcykuY2xvc2VzdCgnLm1vZGFsJyk7XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKG1vZGFsLCdoaWRlJywnYWRkJyk7XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKCcubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdhZGQnKTtcclxuXHRcdCQoXCIuaW1nLWxpc3RcIikuZW1wdHkoKTtcclxuXHRcdCQoJy5tb2RhbF9fbG9hZC1pbWcnKS5zaG93KCk7XHJcblx0fTtcclxuXHJcblx0Ly8g0J7RgtC60YDRi9GC0Ywg0L7QutC90L4g0LTQu9GPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0YTQvtGC0L4g0Lgg0L7RgtC/0YDQsNCy0LjRgtGMIGFqYXgg0L/RgNC4INGB0L7RhdGA0LDQvdC10L3QuNC4INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuXHJcblx0dmFyIG9wZW5FZGl0UGhvdG8gPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8g0J7RgtC60YDRi9GC0Ywg0L7QutC90L5cclxuXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbF9lZGl0LXBob3RvLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKTtcclxuXHJcblx0XHQvLyDQlNCw0L3QvdGL0LUg0LTQu9GPIGFqYXhcclxuXHRcdHZhciAkZm9ybUVkaXRJbWcgPSAkKCcubW9kYWxfX2Zvcm0tZWRpdCcpO1xyXG4gIFx0dmFyIGJ1dHRvbiA9ICdpbnB1dFt0eXBlID0gc3VibWl0XSc7XHJcbiAgXHR2YXIgcG9wdXBUaW1lID0gNTAwMDtcclxuXHQvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgPz8/P1xyXG4gICAgJCgnLnN1Ym1pdC1lZGl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG4gICAgICB2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCRmb3JtRWRpdEltZyk7IC8vINCf0YDQvtCy0LXRgNGP0LXQvCDRgtC10LrRg9GJ0YPRjiDRhNC+0YDQvNGDINC4INCy0YvQtNCw0LXQvCDQvNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQvtGI0LjQsdC+0LpcclxuICAgICAgdmFyICRlcnJvckNvbnRhaW5lciA9ICRmb3JtRWRpdEltZy5maW5kKCcucG9wdXBfX2Vycm9yJyk7XHJcbiAgICAgIGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG4gICAgICAgIGVycm9yQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgICBiYXNlLnNob3dFcnJvcihpbmRleCwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1lbHNleyBcclxuICAgICAgXHQvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcbiAgICAgICAgdmFyIHNlcnZBbnMgPSBiYXNlLmFqYXgoJGZvcm1FZGl0SW1nLCcvYWxidW0vPz8/LycpO1xyXG4gICAgICB9ICAgIFxyXG5cdH0pO1xyXG59O1xyXG5cclxuXHQvLyDQntGC0LzQtdC90LAg0LfQsNCz0YDRg9C30LrQuCDQtNC70Y8g0L7QtNC90L7QuSDQutCw0YDRgtC40L3QutC4XHJcblx0dmFyIF9jYW5jZWxMb2FkID0gZnVuY3Rpb24oZSl7XHJcblx0XHRhbGVydChcItCe0YLQvNC10L3QuNGC0Ywg0LfQsNCz0YDRg9C30LrRgz9cIik7XHJcblx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0Y29uc29sZS5sb2coJCgnLmltZy1saXN0IGxpJykubGVuZ3RoKTtcclxuXHRcdGlmKCQoJy5pbWctbGlzdCBsaScpLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0JCgnLm1vZGFsX19sb2FkLWltZycpLnNob3coKTtcclxuXHRcdH1cclxuXHRcdFxyXG59O1xyXG5cdC8vINCk0YPQvdC60YbQuNGPINC/0YDQuCDRgdC60YDQvtC70LvQtVxyXG5cdHZhciBfZml4ZWRBZGQgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciAkYWxidW1Db250YWluZXIgPSAkKCcuaGVhZGVyLWFsYnVtX19jb250ZW50Jyk7XHJcblx0XHR2YXIgJGFsYnVtQnRuID0gJCgnLmJ0bl9hbGJ1bS1hZGQnKTtcclxuXHRcdHZhciAkYmFja1NpZGUgPSAkKCcuaGVhZGVyLWFsYnVtX19hYm91dC1zaWRlX2JhY2snKTtcclxuXHRcdHZhciAkZnJvbnRTaWRlID0gJCgnLmhlYWRlci1hbGJ1bV9fYWJvdXQtc2lkZV9mcm9udCcpO1xyXG5cdFx0dmFyIGZpeGVkID0gJ2ZpeGVkJztcclxuXHRcdHZhciBoaWRlID0gJ2hpZGUnO1xyXG5cclxuXHRcdGlmKCgkKCdodG1sJykuc2Nyb2xsVG9wKCk+PSRhbGJ1bUNvbnRhaW5lci5oZWlnaHQoKSkgfHwgKCQoJ2JvZHknKS5zY3JvbGxUb3AoKT49JGFsYnVtQ29udGFpbmVyLmhlaWdodCgpKSl7XHJcblxyXG5cdFx0XHRpZiAoISgkYWxidW1CdG4uaGFzQ2xhc3MoZml4ZWQpKSl7XHJcblx0XHQgICAgXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJGFsYnVtQnRuLGZpeGVkLCdhZGQnKTtcclxuXHRcdCAgICB9XHJcblx0XHQgICAkYmFja1NpZGUucmVtb3ZlQ2xhc3MoaGlkZSkuYWRkQ2xhc3MoJ2ZpeGVkSGVhZGVyJyk7XHJcblx0XHQgICBiYXNlLmNoYW5nZUNsYXNzKCRmcm9udFNpZGUsaGlkZSwnYWRkJyk7XHJcblx0ICB9XHJcblx0ICBlbHNle1xyXG5cdCAgICBcdFx0aWYgKCRhbGJ1bUJ0bi5oYXNDbGFzcyhmaXhlZCkpe1xyXG5cdFx0ICAgIFx0XHRiYXNlLmNoYW5nZUNsYXNzKCRhbGJ1bUJ0bixmaXhlZCwnZGVsJyk7XHJcblx0XHQgICAgXHR9XHJcblx0XHQgICAgXHQkYmFja1NpZGUuYWRkQ2xhc3MoaGlkZSkucmVtb3ZlQ2xhc3MoJ2ZpeGVkSGVhZGVyJyk7XHJcblx0XHQgICAgXHRiYXNlLmNoYW5nZUNsYXNzKCRmcm9udFNpZGUsaGlkZSwnZGVsJyk7XHJcblxyXG5cdCAgICBcdH1cclxuXHR9O1xyXG5cclxuXHJcblx0Ly8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIGFkZEFsYnVtQ292ZXJcclxuXHJcblx0YWxidW1Db3ZlcklucHV0Lm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIGZvcm0gPSAkdGhpcy5jbG9zZXN0KCdmb3JtJyk7XHJcblx0XHR2YXIgdmVpd0NvdmVyID0gZm9ybS5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcclxuXHRcdHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHRcdHZhciBjb3ZlciA9ICR0aGlzWzBdLmZpbGVzWzBdO1xyXG5cdFx0dmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG5cclxuXHRcdFxyXG5cdFx0Zm9ybURhdGEuYXBwZW5kKFwiYWxidW1Db3ZlclwiLGNvdmVyKTtcclxuXHRcdHhoci5vcGVuKCdQT1NUJywgaWQgKyAnYWRkQWxidW1Db3Zlci8nLHRydWUpO1xyXG4gICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG4gICAgYmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdhZGQnKTtcclxuICAgIHZlaXdDb3Zlci5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgaWYoIWNvdmVyKXtcclxuICAgIFx0YmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcclxuICAgIFx0cmV0dXJuO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgIFx0XHJcbiAgICAgIFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgIFx0dmVpd0NvdmVyLmNzcyh7XHJcbiAgICAgIFx0XHQnYmFja2dyb3VuZC1pbWFnZScgOiAndXJsKCcrIGRhdGEubmV3QWxib21Db3Zlci5yZXBsYWNlKCcuL3VzZXJzJywnJykgKycpJ1xyXG4gICAgICBcdH0pXHJcbiAgICAgIFx0YmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcclxuICAgICAgfVxyXG4gICAgIH1cclxuXHJcblx0fSlcclxuXHJcblx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LDQu9GM0LHQvtC80LBcclxuICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgYWRkbGJ1bVxyXG4gICRmb3JtQWRkQWxidW0uZmluZChidXR0b24pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xyXG4gICAgdmFyIHZlaXdDb3ZlciA9ICR0aGlzRm9ybS5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcclxuICAgIGlmKHZlaXdDb3Zlci5oYXNDbGFzcyhsb2FkZXIpKXtcclxuICAgIFx0cmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG4gICAgdmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkdGhpc0Zvcm0pOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcbiAgICB2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNGb3JtLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuICAgIGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG4gICAgICBlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgIC8vYmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG4gICAgICAgIGFsZXJ0KGJhc2UuZXJyb3JzW2luZGV4XSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcbiAgICAgIHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICAgICAgLy9zZXJ2QW5zID0gYmFzZS5hamF4KCR0aGlzRm9ybSwgaWQgKyAnYWRkQWxidW0vJyk7XHJcbiAgICBcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJhbGJ1bU5hbWVcIiwkdGhpc0Zvcm0uZmluZCgnLmFkZC1hbGJ1bV9fbmFtZS1pbnB1dCcpLnZhbCgpKTtcclxuXHRcdFx0Zm9ybURhdGEuYXBwZW5kKFwiYWxidW1UZXh0XCIsJHRoaXNGb3JtLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKCkpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJhbGJ1bUNvdmVyXCIsJHRoaXNGb3JtLmZpbmQoJy5idG5fX3VwbG9hZCcpWzBdLmZpbGVzWzBdKTtcclxuXHJcblxyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG4gICAgICB4aHIub3BlbignUE9TVCcsIGlkICsgJ2FkZEFsYnVtLycsdHJ1ZSk7XHJcbiAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgIFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgXHRhbGVydChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIFx0XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLyDQkNC90LjQvNCw0YbQuNGPINC00LvRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINGF0LXQtNC10YDQsFxyXG5cdHZhciBlZGl0QWxsSGVhZGVyID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciAkdGhpcyxcclxuXHRcdFx0XHRmcm9udCxcclxuXHRcdFx0XHRiYWNrLFxyXG5cdFx0XHRcdGhlYWRlckJvdHRvbSxcclxuXHRcdFx0XHRoZWFkZXJCb3R0b21FZGl0O1xyXG5cclxuXHRcdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuYnRuX2VkaXQtaGVhZGVyJykub24oJ2NsaWNrJywgX2VkaXRIZWFkZXIpO1xyXG5cdFx0XHQkKCcjY2FuY2VsX2VkaXRfaGVhZGVyJykub24oJ2NsaWNrJywgX3JldHVybkhlYWRlcik7XHJcblx0XHRcdCQoJy5idG4tLXNhdmUnKS5vbignY2xpY2snLCBfcmV0dXJuSGVhZGVyKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIF9lZGl0SGVhZGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdGZyb250ID0gJHRoaXMuY2xvc2VzdCgnLmhlYWRlcl9fc2VjdGlvbicpO1xyXG5cdFx0XHRiYWNrID0gZnJvbnQubmV4dCgpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b20gPSBmcm9udC5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCcuaGVhZGVyLWJvdHRvbS1mcm9udCcpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b21FZGl0ICA9IGhlYWRlckJvdHRvbS5wcmV2KCk7XHJcblxyXG5cdFx0XHRiYWNrLmNzcygndG9wJywnMCcpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b21FZGl0LmNzcygndHJhbnNmb3JtJywndHJhbnNsYXRlWSgwKScpO1xyXG5cdFx0XHRmcm9udC5mYWRlT3V0KDUwMCk7XHJcblx0XHRcdCQoJy5oZWFkZXItZWRpdC1vdmVybGF5JykuZmFkZUluKDUwMCk7XHJcblx0XHRcdGhlYWRlckJvdHRvbS5mYWRlT3V0KDUwMCk7XHJcblx0XHR9XHJcblx0XHR2YXIgX3JldHVybkhlYWRlciA9IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGJhY2suY3NzKCd0b3AnLCctMTAwJScpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b21FZGl0LmNzcygndHJhbnNmb3JtJywndHJhbnNsYXRlWSgxMDAlKScpO1xyXG5cdFx0XHRmcm9udC5mYWRlSW4oNTAwKTtcclxuXHRcdFx0JCgnLmhlYWRlci1lZGl0LW92ZXJsYXknKS5mYWRlT3V0KDUwMCk7XHJcblx0XHRcdGhlYWRlckJvdHRvbS5mYWRlSW4oNTAwKTtcclxuXHRcdH1cclxuXHRcdHJldHVybntcclxuXHRcdFx0aW5pdCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0XHRcdH0sXHJcblx0XHR9XHJcbn0pO1xyXG5cclxuXHJcblx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKSB7XHJcblx0XHQkKCcuYnRuX2FsYnVtLWFkZCcpLm9uKCdjbGljaycsIG9wZW5VcGxvYWQpO1xyXG5cdFx0JCgnLmJ0bl9lZGl0LXBob3RvJykub24oJ2NsaWNrJywgb3BlbkVkaXRQaG90byk7XHJcblx0XHQkKCcubW9kYWxfX2hlYWRlci1jbG9zZScpLm9uKCdjbGljaycsIGNsb3NlVXBsb2FkKTtcclxuXHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgX2ZpeGVkQWRkKTtcclxuXHRcdCQoJ2JvZHknKS5vbignY2xpY2snLCcuaW1nLWl0ZW0nLF9jYW5jZWxMb2FkKTtcclxuXHR9O1xyXG5cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgXHRlZGl0OiBlZGl0QWxsSGVhZGVyKCksXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICB9O1xyXG59KSgpOyIsImZ1bmN0aW9uIGluaXRQb3B1cCAoKSB7XHJcblxyXG5cdC8vINCk0YPQvdC60YbQuNGPINC+0YLQutGA0YvRgtC40Y8g0L/QvtC/0LDQv9CwXHJcblx0ZnVuY3Rpb24gcG9wdXAoaWQsIGFjdGlvbikge1xyXG5cdFx0dmFyIGJvZHkgICAgICA9ICQoJ2JvZHknKTtcclxuXHRcdHZhciBjbGFzc05hbWUgPSAnaGlkZSc7XHJcblxyXG5cdFx0aWYoYWN0aW9uID09ICdvcGVuJykge1xyXG5cdFx0XHRib2R5LmFkZENsYXNzKCduby1zY3JvbGwnKTtcclxuXHJcblx0XHRcdCQoJyMnICsgaWQpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdC5wYXJlbnQoKVxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKTtcclxuXHRcdH0gZWxzZSBpZihhY3Rpb24gPT0gJ2Nsb3NlJykge1xyXG5cclxuXHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblxyXG5cdFx0XHRpZihpZCA9PSAnYWxsJykge1xyXG5cdFx0XHRcdCQoJy5tb2RhbCcpXHJcblx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcjJyArIGlkKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdFx0LnBhcmVudCgpXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyDQntGC0LrRgNGL0YLQuNC1INC/0L7Qv9Cw0L/QvtCyINC/0L4g0LrQu9C40LrRgyDQvdCwINGN0LvQtdC80LXQvdGC0Ysg0YEg0LDRgtGA0LjQsdGD0YLQvtC8IGRhdGEtbW9kYWxcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtbW9kYWxdJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR2YXIgJGVsICAgICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBwb3B1cElkID0gJGVsLmF0dHIoJ2RhdGEtbW9kYWwnKTtcclxuXHJcblx0XHRcdHBvcHVwKCdhbGwnLCAnY2xvc2UnKTtcclxuXHRcdFx0cG9wdXAocG9wdXBJZCwgJ29wZW4nKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vINCh0L7QsdGL0YLQuNGPINC/0YDQuCDQutC70LjQutC1INGN0LvQtdC80LXQvdGCINGBINCw0YLRgNC40LHRg9GC0L7QvCBkYXRhLWFjdGlvbj1cImNsb3NlXCJcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtYWN0aW9uPVwiY2xvc2VcIl0nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHZhciBidG4gICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBtb2RhbCA9IGJ0bi5jbG9zZXN0KCcubW9kYWwnKTtcclxuXHJcblx0XHRcdHBvcHVwKG1vZGFsLmF0dHIoJ2lkJyksICdjbG9zZScpO1xyXG5cdH0pO1xyXG5cclxufSAvLyBpbml0UG9wdXAoKVxyXG5cclxuXHJcblxyXG5pbml0UG9wdXAoKTsiLCIvLyDQodC70LDQudC00LXRgFxyXG4oZnVuY3Rpb24oKSB7XHJcblx0dmFyIHRyYW5zaXRpb25FbmQgPSAndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJztcclxuXHJcblx0ZnVuY3Rpb24gU2xpZGVyKG9wdGlvbnMpIHtcclxuXHRcdHZhciBnYWxsZXJ5ICAgICA9IG9wdGlvbnMuZWxlbTtcclxuXHRcdHZhciBwcmV2ICAgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9fY29udHJvbC0tcHJldicpO1xyXG5cdFx0dmFyIG5leHQgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1uZXh0Jyk7XHJcblxyXG5cdFx0dmFyIHNsaWRlcyAgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcblx0XHR2YXIgYWN0aXZlU2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdHZhciBzbGlkZXNDbnQgICAgICA9IHNsaWRlcy5sZW5ndGg7XHJcblx0XHR2YXIgYWN0aXZlU2xpZGVJZHggPSBhY3RpdmVTbGlkZS5pbmRleCgpO1xyXG5cclxuXHRcdHZhciBpc1JlYWR5ICAgID0gdHJ1ZTtcclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gc2hvd2VkU2xpZGUoc2xpZGVyLCBpZHgpIHtcclxuXHRcdFx0c2xpZGVyXHJcblx0XHRcdFx0LmVxKGlkeCkuYWRkQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJylcclxuXHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmdW5jdGlvbiBkYXRhQ2hhbmdlKGRpcmVjdGlvbikge1xyXG5cdFx0Ly8gXHRhY3RpdmVTbGlkZUlkeCA9IChkaXJlY3Rpb24gPT09ICduZXh0JykgPyBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICduZXh0JykgOiBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICdwcmV2Jyk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0SWR4KGN1cnJlbnRJZHgsIGRpcikge1xyXG5cdFx0XHRpZihkaXIgPT09ICdwcmV2Jykge1xyXG5cdFx0XHRcdHJldHVybiAoY3VycmVudElkeCAtIDEgPCAwKSA/IHNsaWRlc0NudCAtIDEgOiBjdXJyZW50SWR4IC0gMSA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGlyID09PSAnbmV4dCcpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGN1cnJlbnRJZHggKyAxID49IHNsaWRlc0NudCkgPyAwIDogY3VycmVudElkeCArIDEgO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gY3VycmVudElkeDtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjaGFuZ2VTbGlkZShzbGlkZXMsIGRpcmVjdGlvbiwgY2xhc3NOYW1lKSB7XHJcblx0XHRcdHZhciBjdXJyZW50U2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZUlkeCA9IGN1cnJlbnRTbGlkZS5pbmRleCgpO1xyXG5cdFx0XHR2YXIgbmV3U2xpZGVJZHg7XHJcblxyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuXHRcdFx0XHQgbmV3U2xpZGVJZHggPSBnZXRJZHgoY3VycmVudFNsaWRlSWR4LCAncHJldicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICduZXh0Jykge1xyXG5cdFx0XHRcdG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ25leHQnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2xpZGVzLmVxKG5ld1NsaWRlSWR4KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lIClcclxuXHRcdFx0XHQub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQudHJpZ2dlcignY2hhbmdlZC1zbGlkZScpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Y3VycmVudFNsaWRlXHJcblx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdC5vbmUodHJhbnNpdGlvbkVuZCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZSAnICsgY2xhc3NOYW1lKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NoYW5nZWQtc2xpZGUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aXNSZWFkeSA9IHRydWU7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0XHR0aGlzLnByZXYgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoICFpc1JlYWR5ICkgcmV0dXJuO1xyXG5cdFx0XHRpc1JlYWR5ID0gZmFsc2U7XHJcblxyXG5cdFx0XHRjaGFuZ2VTbGlkZShzbGlkZXMsICdwcmV2JywgJ3NsaWRlcl9faXRlbS0tYW5pbWF0ZS1mYWRlJyk7XHJcblx0XHRcdC8vIGRhdGFDaGFuZ2UoJ3ByZXYnKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiggIWlzUmVhZHkgKSByZXR1cm47XHJcblx0XHRcdGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcblx0XHRcdGNoYW5nZVNsaWRlKHNsaWRlcywgJ25leHQnLCAnc2xpZGVyX19pdGVtLS1hbmltYXRlLWZhZGUnKTtcclxuXHRcdFx0Ly8gZGF0YUNoYW5nZSgnbmV4dCcpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0cHJldi5vbignY2xpY2snLCB0aGlzLnByZXYpO1xyXG5cdFx0bmV4dC5vbignY2xpY2snLCB0aGlzLm5leHQpO1xyXG5cdH0gLy8gU2xpZGVyXHJcblxyXG5cclxuXHJcblx0dmFyIHNsaWRlciA9IG5ldyBTbGlkZXIoe1xyXG5cdFx0ZWxlbTogJCgnI3NsaWRlcicpXHJcblx0fSk7XHJcbn0pKCk7IiwiLy8g0KHQvtC30LTQsNC90LjQtSDQvNC+0LTRg9C70Y8uXHJcbi8vIDEpIEPQvtC30LTQsNC10Lwg0YTQsNC50Lsg0YEg0LzQvtC00YPQu9C10Lwg0LIg0L/QsNC/0LrQtSBzb3Vyc2UvanMvbW9kdWxlc1xyXG4vLyAyKSDQltC10LvQsNGC0LXQu9GM0L3QviDQvdCw0LfRi9Cy0LDRgtGMINGE0LDQudC70Ysg0YEg0L3QuNC20L3QtdCz0L4g0L/QvtC00YfQtdGA0LrQuNCy0LDQvdC40Y8o0KfRgtC+INCx0Ysg0L3QtSDQvtGC0YXQvtC00LjRgtGMINC+0YIg0YLRgNCw0LTQuNGG0LjQuSlcclxuLy8gMykg0JrQvtC/0LjRgNGD0LXQvCDRgdGC0YDRg9C60YLRg9GA0YMg0LjQtyDRhNCw0LnQu9CwIF9sb2dpbiDQuNC70Lgg0LvRjtCx0L7Qs9C+INC00YDRg9Cz0L7QstC+INC80L7QtNGD0LvRjyjQvdC+INC90LUgYmFzZSkuXHJcbi8vIDQpINCyIHJldHVybiDQvNC+0LTRg9C70Y8g0L3Rg9C20L3QviDQstGB0YLQsNCy0LjRgtGMINC+0LHRitC10LrRgiDRgSDQvNC10YLQvtC00L7QvCBpbml0LlxyXG4vLyA1KSDQsiDQvNC10YLQvtC0IGluaXQg0LfQsNC/0LjRgdGL0LLQsNC10Lwg0YTRg9C90LrRhtC40LgsINC60L7RgtC+0YDRi9C1INCx0YPQtNGD0YIg0LLRi9C30YvQstCw0YLRjNGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L/RgNC4INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC80L7QtNGD0LvRjy5cclxuLy8gNikg0KfRgtC+INCx0Ysg0L/QvtC70YPRh9C40YLRjCDQtNC+0YHRgtGD0L8g0Log0LHQuNCx0LvQuNC+0YLQtdC60LUsINCyINC90LDRh9Cw0LvQtSDQvNC+0LTRg9C70Y8g0L3Rg9C20L3QviDQtdC1INC+0LHRitGP0LLQuNGC0YwsINC90LDQv9C40YDQvNC10YAg0YLQsNC6IHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcbi8vINGC0LXQv9C10YDRjCDQstGB0LUg0YHQstC+0LnRgdGC0LLQsCDQuCDQvNC10YLQvtC00Ysg0LHQuNCx0LvQuNC+0YLQtdC60Lgg0LTQvtGB0YLRg9C/0L3RiyDRh9C10YDQtdC3INGC0L7Rh9C60YMsINC90LDQv9C40YDQvNC10YAg0YLQsNC6IGJhc2UuYWpheERhdGEoZm9ybSk7XHJcbi8vIDcpINCSINCx0LjQsdC70LjQvtGC0LXQutGDINC80L7QttC90L4g0LTQvtC/0LjRgdGL0LLQsNGC0Ywg0LLRgdC1INGH0YLQviDRg9Cz0L7QtNC90L4sINCz0LvQsNCy0L3QvtC1INGH0YLQvtCx0Ysg0YTRg9C90LrRhtC40Y8g0L3QsNGH0LjQvdCw0LvQsNGB0Ywg0YEgdGhpcywg0YLQsNC6INC80L7QtNGD0LvRjCBiYXNlINGP0LLQu9GP0LXRgtGB0Y8g0LrQvtC90YHRgtGA0YPQutGC0L7RgNC+0LwuXHJcbi8vIDgpINCU0LvRjyDRgtC+0LPQviDRh9GC0L7QsdGLINC80L7QtNGD0LvRjCDRgdC+0LHRgNCw0LvRgdGPINCyINC+0LTQuNC9INGE0LDQudC7IGFwcC5qcyDQtdCz0L4g0L3Rg9C20L3QviDQv9GA0L7Qv9C40YHQsNGC0Ywg0LIg0LIgZ3VscGZpbGUuanMuXHJcbi8vINCU0L7QutGD0LzQtdC90YLQsNGG0LjRjyDQv9C+INGE0YPQvdGG0LjRj9C8IGJhc2UsINCx0YPQtNC10YIg0YfRg9GC0Ywg0L/QvtC30LbQtS4uLlxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuJCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7IC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LHQuNCx0LvQuNC+0YLQtdC60YMuICjQn9C+0LrQsCDQvdC1INC90YPQttC90L4pXHJcbiAgICBjb21tb25Nb2R1bGUuaW5pdCgpO1xyXG4gICAgbG9naW5Nb2R1bGUuaW5pdCgpO1xyXG4gICAgbWFpblBhZ2VNb2R1bGUuaW5pdCgpO1xyXG4gICAgYWxidW1Nb2R1bGUuaW5pdCgpO1xyXG4gICAgYWxidW1Nb2R1bGUuZWRpdC5pbml0KCk7XHJcbn0pO1xyXG5cclxuXHQvLyDQmtCw0YHRgtC+0LzQvdGL0Lkg0LLQuNC0INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INGE0LDQudC70L7QslxyXG5cdChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlbCA9ICQoJy51cGxvYWQnKTtcclxuXHJcblx0XHRpZihlbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnVwbG9hZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dmFyIGVsICAgID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIGlucHV0ID0gZWwuY2hpbGRyZW4oJ1t0eXBlPWZpbGVdJyk7XHJcblxyXG5cdFx0XHRpbnB1dFswXS5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fSkoKTsiXX0=
