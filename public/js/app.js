var socket = io();

socket.on('eventClient', function (data) {

	var src = data.thumb;
	src =String(src).replace(/\\/g, "/");
	src = src.substr(6);
	console.log(src);

	var li = $('<li/>').addClass('img-item').appendTo($('ul#img-list'));
	var ImgCont = $('<div/>').addClass('img-cont').appendTo(li);
	var image =$('<img>', {
		src: '/'+src});

	// Когда картинка загрузится, ставим её на фон
	image.on("load", function(){
		ImgCont.css('background-image', 'url("/'+src+'")');
	});
	$('.modal__load-img').hide();

});
//socket.emit('eventServer', {data: 'Hello Server'});12

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9iYXNlLmpzIiwiX2NvbW1vbi5qcyIsIl9sb2dpbi5qcyIsInVwbG9hZC5qcyIsIl9tYWluLXBhZ2UuanMiLCJfYWxidW0uanMiLCJtb2RhbC5qcyIsInNsaWRlci5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzb2NrZXQgPSBpby5jb25uZWN0KCk7XHJcblxyXG5zb2NrZXQub24oJ2V2ZW50Q2xpZW50JywgZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcblx0dmFyIHNyYyA9IGRhdGEudGh1bWI7XHJcblx0c3JjID1TdHJpbmcoc3JjKS5yZXBsYWNlKC9cXFxcL2csIFwiL1wiKTtcclxuXHRzcmMgPSBzcmMuc3Vic3RyKDYpO1xyXG5cdGNvbnNvbGUubG9nKHNyYyk7XHJcblxyXG5cdHZhciBsaSA9ICQoJzxsaS8+JykuYWRkQ2xhc3MoJ2ltZy1pdGVtJykuYXBwZW5kVG8oJCgndWwjaW1nLWxpc3QnKSk7XHJcblx0dmFyIEltZ0NvbnQgPSAkKCc8ZGl2Lz4nKS5hZGRDbGFzcygnaW1nLWNvbnQnKS5hcHBlbmRUbyhsaSk7XHJcblx0dmFyIGltYWdlID0kKCc8aW1nPicsIHtcclxuXHRcdHNyYzogJy8nK3NyY30pO1xyXG5cclxuXHQvLyDQmtC+0LPQtNCwINC60LDRgNGC0LjQvdC60LAg0LfQsNCz0YDRg9C30LjRgtGB0Y8sINGB0YLQsNCy0LjQvCDQtdGRINC90LAg0YTQvtC9XHJcblx0aW1hZ2Uub24oXCJsb2FkXCIsIGZ1bmN0aW9uKCl7XHJcblx0XHRJbWdDb250LmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoXCIvJytzcmMrJ1wiKScpO1xyXG5cdH0pO1xyXG5cdCQoJy5tb2RhbF9fbG9hZC1pbWcnKS5oaWRlKCk7XHJcblxyXG59KTtcclxuc29ja2V0LmVtaXQoJ2V2ZW50U2VydmVyJywge2RhdGE6ICdIZWxsbyBTZXJ2ZXInfSk7XHJcblxyXG4vLyA9PT09PT09PT09PSBCYXNlIG1vZHVsZSA9PT09PT09PT09PVxyXG5cclxudmFyIEJhc2VNb2R1bGUgPSBmdW5jdGlvbigpe1xyXG5cclxuXHQvLz09PT09PSDQntCx0YrQtdC60YLRiyzQvNCw0YHRgdC40LLRiyA9PT09PT1cclxuXHR0aGlzLmVycm9ycyA9IHtcclxuICBcdDAgOiAn0JfQsNC/0L7Qu9C90LXQvdGLINC90LUg0LLRgdC1INC/0L7Qu9GPJyxcclxuICBcdDEgOiAn0JLQstC10LTQuNGC0LUg0LrQvtGA0YDQtdC60YLQvdGL0LkgZS1tYWlsJyxcclxuICBcdDJcdDogJ9CU0LvQuNC90LAg0L/QsNGA0L7Qu9GPINC80LXQvdGM0YjQtSA4INGB0LjQvNCy0L7Qu9C+0LInLFxyXG4gIFx0MyA6ICfQktGL0LHQtdGA0LjRgtC1INC+0LHQu9C+0LbQutGDJ1xyXG4gIH07XHJcblxyXG4gIHRoaXMuUmVnUGF0dGVybnMgPSB7XHJcbiAgXHRlbWFpbCA6IC9eKFswLTlhLXpBLVpfLV0rXFwuKSpbMC05YS16QS1aXy1dK0BbMC05YS16QS1aXy1dKyhcXC5bMC05YS16QS1aXy1dKykqXFwuW2Etel17Miw2fSQvLFxyXG4gIH07XHJcblxyXG4gIHRoaXMuZ2xvYmFsID0ge307XHJcblxyXG5cclxuXHJcblxyXG4gIC8vPT09PT09INCk0YPQvdC60YbQuNC4ID09PT09PVxyXG5cclxuXHJcblx0dGhpcy5hamF4RGF0YSA9IGZ1bmN0aW9uKGZvcm0sX3R5cGUpe1xyXG5cdFx0dmFyIGVsZW0gPSBmb3JtLmZpbmQoJ2lucHV0W3R5cGUgIT0gc3VibWl0XSx0ZXh0YXJlYScpO1xyXG5cdFx0dmFyIGRhdGEgPSB7fTtcclxuXHRcdCQuZWFjaChlbGVtLCBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGRhdGFbJCh0aGlzKS5hdHRyKCduYW1lJyldID0gJCh0aGlzKS52YWwoKTtcclxuXHRcdH0pXHJcblx0XHR2YXIgZm9ybWF0ID0gX3R5cGUgfHwgSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuXHRcdHJldHVybiBmb3JtYXQ7XHJcblx0fTtcclxuXHJcblx0dGhpcy5hamF4ID0gZnVuY3Rpb24oZm9ybSwgdXJsLCBfbWV0aG9kKXtcclxuXHRcdFx0dmFyIG1ldGhvZCA9IF9tZXRob2QgfHwgJ1BPU1QnO1xyXG5cdFx0XHR2YXIgZGF0YSA9IHRoaXMuYWpheERhdGEoZm9ybSk7XHJcblx0XHRcdHJldHVybiAkLmFqYXgoe1xyXG5cdFx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHRcdHR5cGU6IG1ldGhvZCxcclxuXHRcdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG5cdFx0XHRcdGRhdGE6IGRhdGFcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmFqYXhEYXRhT2JqID0gZnVuY3Rpb24ob2JqLHVybCxtZXRob2Qpe1xyXG5cdFx0bWV0aG9kID0gbWV0aG9kIHx8ICdQT1NUJ1xyXG5cdFx0dmFyIGRhdGEgPSBKU09OLnN0cmluZ2lmeShvYmopO1xyXG5cdFx0cmV0dXJuICQuYWpheCh7XHJcblx0XHRcdHVybDogdXJsLFxyXG5cdFx0XHR0eXBlOiBtZXRob2QsXHJcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXHJcblx0XHRcdGRhdGE6IGRhdGFcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0dGhpcy5zaG93RXJyb3IgPSBmdW5jdGlvbihlcnJvckluZGV4LGVsZW0sX21zKXtcclxuXHRcdHZhciB0aGlzRnJvbSA9IGVsZW0uY2xvc2VzdCgnZm9ybScpO1xyXG5cdFx0dmFyIHRpbWUgPSBfbXMgfHwgMjAwMDtcclxuXHRcdGlmKHR5cGVvZihlcnJvckluZGV4KSA9PSAnc3RyaW5nJyl7XHJcblx0XHRcdGVsZW0udGV4dChlcnJvckluZGV4KVxyXG5cdFx0fWVsc2V7XHJcblx0XHRcdGVsZW0udGV4dCh0aGlzLmVycm9yc1tlcnJvckluZGV4XSk7XHJcblx0XHR9XHJcblx0XHRpZih0aGlzRnJvbS5maW5kKGVsZW0pLmlzKCc6dmlzaWJsZScpKXtcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuZ2xvYmFsLnRpbWVyKTtcclxuXHRcdFx0dGhpcy5nbG9iYWwudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0ZWxlbS50ZXh0KCk7XHJcblx0XHRcdFx0ZWxlbS5yZW1vdmVDbGFzcygnc2hvdycpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH0sIHRpbWUpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0XHRlbGVtLnJlbW92ZUNsYXNzKCdoaWRlJykuYWRkQ2xhc3MoJ3Nob3cnKTtcclxuXHJcblxyXG5cdFx0dGhpcy5nbG9iYWwudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGVsZW0udGV4dCgpO1xyXG5cdFx0XHRlbGVtLnJlbW92ZUNsYXNzKCdzaG93JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0sIHRpbWUpO1xyXG5cclxuXHR9XHJcblxyXG5cdHRoaXMuaGlkZUVycm9yID0gZnVuY3Rpb24oZWxlbSl7XHJcblx0XHRlbGVtLnJlbW92ZUNsYXNzKCdzaG93JykuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHR9XHJcblxyXG5cdHRoaXMudmFsaWRFbWFpbCA9IGZ1bmN0aW9uKGlucHV0LCBwYXR0ZXIpe1xyXG5cdFx0cmV0dXJuIHBhdHRlci50ZXN0KGlucHV0LnZhbCgpKTtcclxuXHR9O1xyXG5cclxuXHR0aGlzLnZhbGlkUGFzcyA9IGZ1bmN0aW9uKGlucHV0LGxlbmd0aCl7XHJcblx0XHR2YXIgbGVuID0gbGVuZ3RoIHx8IDg7XHJcblx0XHRpZighKGlucHV0LnZhbCgpLmxlbmd0aCA8IGxlbikpe1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHR0aGlzLnZhbGlkRmlsZXMgPSBmdW5jdGlvbihpbnB1dCxsZW5ndGgpe1xyXG5cdFx0dmFyIGxlbiA9IGxlbmd0aCB8fCAwO1xyXG5cdFx0aWYoIShpbnB1dFswXS5maWxlcy5sZW5ndGggPD0gbGVuKSl7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0dGhpcy52YWxpZGF0ZUZvcm0gPSBmdW5jdGlvbihmb3JtKSB7XHJcblx0XHR2YXIgdGhpc01vZHVsZSA9IHRoaXM7XHJcblx0XHR2YXIgcGF0dGVybiA9IHRoaXNNb2R1bGUuUmVnUGF0dGVybnMuZW1haWw7XHJcblx0XHR2YXIgJHRoaXNGb3JtID0gZm9ybTtcclxuXHRcdHZhciBlbGVtZW50cyA9ICR0aGlzRm9ybS5maW5kKCd0ZXh0YXJlYSxpbnB1dDpub3QoaW5wdXRbdHlwZT1cInN1Ym1pdFwiXSknKTtcclxuXHRcdHZhciBlcnJvcnMgPSB0aGlzTW9kdWxlLmVycm9ycztcclxuXHRcdHZhciBvdXRwdXQgPSBbXTtcclxuXHJcblx0XHQkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCEkKHRoaXMpLnZhbCgpICYmICQodGhpcykuYXR0cigndHlwZScpICE9ICdmaWxlJyl7XHJcblx0XHRcdFx0XHRvdXRwdXRbMF0gPSAwO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZihvdXRwdXQubGVuZ3RoID09IDApe1xyXG5cdFx0XHQkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0XHR2YXIgdHlwZSA9ICR0aGlzLmF0dHIoJ3R5cGUnKTtcclxuXHRcdFx0XHR2YXIgbmFtZUF0dHIgPSAkdGhpcy5hdHRyKCduYW1lJyk7XHJcblx0XHRcdFx0c3dpdGNoKHR5cGUpe1xyXG5cdFx0XHRcdFx0Y2FzZSAncGFzc3dvcmQnIDpcclxuXHRcdFx0XHRcdFx0aWYoIXRoaXNNb2R1bGUudmFsaWRQYXNzKCR0aGlzKSl7XHJcblx0XHRcdFx0XHRcdFx0b3V0cHV0LnB1c2goMik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdlbWFpbCcgOlxyXG5cdFx0XHRcdFx0XHRpZighdGhpc01vZHVsZS52YWxpZEVtYWlsKCR0aGlzLHBhdHRlcm4pKXtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQucHVzaCgxKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHN3aXRjaChuYW1lQXR0cil7XHJcblx0XHRcdFx0XHRjYXNlICdhZGRBbGJ1bUNvdmVyJyA6XHJcblx0XHRcdFx0XHRcdGlmKCF0aGlzTW9kdWxlLnZhbGlkRmlsZXMoJHRoaXMpKXtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQucHVzaCgzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9KVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH07XHJcblxyXG5cdHRoaXMuY2xlYXJJbnB1dHMgPSBmdW5jdGlvbihmb3JtKXtcclxuXHRcdHZhciBlbGVtID0gZm9ybS5maW5kKCdpbnB1dFt0eXBlICE9IHN1Ym1pdF0sdGV4dGFyZWEnKTtcclxuXHRcdGVsZW0udmFsKCcnKTtcclxuXHR9XHJcblxyXG5cdHRoaXMuc2Nyb2xsVG9Qb3NpdGlvbiA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBkdXJhdGlvbil7XHJcbiAgXHR2YXIgcG9zaXRpb24gPSBwb3NpdGlvbiB8fCAwO1xyXG5cdFx0dmFyIGR1cmF0aW9uID0gZHVyYXRpb24gfHwgMTAwMDtcclxuXHJcblxyXG5cdFx0JChcImJvZHksIGh0bWxcIikuYW5pbWF0ZSh7XHJcblx0XHRcdFx0c2Nyb2xsVG9wOiBwb3NpdGlvblxyXG5cdFx0fSwgZHVyYXRpb24pXHJcbiAgfTtcclxuXHJcbiAgdGhpcy5jaGFuZ2VDbGFzcyA9IGZ1bmN0aW9uKHBhcmVudCxjbGFzc05hbWUsdHlwZSl7XHJcbiAgXHRpZih0eXBlb2YocGFyZW50KSA9PSAnc3RyaW5nJyl7XHJcbiAgXHRcdHZhciBwYXJlbnQgPSAkKHBhcmVudCk7XHJcbiAgXHR9XHJcbiAgXHRzd2l0Y2godHlwZSl7XHJcbiAgXHRcdGNhc2UgJ2FkZCc6XHJcbiAgXHRcdFx0cGFyZW50LmFkZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgXHRcdFx0YnJlYWs7XHJcbiAgXHRcdGNhc2UgJ2RlbCc6XHJcbiAgXHRcdFx0cGFyZW50LnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XHJcbiAgXHRcdFx0YnJlYWs7XHJcblxyXG4gIFx0fVxyXG4gIH07XHJcblxyXG5cdFxyXG5cclxufSIsIi8vID09PT09PT09PT09IENvbW1vbiBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0L7QsdGJ0LjQtSDRgdC60YDQuNC/0YLRiywg0L/RgNC40YHRg9GJ0LjQtSDQstGB0LXQvCDRgdGC0YDQsNC90LjRhtCw0Lwg0YHQsNC50YLQsC5cclxuXHJcbnZhciBjb21tb25Nb2R1bGUgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcblxyXG5cclxuLy8g0J/RgNC+0LrRgNGD0YLQuNGC0Ywg0YHRgtGA0LDQvdC40YbRgyDQtNC+IC4uLlxyXG5cdHZhciBzY3JvbGxUbyA9IGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHZhciBidG4gICAgICAgID0gJCh0aGlzKTtcclxuXHRcdHZhciB0YXJnZXQgICAgID0gYnRuLmF0dHIoJ2RhdGEtZ28nKTtcclxuXHRcdHZhciBjb250YWluZXIgID0gbnVsbDtcclxuXHJcblx0XHRpZiAodGFyZ2V0ID09ICd0b3AnKSB7XHJcblx0XHRcdGJhc2Uuc2Nyb2xsVG9Qb3NpdGlvbigpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG4vLyDQodCy0L7RgNCw0YfQuNCy0LDQvdC40LUg0LHQu9C+0LrQsCDRgSDQutC+0LzQvNC10L3RgtCw0YDQuNGP0LzQuFxyXG5cdHZhciBjb21tZW50c1RvZ2dsZSA9IGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdHZhciBidG4gICAgICAgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIGNvbnRhaW5lciA9IGJ0bi5jbG9zZXN0KCcuY29tbWVudHMnKTtcclxuXHRcdHZhciBjb21tZW50cyAgPSBjb250YWluZXIuZmluZCgnLmNvbW1lbnRzX19saXN0Jyk7XHJcblxyXG5cdFx0aWYoY29udGFpbmVyLmhhc0NsYXNzKCdjb21tZW50cy0tc2hvdycpKSB7XHJcblx0XHRcdGNvbnRhaW5lci5yZW1vdmVDbGFzcygnY29tbWVudHMtLXNob3cnKTtcclxuXHRcdFx0Y29tbWVudHMuc2xpZGVVcCgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29udGFpbmVyLmFkZENsYXNzKCdjb21tZW50cy0tc2hvdycpO1xyXG5cdFx0XHRjb21tZW50cy5zbGlkZURvd24oKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyBkcm9wIC0g0Y3Qu9C10LzQtdC90YIg0YEg0LLRi9C/0LDQtNCw0Y7RidC40Lwg0LHQu9C+0LrQvtC8XHJcblx0dmFyIGFkZERyb3AgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0dmFyIHRyaWdnZXIgICAgID0gJCh0aGlzKTtcclxuXHRcdHZhciBjb250YWluZXIgICA9IHRyaWdnZXIuY2xvc2VzdCgnLmRyb3AnKTtcclxuXHRcdHZhciBjb250ZW50ICAgICA9IGNvbnRhaW5lci5maW5kKCcuZHJvcF9fbWFpbicpO1xyXG5cdFx0dmFyIGNsYXNzQWN0aXZlID0gJ2Ryb3AtLW9wZW4nO1xyXG5cclxuXHRcdGlmKGNvbnRhaW5lci5oYXNDbGFzcygnZHJvcC0taG92ZXInKSkgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnRhaW5lci50b2dnbGVDbGFzcyggY2xhc3NBY3RpdmUgKTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8g0JrQsNGB0YLQvtC80L3Ri9C5INCy0LjQtCDQtNC70Y8g0LfQsNCz0YDRg9C30LrQuCDRhNCw0LnQu9C+0LJcclxuXHQvLyDQn9C+0LbQsNC70YPQudGB0YLQsCwg0LjRgdC/0YDQsNCy0YzRgtC1INGN0YLRgyDRhNGD0L3QutGG0LjRjiwg0L3QtSDQv9C+0L3Rj9GC0L3QviDQs9C00LUg0L7QvdCwINC40YHQv9C+0LvRjNC30YPQtdGC0YzRgdGPINC4INC90YPQttC90L4g0LLRi9GC0LDRidC40YLRjCBvbiBjbGljayDQsiBfc2V0VXBsaXN0bmVyXHJcblx0dmFyIGZpbGVVcGxvYWQgPSBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGVsID0gJCgnLnVwbG9hZCcpO1xyXG5cclxuXHRcdGlmKGVsLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xyXG5cclxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcudXBsb2FkJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR2YXIgZWwgICAgPSAkKHRoaXMpO1xyXG5cdFx0XHR2YXIgaW5wdXQgPSBlbC5jaGlsZHJlbignW3R5cGU9ZmlsZV0nKTtcclxuXHJcblx0XHRcdGlucHV0WzBdLmNsaWNrKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyDQoNCw0LfQu9C+0LPQuNC9INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xyXG5cdC8vINCd0YPQttC90L4g0LTQvtGA0LDQsdC+0YLQsNGC0YxcclxuXHR2YXIgbG9nb3V0VXNlciA9IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgb2JqID0ge1xyXG5cdFx0XHRyZXE6IFwibG9nb3V0XCJcclxuXHRcdH1cclxuXHRcdHZhciBkYXRhID0gSlNPTi5zdHJpbmdpZnkob2JqKTtcclxuXHJcblx0XHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3Q7XHJcblx0XHRcdHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHRcdFx0eGhyLm9wZW4oJ1BPU1QnLCBpZCArICdsb2dvdXQvJyx0cnVlKTtcclxuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuXHRcdFx0eGhyLnNlbmQoZGF0YSk7XHJcblx0XHRcdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cdFx0XHRcdC8vINCf0LXRgNC10LfQsNCz0YDRg9C30LrQsCDRgdGC0YDQsNC90LjRhtGLXHJcblx0XHRcdFx0aWYoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KS5zdGF0dXMgPT0gXCJsb2dvdXRcIil7XHJcblx0XHRcdFx0XHQvL3dpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XHJcblx0XHRcdFx0XHR2YXIgc2l0ZSA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgJy8nO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKTtcclxuXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2l0ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxufVxyXG5cclxuXHR2YXIgZWRpdFVzZXJEYXRhID0gZnVuY3Rpb24oKXtcclxuXHRcdGNvbnNvbGUubG9nKDEyKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8g0J/RgNC+0YHQu9GD0YjQutCwXHJcblx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuY29tbWVudHNfX3RvZ2dsZScgLCBjb21tZW50c1RvZ2dsZSk7XHJcblx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICdbZGF0YS1nb10nICwgc2Nyb2xsVG8pO1xyXG5cdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmRyb3BfX3RyaWdnZXInLCBhZGREcm9wKTtcclxuXHRcdFx0JCgnLmxvZ291dCcpLm9uKCdjbGljaycsIGxvZ291dFVzZXIpXHJcblx0fTtcclxuXHJcblxyXG5cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIFx0X3NldFVwTGlzdG5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgfTtcclxufSkoKTsiLCIvLyA9PT09PT09PT09PSBMb2dpbiBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0LLRgdC1INGH0YLQviDRgdCy0Y/Qt9Cw0L3QvdC+INGBINGE0L7RgNC80L7QuSDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4INC4INGA0LXQs9C40YHRgtGA0LDRhtC40LguXHJcblxyXG5cclxudmFyIGxvZ2luTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHQvLyDQk9C70L7QsdCw0LvRjNC90YvQtSDQv9C10YDQtdC80LXQvdC90YvQtSDQvNC+0LTRg9C70Y8uXHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuICBcclxuICB2YXIgdG9TZW5kUmVxdWVzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgXHR2YXIgJGZvcm0gPSAkKCcucG9wdXBfX2Zvcm0nKTtcclxuICBcdHZhciAkZm9ybUxvZ2luID0gJGZvcm0uZmlsdGVyKCcucG9wdXBfX2Zvcm0tbG9naW4nKTtcclxuICBcdHZhciAkZm9ybVJlZyA9ICRmb3JtLmZpbHRlcignLnBvcHVwX19mb3JtLXJlZ2lzdHJhdGlvbicpO1xyXG4gIFx0dmFyICRmb3JtUmVjb3ZlciA9ICRmb3JtLmZpbHRlcignLnBvcHVwX19mb3JtLXJlY292ZXInKTtcclxuICBcdHZhciBidXR0b24gPSAnaW5wdXRbdHlwZSA9IHN1Ym1pdF0nO1xyXG4gIFx0dmFyIHBvcHVwVGltZSA9IDUwMDA7XHJcblxyXG4gIFx0Ly8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIGxvZ2luXHJcbiAgXHQkZm9ybUxvZ2luLmZpbmQoYnV0dG9uKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICBcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCAgXHRcdHZhciAkdGhpc0Zvcm0gPSAkKHRoaXMpLmNsb3Nlc3QoJ2Zvcm0nKTtcclxuXHQgIFx0XHQvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0LTQu9GPIHBvcHVwXHJcblx0ICBcdFx0dmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkdGhpc0Zvcm0pOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcblx0ICBcdFx0dmFyICRlcnJvckNvbnRhaW5lciA9ICR0aGlzRm9ybS5maW5kKCcucG9wdXBfX2Vycm9yJyk7XHJcblx0ICBcdFx0aWYoZXJyb3JBcnJheS5sZW5ndGggPiAwKXtcdC8vINCV0YHQu9C4INCyINC80LDRgdGB0LjQstC1INC10YHRgtGMINC+0YjQuNCx0LrQuCwg0LfQvdCw0YfQuNGCINCy0YvQtNCw0LXQvCDQvtC60L3Qviwg0YEg0L3QvtC80LXRgNC+0Lwg0L7RiNC40LHQutC4XHJcblx0ICBcdFx0XHRlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdCAgXHRcdFx0XHRiYXNlLnNob3dFcnJvcihpbmRleCwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHR9KTtcclxuXHQgIFx0XHR9ZWxzZXsgLy8g0JXRgdC70Lgg0LzQsNGB0YHQuNCyINC/0YPRgdGC0L7QuSwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00LDQu9GM0YjQtVxyXG5cdCAgXHRcdFx0c2VydkFucyA9IGJhc2UuYWpheCgkdGhpc0Zvcm0sJy9sb2dpbi8nKTtcclxuXHQgIFx0XHRcdHNlcnZBbnMuZG9uZShmdW5jdGlvbihhbnMpe1xyXG5cdCAgXHRcdFx0XHRpZighYW5zLnN0YXR1cyl7XHJcblx0ICBcdFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0XHR9ZWxzZXtcclxuXHQgIFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xyXG5cdCAgXHRcdFx0XHR9XHJcblx0ICBcdFx0XHR9KTtcclxuXHQgIFx0XHR9XHJcbiAgXHRcdFxyXG4gIFx0fSlcclxuXHJcbiAgXHQvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgcmVnXHJcbiAgXHQkZm9ybVJlZy5maW5kKGJ1dHRvbikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHQgIFx0XHR2YXIgJHRoaXNGb3JtID0gJCh0aGlzKS5jbG9zZXN0KCdmb3JtJyk7XHJcblx0ICBcdFx0Ly8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG5cdCAgXHRcdHZhciBlcnJvckFycmF5ID0gYmFzZS52YWxpZGF0ZUZvcm0oJHRoaXNGb3JtKTsgLy8g0J/RgNC+0LLQtdGA0Y/QtdC8INGC0LXQutGD0YnRg9GOINGE0L7RgNC80YMg0Lgg0LLRi9C00LDQtdC8INC80LDRgdGB0LjQsiDQuNC90LTQtdC60YHQvtCyINC+0YjQuNCx0L7QulxyXG5cdCAgXHRcdHZhciAkZXJyb3JDb250YWluZXIgPSAkdGhpc0Zvcm0uZmluZCgnLnBvcHVwX19lcnJvcicpO1xyXG5cdCAgXHRcdGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG5cdCAgXHRcdFx0ZXJyb3JBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcclxuXHQgIFx0XHRcdFx0YmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0fSk7XHJcblx0ICBcdFx0fWVsc2V7IC8vINCV0YHQu9C4INC80LDRgdGB0LjQsiDQv9GD0YHRgtC+0LksINCy0YvQv9C+0LvQvdGP0LXQvCDQtNCw0LvRjNGI0LVcclxuXHQgIFx0XHRcdHNlcnZBbnMgPSBiYXNlLmFqYXgoJHRoaXNGb3JtLCcvcmVnLycpO1xyXG5cdCAgXHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucyl7XHJcblx0ICBcdFx0XHRcdGlmKCFhbnMuc3RhdHVzKXtcclxuXHQgIFx0XHRcdFx0XHRiYXNlLnNob3dFcnJvcihhbnMubWVzc2FnZSwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHRcdH1lbHNle1xyXG5cdCAgXHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XHJcblx0ICBcdFx0XHRcdH1cclxuXHQgIFx0XHRcdH0pO1xyXG5cdCAgXHRcdH1cclxuICBcdFx0XHJcbiAgXHR9KVxyXG5cclxuICBcdC8vINCe0YLQv9GA0LDQstC70Y/QtdC8IGFqYXgg0L3QsCByZWNvdmVyXHJcblxyXG4gIFx0JGZvcm1SZWNvdmVyLmZpbmQoYnV0dG9uKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICBcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCAgXHRcdHZhciAkdGhpc0Zvcm0gPSAkKHRoaXMpLmNsb3Nlc3QoJ2Zvcm0nKTtcclxuXHQgIFx0XHQvLyDQn9Cw0YDQsNC80LXRgtGA0Ysg0LTQu9GPIHBvcHVwXHJcblx0ICBcdFx0dmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkdGhpc0Zvcm0pOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcblx0ICBcdFx0dmFyICRlcnJvckNvbnRhaW5lciA9ICR0aGlzRm9ybS5maW5kKCcucG9wdXBfX2Vycm9yJyk7XHJcblx0ICBcdFx0aWYoZXJyb3JBcnJheS5sZW5ndGggPiAwKXtcdC8vINCV0YHQu9C4INCyINC80LDRgdGB0LjQstC1INC10YHRgtGMINC+0YjQuNCx0LrQuCwg0LfQvdCw0YfQuNGCINCy0YvQtNCw0LXQvCDQvtC60L3Qviwg0YEg0L3QvtC80LXRgNC+0Lwg0L7RiNC40LHQutC4XHJcblx0ICBcdFx0XHRlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG5cdCAgXHRcdFx0XHRiYXNlLnNob3dFcnJvcihpbmRleCwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcblx0ICBcdFx0XHR9KTtcclxuXHQgIFx0XHR9ZWxzZXsgLy8g0JXRgdC70Lgg0LzQsNGB0YHQuNCyINC/0YPRgdGC0L7QuSwg0LLRi9C/0L7Qu9C90Y/QtdC8INC00LDQu9GM0YjQtVxyXG5cdCAgXHRcdFx0c2VydkFucyA9IGJhc2UuYWpheCgkdGhpc0Zvcm0sJy9yZWNvdmVyLycpO1xyXG5cdCAgXHRcdFx0c2VydkFucy5kb25lKGZ1bmN0aW9uKGFucyl7XHJcblx0ICBcdFx0XHRcdGlmKCFhbnMuc3RhdHVzKXtcclxuXHQgIFx0XHRcdFx0XHRyZXR1cm4gYmFzZS5zaG93RXJyb3IoYW5zLm1lc3NhZ2UsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG5cdCAgXHRcdFx0XHR9ZWxzZXtcclxuXHQgIFx0XHRcdFx0XHRiYXNlLmNsZWFySW5wdXRzKCR0aGlzRm9ybSk7XHJcblx0ICBcdFx0XHRcdFx0cmV0dXJuIGJhc2Uuc2hvd0Vycm9yKGFucy5tZXNzYWdlLCRlcnJvckNvbnRhaW5lciwgcG9wdXBUaW1lKTtcclxuXHQgIFx0XHRcdFx0XHRcclxuXHQgIFx0XHRcdFx0fVxyXG5cdCAgXHRcdFx0fSk7XHJcblx0ICBcdFx0fVxyXG4gIFx0XHRcclxuICBcdH0pXHJcblxyXG4gIH1cclxuXHJcbiBcclxuXHJcbiAgdmFyIHBvcHVwV2luZG93QW5pbWF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgXHQvLyDQsNC90LjQvNCw0YbQuNGPIHBvcHVwXHJcblx0XHQvLyDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCBcItC30LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRj1wiXHJcblx0XHR2YXIgZmxpcHAgXHQ9ICdmbGlwcCc7XHJcblx0XHR2YXIgaGlkZSBcdFx0PSAnaGlkZSc7XHJcblx0XHR2YXIgJGZsaXBDb250YWluZXIgPSAkKCcuZmxpcHBlci1jb250YWluZXInKTtcclxuXHRcdHZhciAkYmFja1Bhc3MgPSAkKCcuYmFjay1wYXNzJyk7XHJcblx0XHR2YXIgJGJhY2tSZWcgPSAkKCcuYmFjay1yZWcnKTtcclxuXHJcblx0XHQkKCcucG9wdXBfX2xpbmtfcmVnaXN0cicpLmNsaWNrKGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCRiYWNrUGFzcy5hZGRDbGFzcyhoaWRlKTtcclxuXHRcdFx0JGJhY2tSZWcucmVtb3ZlQ2xhc3MoaGlkZSk7XHJcblx0XHQgXHQkZmxpcENvbnRhaW5lci5hZGRDbGFzcyhmbGlwcCk7XHJcblx0IH0pO1xyXG5cclxuXHJcblx0XHQvLyDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCBcItCy0L7QudGC0LhcIlxyXG5cdFx0JCgnLnBvcHVwX19saW5rX2VudGVyJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHQgXHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0IFx0XHQkZmxpcENvbnRhaW5lci5yZW1vdmVDbGFzcyhmbGlwcCk7XHJcblx0IH0pO1xyXG5cclxuXHJcblx0XHQvLyDQv9GA0Lgg0L3QsNC20LDRgtC40Lgg0L3QsCBcItC30LDQsdGL0LvQuCDQv9Cw0YDQvtC70YxcIlxyXG5cdFx0JCgnLnBvcHVwX19saW5rX2ZvcmdldC1wYXNzJykuY2xpY2soZnVuY3Rpb24oZSl7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0JGJhY2tQYXNzLnJlbW92ZUNsYXNzKGhpZGUpO1xyXG5cdFx0XHQkYmFja1JlZy5hZGRDbGFzcyhoaWRlKTtcclxuXHRcdCBcdCRmbGlwQ29udGFpbmVyLmFkZENsYXNzKGZsaXBwKTtcclxuXHQgfSk7XHJcbiAgfTtcclxuXHJcblxyXG4gXHJcblxyXG5cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICBcdHBvcHVwV2luZG93QW5pbWF0ZSgpO1xyXG4gICAgICBcdHRvU2VuZFJlcXVlc3QoKTtcclxuICAgICAgfVxyXG5cclxuICB9O1xyXG59KSgpOyIsIi8v0J7QsdGA0LDQsdCw0YLRi9Cy0LXQvCBEcmFnRW5kRHJvcHNcclxudmFyIGlzQWR2YW5jZWRVcGxvYWQgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgcmV0dXJuICgoJ2RyYWdnYWJsZScgaW4gZGl2KSB8fCAoJ29uZHJhZ3N0YXJ0JyBpbiBkaXYgJiYgJ29uZHJvcCcgaW4gZGl2KSkgJiYgJ0Zvcm1EYXRhJyBpbiB3aW5kb3cgJiYgJ0ZpbGVSZWFkZXInIGluIHdpbmRvdztcclxufSgpO1xyXG4vLyDQp9C40YLQsNC10Lwg0YDQsNC30LzQtdGC0LrRgyDQuCDRgdC+0YXRgNCw0L3Rj9C10Lwg0YTQvtGA0LzRg1xyXG52YXIgJGZvcm0gPSAkKCcjdXBsb2FkJyk7XHJcbnZhciAkaW5wdXQgPSAkKCcjZmlsZScpO1xyXG52YXIgJHNhdmUgPSAkKCcjc2F2ZScpO1xyXG5cclxuLy8g0JXRgdC70Lgg0YfRgtC+0YLQviDQt9Cw0LrQuNC90YPQu9C4INC00L7QsdCw0LLQu9GP0LXQvCDQutC70LDRgdGBXHJcbmlmIChpc0FkdmFuY2VkVXBsb2FkKSB7XHJcblxyXG4gIHZhciBkcm9wcGVkRmlsZXMgPSBmYWxzZTtcclxuXHJcbiAgJGZvcm0ub24oJ2RyYWcgZHJhZ3N0YXJ0IGRyYWdlbmQgZHJhZ292ZXIgZHJhZ2VudGVyIGRyYWdsZWF2ZSBkcm9wJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9KVxyXG4gICAgLm9uKCdkcmFnb3ZlciBkcmFnZW50ZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgJGZvcm0uYWRkQ2xhc3MoJ2lzLWRyYWdvdmVyJyk7XHJcbiAgICB9KVxyXG4gICAgLm9uKCdkcmFnbGVhdmUgZHJhZ2VuZCBkcm9wJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdpcy1kcmFnb3ZlcicpO1xyXG4gICAgfSlcclxuICAgIC5vbignZHJvcCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgZHJvcHBlZEZpbGVzID0gZS5vcmlnaW5hbEV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcztcclxuICAgICAgY29uc29sZS5sb2coZHJvcHBlZEZpbGVzKTtcclxuICAgICAgJGZvcm0udHJpZ2dlcignc3VibWl0Jyk7XHJcbiAgICB9KTtcclxuXHJcbiAgJGlucHV0Lm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7IC8vIGRyYWcgJiBkcm9wINCd0JUg0L/QvtC00LTQtdGA0LbQuNCy0LDQtdGC0YHRj1xyXG4gICAgJGZvcm0udHJpZ2dlcignc3VibWl0Jyk7XHJcbiAgfSk7XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxufVxyXG5cclxuXHJcbi8vINCg0YPRh9C90LDRjyDQvtGC0L/RgNCw0LLQutCwXHJcbiRmb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgaWYgKCRmb3JtLmhhc0NsYXNzKCdpcy11cGxvYWRpbmcnKSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAvL2FsZXJ0KCfQntGC0L/RgNCw0LLQu9GP0LXQvCcpO1xyXG5cclxuICAkZm9ybS5hZGRDbGFzcygnaXMtdXBsb2FkaW5nJykucmVtb3ZlQ2xhc3MoJ2lzLWVycm9yJyk7XHJcblxyXG4gIGlmIChpc0FkdmFuY2VkVXBsb2FkKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdmFyIGFqYXhEYXRhID0gbmV3IEZvcm1EYXRhKCRmb3JtLmdldCgwKSk7XHJcblxyXG4gICAgaWYgKGRyb3BwZWRGaWxlcykge1xyXG4gICAgICAkLmVhY2goIGRyb3BwZWRGaWxlcywgZnVuY3Rpb24oaSwgZmlsZSkge1xyXG5cclxuICAgICAgICBhamF4RGF0YS5hcHBlbmQoICRpbnB1dC5hdHRyKCduYW1lJyksIGZpbGUgKTtcclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogbG9jYXRpb24uaHJlZiArICcvYWRkSW1nLycsXHJcbiAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxyXG4gICAgICBkYXRhOiBhamF4RGF0YSxcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKGFucykge1xyXG4gICAgICAgICRmb3JtLnJlbW92ZUNsYXNzKCdpcy11cGxvYWRpbmcnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhhbnMucmVzcG9uc2VUZXh0KTtcclxuXHJcblxyXG4gICAgICBcclxuICAgICAgLy9zb2NrZXQuZW1pdCgnZXZlbnRTZXJ2ZXInLCB7ZGF0YTogJ0hlbGxvIFNlcnZlcid9KTtcclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAgICAgICAkZm9ybS5hZGRDbGFzcyggZGF0YS5zdWNjZXNzID09IHRydWUgPyAnaXMtc3VjY2VzcycgOiAnaXMtZXJyb3InICk7XHJcblxyXG4gICAgICAgIGlmICghZGF0YS5zdWNjZXNzKSAkZXJyb3JNc2cudGV4dChkYXRhLmVycm9yKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIExvZyB0aGUgZXJyb3IsIHNob3cgYW4gYWxlcnQsIHdoYXRldmVyIHdvcmtzIGZvciB5b3VcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coJGZvcm0uYXR0cignYWN0aW9uJykpO1xyXG5cclxuICB9IGVsc2Uge1xyXG5cclxuICAgIHZhciBpZnJhbWVOYW1lICA9ICd1cGxvYWRpZnJhbWUnICsgbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAkaWZyYW1lICAgPSAkKCc8aWZyYW1lIG5hbWU9XCInICsgaWZyYW1lTmFtZSArICdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+PC9pZnJhbWU+Jyk7XHJcblxyXG4gICAgJCgnYm9keScpLmFwcGVuZCgkaWZyYW1lKTtcclxuICAgICRmb3JtLmF0dHIoJ3RhcmdldCcsIGlmcmFtZU5hbWUpO1xyXG5cclxuICAgICRpZnJhbWUub25lKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZSgkaWZyYW1lLmNvbnRlbnRzKCkuZmluZCgnYm9keScgKS50ZXh0KCkpO1xyXG4gICAgICAkZm9ybVxyXG4gICAgICAgIC5yZW1vdmVDbGFzcygnaXMtdXBsb2FkaW5nJylcclxuICAgICAgICAuYWRkQ2xhc3MoZGF0YS5zdWNjZXNzID09IHRydWUgPyAnaXMtc3VjY2VzcycgOiAnaXMtZXJyb3InKVxyXG4gICAgICAgIC5yZW1vdmVBdHRyKCd0YXJnZXQnKTtcclxuICAgICAgaWYgKCFkYXRhLnN1Y2Nlc3MpICRlcnJvck1zZy50ZXh0KGRhdGEuZXJyb3IpO1xyXG4gICAgICAkZm9ybS5yZW1vdmVBdHRyKCd0YXJnZXQnKTtcclxuICAgICAgJGlmcmFtZS5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG4kc2F2ZS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICQuYWpheCh7XHJcbiAgICB0eXBlOiBcIlBPU1RcIixcclxuICAgIHVybDogbG9jYXRpb24uaHJlZiArICcvc2F2ZUltZy8nLFxyXG4gICAgZGF0YTogJ29rJyxcclxuICAgIGNhY2hlOiBmYWxzZSxcclxuICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgJGZvcm0uYWRkQ2xhc3MoIGRhdGEuc3VjY2VzcyA9PSB0cnVlID8gJ2lzLXN1Y2Nlc3MnIDogJ2lzLWVycm9yJyApO1xyXG4gICAgICBpZiAoIWRhdGEuc3VjY2VzcykgJGVycm9yTXNnLnRleHQoZGF0YS5lcnJvcik7XHJcbiAgICB9LFxyXG4gICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBMb2cgdGhlIGVycm9yLCBzaG93IGFuIGFsZXJ0LCB3aGF0ZXZlciB3b3JrcyBmb3IgeW91XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59KTsiLCIvLyA9PT09PT09PT09PSBNYWluLXBhZ2UgbW9kdWxlID09PT09PT09PT09XHJcbi8vINCt0YLQvtGCINC80L7QtNGD0LvRjCDRgdC+0LTQtdGA0LbQuNGCINCyINGB0LXQsdC1INGB0LrRgNC40L/RgtGLINC60L7RgtC+0YDRi9C1INC40YHQv9C+0LvRjNC30YPRjtGC0YzRgdGPINGC0L7Qu9GM0LrQviDQvdCwINCz0LvQsNCy0L3QvtC5INGB0YLRgNCw0L3QuNGG0LVcclxuLy8g0LDQstGC0L7RgNC40LfQvtCy0LDQvdC90L7Qs9C+INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyAobWFpbi1wYWdlKVxyXG5cclxudmFyIG1haW5QYWdlTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcbiAgLy/QntCx0YnQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcbiBcclxuXHJcblxyXG4gIHZhciAkaGVhZGVyID0gJCgnLmhlYWRlci1tYWluJyk7XHJcbiAgdmFyICRmb290ZXIgPSAkKCcuZm9vdGVyJyk7XHJcbiAgdmFyIGhlYWRlckJnID0gJCgnLmhlYWRlci1tYWluJykuYXR0cignc3R5bGUnKTtcclxuICB2YXIgZm9vdGVyQmcgPSAkKCcuZm9vdGVyJykuYXR0cignc3R5bGUnKTtcclxuXHJcblxyXG4gIHZhciAkaGVhZGVyRnJvbnQgPSAkaGVhZGVyLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1mcm9udCcpO1xyXG4gIHZhciAkaGVhZHJCYWNrID0gJGhlYWRlci5maW5kKCcuaGVhZGVyX19zZWN0aW9uX21haW4tYmFjaycpO1xyXG5cclxuICB2YXIgJGF2YXRhckZyb250ID0gJGhlYWRlckZyb250LmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIHZhciAkYXZhdGFyQmFjayA9ICRoZWFkckJhY2suZmluZCgnLnVzZXItYmxvY2tfX3Bob3RvJyk7XHJcbiAgdmFyIGF2YXRhckZyb250VmFsID0gJGF2YXRhckZyb250LmF0dHIoJ3N0eWxlJyk7XHJcbiAgdmFyIGF2YXRhckJhY2tWYWwgPSAkYXZhdGFyQmFjay5hdHRyKCdzdHlsZScpO1xyXG5cclxuXHJcbiAgdmFyICR1c2VyQmxvY2tGcm9udCA9ICRoZWFkZXJGcm9udC5maW5kKCcudXNlci1ibG9jaycpO1xyXG4gIC8vINCe0LrQvdC+INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuICB2YXIgJGhlYWRlckVkaXQgPSAkaGVhZGVyLmZpbmQoJy5oZWFkZXJfX3NlY3Rpb25fbWFpbi1iYWNrJyk7XHJcbiAgdmFyICRoZWFkZXJFZGl0QXZhdGFyID0gJGhlYWRlci5maW5kKCcudXNlci1ibG9ja19fcGhvdG8tZWRpdCcpO1xyXG4gIHZhciAkaGVhZGVyRWRpZEJnID0gJGhlYWRlckVkaXQuZmluZCgnLmhlYWRlcl9fcGFydC0temlwX21haW4nKTtcclxuICB2YXIgJGhlYWRlckVkaXREYXRhID0gJGhlYWRlckVkaXQuZmluZCgnLnVzZXItYmxvY2stLWVkaXQnKTtcclxuICB2YXIgJHVzZXJCbG9ja01haW4gPSAkaGVhZGVyRWRpdERhdGEuZmluZCgnLnVzZXItYmxvY2tfX21haW4nKTtcclxuICB2YXIgJGZvcm1Sb3cgPSAkdXNlckJsb2NrTWFpbi5maW5kKCcuZm9ybV9fcm93Jyk7XHJcbiAgdmFyICRhdmF0YXJFZGl0ID0gJGhlYWRlckVkaXREYXRhLmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIHZhciBhdmF0YXJCZyA9ICRhdmF0YXJFZGl0LmF0dHIoJ3N0eWxlJyk7XHJcbiAgdmFyIGZyb250QXZhdGFyID0gJGhlYWRlckZyb250LmZpbmQoJy51c2VyLWJsb2NrX19waG90bycpO1xyXG4gIHZhciBmcm9udEF2YXRhckJnID0gZnJvbnRBdmF0YXIuYXR0cignc3R5bGUnKTtcclxuICBcclxuICAvLyDQmtC90L7Qv9C60Lgg0YTQvtGA0LzRiyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPXHJcbiAgdmFyIGZpbGVVcGxvYWRCZyA9ICRoZWFkZXJFZGlkQmcuZmluZCgnaW5wdXRbbmFtZT1cImJnXCJdJyk7XHJcbiAgdmFyIGZpbGVVcGxvYWRBdnRhciA9ICRoZWFkZXJFZGl0QXZhdGFyLmZpbmQoJ2lucHV0W25hbWU9XCJwaG90b1wiXScpXHJcbiAgdmFyIGJ0blJlc2V0ID0gJCgnI2NhbmNlbF9lZGl0X2hlYWRlcicpO1xyXG4gIHZhciBidG5TYXZlID0gJGhlYWRlci5maW5kKCcuYnRuLS1zYXZlJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQktCw0LvQuNC00LDRhtC40Y8g0LjQt9C+0LHRgNCw0LbQtdC90LjRjyjQn9C10YDQtdC90LXRgdGC0Lgg0LIgYmFzZSlcclxuXHR2YXIgdmFsaWRhdGVJbWcgPSBmdW5jdGlvbihwaG90byl7XHJcblx0XHR2YXIgbWF4U2l6ZSA9IDIgKiAxMDI0ICogMTAyNDtcclxuICAgIHZhciBmbGFnID0gdHJ1ZTtcclxuXHRcdGlmKCFwaG90by50eXBlLm1hdGNoKC9pbWFnZVxcLyhqcGVnfGpwZ3xwbmd8Z2lmKS8pICkge1xyXG4gICAgICBmbGFnID0gZmFsc2U7XHJcblxyXG4gICAgICByZXR1cm4gYWxlcnQoJ9Ck0L7RgtC+0LPRgNCw0YTQuNGPINC00L7Qu9C20L3QsCDQsdGL0YLRjCDQsiDRhNC+0YDQvNCw0YLQtSBqcGcsIHBuZyDQuNC70LggZ2lmJyk7XHJcbiAgICB9XHJcblx0XHRpZihwaG90by5zaXplID4gbWF4U2l6ZSl7XHJcbiAgICAgIGZsYWcgPSBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIGFsZXJ0KFwi0KTQvtGC0L7Qs9GA0LDRhNC40Y8g0LHQvtC70YzRiNC1IDLQvNCxXCIpO1xyXG5cdFx0fVxyXG4gICAgcmV0dXJuIGZsYWc7XHJcblx0fVxyXG5cclxuICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDQvdC+0LLRi9C5INCx0LXQutGA0LDRg9C90LQsINC10YnQtSDQsdC10Lcg0L7RgtC/0YDQsNCy0LrQuCDQvdCwINGB0LXRgNCy0LXRgFxyXG4gIHZhciBwcmV2aWVVc2VyQmFja0dyb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgXHRcclxuICBcdHZhciBwaG90byA9ICQodGhpcylbMF0uZmlsZXNbMF07XHJcbiAgXHRpZighdmFsaWRhdGVJbWcocGhvdG8pKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG5cdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcblx0XHRyZWFkZXIucmVhZEFzRGF0YVVSTChwaG90byk7XHJcblx0XHRcclxuXHRcdHJlYWRlci5vbmxvYWQgPSAoZnVuY3Rpb24gKHBob3RvKSB7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgJGhlYWRlci5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJywnYmFja2dyb3VuZC1pbWFnZSA6IHVybCgnKyBlLnRhcmdldC5yZXN1bHQgKycpJylcclxuICAgICAgICAgICRmb290ZXIucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpXHJcbiAgICAgIH1cclxuICAgICAgfSkgKHBob3RvKTtcclxuICB9XHJcblxyXG4gIC8vINCf0L7QutCw0LfRi9Cy0LDQtdC8INC90L7QstGD0Y4g0LDQstCw0YLQsNGA0LrRgyAsINC10YnQtSDQsdC10Lcg0L7RgtC/0YDQsNCy0LrQuCDQvdCwINGB0LXRgNCy0LXRgFxyXG4gIHZhciBwcmV2aWVVc2VyQXZhdGFyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBwaG90byA9ICQodGhpcylbMF0uZmlsZXNbMF07XHJcbiAgICBpZighdmFsaWRhdGVJbWcocGhvdG8pKXtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChwaG90byk7XHJcblxyXG4gICAgcmVhZGVyLm9ubG9hZCA9IChmdW5jdGlvbiAocGhvdG8pIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAkYXZhdGFyRnJvbnQucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpO1xyXG4gICAgICAkYXZhdGFyQmFjay5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJywnYmFja2dyb3VuZC1pbWFnZSA6IHVybCgnKyBlLnRhcmdldC5yZXN1bHQgKycpJyk7XHJcbiAgICB9XHJcbiAgICB9KSAocGhvdG8pO1xyXG5cclxuICAgXHJcblxyXG4gIH1cclxuXHJcbiAgLy8g0KHQutC40LTRi9Cy0LDQtdC8INC/0LDRgNCw0LzQtdGC0YDRiyDQv9GA0Lgg0L7RgtC80LXQvdC1XHJcbiAgdmFyIHJlc2V0VXNlckRhdGEgPSBmdW5jdGlvbigpe1xyXG4gIFx0JGhlYWRlci5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJyxoZWFkZXJCZyk7XHJcbiAgXHQkZm9vdGVyLnJlbW92ZUF0dHIoJ3N0eWxlJykuYXR0cignc3R5bGUnLGZvb3RlckJnKTtcclxuICAgICRhdmF0YXJGcm9udC5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJyxhdmF0YXJGcm9udFZhbCk7XHJcbiAgICAkYXZhdGFyQmFjay5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJyxhdmF0YXJCYWNrVmFsKTtcclxuXHJcbiAgfVxyXG5cclxuICAvLyDQn9C+0LvRg9GH0LDQtdC8INC90L7QstGL0Lkg0LHQtdC60YDQsNGD0L3QtFxyXG4gIHZhciBzZXRVc2VyQmFja0dyb3VuZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBoZWFkZXJCZyA9ICRoZWFkZXIuYXR0cignc3R5bGUnKTtcclxuICAgIGZvb3RlckJnID0gJGZvb3Rlci5hdHRyKCdzdHlsZScpO1xyXG4gIH1cclxuXHJcbiAgdmFyIHNldEF2YXRhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICBhdmF0YXJCZyA9ICRhdmF0YXJFZGl0LmF0dHIoJ3N0eWxlJyk7XHJcbiAgICBmcm9udEF2YXRhciA9ICRhdmF0YXJFZGl0LmF0dHIoJ3N0eWxlJyk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICAvLyDQn9GA0L7Rg9GB0LvRg9GI0LrQsFxyXG4gIHZhciBfc2V0VXBsaXN0bmVyID0gZnVuY3Rpb24oKXtcclxuICBcdGZpbGVVcGxvYWRCZy5vbignY2hhbmdlJyxwcmV2aWVVc2VyQmFja0dyb3VuZCk7XHJcbiAgICBmaWxlVXBsb2FkQXZ0YXIub24oJ2NoYW5nZScscHJldmllVXNlckF2YXRhcik7XHJcbiAgXHRidG5SZXNldC5vbignY2xpY2snLHJlc2V0VXNlckRhdGEpO1xyXG4gIH1cclxuICBcclxuXHJcbiAgLy8g0J7RgtC/0YDQsNCy0LvRj9C10Lwg0LTQsNC90L3Ri9C1INC90LAg0YHQtdGA0LLQtdGAXHJcbiAgdmFyIF9lZGl0VXNlckRhdGEgPSBmdW5jdGlvbigpe1xyXG4gIFx0XHJcbiAgXHRidG5TYXZlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gIFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNldFVzZXJCYWNrR3JvdW5kKCk7XHJcbiAgICAgIHNldEF2YXRhcigpO1xyXG4gIFx0XHR2YXIgdXNlck5hbWUgPSAkdXNlckJsb2NrRnJvbnQuZmluZCgnLnVzZXItYmxvY2tfX25hbWUnKTtcclxuICBcdFx0dmFyIHVzZXJBYm91dCA9ICR1c2VyQmxvY2tGcm9udC5maW5kKCcudXNlci1ibG9ja19fZGVzYycpO1xyXG4gIFx0XHR2YXIgaW5wdXROYW1lID0gJGZvcm1Sb3cuZmluZCgnaW5wdXRbbmFtZSA9IFwibmFtZVwiXScpO1xyXG4gIFx0XHR2YXIgaW5wdXRBYm91dCA9ICRmb3JtUm93LmZpbmQoJ3RleHRhcmVhW25hbWUgPSBcImRlc2NcIl0nKTtcclxuICBcdFx0dmFyIGlkID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xyXG4gIFx0XHR2YXIgcGhvdG8gPSBmaWxlVXBsb2FkQmdbMF0uZmlsZXNbMF07XHJcbiAgICAgIHZhciBhdmF0YXIgPSBmaWxlVXBsb2FkQXZ0YXJbMF0uZmlsZXNbMF07XHJcblxyXG5cclxuICBcdFx0Ly8g0J7QsdC90L7QstC70Y/QtdC8INGC0LXQutGB0YLQvtCy0YvQtSDQtNCw0L3QvdGL0LUg0L3QsCDRgdGC0YDQsNC90LjRhtC1KNC10YnQtSDQsdC10Lcg0LHQsNC30YspXHJcbiAgXHRcdHVzZXJOYW1lLnRleHQoaW5wdXROYW1lLnZhbCgpKTtcclxuICBcdFx0dXNlckFib3V0LnRleHQoaW5wdXRBYm91dC52YWwoKSk7XHJcblxyXG4gIFx0XHRcclxuICBcdFx0Ly8g0KTQvtGA0LzQuNGA0YPQtdC8IGFqYXgg0L7QsdGK0LXQutGCINC00LvRjyDQvtGC0L/RgNCw0LLQutC4INC90LAg0YHQtdGA0LLQtdGAXHJcbiAgXHRcdFx0dmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidXNlckF2YXRhclwiLGF2YXRhcik7XHJcbiAgXHRcdFx0Zm9ybURhdGEuYXBwZW5kKFwidXNlckJhY2tHcm91bmRcIixwaG90byk7XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwidXNlck5hbWVcIixpbnB1dE5hbWUudmFsKCkpO1xyXG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInVzZXJBYm91dFwiLGlucHV0QWJvdXQudmFsKCkpO1xyXG5cclxuXHJcbiAgXHRcdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdDtcclxuICAgICAgICB4aHIub3BlbignUE9TVCcsIGlkICsgJ2VkaXRVc2VyRGF0YS8nLHRydWUpO1xyXG4gICAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAvLyRhdmF0YXJGcm9udC5yZW1vdmVBdHRyKCdzdHlsZScpLmF0dHIoJ3N0eWxlJywnYmFja2dyb3VuZC1pbWFnZSA6IHVybCgnKyBlLnRhcmdldC5yZXN1bHQgKycpJyk7XHJcbiAgICAgICAgICAgIC8vJGF2YXRhckJhY2sucmVtb3ZlQXR0cignc3R5bGUnKS5hdHRyKCdzdHlsZScsJ2JhY2tncm91bmQtaW1hZ2UgOiB1cmwoJysgZS50YXJnZXQucmVzdWx0ICsnKScpO1xyXG4gICAgICAgICAgICAvL2FsZXJ0KFwi0J/RgNC40YjQtdC7INC+0YLQstC10YIg0L7RgiDRgdC10YDQstC10YDQsFwiKVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgXHR9KVxyXG4gIH1cclxuICAvLyDQn9GA0L7RgdC70YPRiNC60LAg0YHQvtCx0YvRgtC40LlcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIFx0X2VkaXRVc2VyRGF0YSgpO1xyXG4gICAgXHRfc2V0VXBsaXN0bmVyKCk7XHJcbiAgICB9LFxyXG4gICAgXHJcbiAgfTtcclxufSkoKTsiLCIvLyA9PT09PT09PT09PSBBbGJ1bSBtb2R1bGUgPT09PT09PT09PT1cclxuLy8g0K3RgtC+0YIg0LzQvtC00YPQu9GMINGB0L7QtNC10YDQttC40YIg0LIg0YHQtdCx0LUg0YHQutGA0LjQv9GC0Ysg0LrQvtGC0L7RgNGL0LUg0LjRgdC/0L7Qu9GM0LfRg9GO0YLRjNGB0Y8g0YLQvtC70YzQutC+INC90LAg0YHRgtGA0LDQvdC40YbQtSDQsNC70YzQsdC+0LzQvtCyLlxyXG5cclxudmFyIGFsYnVtTW9kdWxlID0gKGZ1bmN0aW9uKCkge1xyXG5cdC8vINCe0LHRitGP0LLQu9C10L3QuNC1INCx0LjQsdC70LjQvtGC0LXQutC4XHJcbiAgdmFyIGJhc2UgPSBuZXcgQmFzZU1vZHVsZTtcclxuXHJcbiAgLy8g0J7QsdGJ0LjQuNC1INC/0LXRgNC10LzQtdC90L3Ri9C1XHJcbiAgdmFyICRmb3JtID0gJCgnLnBvcHVwX19mb3JtJyk7XHJcbiAgdmFyICRmb3JtQWRkQWxidW0gPSAkZm9ybS5maWx0ZXIoJy5wb3B1cF9fZm9ybS1hZGQtYWxidW0nKTtcclxuICB2YXIgYnV0dG9uID0gJ2lucHV0W3R5cGUgPSBzdWJtaXRdJztcclxuICB2YXIgcG9wdXBUaW1lID0gNTAwMDtcclxuICB2YXIgYWxidW1Db3ZlcklucHV0ID0gJGZvcm0uZmluZCgnaW5wdXRbbmFtZT1cImFkZEFsYnVtQ292ZXJcIl0nKTtcclxuICB2YXIgbG9hZGVyID0gJ2xvYWRlcic7XHJcblxyXG5cdC8vINCe0YLQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INC40LfQvtCx0YDQsNC20LXQvdC40LlcclxuXHR2YXIgb3BlblVwbG9hZCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKCcubW9kYWxfYWRkLXBob3RvLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKVxyXG5cdH07XHJcblxyXG5cdC8vINCX0LDQutGA0YvRgtGMINC+0LrQvdC+INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INC40LfQvtCx0YDQsNC20LXQvdC40LlcclxuXHR2YXIgY2xvc2VVcGxvYWQgPSBmdW5jdGlvbihlKXtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdHZhciBtb2RhbCA9ICQodGhpcykuY2xvc2VzdCgnLm1vZGFsJyk7XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKG1vZGFsLCdoaWRlJywnYWRkJyk7XHJcblx0XHRiYXNlLmNoYW5nZUNsYXNzKCcubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdhZGQnKTtcclxuXHRcdCQoXCIuaW1nLWxpc3RcIikuZW1wdHkoKTtcclxuXHRcdCQoJy5tb2RhbF9fbG9hZC1pbWcnKS5zaG93KCk7XHJcblx0fTtcclxuXHJcblx0Ly8g0J7RgtC60YDRi9GC0Ywg0L7QutC90L4g0LTQu9GPINGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y8g0YTQvtGC0L4g0Lgg0L7RgtC/0YDQsNCy0LjRgtGMIGFqYXgg0L/RgNC4INGB0L7RhdGA0LDQvdC10L3QuNC4INGA0LXQtNCw0LrRgtC40YDQvtCy0LDQvdC40Y9cclxuXHJcblx0dmFyIG9wZW5FZGl0UGhvdG8gPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8g0J7RgtC60YDRi9GC0Ywg0L7QutC90L5cclxuXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJy5tb2RhbF9lZGl0LXBob3RvLCAubW9kYWwtb3ZlcmxheScsJ2hpZGUnLCdkZWwnKTtcclxuXHJcblx0XHQvLyDQlNCw0L3QvdGL0LUg0LTQu9GPIGFqYXhcclxuXHRcdHZhciAkZm9ybUVkaXRJbWcgPSAkKCcubW9kYWxfX2Zvcm0tZWRpdCcpO1xyXG4gIFx0dmFyIGJ1dHRvbiA9ICdpbnB1dFt0eXBlID0gc3VibWl0XSc7XHJcbiAgXHR2YXIgcG9wdXBUaW1lID0gNTAwMDtcclxuXHQvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgPz8/P1xyXG4gICAgJCgnLnN1Ym1pdC1lZGl0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG4gICAgICB2YXIgZXJyb3JBcnJheSA9IGJhc2UudmFsaWRhdGVGb3JtKCRmb3JtRWRpdEltZyk7IC8vINCf0YDQvtCy0LXRgNGP0LXQvCDRgtC10LrRg9GJ0YPRjiDRhNC+0YDQvNGDINC4INCy0YvQtNCw0LXQvCDQvNCw0YHRgdC40LIg0LjQvdC00LXQutGB0L7QsiDQvtGI0LjQsdC+0LpcclxuICAgICAgdmFyICRlcnJvckNvbnRhaW5lciA9ICRmb3JtRWRpdEltZy5maW5kKCcucG9wdXBfX2Vycm9yJyk7XHJcbiAgICAgIGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG4gICAgICAgIGVycm9yQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpbmRleCl7XHJcbiAgICAgICAgICBiYXNlLnNob3dFcnJvcihpbmRleCwkZXJyb3JDb250YWluZXIsIHBvcHVwVGltZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1lbHNleyBcclxuICAgICAgXHQvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcbiAgICAgICAgdmFyIHNlcnZBbnMgPSBiYXNlLmFqYXgoJGZvcm1FZGl0SW1nLCcvYWxidW0vPz8/LycpO1xyXG4gICAgICB9ICAgIFxyXG5cdH0pO1xyXG59O1xyXG5cclxuXHQvLyDQntGC0LzQtdC90LAg0LfQsNCz0YDRg9C30LrQuCDQtNC70Y8g0L7QtNC90L7QuSDQutCw0YDRgtC40L3QutC4XHJcblx0dmFyIF9jYW5jZWxMb2FkID0gZnVuY3Rpb24oZSl7XHJcblx0XHRhbGVydChcItCe0YLQvNC10L3QuNGC0Ywg0LfQsNCz0YDRg9C30LrRgz9cIik7XHJcblx0XHQkKHRoaXMpLnJlbW92ZSgpO1xyXG5cdFx0Y29uc29sZS5sb2coJCgnLmltZy1saXN0IGxpJykubGVuZ3RoKTtcclxuXHRcdGlmKCQoJy5pbWctbGlzdCBsaScpLmxlbmd0aCA9PSAwKXtcclxuXHRcdFx0JCgnLm1vZGFsX19sb2FkLWltZycpLnNob3coKTtcclxuXHRcdH1cclxuXHRcdFxyXG59O1xyXG5cdC8vINCk0YPQvdC60YbQuNGPINC/0YDQuCDRgdC60YDQvtC70LvQtVxyXG5cdHZhciBfZml4ZWRBZGQgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciAkYWxidW1Db250YWluZXIgPSAkKCcuaGVhZGVyLWFsYnVtX19jb250ZW50Jyk7XHJcblx0XHR2YXIgJGFsYnVtQnRuID0gJCgnLmJ0bl9hbGJ1bS1hZGQnKTtcclxuXHRcdHZhciAkYmFja1NpZGUgPSAkKCcuaGVhZGVyLWFsYnVtX19hYm91dC1zaWRlX2JhY2snKTtcclxuXHRcdHZhciAkZnJvbnRTaWRlID0gJCgnLmhlYWRlci1hbGJ1bV9fYWJvdXQtc2lkZV9mcm9udCcpO1xyXG5cdFx0dmFyIGZpeGVkID0gJ2ZpeGVkJztcclxuXHRcdHZhciBoaWRlID0gJ2hpZGUnO1xyXG5cclxuXHRcdGlmKCgkKCdodG1sJykuc2Nyb2xsVG9wKCk+PSRhbGJ1bUNvbnRhaW5lci5oZWlnaHQoKSkgfHwgKCQoJ2JvZHknKS5zY3JvbGxUb3AoKT49JGFsYnVtQ29udGFpbmVyLmhlaWdodCgpKSl7XHJcblxyXG5cdFx0XHRpZiAoISgkYWxidW1CdG4uaGFzQ2xhc3MoZml4ZWQpKSl7XHJcblx0XHQgICAgXHRcdGJhc2UuY2hhbmdlQ2xhc3MoJGFsYnVtQnRuLGZpeGVkLCdhZGQnKTtcclxuXHRcdCAgICB9XHJcblx0XHQgICAkYmFja1NpZGUucmVtb3ZlQ2xhc3MoaGlkZSkuYWRkQ2xhc3MoJ2ZpeGVkSGVhZGVyJyk7XHJcblx0XHQgICBiYXNlLmNoYW5nZUNsYXNzKCRmcm9udFNpZGUsaGlkZSwnYWRkJyk7XHJcblx0ICB9XHJcblx0ICBlbHNle1xyXG5cdCAgICBcdFx0aWYgKCRhbGJ1bUJ0bi5oYXNDbGFzcyhmaXhlZCkpe1xyXG5cdFx0ICAgIFx0XHRiYXNlLmNoYW5nZUNsYXNzKCRhbGJ1bUJ0bixmaXhlZCwnZGVsJyk7XHJcblx0XHQgICAgXHR9XHJcblx0XHQgICAgXHQkYmFja1NpZGUuYWRkQ2xhc3MoaGlkZSkucmVtb3ZlQ2xhc3MoJ2ZpeGVkSGVhZGVyJyk7XHJcblx0XHQgICAgXHRiYXNlLmNoYW5nZUNsYXNzKCRmcm9udFNpZGUsaGlkZSwnZGVsJyk7XHJcblxyXG5cdCAgICBcdH1cclxuXHR9O1xyXG5cclxuXHJcblx0Ly8g0J7RgtC/0YDQsNCy0LvRj9C10LwgYWpheCDQvdCwIGFkZEFsYnVtQ292ZXJcclxuXHJcblx0YWxidW1Db3ZlcklucHV0Lm9uKCdjaGFuZ2UnLGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cdFx0dmFyIGZvcm0gPSAkdGhpcy5jbG9zZXN0KCdmb3JtJyk7XHJcblx0XHR2YXIgdmVpd0NvdmVyID0gZm9ybS5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcclxuXHRcdHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuXHRcdHZhciBjb3ZlciA9ICR0aGlzWzBdLmZpbGVzWzBdO1xyXG5cdFx0dmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XHJcblx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG5cclxuXHRcdFxyXG5cdFx0Zm9ybURhdGEuYXBwZW5kKFwiYWxidW1Db3ZlclwiLGNvdmVyKTtcclxuXHRcdHhoci5vcGVuKCdQT1NUJywgaWQgKyAnYWRkQWxidW1Db3Zlci8nLHRydWUpO1xyXG4gICAgeGhyLnNlbmQoZm9ybURhdGEpO1xyXG4gICAgYmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdhZGQnKTtcclxuICAgIHZlaXdDb3Zlci5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG4gICAgaWYoIWNvdmVyKXtcclxuICAgIFx0YmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcclxuICAgIFx0cmV0dXJuO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgIT0gNCkgcmV0dXJuO1xyXG5cclxuICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgIFx0XHJcbiAgICAgIFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgIFx0dmVpd0NvdmVyLmNzcyh7XHJcbiAgICAgIFx0XHQnYmFja2dyb3VuZC1pbWFnZScgOiAndXJsKCcrIGRhdGEubmV3QWxib21Db3Zlci5yZXBsYWNlKCcuL3VzZXJzJywnJykgKycpJ1xyXG4gICAgICBcdH0pXHJcbiAgICAgIFx0YmFzZS5jaGFuZ2VDbGFzcyh2ZWl3Q292ZXIsbG9hZGVyLCdkZWwnKTtcclxuICAgICAgfVxyXG4gICAgIH1cclxuXHJcblx0fSlcclxuXHJcblx0Ly8g0JTQvtCx0LDQstC70LXQvdC40LUg0LDQu9GM0LHQvtC80LBcclxuICAvLyDQntGC0L/RgNCw0LLQu9GP0LXQvCBhamF4INC90LAgYWRkbGJ1bVxyXG4gICRmb3JtQWRkQWxidW0uZmluZChidXR0b24pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyICR0aGlzRm9ybSA9ICQodGhpcykuY2xvc2VzdCgnZm9ybScpO1xyXG4gICAgdmFyIHZlaXdDb3ZlciA9ICR0aGlzRm9ybS5maW5kKCcudXNlci1ibG9ja19fcGhvdG8nKTtcclxuICAgIGlmKHZlaXdDb3Zlci5oYXNDbGFzcyhsb2FkZXIpKXtcclxuICAgIFx0cmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8g0J/QsNGA0LDQvNC10YLRgNGLINC00LvRjyBwb3B1cFxyXG4gICAgdmFyIGVycm9yQXJyYXkgPSBiYXNlLnZhbGlkYXRlRm9ybSgkdGhpc0Zvcm0pOyAvLyDQn9GA0L7QstC10YDRj9C10Lwg0YLQtdC60YPRidGD0Y4g0YTQvtGA0LzRgyDQuCDQstGL0LTQsNC10Lwg0LzQsNGB0YHQuNCyINC40L3QtNC10LrRgdC+0LIg0L7RiNC40LHQvtC6XHJcbiAgICB2YXIgJGVycm9yQ29udGFpbmVyID0gJHRoaXNGb3JtLmZpbmQoJy5wb3B1cF9fZXJyb3InKTtcclxuICAgIGlmKGVycm9yQXJyYXkubGVuZ3RoID4gMCl7XHQvLyDQldGB0LvQuCDQsiDQvNCw0YHRgdC40LLQtSDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINC30L3QsNGH0LjRgiDQstGL0LTQsNC10Lwg0L7QutC90L4sINGBINC90L7QvNC10YDQvtC8INC+0YjQuNCx0LrQuFxyXG4gICAgICBlcnJvckFycmF5LmZvckVhY2goZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgICAgIC8vYmFzZS5zaG93RXJyb3IoaW5kZXgsJGVycm9yQ29udGFpbmVyLCBwb3B1cFRpbWUpO1xyXG4gICAgICAgIGFsZXJ0KGJhc2UuZXJyb3JzW2luZGV4XSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH1lbHNleyAvLyDQldGB0LvQuCDQvNCw0YHRgdC40LIg0L/Rg9GB0YLQvtC5LCDQstGL0L/QvtC70L3Rj9C10Lwg0LTQsNC70YzRiNC1XHJcbiAgICAgIHZhciBpZCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICAgICAgLy9zZXJ2QW5zID0gYmFzZS5hamF4KCR0aGlzRm9ybSwgaWQgKyAnYWRkQWxidW0vJyk7XHJcbiAgICBcdHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJhbGJ1bU5hbWVcIiwkdGhpc0Zvcm0uZmluZCgnLmFkZC1hbGJ1bV9fbmFtZS1pbnB1dCcpLnZhbCgpKTtcclxuXHRcdFx0Zm9ybURhdGEuYXBwZW5kKFwiYWxidW1UZXh0XCIsJHRoaXNGb3JtLmZpbmQoJy5hZGQtYWxidW1fX3RleHRhcmVhJykudmFsKCkpO1xyXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJhbGJ1bUNvdmVyXCIsJHRoaXNGb3JtLmZpbmQoJy5idG5fX3VwbG9hZCcpWzBdLmZpbGVzWzBdKTtcclxuXHJcblxyXG5cdFx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0O1xyXG4gICAgICB4aHIub3BlbignUE9TVCcsIGlkICsgJ2FkZEFsYnVtLycsdHJ1ZSk7XHJcbiAgICAgIHhoci5zZW5kKGZvcm1EYXRhKTtcclxuICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSAhPSA0KSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgIFx0dmFyIGRhdGEgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgXHRhbGVydChkYXRhLm1lc3NhZ2UpO1xyXG4gICAgICAgIFx0XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHQvLyDQkNC90LjQvNCw0YbQuNGPINC00LvRjyDRgNC10LTQsNC60YLQuNGA0L7QstCw0L3QuNGPINGF0LXQtNC10YDQsFxyXG5cdHZhciBlZGl0QWxsSGVhZGVyID0gKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciAkdGhpcyxcclxuXHRcdFx0XHRmcm9udCxcclxuXHRcdFx0XHRiYWNrLFxyXG5cdFx0XHRcdGhlYWRlckJvdHRvbSxcclxuXHRcdFx0XHRoZWFkZXJCb3R0b21FZGl0O1xyXG5cclxuXHRcdHZhciBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCcuYnRuX2VkaXQtaGVhZGVyJykub24oJ2NsaWNrJywgX2VkaXRIZWFkZXIpO1xyXG5cdFx0XHQkKCcjY2FuY2VsX2VkaXRfaGVhZGVyJykub24oJ2NsaWNrJywgX3JldHVybkhlYWRlcik7XHJcblx0XHRcdCQoJy5idG4tLXNhdmUnKS5vbignY2xpY2snLCBfcmV0dXJuSGVhZGVyKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIF9lZGl0SGVhZGVyID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQkdGhpcyA9ICQodGhpcyk7XHJcblx0XHRcdGZyb250ID0gJHRoaXMuY2xvc2VzdCgnLmhlYWRlcl9fc2VjdGlvbicpO1xyXG5cdFx0XHRiYWNrID0gZnJvbnQubmV4dCgpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b20gPSBmcm9udC5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCcuaGVhZGVyLWJvdHRvbS1mcm9udCcpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b21FZGl0ICA9IGhlYWRlckJvdHRvbS5wcmV2KCk7XHJcblxyXG5cdFx0XHRiYWNrLmNzcygndG9wJywnMCcpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b21FZGl0LmNzcygndHJhbnNmb3JtJywndHJhbnNsYXRlWSgwKScpO1xyXG5cdFx0XHRmcm9udC5mYWRlT3V0KDUwMCk7XHJcblx0XHRcdCQoJy5oZWFkZXItZWRpdC1vdmVybGF5JykuZmFkZUluKDUwMCk7XHJcblx0XHRcdGhlYWRlckJvdHRvbS5mYWRlT3V0KDUwMCk7XHJcblx0XHR9XHJcblx0XHR2YXIgX3JldHVybkhlYWRlciA9IGZ1bmN0aW9uKGV2KSB7XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGJhY2suY3NzKCd0b3AnLCctMTAwJScpO1xyXG5cdFx0XHRoZWFkZXJCb3R0b21FZGl0LmNzcygndHJhbnNmb3JtJywndHJhbnNsYXRlWSgxMDAlKScpO1xyXG5cdFx0XHRmcm9udC5mYWRlSW4oNTAwKTtcclxuXHRcdFx0JCgnLmhlYWRlci1lZGl0LW92ZXJsYXknKS5mYWRlT3V0KDUwMCk7XHJcblx0XHRcdGhlYWRlckJvdHRvbS5mYWRlSW4oNTAwKTtcclxuXHRcdH1cclxuXHRcdHJldHVybntcclxuXHRcdFx0aW5pdCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0XHRcdH0sXHJcblx0XHR9XHJcbn0pO1xyXG5cclxuXHJcblx0dmFyIF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24oKSB7XHJcblx0XHQkKCcuYnRuX2FsYnVtLWFkZCcpLm9uKCdjbGljaycsIG9wZW5VcGxvYWQpO1xyXG5cdFx0JCgnLmJ0bl9lZGl0LXBob3RvJykub24oJ2NsaWNrJywgb3BlbkVkaXRQaG90byk7XHJcblx0XHQkKCcubW9kYWxfX2hlYWRlci1jbG9zZScpLm9uKCdjbGljaycsIGNsb3NlVXBsb2FkKTtcclxuXHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgX2ZpeGVkQWRkKTtcclxuXHRcdCQoJ2JvZHknKS5vbignY2xpY2snLCcuaW1nLWl0ZW0nLF9jYW5jZWxMb2FkKTtcclxuXHR9O1xyXG5cclxuXHJcblxyXG4gIHJldHVybiB7XHJcbiAgXHRlZGl0OiBlZGl0QWxsSGVhZGVyKCksXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdF9zZXRVcExpc3RuZXJzKCk7XHJcbiAgICB9LFxyXG5cclxuICB9O1xyXG59KSgpOyIsImZ1bmN0aW9uIGluaXRQb3B1cCAoKSB7XHJcblxyXG5cdC8vINCk0YPQvdC60YbQuNGPINC+0YLQutGA0YvRgtC40Y8g0L/QvtC/0LDQv9CwXHJcblx0ZnVuY3Rpb24gcG9wdXAoaWQsIGFjdGlvbikge1xyXG5cdFx0dmFyIGJvZHkgICAgICA9ICQoJ2JvZHknKTtcclxuXHRcdHZhciBjbGFzc05hbWUgPSAnaGlkZSc7XHJcblxyXG5cdFx0aWYoYWN0aW9uID09ICdvcGVuJykge1xyXG5cdFx0XHRib2R5LmFkZENsYXNzKCduby1zY3JvbGwnKTtcclxuXHJcblx0XHRcdCQoJyMnICsgaWQpXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdC5wYXJlbnQoKVxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUgKTtcclxuXHRcdH0gZWxzZSBpZihhY3Rpb24gPT0gJ2Nsb3NlJykge1xyXG5cclxuXHRcdFx0Ym9keS5yZW1vdmVDbGFzcygnbm8tc2Nyb2xsJyk7XHJcblxyXG5cdFx0XHRpZihpZCA9PSAnYWxsJykge1xyXG5cdFx0XHRcdCQoJy5tb2RhbCcpXHJcblx0XHRcdFx0XHQuYWRkQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0XHQucGFyZW50KClcclxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKCcjJyArIGlkKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdFx0LnBhcmVudCgpXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lICk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHQvLyDQntGC0LrRgNGL0YLQuNC1INC/0L7Qv9Cw0L/QvtCyINC/0L4g0LrQu9C40LrRgyDQvdCwINGN0LvQtdC80LXQvdGC0Ysg0YEg0LDRgtGA0LjQsdGD0YLQvtC8IGRhdGEtbW9kYWxcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtbW9kYWxdJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHR2YXIgJGVsICAgICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBwb3B1cElkID0gJGVsLmF0dHIoJ2RhdGEtbW9kYWwnKTtcclxuXHJcblx0XHRcdHBvcHVwKCdhbGwnLCAnY2xvc2UnKTtcclxuXHRcdFx0cG9wdXAocG9wdXBJZCwgJ29wZW4nKTtcclxuXHR9KTtcclxuXHJcblxyXG5cdC8vINCh0L7QsdGL0YLQuNGPINC/0YDQuCDQutC70LjQutC1INGN0LvQtdC80LXQvdGCINGBINCw0YLRgNC40LHRg9GC0L7QvCBkYXRhLWFjdGlvbj1cImNsb3NlXCJcclxuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtYWN0aW9uPVwiY2xvc2VcIl0nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdHZhciBidG4gICA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBtb2RhbCA9IGJ0bi5jbG9zZXN0KCcubW9kYWwnKTtcclxuXHJcblx0XHRcdHBvcHVwKG1vZGFsLmF0dHIoJ2lkJyksICdjbG9zZScpO1xyXG5cdH0pO1xyXG5cclxufSAvLyBpbml0UG9wdXAoKVxyXG5cclxuXHJcblxyXG5pbml0UG9wdXAoKTsiLCIvLyDQodC70LDQudC00LXRgFxyXG4oZnVuY3Rpb24oKSB7XHJcblx0dmFyIHRyYW5zaXRpb25FbmQgPSAndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kJztcclxuXHJcblx0ZnVuY3Rpb24gU2xpZGVyKG9wdGlvbnMpIHtcclxuXHRcdHZhciBnYWxsZXJ5ICAgICA9IG9wdGlvbnMuZWxlbTtcclxuXHRcdHZhciBwcmV2ICAgICAgICA9IGdhbGxlcnkuZmluZCgnLnNsaWRlcl9fY29udHJvbC0tcHJldicpO1xyXG5cdFx0dmFyIG5leHQgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19jb250cm9sLS1uZXh0Jyk7XHJcblxyXG5cdFx0dmFyIHNsaWRlcyAgICAgICAgID0gZ2FsbGVyeS5maW5kKCcuc2xpZGVyX19pdGVtJyk7XHJcblx0XHR2YXIgYWN0aXZlU2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdHZhciBzbGlkZXNDbnQgICAgICA9IHNsaWRlcy5sZW5ndGg7XHJcblx0XHR2YXIgYWN0aXZlU2xpZGVJZHggPSBhY3RpdmVTbGlkZS5pbmRleCgpO1xyXG5cclxuXHRcdHZhciBpc1JlYWR5ICAgID0gdHJ1ZTtcclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gc2hvd2VkU2xpZGUoc2xpZGVyLCBpZHgpIHtcclxuXHRcdFx0c2xpZGVyXHJcblx0XHRcdFx0LmVxKGlkeCkuYWRkQ2xhc3MoJ3NsaWRlcl9faXRlbS0tYWN0aXZlJylcclxuXHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmdW5jdGlvbiBkYXRhQ2hhbmdlKGRpcmVjdGlvbikge1xyXG5cdFx0Ly8gXHRhY3RpdmVTbGlkZUlkeCA9IChkaXJlY3Rpb24gPT09ICduZXh0JykgPyBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICduZXh0JykgOiBnZXRJZHgoYWN0aXZlU2xpZGVJZHgsICdwcmV2Jyk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0ZnVuY3Rpb24gZ2V0SWR4KGN1cnJlbnRJZHgsIGRpcikge1xyXG5cdFx0XHRpZihkaXIgPT09ICdwcmV2Jykge1xyXG5cdFx0XHRcdHJldHVybiAoY3VycmVudElkeCAtIDEgPCAwKSA/IHNsaWRlc0NudCAtIDEgOiBjdXJyZW50SWR4IC0gMSA7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZGlyID09PSAnbmV4dCcpIHtcclxuXHRcdFx0XHRyZXR1cm4gKGN1cnJlbnRJZHggKyAxID49IHNsaWRlc0NudCkgPyAwIDogY3VycmVudElkeCArIDEgO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gY3VycmVudElkeDtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjaGFuZ2VTbGlkZShzbGlkZXMsIGRpcmVjdGlvbiwgY2xhc3NOYW1lKSB7XHJcblx0XHRcdHZhciBjdXJyZW50U2xpZGUgICAgPSBzbGlkZXMuZmlsdGVyKCcuc2xpZGVyX19pdGVtLS1hY3RpdmUnKTtcclxuXHRcdFx0dmFyIGN1cnJlbnRTbGlkZUlkeCA9IGN1cnJlbnRTbGlkZS5pbmRleCgpO1xyXG5cdFx0XHR2YXIgbmV3U2xpZGVJZHg7XHJcblxyXG5cdFx0XHRpZiAoZGlyZWN0aW9uID09PSAncHJldicpIHtcclxuXHRcdFx0XHQgbmV3U2xpZGVJZHggPSBnZXRJZHgoY3VycmVudFNsaWRlSWR4LCAncHJldicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChkaXJlY3Rpb24gPT09ICduZXh0Jykge1xyXG5cdFx0XHRcdG5ld1NsaWRlSWR4ID0gZ2V0SWR4KGN1cnJlbnRTbGlkZUlkeCwgJ25leHQnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2xpZGVzLmVxKG5ld1NsaWRlSWR4KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyggY2xhc3NOYW1lIClcclxuXHRcdFx0XHQub25lKHRyYW5zaXRpb25FbmQsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZSApXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnc2xpZGVyX19pdGVtLS1hY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHQudHJpZ2dlcignY2hhbmdlZC1zbGlkZScpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Y3VycmVudFNsaWRlXHJcblx0XHRcdFx0LmFkZENsYXNzKCBjbGFzc05hbWUgKVxyXG5cdFx0XHRcdC5vbmUodHJhbnNpdGlvbkVuZCwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLnJlbW92ZUNsYXNzKCdzbGlkZXJfX2l0ZW0tLWFjdGl2ZSAnICsgY2xhc3NOYW1lKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0JChkb2N1bWVudCkub24oJ2NoYW5nZWQtc2xpZGUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0aXNSZWFkeSA9IHRydWU7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cclxuXHJcblx0XHR0aGlzLnByZXYgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoICFpc1JlYWR5ICkgcmV0dXJuO1xyXG5cdFx0XHRpc1JlYWR5ID0gZmFsc2U7XHJcblxyXG5cdFx0XHRjaGFuZ2VTbGlkZShzbGlkZXMsICdwcmV2JywgJ3NsaWRlcl9faXRlbS0tYW5pbWF0ZS1mYWRlJyk7XHJcblx0XHRcdC8vIGRhdGFDaGFuZ2UoJ3ByZXYnKTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMubmV4dCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiggIWlzUmVhZHkgKSByZXR1cm47XHJcblx0XHRcdGlzUmVhZHkgPSBmYWxzZTtcclxuXHJcblx0XHRcdGNoYW5nZVNsaWRlKHNsaWRlcywgJ25leHQnLCAnc2xpZGVyX19pdGVtLS1hbmltYXRlLWZhZGUnKTtcclxuXHRcdFx0Ly8gZGF0YUNoYW5nZSgnbmV4dCcpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0cHJldi5vbignY2xpY2snLCB0aGlzLnByZXYpO1xyXG5cdFx0bmV4dC5vbignY2xpY2snLCB0aGlzLm5leHQpO1xyXG5cdH0gLy8gU2xpZGVyXHJcblxyXG5cclxuXHJcblx0dmFyIHNsaWRlciA9IG5ldyBTbGlkZXIoe1xyXG5cdFx0ZWxlbTogJCgnI3NsaWRlcicpXHJcblx0fSk7XHJcbn0pKCk7IiwiLy8g0KHQvtC30LTQsNC90LjQtSDQvNC+0LTRg9C70Y8uXHJcbi8vIDEpIEPQvtC30LTQsNC10Lwg0YTQsNC50Lsg0YEg0LzQvtC00YPQu9C10Lwg0LIg0L/QsNC/0LrQtSBzb3Vyc2UvanMvbW9kdWxlc1xyXG4vLyAyKSDQltC10LvQsNGC0LXQu9GM0L3QviDQvdCw0LfRi9Cy0LDRgtGMINGE0LDQudC70Ysg0YEg0L3QuNC20L3QtdCz0L4g0L/QvtC00YfQtdGA0LrQuNCy0LDQvdC40Y8o0KfRgtC+INCx0Ysg0L3QtSDQvtGC0YXQvtC00LjRgtGMINC+0YIg0YLRgNCw0LTQuNGG0LjQuSlcclxuLy8gMykg0JrQvtC/0LjRgNGD0LXQvCDRgdGC0YDRg9C60YLRg9GA0YMg0LjQtyDRhNCw0LnQu9CwIF9sb2dpbiDQuNC70Lgg0LvRjtCx0L7Qs9C+INC00YDRg9Cz0L7QstC+INC80L7QtNGD0LvRjyjQvdC+INC90LUgYmFzZSkuXHJcbi8vIDQpINCyIHJldHVybiDQvNC+0LTRg9C70Y8g0L3Rg9C20L3QviDQstGB0YLQsNCy0LjRgtGMINC+0LHRitC10LrRgiDRgSDQvNC10YLQvtC00L7QvCBpbml0LlxyXG4vLyA1KSDQsiDQvNC10YLQvtC0IGluaXQg0LfQsNC/0LjRgdGL0LLQsNC10Lwg0YTRg9C90LrRhtC40LgsINC60L7RgtC+0YDRi9C1INCx0YPQtNGD0YIg0LLRi9C30YvQstCw0YLRjNGB0Y8g0LDQstGC0L7QvNCw0YLQuNGH0LXRgdC60Lgg0L/RgNC4INC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNC4INC80L7QtNGD0LvRjy5cclxuLy8gNikg0KfRgtC+INCx0Ysg0L/QvtC70YPRh9C40YLRjCDQtNC+0YHRgtGD0L8g0Log0LHQuNCx0LvQuNC+0YLQtdC60LUsINCyINC90LDRh9Cw0LvQtSDQvNC+0LTRg9C70Y8g0L3Rg9C20L3QviDQtdC1INC+0LHRitGP0LLQuNGC0YwsINC90LDQv9C40YDQvNC10YAg0YLQsNC6IHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7XHJcbi8vINGC0LXQv9C10YDRjCDQstGB0LUg0YHQstC+0LnRgdGC0LLQsCDQuCDQvNC10YLQvtC00Ysg0LHQuNCx0LvQuNC+0YLQtdC60Lgg0LTQvtGB0YLRg9C/0L3RiyDRh9C10YDQtdC3INGC0L7Rh9C60YMsINC90LDQv9C40YDQvNC10YAg0YLQsNC6IGJhc2UuYWpheERhdGEoZm9ybSk7XHJcbi8vIDcpINCSINCx0LjQsdC70LjQvtGC0LXQutGDINC80L7QttC90L4g0LTQvtC/0LjRgdGL0LLQsNGC0Ywg0LLRgdC1INGH0YLQviDRg9Cz0L7QtNC90L4sINCz0LvQsNCy0L3QvtC1INGH0YLQvtCx0Ysg0YTRg9C90LrRhtC40Y8g0L3QsNGH0LjQvdCw0LvQsNGB0Ywg0YEgdGhpcywg0YLQsNC6INC80L7QtNGD0LvRjCBiYXNlINGP0LLQu9GP0LXRgtGB0Y8g0LrQvtC90YHRgtGA0YPQutGC0L7RgNC+0LwuXHJcbi8vIDgpINCU0LvRjyDRgtC+0LPQviDRh9GC0L7QsdGLINC80L7QtNGD0LvRjCDRgdC+0LHRgNCw0LvRgdGPINCyINC+0LTQuNC9INGE0LDQudC7IGFwcC5qcyDQtdCz0L4g0L3Rg9C20L3QviDQv9GA0L7Qv9C40YHQsNGC0Ywg0LIg0LIgZ3VscGZpbGUuanMuXHJcbi8vINCU0L7QutGD0LzQtdC90YLQsNGG0LjRjyDQv9C+INGE0YPQvdGG0LjRj9C8IGJhc2UsINCx0YPQtNC10YIg0YfRg9GC0Ywg0L/QvtC30LbQtS4uLlxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuJCggZG9jdW1lbnQgKS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgIHZhciBiYXNlID0gbmV3IEJhc2VNb2R1bGU7IC8vINCY0L3QuNGG0LjQsNC70LjQt9C40YDRg9C10Lwg0LHQuNCx0LvQuNC+0YLQtdC60YMuICjQn9C+0LrQsCDQvdC1INC90YPQttC90L4pXHJcbiAgICBjb21tb25Nb2R1bGUuaW5pdCgpO1xyXG4gICAgbG9naW5Nb2R1bGUuaW5pdCgpO1xyXG4gICAgbWFpblBhZ2VNb2R1bGUuaW5pdCgpO1xyXG4gICAgYWxidW1Nb2R1bGUuaW5pdCgpO1xyXG4gICAgYWxidW1Nb2R1bGUuZWRpdC5pbml0KCk7XHJcbn0pO1xyXG5cclxuXHQvLyDQmtCw0YHRgtC+0LzQvdGL0Lkg0LLQuNC0INC00LvRjyDQt9Cw0LPRgNGD0LfQutC4INGE0LDQudC70L7QslxyXG5cdChmdW5jdGlvbigpIHtcclxuXHRcdHZhciBlbCA9ICQoJy51cGxvYWQnKTtcclxuXHJcblx0XHRpZihlbC5sZW5ndGggPT09IDApIHJldHVybjtcclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnVwbG9hZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0dmFyIGVsICAgID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIGlucHV0ID0gZWwuY2hpbGRyZW4oJ1t0eXBlPWZpbGVdJyk7XHJcblxyXG5cdFx0XHRpbnB1dFswXS5jbGljaygpO1xyXG5cdFx0fSk7XHJcblx0fSkoKTsiXX0=
